import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api, { definirToken, registrarOnNaoAutorizado } from '@/services/api'

const CHAVE_TOKEN = '@vacinas:token'
const CHAVE_USUARIO = '@vacinas:usuario'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(null)

  const autenticado = computed(() => !!usuario.value)

  // Limpa a sessão local (sem chamar o servidor).
  function limparSessao() {
    definirToken(null)
    localStorage.removeItem(CHAVE_TOKEN)
    localStorage.removeItem(CHAVE_USUARIO)
    usuario.value = null
  }

  // Restaura a sessão salva ao abrir o app.
  function restaurarSessao() {
    const token = localStorage.getItem(CHAVE_TOKEN)
    const usuarioSalvo = localStorage.getItem(CHAVE_USUARIO)

    if (token) {
      definirToken(token)
      try {
        usuario.value = usuarioSalvo ? JSON.parse(usuarioSalvo) : {}
      } catch {
        usuario.value = {}
      }
    }
  }

  async function entrar(username, password) {
    const { data } = await api.post('/auth/login/', { username, password })
    definirToken(data.token)
    localStorage.setItem(CHAVE_TOKEN, data.token)
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(data.usuario || {}))
    usuario.value = data.usuario || {}
  }

  async function sair() {
    try {
      await api.post('/auth/logout/')
    } catch {
      // mesmo se falhar no servidor, encerramos a sessão local
    }
    limparSessao()
  }

  // Se a API responder 401, encerra a sessão automaticamente.
  registrarOnNaoAutorizado(limparSessao)

  // Reidrata a sessão na criação da store.
  restaurarSessao()

  return { usuario, autenticado, entrar, sair }
})
