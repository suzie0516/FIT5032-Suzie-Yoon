import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import PlantsView from '../views/PlantsView.vue'
import VolunteerView from '../views/VolunteerView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'

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
  ],
})

export default router