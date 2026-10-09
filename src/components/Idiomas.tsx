import { useId, useState } from 'react'
import { IDIOMAS, type Idioma } from '@/lib/business'
import { cn } from '@/lib/utils'

/**
 * As bandeiras dos idiomas de um curso, com o balão que a escola pediu
 * (08/10/2026): "se a pessoa passar o mouse por cima da bandeira apresenta o
 * texto — O curso Interkids está disponível nos idiomas: Inglês, Espanhol e
 * Francês".
 *
 * · Bandeiras em SVG, não emoji: no Windows, 🇺🇸 vira as letras "US".
 * · O inglês é metade Reino Unido, metade EUA — como no catálogo da escola.
 * · O balão abre com mouse, com foco do teclado e com toque (no celular não
 *   existe "passar o mouse"); fecha ao sair, ao perder o foco ou com Esc.
 * · Para leitor de tela, o mesmo texto é a descrição do botão.
 */
export function Idiomas({
  curso,
  idiomas,
  escuro = false,
  className,
}: {
  curso: string
  idiomas: readonly Idioma[]
  escuro?: boolean
  className?: string
}) {
  const id = useId()
  const [aberto, setAberto] = useState(false)
  const texto = `O ${curso} está disponível em: ${listar(idiomas.map((i) => IDIOMAS[i].nome))}.`

  return (
    <span className={cn('relative inline-flex align-middle', className)}>
      <button
        type="button"
        onMouseEnter={() => setAberto(true)}
        onMouseLeave={() => setAberto(false)}
        aria-describedby={`${id}-balao`}
        aria-label={`Idiomas do ${curso}`}
        onClick={(e) => {
          // Dentro de um cartão-link, o toque nas bandeiras abre o balão e
          // não navega.
          e.preventDefault()
          e.stopPropagation()
          setAberto((v) => !v)
        }}
        onFocus={() => setAberto(true)}
        onBlur={() => setAberto(false)}
        onKeyDown={(e) => e.key === 'Escape' && setAberto(false)}
        className="flex cursor-help items-center rounded-full outline-offset-4"
      >
        {idiomas.map((i, k) => (
          <span
            key={i}
            title={IDIOMAS[i].nome}
            className={cn(
              'block h-7 w-7 overflow-hidden rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.25)] ring-2',
              escuro ? 'ring-white/80' : 'ring-white',
              k > 0 && '-ml-2',
            )}
          >
            <Bandeira idioma={i} />
          </span>
        ))}
      </button>
      <span
        id={`${id}-balao`}
        role="tooltip"
        className={cn(
          'pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 w-max max-w-[16rem] -translate-x-1/2 rounded-2xl bg-noite px-4 py-2.5 text-center text-[0.82rem] leading-snug font-medium text-white shadow-xl transition-[opacity,transform] duration-200',
          "after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-noite after:content-['']",
          aberto ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
        )}
      >
        {texto}
      </span>
    </span>
  )
}

/** "Inglês, Espanhol e Francês" */
function listar(nomes: string[]): string {
  if (nomes.length < 2) return nomes.join('')
  return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`
}

/** Bandeiras redondas, desenhadas num quadrado 36×36 (o círculo é o recorte do pai). */
function Bandeira({ idioma }: { idioma: Idioma }) {
  const comum = {
    viewBox: '0 0 36 36',
    className: 'h-full w-full',
    preserveAspectRatio: 'xMidYMid slice',
  }
  if (idioma === 'es') {
    return (
      <svg {...comum} aria-hidden="true">
        <rect width="36" height="36" fill="#c60b1e" />
        <rect y="9" width="36" height="18" fill="#ffc400" />
      </svg>
    )
  }
  if (idioma === 'fr') {
    return (
      <svg {...comum} aria-hidden="true">
        <rect width="12" height="36" fill="#002395" />
        <rect x="12" width="12" height="36" fill="#fff" />
        <rect x="24" width="12" height="36" fill="#ed2939" />
      </svg>
    )
  }
  return <Ingles comum={comum} />
}

/** Inglês: Reino Unido à esquerda, EUA à direita (ids únicos por instância). */
function Ingles({ comum }: { comum: React.SVGProps<SVGSVGElement> }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg {...comum} aria-hidden="true">
      <defs>
        <clipPath id={`${id}e`}>
          <rect width="18" height="36" />
        </clipPath>
        <clipPath id={`${id}d`}>
          <rect x="18" width="18" height="36" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}e)`}>
        <rect width="36" height="36" fill="#012169" />
        <path d="M0 0 36 36M36 0 0 36" stroke="#fff" strokeWidth="7" />
        <path d="M0 0 36 36M36 0 0 36" stroke="#c8102e" strokeWidth="2.5" />
        <path d="M18 0v36M0 18h36" stroke="#fff" strokeWidth="10" />
        <path d="M18 0v36M0 18h36" stroke="#c8102e" strokeWidth="6" />
      </g>
      <g clipPath={`url(#${id}d)`}>
        <rect width="36" height="36" fill="#fff" />
        {[0, 2, 4, 6, 8, 10, 12].map((n) => (
          <rect key={n} y={(n * 36) / 13} width="36" height={36 / 13} fill="#b22234" />
        ))}
        <rect x="18" width="18" height={(36 * 7) / 13} fill="#3c3b6e" />
        {[22, 27, 32].flatMap((x) =>
          [4, 9, 14].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="#fff" />),
        )}
      </g>
    </svg>
  )
}
