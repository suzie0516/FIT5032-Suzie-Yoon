import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView
    },

    {
      path: '/register',
      name: 'firebase-register',
      component: FirebaseRegisterView
    },

    {
      path: '/firebase-login',
      name: 'firebase-login',
      component: FirebaseSigninView
    },

    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: {
        requiresAuth: true
      }
    },

    {
      path: '/access-denied',
      name: 'access-denied',
      component: AccessDeniedView
    }
  ]
})

router.beforeEach((to) => {
  const isAuthenticated =
    localStorage.getItem('isAuthenticated') === 'true'

  if (
    to.meta.requiresAuth &&
    !isAuthenticated
  ) {
    return {
      name: 'access-denied'
    }
  }
})

export default router