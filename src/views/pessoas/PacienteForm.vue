<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { mostrarErroApi } from '@/services/erros'
import BaseLayout from '@/components/BaseLayout.vue'
import BaseButton from '@/components/BaseButton.vue'
import CampoTexto from '@/components/CampoTexto.vue'
import CampoData from '@/components/CampoData.vue'

const route = useRoute()
const router = useRouter()

const editandoId = route.params.id || null

const form = reactive({
  nome: '',
  email: '',
  telefone: '',
  cpf: '',
  data_nascimento: '',
})

const erros = ref({})

onMounted(async () => {
  if (!editandoId) return
  try {
    const { data } = await api.get(`/pessoas/pacientes/${editandoId}/`)
    form.nome = data.nome
    form.email = data.email
    form.telefone = data.telefone
    form.cpf = data.cpf
    form.data_nascimento = data.data_nascimento
  } catch {
    alert('Não foi possível carregar o paciente.')
    router.push({ name: 'pacientes' })
  }
})

function validar() {
  const e = {}
  if (!form.nome.trim()) e.nome = 'Informe o nome completo.'
  if (!form.email.trim()) e.email = 'Informe um email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido. Ex: nome@email.com'
  if (!form.telefone.trim()) e.telefone = 'Informe um telefone para contato.'
  if (!form.cpf.trim()) e.cpf = 'Informe o CPF.'
  if (!form.data_nascimento) e.data_nascimento = 'Informe a data de nascimento.'
  erros.value = e
  return Object.keys(e).length === 0
}

async function salvar() {
  if (!validar()) return

  const dados = { ...form, ativo: true }
  try {
    if (editandoId) {
      await api.put(`/pessoas/pacientes/${editandoId}/`, dados)
    } else {
      await api.post('/pessoas/pacientes/', dados)
    }
    router.push({ name: 'pacientes' })
  } catch (err) {
    mostrarErroApi(err)
  }
}
</script>

<template>
  <BaseLayout :titulo="editandoId ? 'Editar Paciente' : 'Cadastro de Paciente'" voltar-para="pacientes">
    <form class="form" @submit.prevent="salvar">
      <CampoTexto v-model="form.nome" label="Nome *" placeholder="Nome completo" :erro="erros.nome" />
      <CampoTexto v-model="form.email" label="Email *" type="email" placeholder="nome@email.com" :erro="erros.email" />
      <CampoTexto v-model="form.telefone" label="Telefone *" placeholder="(00) 00000-0000" :erro="erros.telefone" />
      <CampoTexto v-model="form.cpf" label="CPF *" placeholder="000.000.000-00" :erro="erros.cpf" />
      <CampoData v-model="form.data_nascimento" label="Data de Nascimento *" :erro="erros.data_nascimento" />

      <BaseButton type="submit">{{ editandoId ? 'Atualizar' : 'Cadastrar' }}</BaseButton>
    </form>
  </BaseLayout>
</template>

<style scoped>
.form {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  max-width: 520px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
</style>
