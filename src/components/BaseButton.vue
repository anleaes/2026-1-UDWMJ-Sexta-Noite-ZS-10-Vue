<script setup>
defineProps({
  type: { type: String, default: 'button' },
  variante: { type: String, default: 'primaria' }, // primaria | secundaria | perigo
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <button class="botao" :class="variante" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>

<style scoped>
.botao {
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}

.botao:hover {
  opacity: 0.88;
}

.botao:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primaria {
  background: #2e75b6;
}

.secundaria {
  background: #6b7280;
}

.perigo {
  background: #c0392b;
}
</style>
