import { useId, useState } from 'react'
import { cn } from '@/lib/utils'
import { IconeMais } from './Icones'

type Item = { pergunta: string; resposta: string }

/**
 * Acordeão de perguntas.
 *
 * A altura anima por `grid-template-rows: 0fr → 1fr`, e não por `height`. A
 * resposta fica no DOM mesmo fechada: o FAQ que o JSON-LD declara precisa
 * estar no HTML da página, e o HTML é pré-renderizado.
 */
export function Perguntas({ itens }: { itens: readonly Item[] }) {
  const [aberta, setAberta] = useState<number | null>(0)
  const id = useId()

  return (
    <ul className="border-t border-tinta/15">
      {itens.map((item, i) => {
        const estaAberta = aberta === i
        return (
          <li key={item.pergunta} className="border-b border-tinta/15">
            <h3>
              <button
                type="button"
                id={`${id}-p${i}`}
                aria-expanded={estaAberta}
                aria-controls={`${id}-r${i}`}
                onClick={() => setAberta(estaAberta ? null : i)}
                className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-[1.08rem] leading-snug font-semibold sm:text-[1.2rem]"
              >
                {item.pergunta}
                <span
                  className={cn(
                    'grid h-9 w-9 shrink-0 place-items-center rounded-full border border-tinta/20 transition-[transform,background-color,color] duration-500 ease-[var(--ease-inter)]',
                    estaAberta && 'rotate-45 border-azul bg-azul text-white',
                  )}
                >
                  <IconeMais className="h-4 w-4" />
                </span>
              </button>
            </h3>
            <section
              id={`${id}-r${i}`}
              aria-labelledby={`${id}-p${i}`}
              className="grid transition-[grid-template-rows] duration-500 ease-[var(--ease-inter)]"
              style={{ gridTemplateRows: estaAberta ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="max-w-[64ch] pb-6 leading-relaxed text-cinza">{item.resposta}</p>
              </div>
            </section>
          </li>
        )
      })}
    </ul>
  )
}
