import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { IconeSeta, IconeVoltar } from './Icones'

/**
 * Carrossel de cartões no celular, grade a partir de `sm`.
 *
 * Antes era uma lista com `overflow-x-auto`: no celular, arrastar funcionava,
 * mas no desktop (janela estreita) e no Windows aparecia a barra de rolagem
 * no meio da seção — e com o mouse não havia como avançar. Agora: barra
 * escondida, setas (o mouse avança), pontos de posição, arraste nativo com
 * `scroll-snap`. A partir de `sm`, os cartões viram grade e nada disso existe.
 */
export function Carrossel({
  itens,
  escuro = false,
  colunas = 'sm:grid-cols-3',
  rotulo,
}: {
  itens: { chave: string; conteudo: ReactNode }[]
  escuro?: boolean
  colunas?: string
  rotulo: string
}) {
  const trilho = useRef<HTMLUListElement>(null)
  const [ativo, setAtivo] = useState(0)

  useEffect(() => {
    const el = trilho.current
    if (!el) return
    const aoRolar = () => {
      const cartao = el.firstElementChild as HTMLElement | null
      if (!cartao) return
      setAtivo(Math.round(el.scrollLeft / (cartao.offsetWidth + 16)))
    }
    el.addEventListener('scroll', aoRolar, { passive: true })
    return () => el.removeEventListener('scroll', aoRolar)
  }, [])

  const ir = (i: number) => {
    const el = trilho.current
    const cartao = el?.children[Math.max(0, Math.min(itens.length - 1, i))] as
      | HTMLElement
      | undefined
    if (el && cartao)
      el.scrollTo({ left: cartao.offsetLeft - el.offsetLeft - 20, behavior: 'smooth' })
  }

  const botao = cn(
    'grid h-11 w-11 cursor-pointer place-items-center rounded-full transition-colors disabled:cursor-default disabled:opacity-30',
    escuro
      ? 'bg-white/10 text-white hover:bg-white/20'
      : 'bg-white text-marinho ring-1 ring-linha hover:bg-papel',
  )

  return (
    <div>
      <ul
        ref={trilho}
        aria-label={rotulo}
        className={cn(
          'sem-barra -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:mx-0 sm:grid sm:overflow-visible sm:px-0',
          colunas,
        )}
      >
        {itens.map((i) => (
          <li key={i.chave} className="w-[76%] shrink-0 snap-start sm:w-auto">
            {i.conteudo}
          </li>
        ))}
      </ul>
      {/* Controles só onde há carrossel (abaixo de sm). */}
      <div className="mt-4 flex items-center justify-between sm:hidden">
        <div className="flex gap-1.5" role="tablist" aria-label="Posição">
          {itens.map((i, k) => (
            <button
              key={i.chave}
              type="button"
              role="tab"
              aria-selected={k === ativo}
              aria-label={`Ir para o ${k + 1}º`}
              onClick={() => ir(k)}
              className={cn(
                'h-2 cursor-pointer rounded-full transition-all',
                k === ativo ? 'w-6' : 'w-2',
                escuro
                  ? k === ativo
                    ? 'bg-marca'
                    : 'bg-white/30'
                  : k === ativo
                    ? 'bg-azul'
                    : 'bg-linha',
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Anterior"
            disabled={ativo === 0}
            onClick={() => ir(ativo - 1)}
            className={botao}
          >
            <IconeVoltar className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Próximo"
            disabled={ativo >= itens.length - 1}
            onClick={() => ir(ativo + 1)}
            className={botao}
          >
            <IconeSeta className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
