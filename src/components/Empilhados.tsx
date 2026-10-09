import { type ReactNode, useEffect, useRef, useState } from 'react'
import { useGsap } from '@/hooks/useGsap'
import { cn, prefersReducedMotion } from '@/lib/utils'

/**
 * Cartões que se empilham conforme a rolagem.
 *
 * A base é CSS puro: cada cartão é `sticky` alguns pixels abaixo do anterior,
 * então eles se acumulam no topo da tela como um baralho — funciona sem
 * JavaScript. Com o GSAP (sob demanda), o cartão de baixo recua e escurece
 * enquanto o próximo sobe por cima dele: a profundidade fica legível.
 *
 * Usado nos cursos: "um caminho para cada fase" vira, literalmente, uma pilha
 * de fases.
 */
export type Cartao = {
  chave: string
  conteudo: ReactNode
  /** Classes de cor do cartão (fundo e texto). */
  tema: string
}

export function Empilhados({
  cartoes,
  className,
}: {
  cartoes: readonly Cartao[]
  className?: string
}) {
  const lista = useRef<HTMLOListElement>(null)
  const [ativo, setAtivo] = useState(false)
  useEffect(() => setAtivo(!prefersReducedMotion()), [])

  useGsap(
    (gsap) => {
      const itens = lista.current?.querySelectorAll<HTMLElement>('[data-cartao]')
      if (!itens) return
      itens.forEach((el, i) => {
        const proximo = itens[i + 1]
        if (!proximo) return
        gsap.to(el.firstElementChild, {
          // Só escala e um leve recuo: escurecer com filtro deixava o cartão
          // amarelo da marca cor de oliva.
          scale: 0.9,
          yPercent: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: proximo,
            start: 'top bottom',
            end: 'top 20%',
            scrub: true,
          },
        })
      })
    },
    lista,
    ativo,
  )

  return (
    <ol ref={lista} className={cn('relative grid gap-6', className)}>
      {cartoes.map((c, i) => (
        <li
          key={c.chave}
          data-cartao
          className="sticky"
          style={{ top: `calc(5.5rem + ${i * 1.1}rem)` }}
        >
          <div
            className={cn(
              'origin-top overflow-hidden rounded-[2rem] shadow-[0_-20px_60px_-30px_rgba(3,22,52,0.6)] will-change-transform',
              c.tema,
            )}
          >
            {c.conteudo}
          </div>
        </li>
      ))}
    </ol>
  )
}
