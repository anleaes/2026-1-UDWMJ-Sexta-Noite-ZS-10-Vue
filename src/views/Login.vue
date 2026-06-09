<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const carregando = ref(false)
const erro = ref('')

async function entrar() {
  erro.value = ''

  if (!username.value.trim() || !password.value.trim()) {
    erro.value = 'Informe usuário e senha.'
    return
  }

  carregando.value = true
  try {
    await auth.entrar(username.value.trim(), password.value)
    router.push({ name: 'home' })
  } catch {
    erro.value = 'Usuário ou senha inválidos.'
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <main class="login">
    <form class="card" @submit.prevent="entrar">
      <h1>Gestor de Vacinação</h1>
      <p class="subtitulo">Acesse sua conta</p>

      <label class="campo">
        <span>Usuário</span>
        <input v-model="username" type="text" autocomplete="username" placeholder="Usuário" />
      </label>

      <label class="campo">
        <span>Senha</span>
        <input v-model="password" type="password" autocomplete="current-password" placeholder="Senha" />
      </label>

      <p v-if="erro" class="erro">{{ erro }}</p>

      <button type="submit" :disabled="carregando">
        {{ carregando ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>
  </main>
</template>

<style scoped>
.login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 16px;
}

.card {
  width: 100%;
  max-width: 380px;
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

h1 {
  font-size: 22px;
}

.subtitulo {
  color: #6b7280;
  margin-bottom: 6px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
}

.campo input {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
}

.campo input:focus {
  border-color: #2e75b6;
}

.erro {
  color: #c0392b;
  font-size: 14px;
}

button {
  margin-top: 6px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #2e75b6;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
