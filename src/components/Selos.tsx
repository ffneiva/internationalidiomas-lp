import { SELOS } from '@/lib/business'
import { cn } from '@/lib/utils'

/**
 * "Centro Autorizado ETS" com as marcas no padrão novo (TOEFL® Young Students,
 * Primary, Junior e TOEIC®, do "Cabeçalho 2023" da escola) e o selo do
 * preparatório SAT. As marcas ETS são escuras: no fundo escuro, vão numa
 * placa branca única.
 */
export function Selos({
  escuro = false,
  soEts = false,
  className,
}: {
  escuro?: boolean
  /** Só as marcas ETS — nos contêineres da ETS, separadas das outras (escola, 09/10/2026). */
  soEts?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-x-8 gap-y-5', className)}>
      <figure>
        <figcaption
          className={cn('rotulo mb-2.5 text-[0.62rem]', escuro ? 'text-claro' : 'text-azul')}
        >
          Centro Autorizado ETS®
        </figcaption>
        <ul
          className={cn(
            'flex flex-wrap items-center gap-x-5 gap-y-3',
            escuro && 'rounded-2xl bg-white px-4 py-3',
          )}
        >
          {SELOS.ets.map((s) => (
            <li key={s.arquivo}>
              <img
                src={`/images/selos/${s.arquivo}`}
                alt={s.nome}
                width={s.largura}
                height={40}
                loading="lazy"
                decoding="async"
                className="h-10 w-auto"
              />
            </li>
          ))}
        </ul>
      </figure>
      {!soEts && (
        <figure>
          <figcaption
            className={cn('rotulo mb-2.5 text-[0.62rem]', escuro ? 'text-claro' : 'text-azul')}
          >
            {SELOS.sat.legenda}
          </figcaption>
          <span className={cn('inline-block', escuro && 'rounded-xl bg-white p-1')}>
            <img
              src="/images/selos/sat.webp"
              alt={SELOS.sat.nome}
              width={52}
              height={56}
              loading="lazy"
              decoding="async"
              className="h-14 w-auto"
            />
          </span>
        </figure>
      )}
    </div>
  )
}
