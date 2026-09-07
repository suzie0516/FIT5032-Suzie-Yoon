<script setup>
import { ref } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

const email = ref('')
const password = ref('')
const message = ref('')
const errorMessage = ref('')

const register = async () => {
  message.value = ''
  errorMessage.value = ''

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    console.log('Registered user:', userCredential.user)

    message.value = 'Registration successful!'
    email.value = ''
    password.value = ''
  } catch (error) {
    console.error('Registration error:', error)
    errorMessage.value = error.message
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1 class="mb-4">Firebase Registration</h1>

        <form @submit.prevent="register">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>

            <input
              id="email"
              v-model="email"
              type="email"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>

            <input
              id="password"
              v-model="password"
              type="password"
              class="form-control"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary">
            Register
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