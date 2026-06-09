<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineProps({
  titulo: { type: String, default: '' },
  voltarPara: { type: String, default: '' }, // nome da rota para o botão "voltar"
})

const router = useRouter()
const auth = useAuthStore()

async function sair() {
  if (!confirm('Deseja encerrar a sessão?')) return
  await auth.sair()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="layout">
    <header class="topo">
      <div class="esquerda">
        <button v-if="voltarPara" class="voltar" @click="router.push({ name: voltarPara })">
          ‹ Voltar
        </button>
        <h1>{{ titulo }}</h1>
      </div>
      <button class="sair" @click="sair">Sair</button>
    </header>

    <main class="conteudo">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
}

.topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  background: #2e75b6;
  color: #fff;
}

.esquerda {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topo h1 {
  font-size: 18px;
}

.voltar {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.6);
  color: #fff;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
}

.sair {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.8);
  color: #fff;
  border-radius: 8px;
  padding: 6px 14px;
  font-weight: bold;
  cursor: pointer;
}

.conteudo {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px;
}
</style>
