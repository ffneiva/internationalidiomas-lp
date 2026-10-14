import { Conteudo, EXTRAS, Fixo, TOPO_SOLIDO } from '@produto'
import { useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { Cursor } from '@/components/Cursor'
import { AvisoCookies, Rodape, Topo } from '@/components/Moldura'
import { useRouteAnnounce } from '@/hooks/useRouteAnnounce'
import { useRouteMeta } from '@/hooks/useRouteMeta'
import { scrollToSection, useSmoothScroll } from '@/hooks/useSmoothScroll'
import { ROTAS, rotaDe } from '@/lib/routes'
import { prefersReducedMotion } from '@/lib/utils'
import { NaoEncontrada, Obrigado, Privacidade } from '@/pages/Paginas'

/**
 * Roteador de ~40 linhas sobre a History API.
 *
 * Três telas não justificam o react-router. O caminho inicial vem de fora
 * (`caminhoInicial`): no build, o pré-render passa a rota que está gerando;
 * no navegador, o main.tsx passa `location.pathname`. Assim o App nunca lê
 * `window` durante o render — condição para o HTML pré-renderizado e o
 * primeiro render do navegador serem idênticos.
 */
function useCaminho(inicial: string) {
  const [caminho, setCaminho] = useState(inicial)

  useEffect(() => {
    const aoVoltar = () => setCaminho(window.location.pathname)
    window.addEventListener('popstate', aoVoltar)
    return () => window.removeEventListener('popstate', aoVoltar)
  }, [])

  const navegar = useCallback((destino: string) => {
    const [semAncora, ancora] = destino.split('#')
    const novo = semAncora.split('?')[0] || window.location.pathname
    if (novo === window.location.pathname && ancora) {
      scrollToSection(ancora)
      return
    }
    const trocar = () => {
      window.history.pushState({}, '', destino)
      flushSync(() => setCaminho(novo))
      if (ancora) requestAnimationFrame(() => scrollToSection(ancora))
      else window.scrollTo({ top: 0, behavior: 'instant' })
    }
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
    if (doc.startViewTransition && !prefersReducedMotion()) doc.startViewTransition(trocar)
    else trocar()
  }, [])

  return { caminho, navegar }
}

/**
 * Intercepta cliques em links internos — `<a href="/obrigado">` navega sem
 * recarregar. Âncora da própria página (`#contato`) rola suave. Link externo,
 * `target`, Ctrl/Cmd-clique: o navegador cuida.
 */
function useLinksInternos(navegar: (destino: string) => void) {
  useEffect(() => {
    const aoClicar = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return
      const a = (e.target as Element | null)?.closest('a')
      if (!a || a.target || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      const caminho = url.pathname.replace(/\/+$/, '') || '/'
      if (!ROTAS.some((r) => r.path === caminho)) return
      e.preventDefault()
      navegar(url.pathname + url.search + url.hash)
    }
    document.addEventListener('click', aoClicar)
    return () => document.removeEventListener('click', aoClicar)
  }, [navegar])
}

export default function App({ caminhoInicial }: { caminhoInicial: string }) {
  const { caminho, navegar } = useCaminho(caminhoInicial)
  const rota = rotaDe(caminho)

  useRouteMeta(rota)
  useSmoothScroll()
  useLinksInternos(navegar)
  const { alvoRef, aviso } = useRouteAnnounce(rota)

  // Marca a página como hidratada. Com HTML pré-renderizado, os botões
  // aparecem antes de o React ligar os eventos a eles; os testes (e quem
  // depurar) esperam por este atributo antes de interagir.
  useEffect(() => {
    document.documentElement.dataset.hidratado = ''
  }, [])

  // Âncora na URL de entrada (/#contato vindo de um anúncio de sitelink).
  useEffect(() => {
    const ancora = window.location.hash.slice(1)
    if (ancora) requestAnimationFrame(() => scrollToSection(ancora))
  }, [])

  const aoEnviarLead = useCallback(() => navegar('/obrigado'), [navegar])

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only rounded-full bg-marca px-5 py-2 text-sm font-semibold text-noite focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300]"
      >
        Pular para o conteúdo
      </a>
      <p aria-live="polite" role="status" className="sr-only">
        {aviso}
      </p>

      <Cursor />
      {/* No site, toda página abre num herói escuro (topo transparente por cima);
          a LP abre clara, então o topo dela é sempre sólido. */}
      <Topo
        solido={TOPO_SOLIDO || rota.path === '/politica-de-privacidade'}
        caminho={rota.path}
        menu={EXTRAS?.menu}
      />

      <div ref={alvoRef} tabIndex={-1} className="outline-none">
        <main id="conteudo">
          <Conteudo caminho={rota.path} aoEnviar={aoEnviarLead} />
          {rota.path === '/obrigado' && <Obrigado />}
          {rota.path === '/politica-de-privacidade' && <Privacidade />}
          {rota.path === '/404' && <NaoEncontrada />}
        </main>
      </div>

      <Rodape extras={EXTRAS} caminho={rota.path} />
      {rota.path !== '/obrigado' && <Fixo />}
      <AvisoCookies />
    </>
  )
}
