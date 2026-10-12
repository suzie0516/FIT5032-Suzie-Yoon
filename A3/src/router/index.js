
import { watch } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import PlantsView from '../views/PlantsView.vue'
import VolunteerView from '../views/VolunteerView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import AccountView from '../views/AccountView.vue'
import AdminView from '../views/AdminView.vue'
import RatingView from '../views/RatingView.vue'
import TablesDemoView from '../views/TablesDemoView.vue'
import EmailView from '../views/EmailView.vue'

import { authReady, isAuthenticated, isAdmin } from '../utils/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/plants',
      name: 'plants',
      component: PlantsView,
    },
    {
      path: '/volunteer',
      name: 'volunteer',
      component: VolunteerView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: '/email',
      name: 'email',
      component: EmailView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/tables',
      name: 'tables',
      component: TablesDemoView,
    },
    {
      path: '/design-challenge',
      name: 'designChallenge',
      component: RatingView,
    },
  ],
})

const waitForAuth = () => {
  if (authReady.value) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const stop = watch(authReady, (ready) => {
      if (ready) {
        stop()
        resolve()
      }
    })
  })
}

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth || to.meta.requiresAdmin) {
    await waitForAuth()
  }

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (to.meta.requiresAdmin && !isAdmin.value) {
    return {
      name: 'account',
      query: {
        access: 'denied',
      },
    }
  }

  return true
})

export default router
