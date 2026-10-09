import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'
import { iniciarAnalytics } from './lib/analytics'
import { iniciarObservabilidade, medirWebVitals } from './lib/observability'
import { origemDaVisita } from './lib/origem'

/*
 * O HTML de cada rota chega PRÉ-RENDERIZADO (scripts/prerender.mjs): o texto
 * da página está no documento antes de qualquer JavaScript, e o <h1> pinta no
 * primeiro quadro. Aqui o React só "hidrata" — liga os eventos ao DOM que já
 * existe. Sem HTML pré-renderizado (no `npm run dev`), renderiza do zero.
 */
const raiz = document.getElementById('root')!
const arvore = (
  <StrictMode>
    <ErrorBoundary>
      <App caminhoInicial={window.location.pathname} />
    </ErrorBoundary>
  </StrictMode>
)

if (raiz.hasChildNodes()) hydrateRoot(raiz, arvore)
else createRoot(raiz).render(arvore)

// A origem da campanha é lida já na chegada: se a pessoa navegar para
// /obrigado, a URL do anúncio (com o gclid) já não estará na barra.
origemDaVisita()

/**
 * Telemetria depois do primeiro render, e nunca antes: `requestIdleCallback`
 * empurra para o primeiro momento ocioso. Sem as variáveis de ambiente, nada
 * de terceiro é baixado (ver lib/analytics e lib/observability).
 */
const ociosa = (fn: () => void) => {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(fn, { timeout: 3000 })
  } else {
    window.setTimeout(fn, 1800)
  }
}

ociosa(() => {
  iniciarAnalytics()
  iniciarObservabilidade()
  medirWebVitals()
})
