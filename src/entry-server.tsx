import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { NAO_ENCONTRADA, ROTAS } from './lib/routes'

/**
 * Entrada do pré-render (scripts/prerender.mjs), executada no build, em Node.
 *
 * Devolve o HTML de uma rota — o mesmo App do navegador, com o caminho dado.
 * Nada aqui roda no navegador de quem visita.
 */
export function renderizar(caminho: string): string {
  return renderToString(
    <StrictMode>
      <App caminhoInicial={caminho} />
    </StrictMode>,
  )
}

/** As rotas a pré-renderizar — as mesmas que o plugin de rotas gera. */
export const CAMINHOS = [...ROTAS.map((r) => r.path), NAO_ENCONTRADA.path]
