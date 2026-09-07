<script setup>
import { ref } from 'vue'
import {
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { auth } from '../firebase'

const email = ref('')
const password = ref('')
const message = ref('')
const errorMessage = ref('')
const role = ref('')

const signIn = async () => {
  message.value = ''
  errorMessage.value = ''
  role.value = ''

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    const user = userCredential.user

    if (user.email === 'admin.test@example.com') {
      role.value = 'admin'
    } else {
      role.value = 'user'
    }

    console.log('Current user:', auth.currentUser)
    console.log('Signed in user:', user)
    console.log('Current role:', role.value)

    message.value = `Login successful! Role: ${role.value}`
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = error.message
  }
}

const logout = async () => {
  try {
    await signOut(auth)

    role.value = ''
    message.value = 'Logout successful!'
    errorMessage.value = ''

    console.log('Current user after logout:', auth.currentUser)
  } catch (error) {
    console.error('Logout error:', error)
    errorMessage.value = error.message
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1 class="mb-4">Firebase Login</h1>

        <form @submit.prevent="signIn">
          <div class="mb-3">
            <label for="firebase-email" class="form-label">
              Email
            </label>

            <input
              id="firebase-email"
              v-model="email"
              type="email"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label for="firebase-password" class="form-label">
              Password
            </label>

            <input
              id="firebase-password"
              v-model="password"
              type="password"
              class="form-control"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary me-2">
            Login
          </button>

          <button
            type="button"
            class="btn btn-secondary"
            @click="logout"
          >
            Logout
          </button>
        </form>

        <div
          v-if="message"
          class="alert alert-success mt-3"
        >
          {{ message }}
        </div>

        <div
          v-if="errorMessage"
          class="alert alert-danger mt-3"
        >
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>