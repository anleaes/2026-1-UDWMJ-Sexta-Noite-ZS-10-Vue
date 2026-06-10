<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

// Cada item aponta para o `name` da rota da listagem do módulo.
// As rotas são registradas pelas branches de cada módulo, conforme forem entrando.
const grupos = [
  {
    titulo: 'Cadastros',
    cor: '#2e75b6',
    itens: [
      { titulo: 'Pacientes', rota: 'pacientes' },
      { titulo: 'Profissionais', rota: 'profissionais' },
      { titulo: 'Unidades de Saúde', rota: 'unidades' },
      { titulo: 'Vacinas', rota: 'vacinas' },
      { titulo: 'Lotes', rota: 'lotes' },
    ],
  },
  {
    titulo: 'Atendimento',
    cor: '#2e9e5b',
    itens: [
      { titulo: 'Perfis de Saúde', rota: 'perfis' },
      { titulo: 'Calendário Vacinal', rota: 'calendario' },
      { titulo: 'Atendimentos', rota: 'atendimentos' },
      { titulo: 'Doses por Atendimento', rota: 'doses' },
      { titulo: 'Registros de Vacinação', rota: 'registros' },
    ],
  },
  {
    titulo: 'Gestão',
    cor: '#7a4dd1',
    itens: [
      { titulo: 'Campanhas', rota: 'campanhas' },
      { titulo: 'Notificações', rota: 'notificacoes' },
      { titulo: 'Situação Vacinal', rota: 'situacoes' },
    ],
  },
]

function navegar(nome) {
  // Enquanto o módulo não foi entregue, a rota pode ainda não existir.
  if (router.hasRoute(nome)) {
    router.push({ name: nome })
  } else {
    alert('Módulo ainda não disponível.')
  }
}

async function sair() {
  if (!confirm('Deseja encerrar a sessão?')) return
  await auth.sair()
  router.push({ name: 'login' })
}
</script>

<template>
  <main class="home">
    <header class="topo">
      <div>
        <h1>Olá<span v-if="auth.usuario?.username">, {{ auth.usuario.username }}</span></h1>
        <p class="subtitulo">Selecione um módulo</p>
      </div>
      <button class="sair" @click="sair">Sair</button>
    </header>

    <section v-for="grupo in grupos" :key="grupo.titulo" class="grupo">
      <h2 class="grupo-titulo" :style="{ color: grupo.cor }">{{ grupo.titulo }}</h2>
      <button
        v-for="item in grupo.itens"
        :key="item.rota"
        class="botao"
        :style="{ background: grupo.cor }"
        @click="navegar(item.rota)"
      >
        <span>{{ item.titulo }}</span>
        <span class="seta">›</span>
      </button>
    </section>
  </main>
</template>

<style scoped>
.home {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

.topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.topo h1 {
  font-size: 22px;
}

.subtitulo {
  color: #6b7280;
  margin-top: 2px;
}

.sair {
  border: 1px solid #c0392b;
  color: #c0392b;
  background: transparent;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
}

.grupo {
  margin-bottom: 24px;
}

.grupo-titulo {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.botao {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border: none;
  border-radius: 10px;
  margin-bottom: 10px;
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
}

.seta {
  font-size: 22px;
}
</style>
