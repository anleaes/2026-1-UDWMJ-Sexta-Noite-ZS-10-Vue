import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Gestão - Situação Vacinal
    {
      path: '/situacoes',
      name: 'situacoes',
      component: () => import('@/views/situacao/SituacaoList.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/situacoes/form/:id?',
      name: 'situacao-form',
      component: () => import('@/views/situacao/SituacaoForm.vue'),
      meta: { requiresAuth: true },
    },
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

    // Pessoas - Profissionais
    {
      path: '/profissionais',
      name: 'profissionais',
      component: () => import('@/views/pessoas/ProfissionalList.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profissionais/form/:id?',
      name: 'profissional-form',
      component: () => import('@/views/pessoas/ProfissionalForm.vue'),
      meta: { requiresAuth: true },
    },
    // Unidades
{
  path: '/unidades',
  name: 'unidades',
  component: () => import('@/views/unidades/UnidadeList.vue'),
  meta: { requiresAuth: true },
},
{
  path: '/unidades/form/:id?',
  name: 'unidade-form',
  component: () => import('@/views/unidades/UnidadeForm.vue'),
  meta: { requiresAuth: true },
},
{
  path: '/perfis',
  name: 'perfis',
  component: () => import('@/views/perfis/PerfilList.vue'),
  meta: { requiresAuth: true },
},
{
  path: '/perfis/form/:id?',
  name: 'perfil-form',
  component: () => import('@/views/perfis/PerfilForm.vue'),
  meta: { requiresAuth: true },
},
{
  path: '/vacinas',
  name: 'vacinas',
  component: () => import('@/views/vacinas/VacinaList.vue'),
  meta: { requiresAuth: true },
},
{
  path: '/vacinas/form/:id?',
  name: 'vacina-form',
  component: () => import('@/views/vacinas/VacinaForm.vue'),
  meta: { requiresAuth: true },
},
{
  path: '/lotes',
  name: 'lotes',
  component: () => import('@/views/lotes/LoteList.vue'),
  meta: { requiresAuth: true },
},
{
  path: '/lotes/form/:id?',
  name: 'lote-form',
  component: () => import('@/views/lotes/LoteForm.vue'),
  meta: { requiresAuth: true },
},

{
  path: '/calendario',
  name: 'calendario',
  component: () => import('@/views/calendario/CalendarioList.vue'),
  meta: { requiresAuth: true },
},
{
  path: '/calendario/form/:id?',
  name: 'calendario-form',
  component: () => import('@/views/calendario/CalendarioForm.vue'),
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
