
import { ref, computed } from 'vue'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase'

const currentUser = ref(null)
const authReady = ref(false)

const isAuthenticated = computed(() => currentUser.value !== null)
const isAdmin = computed(() => currentUser.value?.role === 'admin')

const toSessionUser = (user, role = 'user') => ({
  id: user.uid,
  fullName: user.displayName || '',
  email: user.email,
  role,
})

const getUserRole = async (user) => {
  const token = await user.getIdTokenResult()
  return token.claims.admin === true ? 'admin' : 'user'
}

onAuthStateChanged(
  auth,
  async (user) => {
    if (user) {
      try {
        const role = await getUserRole(user)

        if (auth.currentUser?.uid === user.uid) {
          currentUser.value = toSessionUser(user, role)
        }
      } catch (error) {
        console.error('Unable to load account permissions:', error)
        currentUser.value = null
      }
    } else {
      currentUser.value = null
    }

    authReady.value = true
  },
  (error) => {
    console.error('Authentication error:', error)
    currentUser.value = null
    authReady.value = true
  },
)

const loginUser = async (email, password) => {
  const result = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  )

  const role = await getUserRole(result.user)
  currentUser.value = toSessionUser(result.user, role)

  return result.user
}

const registerUser = async (fullName, email, password) => {
  const result = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  )

  await updateProfile(result.user, {
    displayName: fullName.trim().replace(/\s+/g, ' '),
  })

  currentUser.value = toSessionUser(result.user)

  return result.user
}

const logout = async () => {
  await signOut(auth)
  currentUser.value = null
}

export {
  currentUser,
  authReady,
  isAuthenticated,
  isAdmin,
  loginUser,
  registerUser,
  logout,
}
