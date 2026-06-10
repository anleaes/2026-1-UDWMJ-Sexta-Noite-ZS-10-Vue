<script setup>
import { useRouter } from 'vue-router'
import api from '@/services/api'
import useLista from '@/composables/useLista'
import useMapaNomes from '@/composables/useMapaNomes'
import BaseLayout from '@/components/BaseLayout.vue'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const { itens, carregar } = useLista('/situacoes/', 'Não foi possível carregar as situações vacinais.')

// Trazemos os nomes dos relacionamentos (Chaves Estrangeiras)
const nomePaciente = useMapaNomes('/pessoas/pacientes/', (p) => p.nome)
const nomeVacina = useMapaNomes('/vacinas/', (v) => v.nome)

function novo() {
  router.push({ name: 'situacao-form' })
}

function editar(id) {
  router.push({ name: 'situacao-form', params: { id } })
}

async function excluir(id) {
  if (!confirm('Deseja excluir este registro?')) return
  try {
    await api.delete(`/situacoes/${id}/`)
    carregar()
  } catch {
    alert('Não foi possível excluir.')
  }
}
</script>

<template>
  <BaseLayout titulo="Situação Vacinal" voltar-para="home">
    <BaseButton @click="novo">+ Novo Registro</BaseButton>

    <p v-if="itens.length === 0" class="vazio">Nenhum registro encontrado.</p>

    <ul class="lista">
      <li v-for="item in itens" :key="item.id" class="card">
        <div>
          <strong>Paciente: {{ nomePaciente(item.paciente) }}</strong>
          <p>Vacina: {{ nomeVacina(item.vacina) }}</p>
          <p>Status: {{ item.status }}</p>
          <p v-if="item.data_proxima_dose">Próxima Dose: {{ item.data_proxima_dose }}</p>
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