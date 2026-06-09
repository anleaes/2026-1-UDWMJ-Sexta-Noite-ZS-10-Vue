import { ref, onMounted } from 'vue'
import api from '@/services/api'

// Busca uma coleção e mapeia cada registro em { valor, rotulo } para usar no Seletor.
export default function useColecao(endpoint, paraOpcao) {
  const itens = ref([])
  const carregando = ref(false)

  async function carregar() {
    carregando.value = true
    try {
      const { data } = await api.get(endpoint)
      const lista = Array.isArray(data) ? data : data?.results || []
      itens.value = lista.map(paraOpcao)
    } catch {
      itens.value = []
    } finally {
      carregando.value = false
    }
  }

  onMounted(carregar)

  return { itens, carregando, carregar }
}
