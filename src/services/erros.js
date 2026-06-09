// Converte um erro de resposta da API (formato DRF { campo: ["msg"] }) em texto legível.
export function formatarErroApi(
  err,
  mensagemPadrao = 'Não foi possível salvar. Verifique os dados informados.',
) {
  const dados = err?.response?.data

  if (dados && typeof dados === 'object') {
    const mensagens = Object.entries(dados)
      .map(([campo, msgs]) => `${campo}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
      .join('\n')
    return mensagens || mensagemPadrao
  }

  return mensagemPadrao
}

// Atalho para exibir o erro da API em um alerta do navegador.
export function mostrarErroApi(err, mensagemPadrao) {
  alert(formatarErroApi(err, mensagemPadrao))
}
