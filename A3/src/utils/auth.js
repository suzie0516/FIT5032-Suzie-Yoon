import { ref, computed } from 'vue'

// --------------------------------
// Internal administrator account
// --------------------------------

// This administrator account is created internally.
// Public registration does not allow users to choose
// the administrator role.

const ADMIN_EMAIL =
  'admin@potsandplants.org.au'

/*
  Store only the pre-computed password hash
  for the internal demonstration account.

  The plain-text administrator password is
  not stored in the application source.
*/
const ADMIN_PASSWORD_HASH =
  '18027cd8bda59cdbea94d513a6d70289e6f2e212a12cc996c4586b9d7792071e'


// --------------------------------
// Create internal administrator
// --------------------------------

const initialiseAdminAccount = () => {
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


  const adminUser = {
    id: 'internal-admin',

    fullName:
      'Pots & Plants Administrator',

    email: ADMIN_EMAIL,

    passwordHash:
      ADMIN_PASSWORD_HASH,

    role: 'admin',
  }


  users.push(adminUser)


  localStorage.setItem(
    'users',
    JSON.stringify(users),
  )
}


// Initialise the internal staff account.
// Registration remains available only
// for normal users.
initialiseAdminAccount()


// --------------------------------
// Load current signed-in user
// --------------------------------

const loadCurrentUser = () => {
  try {
    const storedUser =
      localStorage.getItem(
        'currentUser',
      )

    if (!storedUser) {
      return null
    }

    return JSON.parse(storedUser)

  } catch {
    return null
  }
}


// --------------------------------
// Shared authentication state
// --------------------------------

const currentUser =
  ref(loadCurrentUser())


// --------------------------------
// Authentication status
// --------------------------------

const isAuthenticated =
  computed(() => {
    return currentUser.value !== null
  })


// --------------------------------
// Role checks
// --------------------------------

const isAdmin =
  computed(() => {
    return (
      currentUser.value?.role ===
      'admin'
    )
  })


// --------------------------------
// Sign in
// --------------------------------

const setCurrentUser = (user) => {
  /*
    Only information required for the
    active session is stored.

    The password hash is deliberately
    excluded from currentUser.
  */
  const sessionUser = {
    id: user.id,

    fullName: user.fullName,

    email: user.email,

    role: user.role,
  }


  currentUser.value =
    sessionUser


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