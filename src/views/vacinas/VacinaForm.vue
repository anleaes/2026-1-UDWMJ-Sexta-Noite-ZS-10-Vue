<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { mostrarErroApi } from '@/services/erros'
import BaseLayout from '@/components/BaseLayout.vue'
import BaseButton from '@/components/BaseButton.vue'
import CampoTexto from '@/components/CampoTexto.vue'

const route = useRoute()
const router = useRouter()
const editandoId = route.params.id || null

const form = reactive({
  nome: '',
  fabricante: '',
  doenca_prevenida: '',
  quantidade_doses: '',
  intervalo_dias: '',
  ativa: true,
})
const erros = ref({})

onMounted(async () => {
  if (!editandoId) return
  try {
    const { data } = await api.get(`/vacinas/${editandoId}/`)
    Object.assign(form, {
      nome: data.nome,
      fabricante: data.fabricante,
      doenca_prevenida: data.doenca_prevenida,
      quantidade_doses: data.quantidade_doses,
      intervalo_dias: data.intervalo_dias,
      ativa: data.ativa,
    })
  } catch {
    alert('Não foi possível carregar o registro.')
    router.push({ name: 'vacinas' })
  }
})

function validar() {
  const e = {}
  if (!form.nome.trim()) e.nome = 'Informe o nome.'
  if (!form.fabricante.trim()) e.fabricante = 'Informe o fabricante.'
  if (!form.doenca_prevenida.trim()) e.doenca_prevenida = 'Informe a doença prevenida.'
  if (!form.quantidade_doses) e.quantidade_doses = 'Informe a quantidade de doses.'
  erros.value = e
  return Object.keys(e).length === 0
}

async function salvar() {
  if (!validar()) return
  const dados = { ...form }
  try {
    if (editandoId) {
      await api.put(`/vacinas/${editandoId}/`, dados)
    } else {
      await api.post('/vacinas/', dados)
    }
    router.push({ name: 'vacinas' })
  } catch (err) {
    mostrarErroApi(err)
  }
}
</script>

<template>
  <BaseLayout :titulo="editandoId ? 'Editar Vacina' : 'Cadastro de Vacina'" voltar-para="vacinas">
    <form class="form" @submit.prevent="salvar">
      <CampoTexto v-model="form.nome" label="Nome *" :erro="erros.nome" />
      <CampoTexto v-model="form.fabricante" label="Fabricante *" :erro="erros.fabricante" />
      <CampoTexto v-model="form.doenca_prevenida" label="Doença Prevenida *" :erro="erros.doenca_prevenida" />
      <CampoTexto v-model="form.quantidade_doses" label="Quantidade de Doses *" type="number" :erro="erros.quantidade_doses" />
      <CampoTexto v-model="form.intervalo_dias" label="Intervalo entre Doses (dias)" type="number" />
      <label class="check">
        <input type="checkbox" v-model="form.ativa" /> Ativa
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