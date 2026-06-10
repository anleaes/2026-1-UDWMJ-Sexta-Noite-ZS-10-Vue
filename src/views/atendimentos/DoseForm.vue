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

// Carrega as coleções necessárias para alimentar os seletores de chaves estrangeiras
const { itens: atendimentos } = useColecao('/atendimentos/', (a) => ({ valor: a.id, rotulo: `Atendimento #${a.id}` }))
const { itens: vacinas } = useColecao('/vacinas/', (v) => ({ valor: v.id, rotulo: v.nome }))
const { itens: lotes } = useColecao('/vacinas/lotes/', (l) => ({ valor: l.id, rotulo: `Lote: ${l.numero_lote}` }))

const form = reactive({
  atendimento: '',
  vacina: '',
  lote: '',
  ordem_dose: '',
  observacao: ''
})
const erros = ref({})

onMounted(async () => {
  if (!editandoId) return
  try {
    const { data } = await api.get(`/atendimentos/doses/${editandoId}/`)
    Object.assign(form, {
      atendimento: data.atendimento,
      vacina: data.vacina,
      lote: data.lote,
      ordem_dose: data.ordem_dose,
      observacao: data.observacao || ''
    })
  } catch {
    alert('Não foi possível carregar os dados da dose.')
    router.push({ name: 'doses' })
  }
})

function validar() {
  const e = {}
  if (!form.atendimento) e.atendimento = 'Selecione o atendimento vinculado.'
  if (!form.vacina) e.vacina = 'Selecione a vacina.'
  if (!form.lote) e.lote = 'Selecione o lote da vacina.'
  if (!form.ordem_dose.trim()) e.ordem_dose = 'Informe a ordem da dose (ex: 1ª Dose, Reforço).'
  erros.value = e
  return Object.keys(e).length === 0
}

async function salvar() {
  if (!validar()) return
  const dados = { ...form }
  try {
    if (editandoId) {
      await api.put(`/atendimentos/doses/${editandoId}/`, dados)
    } else {
      await api.post('/atendimentos/doses/', dados)
    }
    router.push({ name: 'doses' })
  } catch (err) {
    mostrarErroApi(err)
  }
}
</script>

<template>
  <BaseLayout :titulo="editandoId ? 'Editar Registo de Dose' : 'Registar Aplicação de Dose'" voltar-para="doses">
    <form class="form" @submit.prevent="salvar">
      <Seletor v-model="form.atendimento" label="Atendimento Vinculado *" :opcoes="atendimentos" :erro="erros.atendimento" />
      <Seletor v-model="form.vacina" label="Vacina *" :opcoes="vacinas" :erro="erros.vacina" />
      <Seletor v-model="form.lote" label="Lote da Vacina *" :opcoes="lotes" :erro="erros.lote" />
      
      <CampoTexto v-model="form.ordem_dose" label="Ordem da Dose * (ex: 1ª dose, Única)" :erro="erros.ordem_dose" />
      <CampoTexto v-model="form.observacao" label="Observação (Opcional)" />
      
      <BaseButton type="submit">{{ editandoId ? 'Atualizar' : 'Salvar Registo' }}</BaseButton>
    </form>
  </BaseLayout>
</template>

<style scoped>
.form { background: #fff; border-radius: 10px; padding: 20px; max-width: 520px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
</style>