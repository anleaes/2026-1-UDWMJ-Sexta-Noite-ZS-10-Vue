<script setup>
import { useRouter } from 'vue-router'
import api from '@/services/api'
import useLista from '@/composables/useLista'
import useMapaNomes from '@/composables/useMapaNomes'
import BaseLayout from '@/components/BaseLayout.vue'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const { itens, carregar } = useLista('/registros/', 'Não foi possível carregar os registos de vacinação.')

// Mapeamentos para transformar IDs nos nomes mais importantes para a visualização rápida
const nomePaciente = useMapaNomes('/pessoas/pacientes/', (p) => p.nome)
const nomeVacina = useMapaNomes('/vacinas/', (v) => v.nome)
const nomeProfissional = useMapaNomes('/pessoas/profissionais/', (p) => p.nome)

function novo() {
  router.push({ name: 'registro-form' })
}

function editar(id) {
  router.push({ name: 'registro-form', params: { id } })
}

async function excluir(id) {
  if (!confirm('Deseja excluir este registo consolidado?')) return
  try {
    await api.delete(`/registros/${id}/`)
    carregar()
  } catch {
    alert('Não foi possível excluir o registo.')
  }
}
</script>

<template>
  <BaseLayout titulo="Registos de Vacinação" voltar-para="home">
    <BaseButton @click="novo">+ Novo Registo</BaseButton>

    <p v-if="itens.length === 0" class="vazio">Nenhum registo efetuado.</p>

    <ul class="lista">
      <li v-for="item in itens" :key="item.id" class="card">
        <div>
          <strong>Paciente: {{ nomePaciente(item.paciente) }}</strong>
          <p>Vacina: {{ nomeVacina(item.vacina) }} (Dose: {{ item.dose }})</p>
          <p>Data de Aplicação: {{ item.data_aplicacao }}</p>
          <p>Aplicador: {{ nomeProfissional(item.profissional) }}</p>
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