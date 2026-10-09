import { type RefObject, useEffect, useLayoutEffect } from 'react'
import { conectarAoLenis } from './useSmoothScroll'

/**
 * Roda uma animação GSAP com a biblioteca carregada sob demanda.
 *
 * O GSAP (~45 kB comprimidos) serve a duas coisas desta página: o manifesto
 * que acende palavra a palavra e o "Como funciona" pinado com rolagem
 * horizontal. Nenhuma das duas está na primeira dobra, então o import é
 * dinâmico: o chunk chega depois de a página estar interativa, e nunca chega
 * para quem pediu movimento reduzido (`ativo` falso).
 *
 * Padrão da Silverado: o `gsap.context` nasce depois de um `await`, então a
 * desmontagem no meio do caminho é tratada pela bandeira `cancelado`.
 */
type GsapModule = typeof import('gsap')['default']
type ScrollTriggerModule = typeof import('gsap/ScrollTrigger')['ScrollTrigger']

/**
 * A limpeza PRECISA rodar antes de o React remover o DOM. O `pin` do
 * ScrollTrigger embrulha o elemento num `pin-spacer`; se o React desmontar a
 * página antes de o GSAP desfazer isso, ele tenta remover o nó do pai antigo
 * e quebra ("removeChild: not a child of this node") — foi o travamento ao
 * sair da home para uma página de curso. A limpeza de `useLayoutEffect` roda
 * antes da remoção dos nós; a de `useEffect`, depois. No servidor (pré-render)
 * não há efeito nenhum, e `useEffect` evita o aviso.
 */
const useEfeitoSincrono = typeof window === 'undefined' ? useEffect : useLayoutEffect

export function useGsap(
  criar: (gsap: GsapModule, st: ScrollTriggerModule) => void,
  escopo: RefObject<HTMLElement | null>,
  ativo = true,
) {
  useEfeitoSincrono(() => {
    if (!ativo) return
    let cancelado = false
    let ctx: { revert: () => void } | undefined
    let desconectar: (() => void) | undefined

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ default: gsap }, { ScrollTrigger }]) => {
        if (cancelado) return
        gsap.registerPlugin(ScrollTrigger)
        desconectar = conectarAoLenis(ScrollTrigger.update)
        gsap.ticker.lagSmoothing(0)
        // A fonte troca depois do primeiro paint e muda a altura dos títulos;
        // sem reancorar, os gatilhos disparam no lugar errado.
        document.fonts?.ready.then(() => ScrollTrigger.refresh())
        ctx = gsap.context(() => criar(gsap, ScrollTrigger), escopo)
      })
      .catch(() => {
        /* chunk bloqueado: o conteúdo já está visível, só não anima */
      })

    return () => {
      cancelado = true
      desconectar?.()
      ctx?.revert()
    }
  }, [ativo])
}
