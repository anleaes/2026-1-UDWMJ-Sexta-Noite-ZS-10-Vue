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

const { itens: pacientes } = useColecao('/pessoas/pacientes/', (p) => ({ valor: p.id, rotulo: p.nome }))

const opcoesTipo = [
  { valor: 'lembrete', rotulo: 'Lembrete' },
  { valor: 'alerta', rotulo: 'Alerta' },
  { valor: 'informativo', rotulo: 'Informativo' },
]

const form = reactive({
  paciente: '',
  titulo: '',
  mensagem: '',
  tipo: '',
  lida: false,
})
const erros = ref({})

onMounted(async () => {
  if (!editandoId) return
  try {
    const { data } = await api.get(`/notificacoes/${editandoId}/`)
    Object.assign(form, {
      paciente: data.paciente ?? '',
      titulo: data.titulo,
      mensagem: data.mensagem,
      tipo: data.tipo,
      lida: data.lida,
    })
  } catch {
    alert('Não foi possível carregar o registro.')
    router.push({ name: 'notificacoes' })
  }
})

function validar() {
  const e = {}
  if (!form.paciente) e.paciente = 'Selecione o paciente.'
  if (!form.titulo.trim()) e.titulo = 'Informe o título.'
  if (!form.mensagem.trim()) e.mensagem = 'Informe a mensagem.'
  if (!form.tipo) e.tipo = 'Selecione o tipo.'
  erros.value = e
  return Object.keys(e).length === 0
}

async function salvar() {
  if (!validar()) return
  const dados = { ...form }
  try {
    if (editandoId) {
      await api.put(`/notificacoes/${editandoId}/`, dados)
    } else {
      await api.post('/notificacoes/', dados)
    }
    router.push({ name: 'notificacoes' })
  } catch (err) {
    mostrarErroApi(err)
  }
}
</script>

<template>
  <BaseLayout :titulo="editandoId ? 'Editar Notificação' : 'Cadastro de Notificação'" voltar-para="notificacoes">
    <form class="form" @submit.prevent="salvar">
      <Seletor v-model="form.paciente" label="Paciente *" :opcoes="pacientes" :erro="erros.paciente" />
      <CampoTexto v-model="form.titulo" label="Título *" :erro="erros.titulo" />
      <CampoTexto v-model="form.mensagem" label="Mensagem *" :erro="erros.mensagem" />
      <Seletor v-model="form.tipo" label="Tipo *" :opcoes="opcoesTipo" :erro="erros.tipo" />
      <label class="check">
        <input type="checkbox" v-model="form.lida" /> Lida
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