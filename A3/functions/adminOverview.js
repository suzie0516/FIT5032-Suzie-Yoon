
import { onRequest } from 'firebase-functions/v2/https'
import { initializeApp, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

if (!getApps().length) initializeApp()

export const adminOverview = onRequest(
  {
    region: 'australia-southeast1',
    cors: true,
    maxInstances: 3,
  },
  async (req, res) => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Use GET' })
    }

    const token = req.get('authorization')?.replace(/^Bearer /, '')

    if (!token) {
      return res.status(401).json({ error: 'Sign in first' })
    }

    try {
      const adminAuth = getAuth()
      const user = await adminAuth.verifyIdToken(token, true)

      if (user.admin !== true) {
        return res.status(403).json({ error: 'Admin access required' })
      }

      const accounts = []
      let nextPageToken

      do {
        const result = await adminAuth.listUsers(1000, nextPageToken)
        accounts.push(...result.users)
        nextPageToken = result.pageToken
      } while (nextPageToken)

      const administrators = accounts.filter(
        (account) => account.customClaims?.admin === true
      ).length

      const users = accounts.map((account) => ({
        id: account.uid,
        fullName: account.displayName || 'Unnamed user',
        email: account.email || '',
        role: account.customClaims?.admin === true
          ? 'admin'
          : 'user',
      }))

      return res.json({
        totalUsers: users.length,
        totalMembers: users.length - administrators,
        totalAdmins: administrators,
        users,
      })
    } catch (error) {
      console.error('Admin overview error:', error)

      return res.status(500).json({
        error: 'Unable to load administrator data',
      })
    }
  }
)
