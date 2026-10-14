import { useEffect, useRef } from 'react'
import { INDEXAVEL } from '@/lib/business'
import { canonicalDe, type Rota } from '@/lib/routes'

/**
 * Mantém o `<head>` coerente na navegação pelo cliente.
 *
 * O HTML de cada rota já chega certo do build (ver vite.config.ts). Isto
 * cobre o outro caso: quem vai do formulário para /obrigado sem recarregar.
 * Sem isto, a aba e o histórico ficariam com o título da página anterior —
 * e a tag de conversão que olha o título leria o errado.
 */
export function useRouteMeta(rota: Rota) {
  const primeira = useRef(true)

  useEffect(() => {
    document.title = rota.titulo
    const set = (seletor: string, atributo: string, valor: string) =>
      document.head.querySelector(seletor)?.setAttribute(atributo, valor)

    set('meta[name="description"]', 'content', rota.descricao)
    set('link[rel="canonical"]', 'href', canonicalDe(rota))
    set('meta[property="og:title"]', 'content', rota.titulo)
    set('meta[property="og:description"]', 'content', rota.descricao)
    set('meta[property="og:url"]', 'content', canonicalDe(rota))
    set(
      'meta[name="robots"]',
      'content',
      !INDEXAVEL || rota.noindex
        ? 'noindex, follow'
        : 'index, follow, max-snippet:-1, max-image-preview:large',
    )
    // Visualização de página virtual para o GTM/GA4: a troca de rota não
    // recarrega, e sem este evento a visita a /obrigado não existiria. A
    // primeira rota fica de fora: essa o próprio carregamento da tag já conta.
    if (primeira.current) {
      primeira.current = false
      return
    }
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'page_view_virtual',
      page_path: rota.path,
      page_title: rota.titulo,
    })
  }, [rota])
}
