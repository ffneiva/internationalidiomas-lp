import globoUrl from '@/assets/globo.svg'
import horizonteUrl from '@/assets/horizonte.png'
import logoUrl from '@/assets/logo.webp'
import { cn } from '@/lib/utils'

/**
 * O logo da International: o globo e "International", com o lema
 * "idiomas personalizados".
 *
 * Globo e nome foram recortados do manual de marca (300 dpi, a versão branca
 * sobre o Azul Intenso) e montados na horizontal. O lema é o do logo NOVO
 * (Canva da escola, 08/10/2026), que trocou "Idiomas e tecnologia" — a escola
 * não oferece mais cursos de tecnologia. Vetorizar não serve: o nome perde a
 * forma exata da letra.
 */
export function Logo({
  className,
  alt = 'International Idiomas',
}: {
  className?: string
  alt?: string
}) {
  return <img src={logoUrl} alt={alt} width={639} height={240} className={cn('block', className)} />
}

/** Só o globo, branco — grafismo de fundo. A opacidade vem de quem usa. */
export function Globo({ className }: { className?: string }) {
  return (
    <img
      src={globoUrl}
      alt=""
      aria-hidden="true"
      width={850}
      height={1136}
      className={cn('w-auto', className)}
    />
  )
}

/**
 * O horizonte de cidades do mundo, em traço — o grafismo da capa do manual de
 * marca (extraído do PDF, com a transparência original). Linhas brancas: vai
 * sobre os fundos escuros, com a opacidade definida por quem usa.
 */
export function Horizonte({ className }: { className?: string }) {
  return (
    <img
      src={horizonteUrl}
      alt=""
      aria-hidden="true"
      width={1267}
      height={292}
      loading="lazy"
      decoding="async"
      className={cn('pointer-events-none block w-full max-w-none select-none', className)}
    />
  )
}
