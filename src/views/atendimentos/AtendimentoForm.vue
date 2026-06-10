<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { mostrarErroApi } from '@/services/erros'
import useColecao from '@/composables/useColecao'
import BaseLayout from '@/components/BaseLayout.vue'
import BaseButton from '@/components/BaseButton.vue'
import CampoData from '@/components/CampoData.vue'
import CampoTexto from '@/components/CampoTexto.vue'
import Seletor from '@/components/Seletor.vue'

const route = useRoute()
const router = useRouter()
const editandoId = route.params.id || null

// Buscar dados das 3 coleções necessárias para os Selects
const { itens: pacientes } = useColecao('/pessoas/pacientes/', (p) => ({ valor: p.id, rotulo: p.nome }))
const { itens: profissionais } = useColecao('/pessoas/profissionais/', (p) => ({ valor: p.id, rotulo: p.nome }))
const { itens: unidades } = useColecao('/unidades/', (u) => ({ valor: u.id, rotulo: u.nome }))

const form = reactive({
  paciente: '',
  profissional: '',
  unidade_saude: '',
  data_atendimento: '',
  observacoes: ''
})
const erros = ref({})

onMounted(async () => {
  if (!editandoId) return
  try {
    const { data } = await api.get(`/atendimentos/${editandoId}/`)
    Object.assign(form, {
      paciente: data.paciente,
      profissional: data.profissional,
      unidade_saude: data.unidade_saude,
      data_atendimento: data.data_atendimento || '',
      observacoes: data.observacoes || ''
    })
  } catch {
    alert('Não foi possível carregar o registro.')
    router.push({ name: 'atendimentos' })
  }
})

function validar() {
  const e = {}
  if (!form.paciente) e.paciente = 'Selecione o paciente.'
  if (!form.profissional) e.profissional = 'Selecione o profissional.'
  if (!form.unidade_saude) e.unidade_saude = 'Selecione a unidade de saúde.'
  if (!form.data_atendimento) e.data_atendimento = 'Informe a data.'
  erros.value = e
  return Object.keys(e).length === 0
}

async function salvar() {
  if (!validar()) return
  const dados = { ...form }
  try {
    if (editandoId) {
      await api.put(`/atendimentos/${editandoId}/`, dados)
    } else {
      await api.post('/atendimentos/', dados)
    }
    router.push({ name: 'atendimentos' })
  } catch (err) {
    mostrarErroApi(err)
  }
}
</script>

<template>
  <BaseLayout :titulo="editandoId ? 'Editar Atendimento' : 'Novo Atendimento'" voltar-para="atendimentos">
    <form class="form" @submit.prevent="salvar">
      <Seletor v-model="form.paciente" label="Paciente *" :opcoes="pacientes" :erro="erros.paciente" />
      <Seletor v-model="form.unidade_saude" label="Unidade de Saúde *" :opcoes="unidades" :erro="erros.unidade_saude" />
      <Seletor v-model="form.profissional" label="Profissional *" :opcoes="profissionais" :erro="erros.profissional" />
      
      <CampoData v-model="form.data_atendimento" label="Data do Atendimento *" :erro="erros.data_atendimento" />
      <CampoTexto v-model="form.observacoes" label="Observações (Opcional)" />
      
      <BaseButton type="submit">{{ editandoId ? 'Atualizar' : 'Salvar' }}</BaseButton>
    </form>
  </BaseLayout>
</template>

<style scoped>
.form { background: #fff; border-radius: 10px; padding: 20px; max-width: 520px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
</style>