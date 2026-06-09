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

const { itens: pacientes } = useColecao('/pacientes/', (p) => ({ valor: p.id, rotulo: p.nome }))

const form = reactive({
  paciente: '',
  grupo_risco: false,
  gestante: false,
  alergias: '',
  observacoes: '',
})
const erros = ref({})

onMounted(async () => {
  if (!editandoId) return
  try {
    const { data } = await api.get(`/perfis/${editandoId}/`)
    Object.assign(form, {
      paciente: data.paciente ?? '',
      grupo_risco: data.grupo_risco,
      gestante: data.gestante,
      alergias: data.alergias ?? '',
      observacoes: data.observacoes ?? '',
    })
  } catch {
    alert('Não foi possível carregar o registro.')
    router.push({ name: 'perfis' })
  }
})

function validar() {
  const e = {}
  if (!form.paciente) e.paciente = 'Selecione o paciente.'
  erros.value = e
  return Object.keys(e).length === 0
}

async function salvar() {
  if (!validar()) return
  const dados = { ...form }
  try {
    if (editandoId) {
      await api.put(`/perfis/${editandoId}/`, dados)
    } else {
      await api.post('/perfis/', dados)
    }
    router.push({ name: 'perfis' })
  } catch (err) {
    mostrarErroApi(err)
  }
}
</script>

<template>
  <BaseLayout :titulo="editandoId ? 'Editar Perfil' : 'Cadastro de Perfil de Saúde'" voltar-para="perfis">
    <form class="form" @submit.prevent="salvar">
      <Seletor v-model="form.paciente" label="Paciente *" :opcoes="pacientes" :erro="erros.paciente" />
      <label class="check">
        <input type="checkbox" v-model="form.grupo_risco" /> Grupo de Risco
      </label>
      <label class="check">
        <input type="checkbox" v-model="form.gestante" /> Gestante
      </label>
      <CampoTexto v-model="form.alergias" label="Alergias" />
      <CampoTexto v-model="form.observacoes" label="Observações" />
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