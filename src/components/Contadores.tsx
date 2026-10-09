import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '@/lib/utils'

/**
 * A faixa de prova imediata (item 4 do 2º documento), com os números que
 * TÊM fonte. O HTML pré-renderizado já traz o número final — o contador só
 * "sobe" a partir do zero no navegador, quando a faixa entra na tela, e nunca
 * para quem pediu movimento reduzido.
 */
export type Contador = { valor: number; prefixo?: string; sufixo?: string; rotulo: string }

function Numero({ c }: { c: Contador }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [mostrado, setMostrado] = useState(c.valor)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) return
    if (el.getBoundingClientRect().top < window.innerHeight) return
    // Anos (2017) não contam do zero: contam a partir de 20 anos antes.
    const inicio = c.valor > 1900 && c.valor < 2100 ? c.valor - 20 : 0
    setMostrado(inicio)
    let frame = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const passo = (agora: number) => {
        const p = Math.min(1, (agora - t0) / 1400)
        const suave = 1 - (1 - p) ** 3
        setMostrado(Math.round(inicio + (c.valor - inicio) * suave))
        if (p < 1) frame = requestAnimationFrame(passo)
      }
      frame = requestAnimationFrame(passo)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [c.valor])

  return (
    <span ref={ref} className="tabular-nums">
      {c.prefixo}
      {/* Anos (2017) sem separador; o resto no formato brasileiro: 10.000. */}
      {c.valor > 1900 && c.valor < 2100 ? mostrado : mostrado.toLocaleString('pt-BR')}
      {c.sufixo}
    </span>
  )
}

export function Contadores({ itens }: { itens: readonly Contador[] }) {
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] bg-white/10 lg:grid-cols-4">
      {itens.map((c) => (
        <li key={c.rotulo} className="bg-marinho px-6 py-8 sm:px-8">
          <p className="titulo-largo text-[2.6rem] text-marca sm:text-[3.4rem]">
            <Numero c={c} />
          </p>
          <p className="mt-2 text-sm text-nevoa sm:text-base">{c.rotulo}</p>
        </li>
      ))}
    </ul>
  )
}
