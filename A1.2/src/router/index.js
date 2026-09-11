import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'

import PlantsView from '../views/PlantsView.vue'

import VolunteerView from '../views/VolunteerView.vue'

import RegisterView from '../views/RegisterView.vue'

import LoginView from '../views/LoginView.vue'

import AccountView from '../views/AccountView.vue'

import AdminView from '../views/AdminView.vue'

import RatingView from '../views/RatingView.vue'

import { currentUser } from '../utils/auth'


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
      path: '/design-challenge',
      name: 'designChallenge',
      component: RatingView,
    },

  ],

})


// --------------------------------
// Route protection
// --------------------------------
router.beforeEach((to) => {

  // Protected page:
  // user must first be signed in.
  if (
    to.meta.requiresAuth &&
    !currentUser.value
  ) {
    return {
      name: 'login',

      query: {
        redirect: to.fullPath,
      },
    }
  }


  // Administrator page:
  // signed-in user must have the admin role.
  if (
    to.meta.requiresAdmin &&
    currentUser.value?.role !== 'admin'
  ) {
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