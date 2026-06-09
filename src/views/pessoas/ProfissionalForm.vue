<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { mostrarErroApi } from '@/services/erros'
import useColecao from '@/composables/useColecao'
import BaseLayout from '@/components/BaseLayout.vue'
import BaseButton from '@/components/BaseButton.vue'
import CampoTexto from '@/components/CampoTexto.vue'
import Seletor from '@/components/Seletor.vue'

const route = useRoute()
const router = useRouter()

const editandoId = route.params.id || null

const { itens: unidades } = useColecao('/unidades/', (u) => ({ valor: u.id, rotulo: u.nome }))

const form = reactive({
  nome: '',
  email: '',
  telefone: '',
  registro_profissional: '',
  cargo: '',
  unidade_saude: '',
})

const erros = ref({})

onMounted(async () => {
  if (!editandoId) return
  try {
    const { data } = await api.get(`/pessoas/profissionais/${editandoId}/`)
    form.nome = data.nome
    form.email = data.email
    form.telefone = data.telefone
    form.registro_profissional = data.registro_profissional
    form.cargo = data.cargo
    form.unidade_saude = data.unidade_saude ?? ''
  } catch {
    alert('Não foi possível carregar o profissional.')
    router.push({ name: 'profissionais' })
  }
})

function validar() {
  const e = {}
  if (!form.nome.trim()) e.nome = 'Informe o nome completo.'
  if (!form.email.trim()) e.email = 'Informe um email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido. Ex: nome@email.com'
  if (!form.telefone.trim()) e.telefone = 'Informe um telefone para contato.'
  if (!form.registro_profissional.trim()) e.registro_profissional = 'Informe o registro profissional.'
  if (!form.cargo.trim()) e.cargo = 'Informe o cargo.'
  erros.value = e
  return Object.keys(e).length === 0
}

async function salvar() {
  if (!validar()) return

  const dados = {
    ...form,
    unidade_saude: form.unidade_saude || null,
    ativo: true,
  }
  try {
    if (editandoId) {
      await api.put(`/pessoas/profissionais/${editandoId}/`, dados)
    } else {
      await api.post('/pessoas/profissionais/', dados)
    }
    router.push({ name: 'profissionais' })
  } catch (err) {
    mostrarErroApi(err)
  }
}
</script>

<template>
  <BaseLayout
    :titulo="editandoId ? 'Editar Profissional' : 'Cadastro de Profissional'"
    voltar-para="profissionais"
  >
    <form class="form" @submit.prevent="salvar">
      <CampoTexto v-model="form.nome" label="Nome *" placeholder="Nome completo" :erro="erros.nome" />
      <CampoTexto v-model="form.email" label="Email *" type="email" placeholder="nome@email.com" :erro="erros.email" />
      <CampoTexto v-model="form.telefone" label="Telefone *" placeholder="(00) 00000-0000" :erro="erros.telefone" />
      <CampoTexto
        v-model="form.registro_profissional"
        label="Registro Profissional *"
        placeholder="Ex: CRM 12345"
        :erro="erros.registro_profissional"
      />
      <CampoTexto v-model="form.cargo" label="Cargo *" placeholder="Ex: Enfermeiro(a)" :erro="erros.cargo" />
      <Seletor
        v-model="form.unidade_saude"
        label="Unidade de Saúde"
        :opcoes="unidades"
        placeholder="Selecione a unidade"
      />

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
