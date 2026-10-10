<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { loginUser } from '../utils/auth'

const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const login = async () => {
  if (isLoading.value) return
  errorMessage.value = ''

  if (!email.value.trim() || !password.value) {
    errorMessage.value = 'Please enter your email and password.'
    return
  }

  isLoading.value = true
  try {
    await loginUser(email.value, password.value)
    password.value = ''

    const redirect = route.query.redirect
    // Only allow navigation to local app routes.
    const redirectPath = typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
      ? redirect
      : '/'
    await router.push(redirectPath)
  } catch (error) {
    if (error.code === 'auth/network-request-failed') {
      errorMessage.value = 'Network error. Please try again.'
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage.value = 'Too many attempts. Please try again later.'
    } else {
      errorMessage.value = 'Invalid email or password.'
    }
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
        <p class="intro">Sign in to your Pots & Plants Melbourne account.</p>

        <form @submit.prevent="login" novalidate>
          <div class="mb-3">
            <label for="loginEmail" class="form-label">Email Address</label>
            <input id="loginEmail" v-model="email" type="email" class="form-control"
              autocomplete="email" required />
          </div>

          <div class="mb-4">
            <label for="loginPassword" class="form-label">Password</label>
            <input id="loginPassword" v-model="password" type="password" class="form-control"
              autocomplete="current-password" required />
          </div>

          <div v-if="errorMessage" class="alert alert-danger" role="alert" aria-live="polite">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn btn-dark w-100" :disabled="isLoading">
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <p class="register-text">
          Don't have an account?
          <RouterLink to="/register">Create an account</RouterLink>
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
.login-card h1 { margin-bottom: 10px; font-weight: 700; }
.intro { margin-bottom: 30px; color: #555; }
.register-text { margin-top: 22px; margin-bottom: 0; text-align: center; }
@media (max-width: 576px) {
  .login-page { padding: 30px 12px; }
  .login-card { padding: 24px 18px; }
}
</style>
