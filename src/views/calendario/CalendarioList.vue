<script setup>
import { useRouter } from 'vue-router'
import api from '@/services/api'
import useLista from '@/composables/useLista'
import useMapaNomes from '@/composables/useMapaNomes'
import BaseLayout from '@/components/BaseLayout.vue'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const { itens, carregar } = useLista('/calendario/', 'Não foi possível carregar o calendário.')

const nomeVacina = useMapaNomes('/vacinas/', (v) => v.nome)

function novo() {
  router.push({ name: 'calendario-form' })
}
function editar(id) {
  router.push({ name: 'calendario-form', params: { id } })
}
async function excluir(id) {
  if (!confirm('Deseja excluir este registro?')) return
  try {
    await api.delete(`/calendario/${id}/`)
    carregar()
  } catch {
    alert('Não foi possível excluir.')
  }
}
</script>

<template>
  <BaseLayout titulo="Calendário Vacinal" voltar-para="home">
    <BaseButton @click="novo">+ Novo Registro</BaseButton>

    <p v-if="itens.length === 0" class="vazio">Nenhum registro no calendário.</p>

    <ul class="lista">
      <li v-for="item in itens" :key="item.id" class="card">
        <div>
          <strong>{{ nomeVacina(item.vacina) }}</strong>
          <p>Público-alvo: {{ item.publico_alvo }}</p>
          <p>Dose recomendada: {{ item.dose_recomendada }}</p>
          <p>Idade mínima: {{ item.idade_minima_meses }} meses</p>
          <p v-if="item.idade_maxima_meses">Idade máxima: {{ item.idade_maxima_meses }} meses</p>
          <p>{{ item.obrigatoria ? '✅ Obrigatória' : 'Opcional' }}</p>
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
.card {
  background: #fff; border-radius: 10px; padding: 16px; margin-bottom: 10px;
  display: flex; justify-content: space-between; gap: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.card p { color: #4b5563; font-size: 14px; margin-top: 2px; }
.acoes { display: flex; gap: 8px; align-items: flex-start; }
.vazio { color: #6b7280; margin-top: 16px; }
</style>