import { onRequest } from 'firebase-functions/v2/https'
import { initializeApp, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

if (!getApps().length) initializeApp()
const db = getFirestore()
const validDesigns = new Set([
  'spiral-garden-1', 'octagon-pond-2', 'native-bee-walk-3', 'rainwater-pocket-park-4',
])

export const designRatings = onRequest(
  { region: 'australia-southeast1', cors: true, maxInstances: 3 },
  async (req, res) => {
    if (!['GET', 'POST'].includes(req.method)) {
      return res.status(405).json({ error: 'Use GET or POST' })
    }

    const token = /^Bearer (.+)$/.exec(req.get('authorization') || '')?.[1]
    let user = null
    if (token) {
      try {
        user = await getAuth().verifyIdToken(token, true)
      } catch {
        return res.status(401).json({ error: 'Invalid session' })
      }
    }

    if (req.method === 'POST') {
      if (!user) return res.status(401).json({ error: 'Sign in first' })
      const { designId, design, applicability, creativity } = req.body || {}
      if (!validDesigns.has(designId) ||
          ![design, applicability, creativity].every(v => Number.isInteger(v) && v >= 1 && v <= 5)) {
        return res.status(400).json({ error: 'Invalid design or rating values' })
      }
      try {
        // A fixed ID enforces one rating per account per design.
        await db.collection('designRatings').doc(`${designId}_${user.uid}`).set({
          designId, userId: user.uid, design, applicability, creativity,
          updatedAt: FieldValue.serverTimestamp(),
        })
        return res.json({ message: 'Rating saved' })
      } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Unable to save rating' })
      }
    }

    try {
      // Collection is capped for a coursework demo; use server aggregates at scale.
      const snapshot = await db.collection('designRatings').limit(1000).get()
      const results = {}
      const mine = {}
      for (const id of validDesigns) {
        results[id] = { count: 0, design: 0, applicability: 0, creativity: 0, overall: 0 }
      }
      for (const doc of snapshot.docs) {
        const rating = doc.data()
        if (!validDesigns.has(rating.designId)) continue
        if (![rating.design, rating.applicability, rating.creativity]
          .every(v => Number.isInteger(v) && v >= 1 && v <= 5)) continue
        const total = results[rating.designId]
        total.count += 1
        total.design += rating.design
        total.applicability += rating.applicability
        total.creativity += rating.creativity
        if (user && rating.userId === user.uid) {
          mine[rating.designId] = {
            design: rating.design,
            applicability: rating.applicability,
            creativity: rating.creativity,
          }
        }
      }
      for (const total of Object.values(results)) {
        if (!total.count) continue
        total.design /= total.count
        total.applicability /= total.count
        total.creativity /= total.count
        total.overall = (total.design + total.applicability + total.creativity) / 3
      }
      return res.json({ results, mine })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Unable to load ratings' })
    }
  }
)
