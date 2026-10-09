import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { BotaoWhatsApp } from '@/components/BotaoWhatsApp'
import { IconeCheck } from '@/components/Icones'
import { Idiomas } from '@/components/Idiomas'
import { Horizonte } from '@/components/Logo'
import { Perguntas } from '@/components/Perguntas'
import { Marca, Reveal } from '@/components/Reveal'
import { useGsap } from '@/hooks/useGsap'
import { useParallax } from '@/hooks/useParallax'
import { idiomasDaPagina } from '@/lib/business'
import { trechoDe } from '@/lib/cefr'
import { type PaginaCurso as Curso, IDIOMAS_CURSOS } from '@/lib/site'
import { cn, prefersReducedMotion } from '@/lib/utils'
import { Fecho } from '@/sections/Fecho'
import { Diferenciais } from '@/sections/Metodo'

/**
 * Uma página de curso do site — o mesmo esqueleto para os cinco programas,
 * com o conteúdo de cada um em src/lib/site.ts:
 *
 *   herói       — o rótulo gigante e vazado ao fundo, em parallax
 *   pilares     — ênfase, metodologia, personalização
 *   jornada     — os níveis, numa linha que se acende com a rolagem
 *   formatos    — modalidades e certificações
 *   diferenciais, clientes/trilhas (In Company), perguntas, fecho
 *
 * Cada botão de WhatsApp abre com a mensagem do curso ("…sobre o Interkids").
 */
/**
 * As paletas das SUBMARCAS, do manual de marca ("Paleta de Cores
 * Submarcas"). Trocar as variáveis no invólucro da página re-tinge todas as
 * seções dela — herói, jornada, botões, marca-texto — sem um componente
 * saber disso. Topo e rodapé ficam fora: são da marca-mãe.
 *
 * O manual rotula o Azul Intenso das submarcas como #074CAE, mas o quadrado
 * de cor é o #25376A da marca-mãe; vale o quadrado. Idem o "Azul Bebê", cujo
 * rótulo repete #0CC0DF e o quadrado é #8FB0D0.
 */
const SUBMARCAS: Record<string, CSSProperties> = {
  // Interkids (cursos infantis): Azul Claro #0CC0DF, Roxo Kids #7907AE,
  // Azul Intenso, Amarelo destaque #FFF133.
  '/kids': {
    '--color-marinho': '#7907ae',
    '--color-marinho-2': '#5a0585',
    '--color-azul': '#0cc0df',
    '--color-claro': '#0cc0df',
    '--color-noite': '#25376a',
    '--color-marca': '#fff133',
  } as CSSProperties,
  // In Company e Business: Azul Bebê #8FB0D0, Azul Profundo #001220, Azul
  // Intenso, Ouro Laranja #F4B300.
  '/in-company': {
    '--color-marinho': '#001220',
    '--color-marinho-2': '#25376a',
    '--color-azul': '#25376a',
    '--color-claro': '#f4b300',
    '--color-noite': '#001220',
    '--color-marca': '#f4b300',
    '--color-nevoa': '#c7d6e6',
  } as CSSProperties,
}

export function PaginaCurso({ curso, aoEnviar }: { curso: Curso; aoEnviar: () => void }) {
  return (
    <div style={SUBMARCAS[curso.path]}>
      <HeroiCurso curso={curso} />
      <Pilares curso={curso} />
      <Jornada curso={curso} />
      <Formatos curso={curso} />
      <Diferenciais
        rotulo={curso.nome}
        titulo="O que faz diferença no"
        destaque={`${curso.nome}.`}
        itens={curso.diferenciais}
        cta={`Quero saber mais sobre o ${curso.nome}`}
      />
      {curso.clientes && curso.clientes.length > 0 && <Clientes nomes={curso.clientes} />}
      {curso.perguntas.length > 0 && (
        <section className="bg-white py-20 sm:py-28">
          <div className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <Reveal>
              <h2 className="titulo-secao text-[2.1rem] sm:text-[2.6rem]">
                Perguntas sobre o {curso.nome}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <Perguntas itens={curso.perguntas} />
            </Reveal>
          </div>
        </section>
      )}
      <Fecho
        aoEnviar={aoEnviar}
        titulo={`Vamos conversar sobre o`}
        destaque={`${curso.nome}?`}
        texto="Conte para a nossa equipe o seu momento e o seu objetivo. A turma certa sai do nivelamento."
        cta="Falar agora pelo WhatsApp"
      />
    </div>
  )
}

function HeroiCurso({ curso }: { curso: Curso }) {
  const ref = useRef<HTMLElement>(null)
  useParallax(ref)
  const inicio = curso.titulo.slice(0, curso.titulo.length - curso.destaque.length).trim()
  const trecho = trechoDe(curso)
  const idiomas = idiomasDaPagina(curso.path)
  const fatos = [
    `${curso.niveis.length} ${curso.niveis.length === 1 ? 'etapa' : 'etapas'} na jornada`,
    trecho
      ? `Do ${curso.niveis.find((n) => n.cefr)?.cefr?.split(/[ →/]/)[0]} ao ${maiorCefr(curso)}`
      : null,
    // O formato (presencial / online) diz mais no herói do que a 1ª linha.
    curso.modalidades.find((m) => /presencia|online/i.test(m)) ?? curso.modalidades[0] ?? null,
  ].filter(Boolean)

  return (
    <section
      ref={ref}
      data-tema="escuro"
      className="relative isolate overflow-hidden bg-marinho pt-32 pb-20 text-white sm:pt-40 sm:pb-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(100%_80%_at_90%_0%,var(--color-azul)_0%,transparent_60%)]" />
        <Horizonte className="absolute right-0 bottom-0 left-0 opacity-[0.14]" />
        <p
          data-velocidade="0.4"
          className="titulo-largo absolute right-[-4vw] bottom-[-4vw] text-[30vw] leading-none whitespace-nowrap text-transparent uppercase [-webkit-text-stroke:1.5px_rgba(255,249,0,0.16)]"
        >
          {curso.rotulo}
        </p>
      </div>
      <div className="container-x">
        <nav aria-label="Trilha" className="rotulo text-[0.66rem] text-nevoa">
          <a href="/" className="hover:text-white">
            Início
          </a>{' '}
          / <span className="text-white">{curso.rotulo}</span>
        </nav>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <p className="font-semibold text-marca">{curso.nome}</p>
          {idiomas && <Idiomas curso={curso.nome} idiomas={idiomas} escuro />}
        </div>
        <h1 className="titulo-largo mt-3 max-w-[56rem] text-[2.6rem] sm:text-[3.8rem] lg:text-[4.6rem]">
          {inicio} <span className="marca-texto marca-cheia marca-heroi">{curso.destaque}</span>
        </h1>
        <p className="mt-6 max-w-[40rem] text-[1.1rem] leading-relaxed text-nevoa sm:text-[1.2rem]">
          {curso.subtitulo}
        </p>
        <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center">
          <BotaoWhatsApp
            origem={`heroi-${curso.rotulo}`}
            mensagem={curso.mensagemWhatsApp}
            className="botao-marca min-h-14 px-7"
          >
            Quero conhecer o {curso.nome}
          </BotaoWhatsApp>
          <p className="text-sm text-nevoa">{curso.publico}</p>
        </div>
        <ul className="mt-12 flex flex-wrap gap-3">
          {fatos.map((f) => (
            <li
              key={f}
              className="rounded-full bg-white/[0.07] px-4 py-2 text-sm ring-1 ring-white/15 backdrop-blur"
            >
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function maiorCefr(curso: Curso): string {
  const ultimo = [...curso.niveis].reverse().find((n) => n.cefr)?.cefr ?? ''
  const partes = ultimo.split(/[→/]/).map((p) => p.trim())
  return partes[partes.length - 1]
}

function Pilares({ curso }: { curso: Curso }) {
  return (
    <section className="bg-papel py-20 sm:py-28">
      <div className="container-x">
        <ul className="grid gap-5 lg:grid-cols-3">
          {curso.pilares.map((p, i) => (
            <Reveal
              as="li"
              key={p.titulo}
              delay={i * 0.08}
              className={cn(
                'rounded-[1.75rem] p-8 sm:p-10',
                i === 1 ? 'bg-azul text-white' : 'bg-white ring-1 ring-linha',
              )}
            >
              <span className={cn('rotulo', i === 1 ? 'text-marca' : 'text-azul')}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="titulo-secao mt-5 text-[1.7rem]">{p.titulo}</h2>
              <p className={cn('mt-4 leading-relaxed', i === 1 ? 'text-white/85' : 'text-cinza')}>
                {p.texto}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/**
 * A jornada de níveis: uma linha vertical que se ACENDE (amarelo) conforme a
 * rolagem passa por ela, e cada nível com o seu degrau CEFR e a carga
 * horária. GSAP `scrub`; sem ele, a linha nasce cheia.
 */
function Jornada({ curso }: { curso: Curso }) {
  const ref = useRef<HTMLElement>(null)
  const linha = useRef<HTMLSpanElement>(null)
  const [ativo, setAtivo] = useState(false)
  useEffect(() => setAtivo(!prefersReducedMotion()), [])
  useGsap(
    (gsap) => {
      if (!linha.current) return
      gsap.fromTo(
        linha.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 60%', end: 'bottom 70%', scrub: true },
        },
      )
    },
    ref,
    ativo,
  )

  return (
    <section ref={ref} data-tema="escuro" className="bg-noite py-20 text-white sm:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <p className="rotulo text-marca">A jornada</p>
          <h2 className="titulo-secao mt-4 text-[2.2rem] sm:text-[3rem]">
            Nível por nível, <Marca className="marca-cheia">até onde você quer chegar.</Marca>
          </h2>
          <p className="mt-6 max-w-[28rem] leading-relaxed text-nevoa">
            Cada etapa tem objetivo claro e, quando a escola publica, o degrau do Quadro Europeu
            (CEFR) e a carga horária.
          </p>
        </Reveal>

        <ol className="relative grid gap-5 pl-10">
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-3 w-0.5 rounded bg-white/10"
          >
            <span ref={linha} className="block h-full w-full origin-top rounded bg-marca" />
          </span>
          {curso.niveis.map((n, i) => (
            <Reveal as="li" key={n.nome} delay={i * 0.05} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-6 -left-[2.15rem] h-4 w-4 rounded-full bg-marca ring-4 ring-noite"
              />
              <div className="rounded-3xl bg-white/[0.05] p-6 ring-1 ring-white/10 transition-colors hover:bg-white/[0.08]">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="titulo-secao text-[1.4rem]">{n.nome}</h3>
                  {n.cefr && (
                    <span className="rounded-full bg-marca px-3 py-1 text-xs font-bold text-noite">
                      {n.cefr}
                    </span>
                  )}
                  {n.carga && <span className="text-sm text-nevoa">{n.carga}</span>}
                </div>
                <p className="mt-3 leading-relaxed text-nevoa">{n.texto}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Formatos({ curso }: { curso: Curso }) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="rotulo text-azul">Formatos</p>
          <h2 className="titulo-secao mt-4 text-[2rem] sm:text-[2.6rem]">
            Do jeito que cabe na sua rotina
          </h2>
          <ul className="mt-8 grid gap-3">
            {curso.modalidades.map((m) => (
              <li key={m} className="flex items-start gap-3 rounded-2xl bg-papel p-4">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-azul text-white">
                  <IconeCheck className="h-3.5 w-3.5" />
                </span>
                <span className="leading-relaxed">{m}</span>
              </li>
            ))}
          </ul>
          {curso.path !== '/in-company' && (
            <p className="mt-4 text-sm leading-relaxed text-cinza">{IDIOMAS_CURSOS}</p>
          )}
        </Reveal>
        {(curso.certificacoes.length > 0 || (curso.trilhas?.length ?? 0) > 0) && (
          <Reveal delay={0.1}>
            {curso.certificacoes.length > 0 && (
              <>
                <p className="rotulo text-azul">Certificações</p>
                <h2 className="titulo-secao mt-4 text-[2rem] sm:text-[2.6rem]">
                  Preparação para os exames
                </h2>
                <ul className="mt-8 flex flex-wrap gap-3">
                  {curso.certificacoes.map((c) => (
                    <li
                      key={c}
                      className="rounded-full bg-marinho px-5 py-3 font-semibold text-white"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {curso.trilhas && curso.trilhas.length > 0 && (
              <>
                <p className="rotulo text-azul">Trilhas</p>
                <h2 className="titulo-secao mt-4 text-[2rem] sm:text-[2.6rem]">
                  Para cada área da empresa
                </h2>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {curso.trilhas.map((t) => (
                    <li
                      key={t}
                      className="rounded-2xl bg-marinho px-5 py-4 font-semibold text-white"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Reveal>
        )}
      </div>
    </section>
  )
}

/** Clientes do In Company — os nomes que o site atual mostra em logos. */
function Clientes({ nomes }: { nomes: readonly string[] }) {
  const lista = (oculto: boolean) => (
    <ul
      aria-hidden={oculto || undefined}
      className={cn(
        'titulo-largo flex shrink-0 animate-[marquee-x_45s_linear_infinite] gap-12 pr-12 text-[1.6rem] whitespace-nowrap text-azul/80 sm:text-[2.2rem]',
        // Parado, o letreiro cortava um nome no meio: vira uma lista que quebra linha.
        'motion-reduce:container-x motion-reduce:shrink motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:gap-x-10 motion-reduce:gap-y-2 motion-reduce:whitespace-normal',
        oculto && 'motion-reduce:hidden',
      )}
    >
      {nomes.map((n) => (
        <li key={n}>{n}</li>
      ))}
    </ul>
  )
  return (
    <section className="overflow-hidden bg-papel py-16">
      <p className="rotulo container-x mb-8 text-cinza">
        Empresas que já levaram o idioma para dentro
      </p>
      <div className="flex">
        {lista(false)}
        {lista(true)}
      </div>
    </section>
  )
}
