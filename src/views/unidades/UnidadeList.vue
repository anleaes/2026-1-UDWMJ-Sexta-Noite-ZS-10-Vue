<script setup>
import { useRouter } from 'vue-router'
import api from '@/services/api'
import useLista from '@/composables/useLista'
import BaseLayout from '@/components/BaseLayout.vue'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const { itens, carregar } = useLista('/unidades/', 'Não foi possível carregar unidades.')

function novo() {
  router.push({ name: 'unidade-form' })
}
function editar(id) {
  router.push({ name: 'unidade-form', params: { id } })
}
async function excluir(id) {
  if (!confirm('Deseja excluir esta unidade?')) return
  try {
    await api.delete(`/unidades/${id}/`)
    carregar()
  } catch {
    alert('Não foi possível excluir.')
  }
}
</script>

<template>
  <BaseLayout titulo="Unidades de Saúde" voltar-para="home">
    <BaseButton @click="novo">+ Nova Unidade</BaseButton>

    <p v-if="itens.length === 0" class="vazio">Nenhuma unidade cadastrada.</p>

    <ul class="lista">
      <li v-for="item in itens" :key="item.id" class="card">
        <div>
          <strong>{{ item.nome }}</strong>
          <p>Endereço: {{ item.endereco }}</p>
          <p>Bairro: {{ item.bairro }}</p>
          <p>Telefone: {{ item.telefone }}</p>
          <p>Horário: {{ item.horario_funcionamento }}</p>
          <p>{{ item.ativa ? '✅ Ativa' : '❌ Inativa' }}</p>
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