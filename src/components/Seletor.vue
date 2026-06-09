<script setup>
// Select genérico. As opções seguem o formato { valor, rotulo }.
// Use multiplo=true para campos ManyToMany (modelValue vira um array de ids).
defineProps({
  label: { type: String, default: '' },
  modelValue: { type: [String, Number, Array, null], default: '' },
  opcoes: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Selecione...' },
  multiplo: { type: Boolean, default: false },
  erro: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

function aoMudar(evento) {
  if (evento.target.multiple) {
    const selecionados = Array.from(evento.target.selectedOptions).map((o) => o.value)
    emit('update:modelValue', selecionados)
  } else {
    emit('update:modelValue', evento.target.value)
  }
}
</script>

<template>
  <label class="campo">
    <span v-if="label">{{ label }}</span>
    <select
      :value="modelValue"
      :multiple="multiplo"
      :class="{ 'tem-erro': erro, multiplo }"
      @change="aoMudar"
    >
      <option v-if="!multiplo" value="" disabled>{{ placeholder }}</option>
      <option v-for="opcao in opcoes" :key="opcao.valor" :value="opcao.valor">
        {{ opcao.rotulo }}
      </option>
    </select>
    <small v-if="erro" class="msg-erro">{{ erro }}</small>
  </label>
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

select.multiplo {
  min-height: 120px;
}

select:focus {
  border-color: #2e75b6;
}

select.tem-erro {
  border-color: #c0392b;
}

.msg-erro {
  color: #c0392b;
}
</style>
