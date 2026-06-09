import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { requiresAuth: true },
    },

    // Pessoas - Pacientes
    {
      path: '/pacientes',
      name: 'pacientes',
      component: () => import('@/views/pessoas/PacienteList.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pacientes/form/:id?',
      name: 'paciente-form',
      component: () => import('@/views/pessoas/PacienteForm.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  // Rota protegida sem sessão -> manda para o login.
  if (to.meta.requiresAuth && !auth.autenticado) {
    return { name: 'login' }
  }

  // Já autenticado tentando abrir o login -> manda para a home.
  if (to.name === 'login' && auth.autenticado) {
    return { name: 'home' }
  }

  return true
})

export default router
