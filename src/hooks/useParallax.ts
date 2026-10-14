import { type RefObject, useEffect, useState } from 'react'
import { prefersReducedMotion } from '@/lib/utils'
import { useGsap } from './useGsap'

/**
 * Parallax declarativo (padrão da Lottus): todo elemento com
 * `data-velocidade` dentro do escopo desliza em relação à rolagem. Positivo =
 * mais lento que a página (fica "atrás"); negativo = vem "para a frente".
 *
 * A distância é uma fração da altura da janela, e não do elemento: um título
 * enorme e uma etiqueta pequena com a mesma velocidade parecem estar no mesmo
 * plano de profundidade.
 *
 * Sem o motor (movimento reduzido, chunk bloqueado), nada se move e nada some.
 */
export function useParallax(escopo: RefObject<HTMLElement | null>) {
  const [ativo, setAtivo] = useState(false)
  useEffect(() => setAtivo(!prefersReducedMotion()), [])

  useGsap(
    (gsap) => {
      const raiz = escopo.current
      if (!raiz) return
      for (const el of raiz.querySelectorAll<HTMLElement>('[data-velocidade]')) {
        const v = Number(el.dataset.velocidade)
        if (!v) continue
        gsap.fromTo(
          el,
          { y: () => -v * window.innerHeight * 0.5 },
          {
            y: () => v * window.innerHeight * 0.5,
            ease: 'none',
            scrollTrigger: {
              trigger: raiz,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        )
      }
    },
    escopo,
    ativo,
  )
}
