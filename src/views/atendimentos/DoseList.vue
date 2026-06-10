<script setup>
import { useRouter } from 'vue-router'
import api from '@/services/api'
import useLista from '@/composables/useLista'
import useMapaNomes from '@/composables/useMapaNomes'
import BaseLayout from '@/components/BaseLayout.vue'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
// Endpoint correto para a listagem de doses conforme especificado na API
const { itens, carregar } = useLista('/atendimentos/doses/', 'Não foi possível carregar as doses.')

// Mapeamentos para transformar IDs em textos compreensíveis na listagem
const nomeVacina = useMapaNomes('/vacinas/', (v) => v.nome)
const numeroLote = useMapaNomes('/vacinas/lotes/', (l) => l.numero_lote)
const identificadorAtendimento = useMapaNomes('/atendimentos/', (a) => `Atendimento #${a.id}`)

function novo() {
  router.push({ name: 'dose-form' })
}

function editar(id) {
  router.push({ name: 'dose-form', params: { id } })
}

async function excluir(id) {
  if (!confirm('Deseja excluir este registo de dose?')) return
  try {
    await api.delete(`/atendimentos/doses/${id}/`)
    carregar()
  } catch {
    alert('Não foi possível excluir o registo.')
  }
}
</script>

<template>
  <BaseLayout titulo="Doses Aplicadas" voltar-para="home">
    <BaseButton @click="novo">+ Registar Dose</BaseButton>

    <p v-if="itens.length === 0" class="vazio">Nenhum registo de dose encontrado.</p>

    <ul class="lista">
      <li v-for="item in itens" :key="item.id" class="card">
        <div>
          <strong>{{ identificadorAtendimento(item.atendimento) }}</strong>
          <p>Vacina: {{ nomeVacina(item.vacina) }}</p>
          <p>Lote: {{ numeroLote(item.lote) }}</p>
          <p>Ordem da Dose: {{ item.ordem_dose }}</p>
          <p v-if="item.observacao">Obs: {{ item.observacao }}</p>
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