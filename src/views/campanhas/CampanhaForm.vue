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

// Vacinas disponíveis para o relacionamento ManyToMany.
const { itens: vacinas } = useColecao('/vacinas/', (v) => ({ valor: v.id, rotulo: v.nome }))

const form = reactive({
  nome: '',
  descricao: '',
  data_inicio: '',
  data_fim: '',
  publico_alvo: '',
  ativa: true,
  vacinas: [],
})
const erros = ref({})

onMounted(async () => {
  if (!editandoId) return
  try {
    const { data } = await api.get(`/campanhas/${editandoId}/`)
    Object.assign(form, {
      nome: data.nome,
      descricao: data.descricao || '',
      data_inicio: data.data_inicio || '',
      data_fim: data.data_fim || '',
      publico_alvo: data.publico_alvo || '',
      ativa: data.ativa,
      // O Seletor múltiplo trabalha com strings; normalizamos os ids.
      vacinas: (data.vacinas || []).map((id) => String(id)),
    })
  } catch {
    alert('Não foi possível carregar a campanha.')
    router.push({ name: 'campanhas' })
  }
})

function validar() {
  const e = {}
  if (!form.nome.trim()) e.nome = 'Informe o nome da campanha.'
  if (!form.data_inicio) e.data_inicio = 'Informe a data de início.'
  if (!form.data_fim) e.data_fim = 'Informe a data de fim.'
  if (form.data_inicio && form.data_fim && form.data_fim < form.data_inicio) {
    e.data_fim = 'A data de fim deve ser posterior à data de início.'
  }
  erros.value = e
  return Object.keys(e).length === 0
}

async function salvar() {
  if (!validar()) return
  const dados = {
    ...form,
    vacinas: form.vacinas.map((id) => Number(id)),
  }
  try {
    if (editandoId) {
      await api.put(`/campanhas/${editandoId}/`, dados)
    } else {
      await api.post('/campanhas/', dados)
    }
    router.push({ name: 'campanhas' })
  } catch (err) {
    mostrarErroApi(err)
  }
}
</script>

<template>
  <BaseLayout :titulo="editandoId ? 'Editar Campanha' : 'Nova Campanha'" voltar-para="campanhas">
    <form class="form" @submit.prevent="salvar">
      <CampoTexto v-model="form.nome" label="Nome *" :erro="erros.nome" />
      <CampoTexto v-model="form.descricao" label="Descrição" />
      <CampoData v-model="form.data_inicio" label="Data de Início *" :erro="erros.data_inicio" />
      <CampoData v-model="form.data_fim" label="Data de Fim *" :erro="erros.data_fim" />
      <CampoTexto v-model="form.publico_alvo" label="Público-alvo" />
      <Seletor
        v-model="form.vacinas"
        label="Vacinas"
        :opcoes="vacinas"
        :multiplo="true"
      />
      <label class="check">
        <input type="checkbox" v-model="form.ativa" /> Campanha ativa
      </label>
      <BaseButton type="submit">{{ editandoId ? 'Atualizar' : 'Cadastrar' }}</BaseButton>
    </form>
  </BaseLayout>
</template>

<style scoped>
.form {
  background: #fff; border-radius: 10px; padding: 20px; max-width: 520px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.check { display: flex; align-items: center; gap: 8px; margin: 12px 0; font-size: 14px; }
</style>
