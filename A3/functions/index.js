
import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { initializeApp, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import nodemailer from 'nodemailer'

if (!getApps().length) initializeApp()

const db = getFirestore()
const gmailUser = defineSecret('GMAIL_USER')
const gmailPassword = defineSecret('GMAIL_APP_PASSWORD')

const options = {
  region: 'australia-southeast1',
  maxInstances: 3,
  cors: true,
}

// Count plant and project records
export const countRecords = onRequest(options, async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Use GET' })
  }

  try {
    const [plants, projects] = await Promise.all([
      db.collection('plants').count().get(),
      db.collection('projects').count().get(),
    ])

    return res.json({
      plants: plants.data().count,
      projects: projects.data().count,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Unable to load counts' })
  }
})

// Email with optional PDF or CSV attachment
export const sendEmail = onRequest(
  { ...options, secrets: [gmailUser, gmailPassword] },
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

    let user

    try {
      user = await getAuth().verifyIdToken(token, true)
    } catch {
      return res.status(401).json({ error: 'Invalid session' })
    }

    const { subject, message, attachment } = req.body || {}

    if (
      !user.email ||
      typeof subject !== 'string' ||
      subject.trim().length < 3 ||
      subject.length > 120 ||
      typeof message !== 'string' ||
      !message.trim() ||
      message.length > 2000
    ) {
      return res.status(400).json({ error: 'Invalid email content' })
    }

    let attachments = []

    if (attachment != null) {
      const allowedTypes = ['application/pdf', 'text/csv']

      if (
        typeof attachment !== 'object' ||
        typeof attachment.filename !== 'string' ||
        !/^[a-zA-Z0-9_.-]{1,70}$/.test(attachment.filename) ||
        !allowedTypes.includes(attachment.contentType) ||
        typeof attachment.base64 !== 'string' ||
        !/^[A-Za-z0-9+/]*={0,2}$/.test(attachment.base64)
      ) {
        return res.status(400).json({ error: 'Invalid attachment' })
      }

      const content = Buffer.from(attachment.base64, 'base64')

      if (!content.length || content.length > 1024 * 1024) {
        return res.status(400).json({
          error: 'Attachment must be 1 MB or smaller',
        })
      }

      if (
        attachment.contentType === 'application/pdf' &&
        content.subarray(0, 5).toString() !== '%PDF-'
      ) {
        return res.status(400).json({ error: 'Not a valid PDF file' })
      }

      attachments = [{
        filename: attachment.filename,
        content,
        contentType: attachment.contentType,
      }]
    }

    try {
      const hour = Math.floor(Date.now() / 3600000)
      const quotaRef = db.collection('emailQuota')
        .doc(`${user.uid}_${hour}`)

      await db.runTransaction(async (tx) => {
        const snapshot = await tx.get(quotaRef)
        const count = snapshot.exists ? snapshot.data().count : 0

        if (count >= 5) {
          throw new Error('EMAIL_QUOTA')
        }

        tx.set(quotaRef, {
          count: FieldValue.increment(1),
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

      await transporter.sendMail({
        from: gmailUser.value(),
        to: user.email,
        subject: subject.trim(),
        text: message.trim(),
        attachments,
      })

      return res.json({
        message: 'Email sent to your registered address.',
      })
    } catch (error) {
      if (error.message === 'EMAIL_QUOTA') {
        return res.status(429).json({
          error: 'Maximum 5 emails per hour.',
        })
      }

      console.error(error)
      return res.status(500).json({
        error: 'Unable to send email. Check server configuration.',
      })
    }
  }
)

// Existing administrator function
export { adminOverview } from './adminOverview.js'

// Public REST API: plant records
export const getPlants = onRequest(options, async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Use GET' })
  }

  try {
    const snapshot = await db.collection('plants').limit(50).get()

    const plants = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.get('name') || '',
      commonName: doc.get('commonName') || '',
      category: doc.get('category') || '',
      region: doc.get('region') || '',
      description: doc.get('description') || '',
    }))

    return res.json({ plants })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Unable to load plants' })
  }
})

// Public REST API: greening projects
export const getProjects = onRequest(options, async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Use GET' })
  }

  try {
    const snapshot = await db.collection('projects').limit(50).get()

    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.get('name') || '',
      suburb: doc.get('suburb') || '',
      status: doc.get('status') || '',
      targetTrees: doc.get('targetTrees') ?? 0,
      description: doc.get('description') || '',
    }))

    return res.json({ projects })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Unable to load projects' })
  }
})
export { sendBulkEmail } from './bulkEmail.js'
export { designRatings } from './designRatings.js'