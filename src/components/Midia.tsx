import { useEffect, useRef, useState } from 'react'
import MANIFESTO from '@/data/fotos.json'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { registrar } from '@/lib/analytics'
import { cn } from '@/lib/utils'
import { IconePlay } from './Icones'

type Registro = { cor: string; proporcao: number; larguras: number[] }
const FOTOS = MANIFESTO as Record<string, Registro>

/**
 * Foto: AVIF com WebP de reserva, nas larguras que o manifesto diz existir.
 * Enquanto não chega, o quadro mostra a cor dominante da própria foto, e a
 * proporção reserva o espaço — sem salto de layout.
 */
type FotoProps = {
  nome: string
  alt: string
  sizes?: string
  className?: string
  prioridade?: boolean
}

export function Foto({
  nome,
  alt,
  sizes = '(min-width: 1024px) 360px, 90vw',
  className,
  prioridade,
}: FotoProps) {
  const r = FOTOS[nome]
  const base = `/images/fotos/${nome}`
  const larguras = r?.larguras ?? [360]
  const srcset = (ext: string) => larguras.map((l) => `${base}-${l}.${ext} ${l}w`).join(', ')
  const menor = larguras[0]

  return (
    <picture className={cn('block overflow-hidden', className)} style={{ backgroundColor: r?.cor }}>
      <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
      <img
        src={`${base}-${menor}.webp`}
        alt={alt}
        width={menor}
        height={Math.round(menor / (r?.proporcao ?? 1))}
        loading={prioridade ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-cover"
      />
    </picture>
  )
}

/**
 * Vídeo do YouTube em *facade*: a capa (servida daqui, não do YouTube) e um
 * botão. O iframe — ~700 kB e cookies de três domínios do Google — só existe
 * depois do clique de quem quer assistir. O domínio é o youtube-nocookie.
 */
export function VideoYouTube({
  id,
  titulo,
  poster,
  className,
}: {
  id: string
  titulo: string
  poster: string
  className?: string
}) {
  const [aberto, setAberto] = useState(false)

  return (
    <div className={cn('relative overflow-hidden bg-noite', className)}>
      {aberto ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
          title={titulo}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setAberto(true)
            registrar('video_play', { video: id })
          }}
          className="group absolute inset-0 h-full w-full cursor-pointer"
          data-cursor="Assistir"
          aria-label={`Assistir: ${titulo}`}
        >
          <Foto
            nome={poster}
            alt=""
            sizes="(min-width: 1024px) 320px, 70vw"
            className="h-full w-full transition-transform duration-700 ease-[var(--ease-inter)] group-hover:scale-[1.04]"
          />
          <span aria-hidden="true" className="listras-marca absolute inset-0" />
          <span className="absolute inset-0 bg-gradient-to-t from-noite/85 via-noite/10 to-transparent" />
          <span className="pulso absolute top-1/2 left-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-marca text-noite shadow-xl transition-transform duration-500 ease-[var(--ease-inter)] group-hover:scale-110">
            <IconePlay className="relative z-10 ml-1 h-6 w-6" />
          </span>
        </button>
      )}
    </div>
  )
}

/**
 * Vídeo próprio, em laço e sem som (o trajeto até a escola).
 *
 * · Nada é baixado antes de chegar perto da tela: até lá, sem `src`, fica o
 *   pôster.
 * · Só toca o que está visível; fora da tela, pausa.
 * · Movimento reduzido: não toca. Fica o pôster.
 */
export function VideoLaco({
  arquivo,
  poster,
  alt,
  className,
}: {
  arquivo: string
  poster: string
  alt: string
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const caixa = useRef<HTMLDivElement>(null)
  const reduzido = useReducedMotion()
  const [perto, setPerto] = useState(false)
  const [tocando, setTocando] = useState(false)

  useEffect(() => {
    const el = caixa.current
    if (!el || reduzido || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setPerto(true)
        const video = ref.current
        if (!video) return
        if (e.intersectionRatio > 0.3) video.play().catch(() => {})
        else video.pause()
      },
      { rootMargin: '300px 0px', threshold: [0, 0.3, 0.6] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduzido])

  return (
    <div ref={caixa} className={cn('relative overflow-hidden', className)}>
      <Foto
        nome={poster}
        alt={alt}
        sizes="(min-width: 1024px) 640px, 100vw"
        className="absolute inset-0 h-full w-full"
      />
      {!reduzido && (
        <video
          ref={ref}
          src={perto ? `/videos/${arquivo}.mp4` : undefined}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          aria-hidden
          onPlaying={() => setTocando(true)}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
            tocando ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
    </div>
  )
}
