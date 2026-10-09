import { useRef, useState } from 'react'
import { BotaoWhatsApp } from '@/components/BotaoWhatsApp'
import { type Contador, Contadores } from '@/components/Contadores'
import { Empilhados } from '@/components/Empilhados'
import { Globo3D, useTem3D } from '@/components/Globo3D'
import { IconeCheck, IconePino, IconeSeta } from '@/components/Icones'
import { Idiomas } from '@/components/Idiomas'
import { Globo, Horizonte } from '@/components/Logo'
import { ReguaCefr } from '@/components/ReguaCefr'
import { Marca, Reveal } from '@/components/Reveal'
import { Selos } from '@/components/Selos'
import { useParallax } from '@/hooks/useParallax'
import { DESTINOS, GOIANIA, idiomasDaPagina, PROVAS } from '@/lib/business'
import { BLOG, POSTS } from '@/lib/paginas-novas'
import { HOME_SITE, PAGINAS_CURSO } from '@/lib/site'
import { ProvaSocial } from '@/sections/Autoridade'
import { Fecho, SecaoPerguntas } from '@/sections/Fecho'
import { Localizacao } from '@/sections/Localizacao'
import { ComoFunciona, Diferenciais, Objetivos } from '@/sections/Metodo'

/**
 * A home do site institucional, na ordem do 2º documento ("Sitemap de
 * otimização para performance"), com os textos sugeridos por ele:
 *
 *   1  Herói                  — "Aprenda inglês em Goiânia e amplie suas oportunidades"
 *   4  Prova imediata         — só os números que têm fonte
 *   5  Para quem é            — cinco perfis, em cartões que se empilham
 *   6  Por que International? — manifesto + bento
 *   7  Metodologia            — três pilares, pinados na horizontal
 *   8  Certificações          — com contexto, e a régua CEFR dos programas
 *   9  Depoimentos            — vídeos reais do canal da escola
 *   —  Onde o inglês leva     — o globo 3D com as rotas (acréscimo)
 *  12  Localização
 *  13  CTA final + 14 Formulário
 */
export function HomeSite({ aoEnviar }: { aoEnviar: () => void }) {
  const h = HOME_SITE
  return (
    <>
      <HeroiSite />
      <ProvaImediata />
      <ParaQuem />
      <Diferenciais
        rotulo="Diferenciais"
        titulo="Por que a"
        destaque="International?"
        itens={h.porQue.itens}
        cta={h.porQue.cta}
      />
      <ComoFunciona
        titulo={h.metodologia.titulo}
        passos={h.metodologia.pilares}
        cta={h.metodologia.cta}
      />
      <Certificacoes />
      <ProvaSocial
        titulo={h.depoimentos.titulo}
        subtitulo="Alunos e projetos reais, no canal da escola."
        cta={h.depoimentos.cta}
      />
      <Objetivos />
      <DoBlog />
      <Localizacao
        titulo={h.localizacao.titulo}
        texto={h.localizacao.texto}
        cta={h.localizacao.cta}
      />
      <Fecho
        aoEnviar={aoEnviar}
        titulo="Pronto para dar o próximo passo"
        destaque="no seu inglês?"
        texto={h.ctaFinal.texto}
        cta={h.ctaFinal.cta}
      />
      <SecaoPerguntas />
    </>
  )
}

/** Os artigos mais recentes do blog — a home é a porta de entrada para ele. */
function DoBlog() {
  const recentes = [...POSTS].sort((a, b) => b.data.localeCompare(a.data)).slice(0, 3)
  return (
    <section id="blog" className="bg-white py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="rotulo text-azul">Blog</p>
            <h2 className="titulo-secao mt-3 max-w-[36rem] text-[2.1rem] sm:text-[2.8rem]">
              Exames, níveis e aprendizado, <Marca>sem enrolação</Marca>
            </h2>
          </div>
          <a
            href={BLOG.path}
            className="inline-flex items-center gap-2 font-semibold whitespace-nowrap text-azul"
          >
            Ver todos os artigos
            <IconeSeta className="h-5 w-5" />
          </a>
        </Reveal>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {recentes.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 0.05}>
              <a
                href={`/blog/${p.slug}`}
                className="group flex h-full flex-col rounded-[1.75rem] bg-papel p-7 ring-1 ring-linha transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(37,55,106,0.45)]"
              >
                <p className="rotulo text-[0.66rem] text-azul">
                  {p.categoria} · {p.minutos} min
                </p>
                <h3 className="titulo-secao mt-4 text-[1.3rem] leading-snug">{p.titulo}</h3>
                <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-cinza">{p.resumo}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-azul">
                  Ler
                  <IconeSeta className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1.5" />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function HeroiSite() {
  const h = HOME_SITE.hero
  const ref = useRef<HTMLElement>(null)
  const [rota, setRota] = useState(0)
  const tem3D = useTem3D()
  useParallax(ref)
  const inicio = h.titulo.slice(0, h.titulo.length - h.destaque.length).trim()

  return (
    <section
      ref={ref}
      data-tema="escuro"
      className="relative isolate overflow-hidden bg-marinho pt-28 pb-14 text-white sm:pt-36 lg:min-h-[100svh] lg:pb-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(110%_80%_at_80%_20%,var(--color-azul)_0%,transparent_60%),radial-gradient(80%_60%_at_0%_100%,var(--color-marinho-2)_0%,transparent_60%)]" />
        <Horizonte className="absolute right-0 bottom-0 left-0 opacity-[0.14]" />
        {/* A palavra da marca, vazada e enorme, num plano atrás de tudo. */}
        <p
          data-velocidade="0.35"
          className="titulo-largo absolute top-[86%] left-1/2 lg:top-[58%] -translate-x-1/2 text-[22vw] leading-none whitespace-nowrap text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.09)]"
        >
          International
        </p>
        {!tem3D && (
          <Globo className="globo-entra absolute top-[6%] -right-[22%] h-[110%] max-w-none opacity-[0.07] lg:right-[-6%]" />
        )}
      </div>

      <div className="container-x relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="rotulo flex items-center gap-2 text-nevoa">
            <IconePino className="h-4 w-4 text-marca" />
            Escola de idiomas em Goiânia
          </p>
          <h1 className="titulo-largo mt-6 text-[2.5rem] sm:text-[3.3rem] lg:text-[3.2rem] xl:text-[3.75rem]">
            {inicio} <span className="marca-texto marca-cheia marca-heroi">{h.destaque}</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-[1.1rem] leading-relaxed text-nevoa sm:text-[1.2rem]">
            {h.subtitulo}
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <BotaoWhatsApp origem="heroi" className="botao-marca min-h-14 px-7 text-[1.02rem]">
              {h.cta}
            </BotaoWhatsApp>
            <a
              href="#cursos"
              className="inline-flex items-center gap-2 px-2 font-semibold text-nevoa underline decoration-white/30 underline-offset-4 hover:text-white"
            >
              Ver os cursos
              <IconeSeta className="h-4 w-4 rotate-90" />
            </a>
          </div>
          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
            {h.apoios.map((a) => (
              <li key={a} className="flex items-center gap-2.5 font-medium">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-marca text-noite">
                  <IconeCheck className="h-3 w-3" />
                </span>
                {a}
              </li>
            ))}
          </ul>
          {/* O SAT é "o coração da coisa" (escola, 09/10/2026). */}
          <a
            href="/preparatorios-e-certificacoes#sat"
            className="group mt-8 inline-flex max-w-[34rem] items-center gap-3 rounded-2xl bg-marca/10 px-4 py-3 ring-1 ring-marca/40 transition-colors hover:bg-marca/20"
          >
            <span className="rounded-full bg-marca px-2.5 py-1 text-[0.72rem] font-extrabold text-noite">
              SAT
            </span>
            <span className="text-[0.95rem] leading-snug font-semibold">{PROVAS.sat.texto}</span>
            <IconeSeta className="h-4 w-4 shrink-0 text-marca transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="relative h-[22rem] sm:h-[28rem] lg:h-[40rem]">
          <Globo3D
            destinos={DESTINOS}
            origem={GOIANIA}
            aoTrocar={setRota}
            className="absolute inset-0 lg:-inset-x-16 lg:-inset-y-10"
          />
          {tem3D && (
            <p className="pointer-events-none absolute bottom-2 left-2 rounded-2xl bg-noite/60 px-4 py-3 backdrop-blur lg:bottom-10 lg:left-0">
              <span className="rotulo block text-[0.62rem] text-nevoa">Goiânia →</span>
              <span
                key={rota}
                className="legenda-entra titulo-largo mt-0.5 block text-[1.6rem] text-marca"
              >
                {DESTINOS[rota].cidade}
              </span>
              <span className="mt-0.5 block text-xs text-nevoa">Arraste para girar o mundo</span>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

const CLIENTES = PAGINAS_CURSO.find((c) => c.path === '/in-company')?.clientes ?? []

/** Item 4 do documento: prova imediata — só com fonte (ver `provas` em site.ts). */
function ProvaImediata() {
  const p = HOME_SITE.provas
  // "10.000+" → 10000: tira o separador de milhar antes de converter.
  const numero = (v: string) => Number.parseInt(v.replace(/\D/g, ''), 10)
  const confirmados: Contador[] = p.itens
    .filter((i) => i.confirmado)
    .map((i) => ({ valor: numero(i.valor), sufixo: '+', rotulo: i.rotulo }))
  const g = p.avaliacoesGoogle
  const itens: Contador[] = [
    ...confirmados,
    ...(g.confirmado
      ? [{ valor: numero(g.total), sufixo: '+', rotulo: `avaliações no Google, nota ${g.nota}` }]
      : []),
    { valor: PAGINAS_CURSO.length, rotulo: 'programas, do Kids ao In Company' },
  ]
  return (
    <section data-tema="escuro" className="bg-marinho pb-16 text-white">
      <div className="container-x">
        <Reveal>
          <Contadores itens={itens.slice(0, 4)} />
        </Reveal>
        {/* "Certificações / parceiros" (item 4 do documento): os exames da
            preparação e as empresas que a escola atende no In Company. */}
        <Reveal delay={0.1} className="mt-8 grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
          <ul className="flex flex-wrap gap-2">
            {HOME_SITE.certificacoes.itens.map((x) => (
              <li
                key={x.nome}
                className="titulo-largo rounded-xl bg-white/[0.08] px-3.5 py-2 text-[0.95rem] ring-1 ring-white/15"
              >
                {x.nome}
              </li>
            ))}
          </ul>
          <p className="text-sm leading-relaxed text-nevoa">
            <span className="rotulo mr-2 text-[0.62rem] text-claro">Empresas atendidas</span>
            {CLIENTES.join(' · ')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

const TEMAS = [
  'bg-azul text-white',
  'bg-white text-tinta ring-1 ring-linha',
  'bg-noite text-white',
  'bg-claro text-noite',
  'bg-marinho-2 text-white',
]

/** Item 5: "Para quem é" — cinco perfis, cada um levando à página do curso. */
function ParaQuem() {
  const q = HOME_SITE.paraQuem
  const cartoes = q.cards.map((c, i) => {
    const curso = PAGINAS_CURSO.find((p) => p.path === c.path)
    return {
      chave: c.path + c.rotulo,
      tema: TEMAS[i % TEMAS.length],
      conteudo: (
        <div className="group relative grid min-h-[22rem] gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_1fr] lg:items-end lg:p-14">
          {/* O link cobre o cartão inteiro; as bandeiras ficam por cima dele
              (z-10), para o balão abrir sem navegar. */}
          <a
            href={c.path}
            data-cursor="Ver curso"
            className="absolute inset-0 z-0 rounded-[inherit]"
          >
            <span className="sr-only">Ver o curso {curso?.nome ?? c.rotulo}</span>
          </a>
          <div className="pointer-events-none relative">
            <p className="rotulo opacity-70">{String(i + 1).padStart(2, '0')} · Para quem é</p>
            <h3 className="titulo-largo mt-4 text-[3rem] leading-[0.95] sm:text-[4.5rem] lg:text-[5.5rem]">
              {c.rotulo}
            </h3>
            {idiomasDaPagina(c.path) && (
              <Idiomas
                curso={curso?.nome ?? c.rotulo}
                idiomas={idiomasDaPagina(c.path) ?? []}
                escuro
                className="pointer-events-auto relative z-10 mt-5"
              />
            )}
          </div>
          <div className="pointer-events-none relative">
            {curso && <p className="text-sm font-semibold opacity-75">{curso.nome}</p>}
            <p className="mt-2 text-[1.3rem] leading-snug font-medium sm:text-[1.5rem]">
              {c.texto}
            </p>
            {curso && (
              <p className="mt-4 max-w-[30rem] leading-relaxed opacity-80">{curso.publico}</p>
            )}
            <span className="mt-7 inline-flex items-center gap-2 font-semibold">
              Ver o curso
              <IconeSeta className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1.5" />
            </span>
          </div>
        </div>
      ),
    }
  })

  return (
    <section id="cursos" className="bg-papel py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="titulo-secao max-w-[40rem] text-[2.2rem] sm:text-[3.2rem]">
            Um caminho para <Marca>cada fase</Marca> e objetivo.
          </h2>
          <p className="max-w-[26rem] leading-relaxed text-cinza">{q.subtitulo}</p>
        </Reveal>
        <Empilhados cartoes={cartoes} />
        <div className="mt-12 flex justify-center">
          <BotaoWhatsApp origem="para-quem" className="botao-azul">
            {q.cta}
          </BotaoWhatsApp>
        </div>
      </div>
    </section>
  )
}

/** Item 8: certificações COM contexto, e a régua CEFR dos programas. */
function Certificacoes() {
  const c = HOME_SITE.certificacoes
  return (
    <section id="certificacoes" className="bg-white py-20 sm:py-28">
      {/* Em faixas de largura total: antes, tudo ia numa coluna e a régua
          ficava sozinha no topo da outra, com um vazio enorme embaixo. */}
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <Reveal>
            <p className="rotulo text-azul">Certificações</p>
            <h2 className="titulo-secao mt-4 text-[2.1rem] sm:text-[2.9rem]">
              Formação reconhecida e conectada com <Marca>oportunidades globais</Marca>
            </h2>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-cinza">{c.texto}</p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-[1.75rem] bg-papel p-6 sm:p-8">
            <p className="rotulo mb-6 text-cinza">Até onde cada programa leva</p>
            <ReguaCefr />
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <a
            href="/preparatorios-e-certificacoes#sat"
            className="group grid gap-4 rounded-[1.75rem] bg-marca p-7 text-noite sm:p-9 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8"
          >
            <span className="titulo-largo text-[3rem] leading-none sm:text-[3.6rem]">SAT</span>
            <span>
              <span className="titulo-secao block text-[1.5rem] leading-snug sm:text-[1.8rem]">
                {PROVAS.sat.texto}
              </span>
              <span className="mt-2 block leading-relaxed text-noite/75">
                O exame de admissão das universidades americanas — e a parte que mais pesa para quem
                estudou no Brasil.
              </span>
            </span>
            <span className="inline-flex items-center gap-2 font-bold">
              Conhecer o preparatório
              <IconeSeta className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        </Reveal>

        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {c.destaques.map((x, i) => (
            <Reveal
              as="li"
              key={x.titulo}
              delay={i * 0.06}
              className="rounded-[1.75rem] bg-marinho p-7 text-white sm:p-9"
            >
              <p className="titulo-largo text-[1.5rem] text-marca sm:text-[1.75rem]">{x.titulo}</p>
              <p className="mt-3 leading-relaxed text-nevoa">{x.texto}</p>
            </Reveal>
          ))}
        </ul>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.itens.map((x, i) => (
            <Reveal
              as="li"
              key={x.nome}
              delay={i * 0.04}
              className="rounded-[1.5rem] bg-papel p-6 sm:p-7"
            >
              <p className="titulo-largo text-[1.6rem] text-azul">{x.nome}</p>
              <p className="mt-2 leading-relaxed text-cinza">{x.texto}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-12 grid gap-8 border-t border-linha pt-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-16">
          <Selos />
          <div>
            <a href="/preparatorios-e-certificacoes" className="botao botao-azul min-h-14 px-7">
              Ver preparatórios e agendar uma prova
              <IconeSeta className="h-5 w-5" />
            </a>
            <p className="mt-5 max-w-[44rem] text-[0.72rem] leading-snug text-cinza/80">
              {c.aviso}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
