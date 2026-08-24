<template>
  <div>

    <div class="container">
      <header class="d-flex justify-content-center py-3">

        <ul class="nav nav-pills align-items-center">

          <li class="nav-item">
            <router-link
              to="/"
              class="nav-link"
              active-class="active"
            >
              Home (Week 5)
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              to="/about"
              class="nav-link"
              active-class="active"
            >
              About
            </router-link>
          </li>

          <li
            v-if="!isAuthenticated"
            class="nav-item"
          >
            <router-link
              to="/login"
              class="nav-link"
              active-class="active"
            >
              Login
            </router-link>
          </li>

          <li
            v-else
            class="nav-item"
          >
            <button
              class="nav-link btn btn-link"
              @click="logout"
            >
              Logout
            </button>
          </li>

        </ul>

      </header>
    </div>

    <router-view />

  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isAuthenticated = ref(false)

const updateAuthState = () => {
  isAuthenticated.value =
    localStorage.getItem('isAuthenticated') === 'true'
}

const logout = () => {

  localStorage.removeItem('isAuthenticated')

  updateAuthState()

  router.push('/login')
}

onMounted(() => {
  updateAuthState()

  window.addEventListener(
    'auth-changed',
    updateAuthState
  )
})

onUnmounted(() => {
  window.removeEventListener(
    'auth-changed',
    updateAuthState
  )
})
</script>