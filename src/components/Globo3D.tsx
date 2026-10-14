import { useEffect, useRef, useState } from 'react'
import { cn, prefersReducedMotion } from '@/lib/utils'
import type { CenaGlobo, Destino } from '@/scene/globo'

/**
 * O globo 3D da marca — carregado sob demanda, pausado fora da tela, e que
 * gira quando arrastado (mouse ou dedo), com inércia.
 *
 * · **A decisão de montar vem ANTES do import.** Sem WebGL, o
 *   `import('@/scene/globo')` nunca é disparado: o three.js (~138 kB
 *   comprimidos) não é baixado por quem não vai vê-lo.
 * · **"Reduzir movimento" não esconde o globo** — o Windows liga a
 *   preferência sem a pessoa saber (Efeitos de animação desligado), e metade
 *   da seção ficava vazia. A cena roda em modo calmo.
 * · **No celular, depois de a página estar pronta.** O import espera o
 *   primeiro momento ocioso do navegador (o LCP é o título, e numa página de
 *   anúncio ele não pode esperar o 3D), e a cena roda em modo compacto:
 *   resolução 1×, sem antisserrilhado, metade dos segmentos.
 * · **Um laço de render só enquanto visível.** Fora da tela, parado.
 * · **Arrastar não sequestra a rolagem:** `touch-action: pan-y` — o gesto
 *   vertical continua rolando a página; só o horizontal gira o globo.
 */
let suporte: boolean | null = null
function suportaWebGL(): boolean {
  if (suporte !== null) return suporte
  try {
    const c = document.createElement('canvas')
    suporte = Boolean(c.getContext('webgl2') ?? c.getContext('webgl'))
  } catch {
    suporte = false
  }
  return suporte
}

function deveMontar3D(): boolean {
  return typeof window !== 'undefined' && suportaWebGL()
}

const ehCompacto = () => !window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches

/** No celular, o import espera o navegador ficar ocioso. */
const quandoOcioso = (fn: () => void) => {
  if (!ehCompacto()) return fn()
  if (typeof window.requestIdleCallback === 'function')
    window.requestIdleCallback(fn, { timeout: 2500 })
  else window.setTimeout(fn, 1500)
}

type Props = {
  destinos: readonly Destino[]
  origem: { lat: number; lon: number }
  /** Destino fixado por fora (hover/rolagem). `null` = ciclo automático. */
  escolhido?: number | null
  ciclo?: number
  className?: string
  /** Chamado quando a rota visível muda — para a legenda em HTML. */
  aoTrocar?: (i: number) => void
  /** Pode ser girado com o mouse/dedo. */
  arrastavel?: boolean
}

export function Globo3D({
  destinos,
  origem,
  escolhido = null,
  ciclo,
  className,
  aoTrocar,
  arrastavel = true,
}: Props) {
  const caixaRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cenaRef = useRef<CenaGlobo | null>(null)
  const aoTrocarRef = useRef(aoTrocar)
  aoTrocarRef.current = aoTrocar
  const [pintou, setPintou] = useState(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: monta uma vez; destinos e origem são constantes de business.ts
  useEffect(() => {
    const caixa = caixaRef.current
    const canvas = canvasRef.current
    if (!caixa || !canvas || !deveMontar3D()) return

    let cancelado = false
    let limpar: (() => void) | undefined

    const carregar = () =>
      import('@/scene/globo')
        .then(({ CenaGlobo }) => {
          if (cancelado) return
          const cena = new CenaGlobo(canvas, {
            destinos,
            origem,
            ciclo,
            compacto: ehCompacto(),
            calmo: prefersReducedMotion(),
          })
          cenaRef.current = cena
          cena.aoTrocar = (i) => aoTrocarRef.current?.(i)

          const medir = () => {
            const { width, height } = caixa.getBoundingClientRect()
            cena.redimensionar(Math.max(1, width), Math.max(1, height))
          }
          medir()
          const ro = new ResizeObserver(medir)
          ro.observe(caixa)

          const aoMover = (e: PointerEvent) => {
            cena.apontar(
              (e.clientX / window.innerWidth) * 2 - 1,
              (e.clientY / window.innerHeight) * 2 - 1,
            )
          }
          window.addEventListener('pointermove', aoMover, { passive: true })

          // Arrasto: só com o botão/dedo pressionado sobre o globo.
          let ultimo: { x: number; y: number } | null = null
          const aoApertar = (e: PointerEvent) => {
            ultimo = { x: e.clientX, y: e.clientY }
            caixa.setPointerCapture(e.pointerId)
            caixa.dataset.arrastando = ''
          }
          const aoArrastar = (e: PointerEvent) => {
            if (!ultimo) return
            cena.arrastar(e.clientX - ultimo.x, e.clientY - ultimo.y)
            ultimo = { x: e.clientX, y: e.clientY }
          }
          const aoSoltar = () => {
            ultimo = null
            delete caixa.dataset.arrastando
          }
          if (arrastavel) {
            caixa.addEventListener('pointerdown', aoApertar)
            caixa.addEventListener('pointermove', aoArrastar)
            caixa.addEventListener('pointerup', aoSoltar)
            caixa.addEventListener('pointercancel', aoSoltar)
          }

          const io = new IntersectionObserver(
            ([e]) => (e.isIntersecting ? cena.iniciar() : cena.parar()),
            {
              rootMargin: '100px',
            },
          )
          io.observe(caixa)

          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              if (!cancelado) setPintou(true)
            }),
          )

          limpar = () => {
            io.disconnect()
            ro.disconnect()
            window.removeEventListener('pointermove', aoMover)
            caixa.removeEventListener('pointerdown', aoApertar)
            caixa.removeEventListener('pointermove', aoArrastar)
            caixa.removeEventListener('pointerup', aoSoltar)
            caixa.removeEventListener('pointercancel', aoSoltar)
            cena.destruir()
            cenaRef.current = null
          }
        })
        .catch(() => {
          /* chunk bloqueado: fica a reserva 2D, que já está na tela */
        })
    quandoOcioso(carregar)

    return () => {
      cancelado = true
      limpar?.()
    }
  }, [])

  useEffect(() => {
    cenaRef.current?.escolher(escolhido)
  }, [escolhido])

  return (
    <div
      ref={caixaRef}
      className={cn(
        arrastavel
          ? 'cursor-grab touch-pan-y select-none data-[arrastando]:cursor-grabbing'
          : 'pointer-events-none',
        className,
      )}
      data-cursor={arrastavel ? 'Girar' : undefined}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className={cn(
          'h-full w-full transition-opacity duration-[1400ms] ease-[var(--ease-inter)]',
          pintou ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  )
}

/** O mesmo teste, como hook: o componente que tem reserva 2D decide o que mostrar. */
export function useTem3D(): boolean {
  const [tem, setTem] = useState(false)
  useEffect(() => setTem(deveMontar3D()), [])
  return tem
}
