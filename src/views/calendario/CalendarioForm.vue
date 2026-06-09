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

const { itens: vacinas } = useColecao('/vacinas/', (v) => ({ valor: v.id, rotulo: v.nome }))

const form = reactive({
  vacina: '',
  idade_minima_meses: '',
  idade_maxima_meses: '',
  publico_alvo: '',
  dose_recomendada: '',
  obrigatoria: false,
})
const erros = ref({})

onMounted(async () => {
  if (!editandoId) return
  try {
    const { data } = await api.get(`/calendario/${editandoId}/`)
    Object.assign(form, {
      vacina: data.vacina ?? '',
      idade_minima_meses: data.idade_minima_meses,
      idade_maxima_meses: data.idade_maxima_meses ?? '',
      publico_alvo: data.publico_alvo,
      dose_recomendada: data.dose_recomendada,
      obrigatoria: data.obrigatoria,
    })
  } catch {
    alert('Não foi possível carregar o registro.')
    router.push({ name: 'calendario' })
  }
})

function validar() {
  const e = {}
  if (!form.vacina) e.vacina = 'Selecione a vacina.'
  if (!form.idade_minima_meses) e.idade_minima_meses = 'Informe a idade mínima.'
  if (!form.publico_alvo.trim()) e.publico_alvo = 'Informe o público-alvo.'
  if (!form.dose_recomendada.trim()) e.dose_recomendada = 'Informe a dose recomendada.'
  erros.value = e
  return Object.keys(e).length === 0
}

async function salvar() {
  if (!validar()) return
  const dados = {
    ...form,
    idade_maxima_meses: form.idade_maxima_meses || null,
  }
  try {
    if (editandoId) {
      await api.put(`/calendario/${editandoId}/`, dados)
    } else {
      await api.post('/calendario/', dados)
    }
    router.push({ name: 'calendario' })
  } catch (err) {
    mostrarErroApi(err)
  }
}
</script>

<template>
  <BaseLayout :titulo="editandoId ? 'Editar Calendário' : 'Cadastro de Calendário Vacinal'" voltar-para="calendario">
    <form class="form" @submit.prevent="salvar">
      <Seletor v-model="form.vacina" label="Vacina *" :opcoes="vacinas" :erro="erros.vacina" />
      <CampoTexto v-model="form.idade_minima_meses" label="Idade Mínima (meses) *" type="number" :erro="erros.idade_minima_meses" />
      <CampoTexto v-model="form.idade_maxima_meses" label="Idade Máxima (meses)" type="number" />
      <CampoTexto v-model="form.publico_alvo" label="Público-alvo *" :erro="erros.publico_alvo" />
      <CampoTexto v-model="form.dose_recomendada" label="Dose Recomendada *" :erro="erros.dose_recomendada" />
      <label class="check">
        <input type="checkbox" v-model="form.obrigatoria" /> Obrigatória
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