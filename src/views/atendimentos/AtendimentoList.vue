<script setup>
import { useRouter } from 'vue-router'
import api from '@/services/api'
import useLista from '@/composables/useLista'
import useMapaNomes from '@/composables/useMapaNomes'
import BaseLayout from '@/components/BaseLayout.vue'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const { itens, carregar } = useLista('/atendimentos/', 'Não foi possível carregar os atendimentos.')

// Mapeamento de 3 Chaves Estrangeiras diferentes para exibir nomes em vez de IDs
const nomePaciente = useMapaNomes('/pessoas/pacientes/', (p) => p.nome)
const nomeProfissional = useMapaNomes('/pessoas/profissionais/', (p) => p.nome)
const nomeUnidade = useMapaNomes('/unidades/', (u) => u.nome)

function novo() {
  router.push({ name: 'atendimento-form' })
}

function editar(id) {
  router.push({ name: 'atendimento-form', params: { id } })
}

async function excluir(id) {
  if (!confirm('Deseja excluir este atendimento?')) return
  try {
    await api.delete(`/atendimentos/${id}/`)
    carregar()
  } catch {
    alert('Não foi possível excluir.')
  }
}
</script>

<template>
  <BaseLayout titulo="Atendimentos" voltar-para="home">
    <BaseButton @click="novo">+ Novo Atendimento</BaseButton>

    <p v-if="itens.length === 0" class="vazio">Nenhum atendimento registrado.</p>

    <ul class="lista">
      <li v-for="item in itens" :key="item.id" class="card">
        <div>
          <strong>Paciente: {{ nomePaciente(item.paciente) }}</strong>
          <p>Unidade: {{ nomeUnidade(item.unidade_saude) }}</p>
          <p>Profissional: {{ nomeProfissional(item.profissional) }}</p>
          <p>Data: {{ item.data_atendimento }}</p>
        </div>
        <div class="acoes">
          <BaseButton variante="secundaria" @click="editar(item.id)">Editar</BaseButton>
          <BaseButton variante="perigo" @click="excluir(item.id)">Excluir</BaseButton>
        </div>
      </li>
    </ul>
  </BaseLayout>
</template>

<style scoped>
.lista { list-style: none; margin-top: 16px; }
.card { background: #fff; border-radius: 10px; padding: 16px; margin-bottom: 10px; display: flex; justify-content: space-between; gap: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.card p { color: #4b5563; font-size: 14px; margin-top: 2px; }
.acoes { display: flex; gap: 8px; align-items: flex-start; }
.vazio { color: #6b7280; margin-top: 16px; }
</style>