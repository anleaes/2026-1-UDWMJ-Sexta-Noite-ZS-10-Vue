import { ref, onMounted } from 'vue'
import api from '@/services/api'

// Carrega uma lista de um endpoint (tratando paginação do DRF) ao montar o componente.
// Expõe `carregar` para recarregar manualmente (ex.: após excluir um item).
export default function useLista(endpoint, msgErro = 'Não foi possível carregar os dados.') {
  const itens = ref([])
  const carregando = ref(false)

  async function carregar() {
    carregando.value = true
    try {
      const { data } = await api.get(endpoint)
      itens.value = Array.isArray(data) ? data : data?.results || []
    } catch {
      itens.value = []
      alert(msgErro)
    } finally {
      carregando.value = false
    }
  }

  onMounted(carregar)

  return { itens, carregando, carregar }
}
