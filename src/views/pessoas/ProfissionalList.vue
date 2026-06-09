<script setup>
import { useRouter } from 'vue-router'
import api from '@/services/api'
import useLista from '@/composables/useLista'
import useMapaNomes from '@/composables/useMapaNomes'
import BaseLayout from '@/components/BaseLayout.vue'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const { itens: profissionais, carregar } = useLista(
  '/pessoas/profissionais/',
  'Não foi possível carregar profissionais.',
)
const nomeUnidade = useMapaNomes('/unidades/', (u) => u.nome)

function novo() {
  router.push({ name: 'profissional-form' })
}

function editar(id) {
  router.push({ name: 'profissional-form', params: { id } })
}

async function excluir(id) {
  if (!confirm('Deseja excluir este profissional?')) return
  try {
    await api.delete(`/pessoas/profissionais/${id}/`)
    carregar()
  } catch {
    alert('Não foi possível excluir o profissional.')
  }
}
</script>

<template>
  <BaseLayout titulo="Profissionais" voltar-para="home">
    <BaseButton @click="novo">+ Novo Profissional</BaseButton>

    <p v-if="profissionais.length === 0" class="vazio">Nenhum profissional cadastrado.</p>

    <ul class="lista">
      <li v-for="prof in profissionais" :key="prof.id" class="card">
        <div>
          <strong>{{ prof.nome }}</strong>
          <p>Cargo: {{ prof.cargo }}</p>
          <p>Registro: {{ prof.registro_profissional }}</p>
          <p>Unidade: {{ nomeUnidade(prof.unidade_saude) }}</p>
          <p>Email: {{ prof.email }}</p>
        </div>
        <div class="acoes">
          <BaseButton variante="secundaria" @click="editar(prof.id)">Editar</BaseButton>
          <BaseButton variante="perigo" @click="excluir(prof.id)">Excluir</BaseButton>
        </div>
      </li>
    </ul>
  </BaseLayout>
</template>

<style scoped>
.lista {
  list-style: none;
  margin-top: 16px;
}

.card {
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.card p {
  color: #4b5563;
  font-size: 14px;
  margin-top: 2px;
}

.acoes {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.vazio {
  color: #6b7280;
  margin-top: 16px;
}
</style>
