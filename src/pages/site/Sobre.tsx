import { Fragment, useEffect, useRef, useState } from 'react'
import { IconePino, IconeSetaDiagonal } from '@/components/Icones'
import { Globo, Horizonte } from '@/components/Logo'
import { Marca, Reveal } from '@/components/Reveal'
import { useGsap } from '@/hooks/useGsap'
import { useParallax } from '@/hooks/useParallax'
import { SOBRE } from '@/lib/site'
import { prefersReducedMotion } from '@/lib/utils'
import { Fecho } from '@/sections/Fecho'

/**
 * Sobre a Inter. A história é lida como manifesto (as palavras acendem com a
 * rolagem), e as unidades levam ao "como chegar" de cada uma.
 */
export function Sobre({ aoEnviar }: { aoEnviar: () => void }) {
  const s = SOBRE
  const ref = useRef<HTMLElement>(null)
  useParallax(ref)
  const inicio = s.titulo.slice(0, s.titulo.length - s.destaque.length).trim()

  return (
    <>
      <section
        ref={ref}
        data-tema="escuro"
        className="relative isolate overflow-hidden bg-marinho pt-32 pb-24 text-white sm:pt-40"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <Horizonte className="absolute right-0 bottom-0 left-0 opacity-[0.14]" />
          <Globo className="globo-entra absolute top-[10%] -right-[16%] h-[120%] max-w-none opacity-[0.08]" />
          <p
            data-velocidade="0.3"
            className="titulo-largo absolute bottom-0 left-0 text-[18vw] leading-none whitespace-nowrap text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.08)]"
          >
            desde 2017
          </p>
        </div>
        <div className="container-x">
          <p className="rotulo text-nevoa">Sobre a Inter</p>
          <h1 className="titulo-largo mt-6 max-w-[56rem] text-[2.6rem] sm:text-[3.8rem] lg:text-[4.6rem]">
            {inicio} <span className="marca-texto marca-cheia marca-heroi">{s.destaque}</span>
          </h1>
          <p className="mt-6 max-w-[40rem] text-[1.15rem] leading-relaxed text-nevoa">
            {s.subtitulo}
          </p>
          <ul className="mt-10 flex flex-wrap gap-3">
            {s.idiomas.map((i) => (
              <li
                key={i}
                className="titulo-largo rounded-full bg-white/[0.07] px-5 py-2.5 text-[1.1rem] ring-1 ring-white/15"
              >
                {i}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Historia paragrafos={s.historia} />

      <section data-tema="escuro" className="bg-marinho py-20 text-white sm:py-28">
        <div className="container-x">
          <div className="grid gap-5 lg:grid-cols-2">
            {[
              ['Missão', s.missao],
              ['Visão', s.visao],
            ].map(([t, texto], i) => (
              <Reveal
                key={t}
                delay={i * 0.08}
                className="rounded-[1.75rem] bg-white/[0.06] p-8 ring-1 ring-white/10 sm:p-10"
              >
                <p className="rotulo text-marca">{t}</p>
                <p className="subtitulo mt-5 text-[1.3rem] leading-snug sm:text-[1.55rem]">
                  {texto}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.12} className="mt-12">
            <p className="rotulo text-marca">Valores</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {s.valores.map((v) => (
                <li
                  key={v}
                  className="titulo-largo rounded-full bg-claro px-5 py-3 text-[1.05rem] text-noite sm:text-[1.2rem]"
                >
                  {v}
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-20 grid items-center gap-10 lg:grid-cols-[0.6fr_1.4fr]">
            <Globo className="mx-auto h-56 opacity-90 sm:h-72" />
            <Reveal>
              <p className="rotulo text-marca">O símbolo</p>
              <p className="mt-5 max-w-[44rem] text-[1.15rem] leading-relaxed text-nevoa">
                {s.simbolo}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-papel py-20 sm:py-28">
        <div className="container-x">
          <Reveal className="max-w-[46rem]">
            <p className="rotulo text-azul">{s.proposito.titulo}</p>
            <p className="titulo-secao mt-5 text-[1.8rem] leading-snug sm:text-[2.4rem]">
              {s.proposito.texto}
            </p>
          </Reveal>
          <h2 className="titulo-secao mt-20 text-[2rem] sm:text-[2.6rem]">
            Três metodologias, <Marca>em consonância</Marca>
          </h2>
          <ul className="mt-10 grid gap-5 lg:grid-cols-3">
            {s.metodologias.map((m, i) => (
              <Reveal
                as="li"
                key={m.titulo}
                delay={i * 0.08}
                className="rounded-[1.75rem] bg-white p-8 ring-1 ring-linha"
              >
                <p className="titulo-largo text-[2.4rem] text-azul">{m.titulo.split(' · ')[0]}</p>
                <p lang="en" className="mt-1 text-sm font-semibold text-cinza">
                  {m.titulo.split(' · ')[1]}
                </p>
                <p className="mt-5 leading-relaxed text-cinza">{m.texto}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="container-x">
          <h2 className="titulo-secao text-[2rem] sm:text-[2.6rem]">Onde estamos</h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {s.unidades.map((u) => (
              <Reveal as="li" key={u.nome} className="rounded-[1.75rem] bg-marinho p-8 text-white">
                <p className="rotulo flex items-center gap-2 text-marca">
                  <IconePino className="h-4 w-4" />
                  {u.cidade}
                </p>
                <h3 className="titulo-secao mt-4 text-[1.6rem]">{u.nome}</h3>
                <p className="mt-3 leading-relaxed text-nevoa">
                  {u.endereco}
                  <br />
                  {u.cidade}, {u.cep} · {u.telefone}
                </p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`International Idiomas, ${u.endereco}, ${u.cidade}`)}`}
                  target="_blank"
                  rel="noopener"
                  className="mt-6 inline-flex items-center gap-1.5 font-semibold text-marca hover:underline"
                >
                  Como chegar
                  <IconeSetaDiagonal className="h-4 w-4" />
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Fecho
        aoEnviar={aoEnviar}
        titulo="Venha conhecer"
        destaque="a International."
        texto="Agende uma visita ou fale com a equipe: a gente entende o seu momento e indica o caminho."
        cta="Falar agora pelo WhatsApp"
      />
    </>
  )
}

/** A história como manifesto: grande, e acendendo palavra a palavra. */
function Historia({ paragrafos }: { paragrafos: readonly string[] }) {
  const ref = useRef<HTMLElement>(null)
  const [ativo, setAtivo] = useState(false)
  useEffect(() => setAtivo(!prefersReducedMotion()), [])
  useGsap(
    (gsap) => {
      const palavras = ref.current?.querySelectorAll('[data-palavra]')
      if (!palavras?.length) return
      gsap.fromTo(
        palavras,
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 75%', end: 'bottom 55%', scrub: true },
        },
      )
    },
    ref,
    ativo,
  )
  return (
    <section ref={ref} className="bg-white py-24 sm:py-32">
      <div className="container-x grid gap-8">
        {paragrafos.map((p) => (
          <p
            key={p}
            className="titulo-secao max-w-[62rem] text-[1.6rem] leading-[1.25] sm:text-[2.3rem]"
          >
            {p.split(' ').map((w, i, a) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: frase fixa; a posição é a identidade
              <Fragment key={`${w}-${i}`}>
                <span data-palavra>{w}</span>
                {i < a.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </p>
        ))}
      </div>
    </section>
  )
}
