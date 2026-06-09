<script setup>
defineProps({
  label: { type: String, default: '' },
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  erro: { type: String, default: '' },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label class="campo">
    <span v-if="label">{{ label }}</span>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :class="{ 'tem-erro': erro }"
      @input="$emit('update:modelValue', $event.target.value)"
    />
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

input {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
}

input:focus {
  border-color: #2e75b6;
}

input.tem-erro {
  border-color: #c0392b;
}

.msg-erro {
  color: #c0392b;
}
</style>
