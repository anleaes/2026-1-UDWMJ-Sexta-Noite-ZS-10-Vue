<script setup>
import { useRouter } from 'vue-router'
import api from '@/services/api'
import useLista from '@/composables/useLista'
import BaseLayout from '@/components/BaseLayout.vue'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const { itens: pacientes, carregar } = useLista('/pessoas/pacientes/', 'Não foi possível carregar pacientes.')

function novo() {
  router.push({ name: 'paciente-form' })
}

function editar(id) {
  router.push({ name: 'paciente-form', params: { id } })
}

async function excluir(id) {
  if (!confirm('Deseja excluir este paciente?')) return
  try {
    await api.delete(`/pessoas/pacientes/${id}/`)
    carregar()
  } catch {
    alert('Não foi possível excluir o paciente.')
  }
}
</script>

<template>
  <BaseLayout titulo="Pacientes" voltar-para="home">
    <BaseButton @click="novo">+ Novo Paciente</BaseButton>

    <p v-if="pacientes.length === 0" class="vazio">Nenhum paciente cadastrado.</p>

    <ul class="lista">
      <li v-for="paciente in pacientes" :key="paciente.id" class="card">
        <div>
          <strong>{{ paciente.nome }}</strong>
          <p>CPF: {{ paciente.cpf }}</p>
          <p>Email: {{ paciente.email }}</p>
          <p>Telefone: {{ paciente.telefone }}</p>
        </div>
        <div class="acoes">
          <BaseButton variante="secundaria" @click="editar(paciente.id)">Editar</BaseButton>
          <BaseButton variante="perigo" @click="excluir(paciente.id)">Excluir</BaseButton>
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
