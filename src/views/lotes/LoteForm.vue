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

const { itens: vacinas } = useColecao('/vacinas/', (v) => ({ valor: v.id, rotulo: v.nome }))
const { itens: unidades } = useColecao('/unidades/', (u) => ({ valor: u.id, rotulo: u.nome }))

const form = reactive({
  vacina: '',
  unidade_saude: '',
  numero_lote: '',
  data_validade: '',
  quantidade_disponivel: '',
})
const erros = ref({})

onMounted(async () => {
  if (!editandoId) return
  try {
    const { data } = await api.get(`/vacinas/lotes/${editandoId}/`)
    Object.assign(form, {
      vacina: data.vacina ?? '',
      unidade_saude: data.unidade_saude ?? '',
      numero_lote: data.numero_lote,
      data_validade: data.data_validade,
      quantidade_disponivel: data.quantidade_disponivel,
    })
  } catch {
    alert('Não foi possível carregar o registro.')
    router.push({ name: 'lotes' })
  }
})

function validar() {
  const e = {}
  if (!form.vacina) e.vacina = 'Selecione a vacina.'
  if (!form.unidade_saude) e.unidade_saude = 'Selecione a unidade.'
  if (!form.numero_lote.trim()) e.numero_lote = 'Informe o número do lote.'
  if (!form.data_validade) e.data_validade = 'Informe a validade.'
  erros.value = e
  return Object.keys(e).length === 0
}

async function salvar() {
  if (!validar()) return
  const dados = { ...form }
  try {
    if (editandoId) {
      await api.put(`/vacinas/lotes/${editandoId}/`, dados)
    } else {
      await api.post('/vacinas/lotes/', dados)
    }
    router.push({ name: 'lotes' })
  } catch (err) {
    mostrarErroApi(err)
  }
}
</script>

<template>
  <BaseLayout :titulo="editandoId ? 'Editar Lote' : 'Cadastro de Lote'" voltar-para="lotes">
    <form class="form" @submit.prevent="salvar">
      <Seletor v-model="form.vacina" label="Vacina *" :opcoes="vacinas" :erro="erros.vacina" />
      <Seletor v-model="form.unidade_saude" label="Unidade *" :opcoes="unidades" :erro="erros.unidade_saude" />
      <CampoTexto v-model="form.numero_lote" label="Número do Lote *" :erro="erros.numero_lote" />
      <CampoData v-model="form.data_validade" label="Validade *" :erro="erros.data_validade" />
      <CampoTexto v-model="form.quantidade_disponivel" label="Quantidade Disponível" type="number" />
      <BaseButton type="submit">{{ editandoId ? 'Atualizar' : 'Cadastrar' }}</BaseButton>
    </form>
  </BaseLayout>
</template>

<style scoped>
.form {
  background: #fff; border-radius: 10px; padding: 20px; max-width: 520px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
</style>