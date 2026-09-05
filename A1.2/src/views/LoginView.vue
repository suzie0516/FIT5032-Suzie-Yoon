<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { setCurrentUser } from '../utils/auth'

const router = useRouter()

const email = ref('')
const password = ref('')

const errorMessage = ref('')
const isLoading = ref(false)

// Hash the entered password using the same method as Register
const hashPassword = async (plainPassword) => {
  const data = new TextEncoder().encode(plainPassword)

  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    data,
  )

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) =>
      byte.toString(16).padStart(2, '0'),
    )
    .join('')
}

const login = async () => {
  errorMessage.value = ''

  // Check empty fields
  if (!email.value.trim() || !password.value) {
    errorMessage.value =
      'Please enter your email and password.'
    return
  }

  const normalizedEmail =
    email.value.trim().toLowerCase()

  // Retrieve registered users
  let users = []

  try {
    users =
      JSON.parse(localStorage.getItem('users')) || []

    if (!Array.isArray(users)) {
      users = []
    }
  } catch {
    users = []
  }

  // Find account by email
  const user = users.find(
    (storedUser) =>
      storedUser.email?.toLowerCase() ===
      normalizedEmail,
  )

  // Same error message for unknown email
  if (!user) {
    errorMessage.value =
      'Invalid email or password.'
    return
  }

  isLoading.value = true

  try {
    // Hash entered password
    const enteredPasswordHash =
      await hashPassword(password.value)

    // Compare password hashes
    if (
      enteredPasswordHash !== user.passwordHash
    ) {
      errorMessage.value =
        'Invalid email or password.'
      return
    }

    // Update shared authentication state
    setCurrentUser(user)

    // Successful login
    router.push('/')
  } catch {
    errorMessage.value =
      'Unable to sign in. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <div class="container">
      <div class="login-card">
        <h1>Sign In</h1>

        <p class="intro">
          Sign in to your Pots & Plants Melbourne account.
        </p>

        <form
          @submit.prevent="login"
          novalidate
        >
          <!-- Email -->
          <div class="mb-3">
            <label
              for="loginEmail"
              class="form-label"
            >
              Email Address
            </label>

            <input
              id="loginEmail"
              v-model="email"
              type="email"
              class="form-control"
              autocomplete="email"
              required
            />
          </div>

          <!-- Password -->
          <div class="mb-4">
            <label
              for="loginPassword"
              class="form-label"
            >
              Password
            </label>

            <input
              id="loginPassword"
              v-model="password"
              type="password"
              class="form-control"
              autocomplete="current-password"
              required
            />
          </div>

          <!-- Error -->
          <div
            v-if="errorMessage"
            class="alert alert-danger"
            role="alert"
            aria-live="polite"
          >
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            class="btn btn-dark w-100"
            :disabled="isLoading"
          >
            {{
              isLoading
                ? 'Signing In...'
                : 'Sign In'
            }}
          </button>
        </form>

        <p class="register-text">
          Don't have an account?

          <RouterLink to="/register">
            Create an account
          </RouterLink>
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.login-page {
  padding: 60px 16px;
  min-height: 75vh;
  background: #f7f8f5;
}

.login-card {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding: 36px;
  background: white;
  border: 1px solid #dedede;
  border-radius: 12px;
}

.login-card h1 {
  margin-bottom: 10px;
  font-weight: 700;
}

.intro {
  margin-bottom: 30px;
  color: #555;
}

.register-text {
  margin-top: 22px;
  margin-bottom: 0;
  text-align: center;
}

@media (max-width: 576px) {
  .login-page {
    padding: 30px 12px;
  }

  .login-card {
    padding: 24px 18px;
  }
}
</style>