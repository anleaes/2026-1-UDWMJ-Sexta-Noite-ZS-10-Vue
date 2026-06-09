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
  endereco: '',
  bairro: '',
  telefone: '',
  horario_funcionamento: '',
  ativa: true,
})
const erros = ref({})

onMounted(async () => {
  if (!editandoId) return
  try {
    const { data } = await api.get(`/unidades/${editandoId}/`)
    Object.assign(form, {
      nome: data.nome,
      endereco: data.endereco,
      bairro: data.bairro,
      telefone: data.telefone,
      horario_funcionamento: data.horario_funcionamento,
      ativa: data.ativa,
    })
  } catch {
    alert('Não foi possível carregar o registro.')
    router.push({ name: 'unidades' })
  }
})

function validar() {
  const e = {}
  if (!form.nome.trim()) e.nome = 'Informe o nome.'
  if (!form.endereco.trim()) e.endereco = 'Informe o endereço.'
  if (!form.bairro.trim()) e.bairro = 'Informe o bairro.'
  erros.value = e
  return Object.keys(e).length === 0
}

async function salvar() {
  if (!validar()) return
  const dados = { ...form }
  try {
    if (editandoId) {
      await api.put(`/unidades/${editandoId}/`, dados)
    } else {
      await api.post('/unidades/', dados)
    }
    router.push({ name: 'unidades' })
  } catch (err) {
    mostrarErroApi(err)
  }
}
</script>

<template>
  <BaseLayout :titulo="editandoId ? 'Editar Unidade' : 'Cadastro de Unidade'" voltar-para="unidades">
    <form class="form" @submit.prevent="salvar">
      <CampoTexto v-model="form.nome" label="Nome *" :erro="erros.nome" />
      <CampoTexto v-model="form.endereco" label="Endereço *" :erro="erros.endereco" />
      <CampoTexto v-model="form.bairro" label="Bairro *" :erro="erros.bairro" />
      <CampoTexto v-model="form.telefone" label="Telefone" />
      <CampoTexto v-model="form.horario_funcionamento" label="Horário de Funcionamento" />
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