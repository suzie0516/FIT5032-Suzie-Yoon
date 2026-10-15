
import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import nodemailer from 'nodemailer'

const gmailUser = defineSecret('GMAIL_USER')
const gmailPassword = defineSecret('GMAIL_APP_PASSWORD')

export const sendBulkEmail = onRequest(
  {
    region: 'australia-southeast1',
    cors: true,
    maxInstances: 3,
    secrets: [gmailUser, gmailPassword],
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Use POST' })
    }

    const token = /^Bearer (.+)$/.exec(
      req.get('authorization') || ''
    )?.[1]

    if (!token) {
      return res.status(401).json({ error: 'Sign in first' })
    }

    const adminAuth = getAuth()
    let admin

    try {
      admin = await adminAuth.verifyIdToken(token, true)
    } catch {
      return res.status(401).json({ error: 'Invalid session' })
    }

    if (admin.admin !== true) {
      return res.status(403).json({ error: 'Admin access required' })
    }

    const {
      recipientUids,
      subject,
      message,
      confirmation,
    } = req.body || {}

    if (
      !Array.isArray(recipientUids) ||
      recipientUids.length < 1 ||
      recipientUids.length > 5 ||
      !recipientUids.every(
        (uid) => typeof uid === 'string' && uid.length > 0
      ) ||
      new Set(recipientUids).size !== recipientUids.length ||
      typeof subject !== 'string' ||
      subject.trim().length < 3 ||
      subject.length > 120 ||
      typeof message !== 'string' ||
      !message.trim() ||
      message.length > 2000 ||
      confirmation !== 'SEND'
    ) {
      return res.status(400).json({ error: 'Invalid email request' })
    }

    try {
      const recipients = []

      for (const uid of recipientUids) {
        const account = await adminAuth.getUser(uid)

        if (!account.email || account.disabled) {
          return res.status(400).json({
            error: 'A selected account cannot receive email',
          })
        }

        recipients.push(account.email)
      }

      // Limit email recipients per administrator each hour.
      const hour = Math.floor(Date.now() / 3600000)
      const quotaRef = getFirestore()
        .collection('bulkEmailQuota')
        .doc(`${admin.uid}_${hour}`)

      await getFirestore().runTransaction(async (tx) => {
        const snapshot = await tx.get(quotaRef)
        const count = snapshot.exists
          ? snapshot.data().count || 0
          : 0

        if (count + recipients.length > 10) {
          throw new Error('BULK_EMAIL_QUOTA')
        }

        tx.set(quotaRef, {
          count: FieldValue.increment(recipients.length),
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true })
      })

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser.value(),
          pass: gmailPassword.value(),
        },
      })

      let sent = 0
      const failed = []

      // Send individual emails to keep recipients private.
      for (const email of recipients) {
        try {
          await transporter.sendMail({
            from: gmailUser.value(),
            to: email,
            subject: subject.trim(),
            text: message.trim(),
          })
          sent++
        } catch (error) {
          console.error('Bulk email delivery failed:', error)
          failed.push(email)
        }
      }

      return res.json({
        sent,
        failed,
        message: `${sent} of ${recipients.length} emails sent.`,
      })
    } catch (error) {
      if (error.message === 'BULK_EMAIL_QUOTA') {
        return res.status(429).json({
          error: 'Maximum 10 recipients per administrator per hour.',
        })
      }

      console.error('Bulk email error:', error)

      return res.status(500).json({
        error: 'Unable to complete bulk email request',
      })
    }
  }
)
