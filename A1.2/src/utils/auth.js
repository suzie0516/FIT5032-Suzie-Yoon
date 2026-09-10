import { ref, computed } from 'vue'

// --------------------------------
// Internal administrator account
// --------------------------------

// This administrator account is created internally.
// Public registration does not allow users to choose
// the administrator role.

const ADMIN_EMAIL = 'admin@potsandplants.org.au'

const ADMIN_PASSWORD =
  'GreenAdmin1!'

// --------------------------------
// Hash password
// --------------------------------
const hashPassword = async (plainPassword) => {
  const data =
    new TextEncoder().encode(plainPassword)

  const hashBuffer =
    await crypto.subtle.digest(
      'SHA-256',
      data,
    )

  return Array.from(
    new Uint8Array(hashBuffer),
  )
    .map((byte) =>
      byte
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')
}

// --------------------------------
// Create internal administrator
// --------------------------------
const initialiseAdminAccount = async () => {
  let users = []

  try {
    const storedUsers =
      JSON.parse(
        localStorage.getItem('users'),
      )

    if (Array.isArray(storedUsers)) {
      users = storedUsers
    }
  } catch {
    users = []
  }

  const adminAlreadyExists =
    users.some(
      (user) =>
        user.email
          ?.trim()
          .toLowerCase() ===
        ADMIN_EMAIL,
    )

  if (adminAlreadyExists) {
    return
  }

  const passwordHash =
    await hashPassword(ADMIN_PASSWORD)

  const adminUser = {
    id: 'internal-admin',
    fullName: 'Pots & Plants Administrator',
    email: ADMIN_EMAIL,
    passwordHash,
    role: 'admin',
  }

  users.push(adminUser)

  localStorage.setItem(
    'users',
    JSON.stringify(users),
  )
}

// Initialise the internal staff account.
// Registration remains available only for normal users.
initialiseAdminAccount()


// --------------------------------
// Load current signed-in user
// --------------------------------
const loadCurrentUser = () => {
  try {
    const storedUser =
      localStorage.getItem('currentUser')

    if (!storedUser) {
      return null
    }

    return JSON.parse(storedUser)
  } catch {
    return null
  }
}


// Shared reactive authentication state
const currentUser =
  ref(loadCurrentUser())


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

  localStorage.removeItem(
    'currentUser',
  )
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