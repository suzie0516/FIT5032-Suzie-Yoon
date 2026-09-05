import { ref, computed } from 'vue'

// --------------------------------
// Load current signed-in user
// --------------------------------
const loadCurrentUser = () => {
  try {
    const storedUser = localStorage.getItem('currentUser')

    if (!storedUser) {
      return null
    }

    return JSON.parse(storedUser)
  } catch {
    return null
  }
}

// Shared reactive authentication state
const currentUser = ref(loadCurrentUser())

// --------------------------------
// Authentication status
// --------------------------------
const isAuthenticated = computed(() => {
  return currentUser.value !== null
})

// --------------------------------
// Role checks
// --------------------------------
const isAdmin = computed(() => {
  return currentUser.value?.role === 'admin'
})

// --------------------------------
// Sign in
// --------------------------------
const setCurrentUser = (user) => {
  const sessionUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  }

  currentUser.value = sessionUser

  localStorage.setItem(
    'currentUser',
    JSON.stringify(sessionUser),
  )
}

// --------------------------------
// Sign out
// --------------------------------
const logout = () => {
  currentUser.value = null
  localStorage.removeItem('currentUser')
}

// --------------------------------
// Export shared authentication state
// --------------------------------
export {
  currentUser,
  isAuthenticated,
  isAdmin,
  setCurrentUser,
  logout,
}