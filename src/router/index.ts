import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import DashboardMainLayout from '../views/dashboard/MainLayout.vue'

import { supabase } from '@/config/supabase'
import { useToast } from '@/components/ui/toast/use-toast'

const authGuard = async function (to, from, next) {
  const { data: { user } } = await supabase.auth.getUser()

  const { toast } = useToast()

  if (user) {
    next()
  } else {
    toast({ title: 'Please Log In', description: 'You need to be logged in to continue' })
    next('/')
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dashboard',
      name: 'dashboardMain',
      component: DashboardMainLayout,
      beforeEnter: authGuard,
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('../views/dashboard/IndexView.vue')
        },
        {
          path: 'services',
          name: 'Services',
          component: () => import('../views/dashboard/ServicesView.vue')
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
