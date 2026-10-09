import { useRef } from 'react'
import { BotaoWhatsApp } from '@/components/BotaoWhatsApp'
import { IconeSeta } from '@/components/Icones'
import { Globo, Horizonte } from '@/components/Logo'
import { Perguntas } from '@/components/Perguntas'
import { Reveal } from '@/components/Reveal'
import { useParallax } from '@/hooks/useParallax'
import { PARCERIAS } from '@/lib/paginas-novas'
import { Fecho } from '@/sections/Fecho'

/**
 * /parcerias — "Leve a Inter para sua escola" (escola, 08/10/2026), com o
 * programa K-12 do catálogo e o benefício para empresas.
 */
export function Parcerias({ aoEnviar }: { aoEnviar: () => void }) {
  const p = PARCERIAS
  const ref = useRef<HTMLElement>(null)
  useParallax(ref)
  const inicio = p.titulo.slice(0, p.titulo.length - p.destaque.length).trim()

  return (
    <>
      <section
        ref={ref}
        data-tema="escuro"
        className="relative isolate overflow-hidden bg-marinho pt-32 pb-20 text-white sm:pt-40 sm:pb-28"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <Horizonte className="absolute right-0 bottom-0 left-0 opacity-[0.14]" />
          <Globo className="globo-entra absolute top-[10%] -right-[16%] h-[120%] max-w-none opacity-[0.08]" />
          <p
            data-velocidade="0.3"
            className="titulo-largo absolute bottom-0 left-0 text-[22vw] leading-none whitespace-nowrap text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.08)]"
          >
            K-12
          </p>
        </div>
        <div className="container-x">
          <nav aria-label="Trilha" className="rotulo text-[0.66rem] text-nevoa">
            <a href="/" className="hover:text-white">
              Início
            </a>{' '}
            / <span className="text-white">{p.rotulo}</span>
          </nav>
          <p className="mt-8 font-semibold text-marca">{p.sobretitulo}</p>
          <h1 className="titulo-largo mt-3 max-w-[56rem] text-[2.6rem] sm:text-[3.8rem] lg:text-[4.6rem]">
            {inicio} <span className="marca-texto marca-cheia marca-heroi">{p.destaque}</span>
          </h1>
          <p className="mt-6 max-w-[42rem] text-[1.1rem] leading-relaxed text-nevoa sm:text-[1.2rem]">
            {p.subtitulo}
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <BotaoWhatsApp
              origem="heroi-parcerias"
              mensagem={p.mensagem}
              className="botao-marca min-h-14 px-7"
            >
              Quero levar a International para a minha escola
            </BotaoWhatsApp>
          </div>
          <ul className="mt-12 flex flex-wrap gap-3">
            {p.idiomas.map((i) => (
              <li
                key={i}
                className="titulo-largo rounded-full bg-white/[0.07] px-5 py-2.5 text-[1.05rem] ring-1 ring-white/15"
              >
                {i}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-papel py-20 sm:py-28">
        <div className="container-x">
          <Reveal>
            <p className="rotulo text-azul">Por que ser parceira</p>
            <h2 className="titulo-secao mt-3 max-w-[40rem] text-[2.1rem] sm:text-[2.8rem]">
              Um centro de línguas dentro da sua instituição.
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-5 lg:grid-cols-3">
            {p.beneficios.map((b, i) => (
              <Reveal
                as="li"
                key={b.titulo}
                delay={i * 0.08}
                className={
                  i === 1
                    ? 'rounded-[1.75rem] bg-azul p-8 text-white sm:p-10'
                    : 'rounded-[1.75rem] bg-white p-8 ring-1 ring-linha sm:p-10'
                }
              >
                <span className={i === 1 ? 'rotulo text-marca' : 'rotulo text-azul'}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="titulo-secao mt-5 text-[1.6rem]">{b.titulo}</h3>
                <p
                  className={
                    i === 1
                      ? 'mt-4 leading-relaxed text-white/85'
                      : 'mt-4 leading-relaxed text-cinza'
                  }
                >
                  {b.texto}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="rotulo text-azul">Para quem é</p>
            <ul className="mt-6 grid gap-4">
              {p.publico.map((x) => (
                <li key={x.titulo} className="rounded-3xl bg-papel p-6">
                  <h3 className="titulo-secao text-[1.3rem]">{x.titulo}</h3>
                  <p className="mt-2 leading-relaxed text-cinza">{x.texto}</p>
                  {'path' in x && x.path && (
                    <a
                      href={x.path}
                      className="mt-3 inline-flex items-center gap-1.5 font-semibold text-azul hover:underline"
                    >
                      Ver o In Company <IconeSeta className="h-4 w-4" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="rotulo text-azul">Como funciona</p>
            <ol className="mt-6 grid gap-4">
              {p.passos.map((s, i) => (
                <li key={s.titulo} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-azul font-bold text-white">
                    {i + 1}
                  </span>
                  <span>
                    <strong className="block text-[1.1rem]">{s.titulo}</strong>
                    <span className="leading-relaxed text-cinza">{s.texto}</span>
                  </span>
                </li>
              ))}
            </ol>
            <BotaoWhatsApp
              origem="parcerias-empresa"
              mensagem={p.mensagemEmpresa}
              className="botao-azul mt-10"
            >
              Sou empresa: quero o benefício
            </BotaoWhatsApp>
          </Reveal>
        </div>
      </section>

      <section className="bg-papel py-20 sm:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <Reveal>
            <h2 className="titulo-secao text-[2.1rem] sm:text-[2.6rem]">
              Perguntas sobre as parcerias
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <Perguntas itens={p.perguntas} />
          </Reveal>
        </div>
      </section>

      <Fecho
        aoEnviar={aoEnviar}
        titulo="Vamos conversar sobre a"
        destaque="parceria?"
        texto="Deixe seu contato e conte qual é a sua instituição. A equipe da International chama você."
        cta="Falar agora pelo WhatsApp"
      />
    </>
  )
}
