import { DEGRAUS, porcento, trechoDe } from '@/lib/cefr'
import { PAGINAS_CURSO } from '@/lib/site'
import { cn } from '@/lib/utils'
import { useEntrada } from './Reveal'

/**
 * A régua CEFR: do Pré-A1 ao C2, com o trecho que cada programa percorre.
 *
 * Mostra, num olhar, o que nenhum texto diz tão rápido: a escola leva do
 * primeiro contato ao C1 — e onde cada programa entra nesse caminho. As
 * barras crescem da esquerda quando a régua entra na tela (mesmo contrato do
 * <Reveal>: nascem cheias no HTML e só "esvaziam" para animar se estiverem
 * abaixo da tela quando o JS chega).
 */
export function ReguaCefr({ escuro = false, links = true }: { escuro?: boolean; links?: boolean }) {
  const { ref, armado } = useEntrada<HTMLDivElement>()
  const trechos = PAGINAS_CURSO.map(trechoDe).filter((t) => t !== null)

  return (
    <div ref={ref} className={cn('relative', escuro ? 'text-white' : 'text-tinta')}>
      {/* Eixo */}
      <div className="relative ml-[7.5rem] h-8 sm:ml-[10rem]">
        {DEGRAUS.map((d, i) => (
          <span
            key={d}
            className={cn(
              'rotulo absolute top-0 -translate-x-1/2 text-[0.62rem] sm:text-[0.7rem]',
              escuro ? 'text-nevoa' : 'text-cinza',
            )}
            style={{ left: `${porcento(i)}%` }}
          >
            {d}
          </span>
        ))}
      </div>

      <ul className="grid gap-3">
        {trechos.map((t, i) => (
          <li key={t.path} className="flex items-center">
            {/* Na LP não há páginas de curso: o nome é só rótulo. */}
            {links ? (
              <a
                href={t.path}
                className="w-[7.5rem] shrink-0 pr-3 text-right text-sm leading-tight font-semibold hover:underline sm:w-[10rem]"
              >
                {t.nome}
              </a>
            ) : (
              <span className="w-[7.5rem] shrink-0 pr-3 text-right text-sm leading-tight font-semibold sm:w-[10rem]">
                {t.nome}
              </span>
            )}
            <div
              className={cn(
                'relative h-11 flex-1 rounded-full',
                escuro ? 'bg-white/[0.06]' : 'bg-papel',
              )}
            >
              {/* Fios verticais de cada degrau */}
              {DEGRAUS.map((d, k) => (
                <span
                  key={d}
                  aria-hidden="true"
                  className={cn(
                    'absolute top-1 bottom-1 w-px',
                    escuro ? 'bg-white/10' : 'bg-linha',
                  )}
                  style={{ left: `${porcento(k)}%` }}
                />
              ))}
              <span
                className="absolute top-1.5 bottom-1.5 origin-left rounded-full bg-gradient-to-r from-azul-vivo to-azul shadow-[0_8px_24px_-10px_rgba(21,96,212,0.9)] transition-transform duration-[1400ms] ease-[var(--ease-inter)]"
                style={{
                  left: `${porcento(t.de)}%`,
                  width: `${porcento(t.ate) - porcento(t.de)}%`,
                  transform: armado ? 'scaleX(0)' : undefined,
                  transitionDelay: `${0.2 + i * 0.15}s`,
                }}
              >
                <span className="absolute top-1/2 right-1.5 h-5 w-5 -translate-y-1/2 rounded-full bg-marca ring-4 ring-azul" />
              </span>
            </div>
          </li>
        ))}
      </ul>
      <p className={cn('mt-4 text-xs', escuro ? 'text-nevoa/70' : 'text-cinza/80')}>
        Trechos conforme os níveis publicados de cada programa. A turma de cada aluno é definida no
        nivelamento.
      </p>
    </div>
  )
}
