import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react'
import { cn, prefersReducedMotion } from '@/lib/utils'

/**
 * Entrada por scroll, sem GSAP — um `IntersectionObserver` e uma transição.
 *
 * REGRA QUE NÃO SE QUEBRA: o estado escondido nunca sobrevive a uma falha.
 *
 * Aqui a regra tem um motivo a mais: o HTML chega PRÉ-RENDERIZADO. O servidor
 * (o build) não sabe onde está a dobra, então tudo sai visível — e continua
 * visível no primeiro render do navegador, para a hidratação bater com o
 * HTML. Só depois, num efeito, o componente se "arma": o que está ABAIXO da
 * tela é escondido e aguarda a rolagem; o que já está na tela nunca some.
 * Sem JavaScript, sem IntersectionObserver ou com movimento reduzido, nada é
 * escondido.
 */
const MARGEM = '0px 0px -10% 0px'

type Estado = 'visivel' | 'armado' | 'entrou'

export function useEntrada<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [estado, setEstado] = useState<Estado>('visivel')

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) return
    // Já na tela (ou acima dela): fica como está.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return

    setEstado('armado')
    const io = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setEstado('entrou')
          io.disconnect()
        }
      },
      { rootMargin: MARGEM },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return { ref, armado: estado === 'armado', entrou: estado === 'entrou' }
}

type Props = {
  children: ReactNode
  className?: string
  /** Atraso em segundos — útil para escalonar irmãos. */
  delay?: number
  y?: number
  as?: 'div' | 'li' | 'article' | 'header'
  id?: string
  style?: CSSProperties
}

export function Reveal({ children, className, delay = 0, y = 28, as = 'div', id, style }: Props) {
  const { ref, armado } = useEntrada<HTMLDivElement>()
  const Tag = as as 'div'

  return (
    <Tag
      ref={ref}
      id={id}
      className={cn(className)}
      style={{
        ...style,
        opacity: armado ? 0 : undefined,
        transform: armado ? `translateY(${y}px)` : undefined,
        transitionProperty: 'opacity, transform',
        transitionDuration: '900ms',
        transitionTimingFunction: 'var(--ease-inter)',
        transitionDelay: armado ? '0s' : `${delay}s`,
      }}
    >
      {children}
    </Tag>
  )
}

/**
 * A caneta marca-texto passando sobre a palavra quando ela entra na tela.
 * Mesmo contrato do <Reveal>: nasce marcada, e só se desmarca para animar se
 * estiver abaixo da tela quando o JS chegar.
 */
export function Marca({
  children,
  className,
  delay = 0.25,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const { ref, armado } = useEntrada<HTMLSpanElement>()
  return (
    <span
      ref={ref}
      className={cn('marca-texto', className)}
      style={{
        backgroundSize: armado ? '0% var(--altura-marca, 0.5em)' : undefined,
        transition: 'background-size 900ms cubic-bezier(0.65, 0, 0.35, 1)',
        transitionDelay: armado ? '0s' : `${delay}s`,
      }}
    >
      {children}
    </span>
  )
}
