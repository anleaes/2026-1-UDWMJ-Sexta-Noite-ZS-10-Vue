import { computed } from 'vue'
import useColecao from './useColecao'

// Resolve o id de um relacionamento para um nome legível (fallback "#id").
// Retorna uma função reativa: resolver(id) -> rótulo.
export default function useMapaNomes(endpoint, paraRotulo) {
  const { itens } = useColecao(endpoint, (registro) => ({
    valor: registro.id,
    rotulo: paraRotulo(registro),
  }))

  const mapa = computed(() => {
    const m = {}
    itens.value.forEach((i) => {
      m[String(i.valor)] = i.rotulo
    })
    return m
  })

  return (id) => {
    if (id == null) return '—'
    return mapa.value[String(id)] ?? `#${id}`
  }
}
