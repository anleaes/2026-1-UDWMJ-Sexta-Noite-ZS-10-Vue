<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { mostrarErroApi } from '@/services/erros'
import useColecao from '@/composables/useColecao'
import BaseLayout from '@/components/BaseLayout.vue'
import BaseButton from '@/components/BaseButton.vue'
import CampoTexto from '@/components/CampoTexto.vue'
import CampoData from '@/components/CampoData.vue'
import Seletor from '@/components/Seletor.vue'

const route = useRoute()
const router = useRouter()
const editandoId = route.params.id || null

// Buscar TUDO que compõe um registo final
const { itens: pacientes } = useColecao('/pessoas/pacientes/', (p) => ({ valor: p.id, rotulo: p.nome }))
const { itens: vacinas } = useColecao('/vacinas/', (v) => ({ valor: v.id, rotulo: v.nome }))
const { itens: lotes } = useColecao('/vacinas/lotes/', (l) => ({ valor: l.id, rotulo: l.numero_lote }))
const { itens: profissionais } = useColecao('/pessoas/profissionais/', (p) => ({ valor: p.id, rotulo: p.nome }))
const { itens: unidades } = useColecao('/unidades/', (u) => ({ valor: u.id, rotulo: u.nome }))
const { itens: atendimentos } = useColecao('/atendimentos/', (a) => ({ valor: a.id, rotulo: `Atendimento #${a.id}` }))

const form = reactive({
  paciente: '',
  vacina: '',
  lote: '',
  profissional: '',
  unidade_saude: '',
  atendimento: '',
  data_aplicacao: '',
  dose: '',
  observacao: ''
})
const erros = ref({})

onMounted(async () => {
  if (!editandoId) return
  try {
    const { data } = await api.get(`/registros/${editandoId}/`)
    Object.assign(form, {
      paciente: data.paciente,
      vacina: data.vacina,
      lote: data.lote,
      profissional: data.profissional,
      unidade_saude: data.unidade_saude,
      atendimento: data.atendimento,
      data_aplicacao: data.data_aplicacao,
      dose: data.dose,
      observacao: data.observacao || ''
    })
  } catch {
    alert('Não foi possível carregar os dados.')
    router.push({ name: 'registros' })
  }
})

function validar() {
  const e = {}
  if (!form.paciente) e.paciente = 'Obrigatório.'
  if (!form.vacina) e.vacina = 'Obrigatório.'
  if (!form.lote) e.lote = 'Obrigatório.'
  if (!form.profissional) e.profissional = 'Obrigatório.'
  if (!form.unidade_saude) e.unidade_saude = 'Obrigatório.'
  if (!form.atendimento) e.atendimento = 'Obrigatório.'
  if (!form.data_aplicacao) e.data_aplicacao = 'Obrigatório.'
  if (!form.dose.trim()) e.dose = 'Obrigatório.'
  erros.value = e
  return Object.keys(e).length === 0
}

async function salvar() {
  if (!validar()) return
  const dados = { ...form }
  try {
    if (editandoId) {
      await api.put(`/registros/${editandoId}/`, dados)
    } else {
      await api.post('/registros/', dados)
    }
    router.push({ name: 'registros' })
  } catch (err) {
    mostrarErroApi(err)
  }
}
</script>

<template>
  <BaseLayout :titulo="editandoId ? 'Editar Registo' : 'Novo Registo de Vacinação'" voltar-para="registros">
    <form class="form" @submit.prevent="salvar">
      <div class="grid">
        <Seletor v-model="form.paciente" label="Paciente *" :opcoes="pacientes" :erro="erros.paciente" />
        <Seletor v-model="form.atendimento" label="Atendimento Base *" :opcoes="atendimentos" :erro="erros.atendimento" />
        
        <Seletor v-model="form.vacina" label="Vacina *" :opcoes="vacinas" :erro="erros.vacina" />
        <Seletor v-model="form.lote" label="Lote *" :opcoes="lotes" :erro="erros.lote" />
        
        <Seletor v-model="form.profissional" label="Profissional *" :opcoes="profissionais" :erro="erros.profissional" />
        <Seletor v-model="form.unidade_saude" label="Unidade *" :opcoes="unidades" :erro="erros.unidade_saude" />
      </div>

      <CampoData v-model="form.data_aplicacao" label="Data de Aplicação *" :erro="erros.data_aplicacao" />
      <CampoTexto v-model="form.dose" label="Qual a Dose? (ex: 2ª Dose) *" :erro="erros.dose" />
      <CampoTexto v-model="form.observacao" label="Observações (Opcional)" />
      
      <BaseButton type="submit" class="btn-salvar">{{ editandoId ? 'Atualizar Registo' : 'Confirmar Registo' }}</BaseButton>
    </form>
  </BaseLayout>
</template>

<style scoped>
.form { background: #fff; border-radius: 10px; padding: 20px; max-width: 650px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
.btn-salvar { margin-top: 16px; width: 100%; }
@media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }
</style>