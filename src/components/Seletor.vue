<script setup>
// Select genérico. As opções seguem o formato { valor, rotulo }.
// Use multiplo=true para campos ManyToMany: o campo vira uma lista de
// checkboxes e o modelValue passa a ser um array de ids.
const props = defineProps({
  label: { type: String, default: '' },
  modelValue: { type: [String, Number, Array, null], default: '' },
  opcoes: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Selecione...' },
  multiplo: { type: Boolean, default: false },
  erro: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

// Seleção única (select nativo).
function aoMudar(evento) {
  emit('update:modelValue', evento.target.value)
}

// Seleção múltipla (checkboxes). Comparamos como string para tolerar
// ids que venham como número ou texto.
function estaSelecionado(valor) {
  const atual = Array.isArray(props.modelValue) ? props.modelValue : []
  return atual.some((v) => String(v) === String(valor))
}

function alternar(valor) {
  const atual = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const i = atual.findIndex((v) => String(v) === String(valor))
  if (i >= 0) {
    atual.splice(i, 1)
  } else {
    atual.push(valor)
  }
  emit('update:modelValue', atual)
}
</script>

<template>
  <div class="campo">
    <span v-if="label">{{ label }}</span>

    <!-- Múltiplo: lista de checkboxes -->
    <div v-if="multiplo" class="checkboxes" :class="{ 'tem-erro': erro }">
      <label v-for="opcao in opcoes" :key="opcao.valor" class="item">
        <input
          type="checkbox"
          :value="opcao.valor"
          :checked="estaSelecionado(opcao.valor)"
          @change="alternar(opcao.valor)"
        />
        <span>{{ opcao.rotulo }}</span>
      </label>
      <p v-if="opcoes.length === 0" class="vazio">Nenhuma opção disponível.</p>
    </div>

    <!-- Único: select nativo -->
    <select
      v-else
      :value="modelValue"
      :class="{ 'tem-erro': erro }"
      @change="aoMudar"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="opcao in opcoes" :key="opcao.valor" :value="opcao.valor">
        {{ opcao.rotulo }}
      </option>
    </select>

    <small v-if="erro" class="msg-erro">{{ erro }}</small>
  </div>
</template>

<style scoped>
.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
  font-size: 14px;
}

select {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  background: #fff;
}

select:focus {
  border-color: #2e75b6;
}

.checkboxes {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 180px;
  overflow-y: auto;
  background: #fff;
}

.item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.item input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.vazio {
  color: #6b7280;
}

select.tem-erro,
.checkboxes.tem-erro {
  border-color: #c0392b;
}

.msg-erro {
  color: #c0392b;
}
</style>
