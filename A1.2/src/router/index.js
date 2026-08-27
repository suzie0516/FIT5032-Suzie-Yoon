import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import PlantsView from '../views/PlantsView.vue'
import VolunteerView from '../views/VolunteerView.vue'

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
  ],
})

export default router