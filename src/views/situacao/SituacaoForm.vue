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

// Busca de dados para preencher os selects
const { itens: pacientes } = useColecao('/pessoas/pacientes/', (p) => ({ valor: p.id, rotulo: p.nome }))
const { itens: vacinas } = useColecao('/vacinas/', (v) => ({ valor: v.id, rotulo: v.nome }))

// Opções fixas de status
const opcoesStatus = [
  { valor: 'em_dia', rotulo: 'Em Dia' },
  { valor: 'atrasado', rotulo: 'Atrasado' },
  { valor: 'pendente', rotulo: 'Pendente' }
]

const form = reactive({
  paciente: '',
  vacina: '',
  status: '',
  observacao: ''
})
const erros = ref({})

onMounted(async () => {
  if (!editandoId) return
  try {
    const { data } = await api.get(`/situacao/${editandoId}/`)
    Object.assign(form, {
      paciente: data.paciente,
      vacina: data.vacina,
      status: data.status,
      observacao: data.observacao || ''
    })
  } catch {
    alert('Não foi possível carregar o registro.')
    router.push({ name: 'situacoes' })
  }
})

function validar() {
  const e = {}
  if (!form.paciente) e.paciente = 'Selecione o paciente.'
  if (!form.vacina) e.vacina = 'Selecione a vacina.'
  if (!form.status) e.status = 'Selecione o status.'
  erros.value = e
  return Object.keys(e).length === 0
}

async function salvar() {
  if (!validar()) return
  const dados = { ...form }
  try {
    if (editandoId) {
      await api.put(`/situacao/${editandoId}/`, dados)
    } else {
      await api.post('/situacao/', dados)
    }
    router.push({ name: 'situacoes' })
  } catch (err) {
    mostrarErroApi(err)
  }
}
</script>

<template>
  <BaseLayout :titulo="editandoId ? 'Editar Situação' : 'Nova Situação'" voltar-para="situacoes">
    <form class="form" @submit.prevent="salvar">
      <Seletor v-model="form.paciente" label="Paciente *" :opcoes="pacientes" :erro="erros.paciente" />
      <Seletor v-model="form.vacina" label="Vacina *" :opcoes="vacinas" :erro="erros.vacina" />
      <Seletor v-model="form.status" label="Status *" :opcoes="opcoesStatus" :erro="erros.status" />
      <CampoTexto v-model="form.observacao" label="Observação" />
      
      <BaseButton type="submit">{{ editandoId ? 'Atualizar' : 'Salvar' }}</BaseButton>
    </form>
  </BaseLayout>
</template>

<style scoped>
.form { background: #fff; border-radius: 10px; padding: 20px; max-width: 520px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
</style>