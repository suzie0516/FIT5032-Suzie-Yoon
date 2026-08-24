<template>
  <div class="container mt-5">

    <div class="row justify-content-center">
      <div class="col-md-6">

        <h1 class="text-center mb-4">
          Member Login
        </h1>

        <form @submit.prevent="handleLogin">

          <div class="mb-3">
            <label for="username" class="form-label">
              Username
            </label>

            <input
              id="username"
              v-model="username"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">
              Password
            </label>

            <input
              id="password"
              v-model="password"
              type="password"
              class="form-control"
              required
            />
          </div>

          <div
            v-if="loginError"
            class="alert alert-danger"
          >
            Invalid username or password.
          </div>

          <div class="text-center">
            <button
              type="submit"
              class="btn btn-primary"
            >
              Login
            </button>
          </div>

        </form>

      </div>
    </div>

  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')
const loginError = ref(false)

const handleLogin = () => {

  if (
    username.value === 'admin' &&
    password.value === 'password123'
  ) {

    localStorage.setItem('isAuthenticated', 'true')

    window.dispatchEvent(
      new Event('auth-changed')
    )

    loginError.value = false

    router.push('/about')

  } else {

    loginError.value = true

  }
}
</script>