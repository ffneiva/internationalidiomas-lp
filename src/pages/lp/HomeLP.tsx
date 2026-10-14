import { useEffect, useState } from 'react'
import { BotaoWhatsApp } from '@/components/BotaoWhatsApp'
import { Carrossel } from '@/components/Carrossel'
import { ChatQuiz } from '@/components/ChatQuiz'
import {
  IconeAviao,
  IconeBalao,
  IconeCapelo,
  IconeCheck,
  IconeEstrela,
  IconeGlobo,
  IconeMaleta,
  IconePino,
  IconeSetaDiagonal,
} from '@/components/Icones'
import { Idiomas } from '@/components/Idiomas'
import { Horizonte } from '@/components/Logo'
import { Foto, VideoYouTube } from '@/components/Midia'
import { Perguntas } from '@/components/Perguntas'
import { Marca, Reveal } from '@/components/Reveal'
import { Selos } from '@/components/Selos'
import {
  AUTORIDADE,
  CURSOS,
  type CursoId,
  DEPOIMENTOS,
  DESTINOS,
  DIFERENCIAIS,
  ESCOLA,
  EXAMES,
  FAQ,
  HEROI,
  IDIOMAS_DO_CURSO,
  OBJETIVOS,
  type ObjetivoId,
  PASSOS,
  PROVA_SOCIAL,
  PROVAS,
  SECAO_DIFERENCIAIS,
  SECAO_FASES,
  SECAO_OBJETIVOS,
  SECAO_PASSOS,
} from '@/lib/business'
import { cn, prefersReducedMotion } from '@/lib/utils'
import { Avaliacoes } from '@/sections/Autoridade'
import { Fecho } from '@/sections/Fecho'
import { Localizacao } from '@/sections/Localizacao'

/**
 * A landing page de performance — feita para CONVERTER, e por isso diferente
 * do site institucional de propósito.
 *
 * O site apresenta a escola (escuro, cinematográfico, globo 3D, cenas de
 * rolagem). A LP recebe tráfego pago com um objetivo só: conversa
 * qualificada no WhatsApp. Então:
 *
 * · **O herói é a conversa.** Um chat de WhatsApp em que a escola pergunta e
 *   a pessoa toca nas respostas; no fim, "Enviar no WhatsApp" abre a conversa
 *   real com tudo escrito. Primeira dobra = primeira interação.
 * · **Claro, leve e direto.** Sem three.js, sem GSAP, sem seção pinada: nada
 *   entre o anúncio e o botão. Cada seção termina num CTA.
 * · **Cada cartão é um atalho.** "Falar sobre o Kids" já abre o WhatsApp com
 *   o curso na mensagem.
 * · **A barra de WhatsApp fica fixa** no pé da tela (ver Moldura).
 *
 * A ordem e os textos são os do sitemap validado (Sitemap LP Curso de Inglês
 * | Performance), seção por seção.
 */
export function HomeLP({ aoEnviar }: { aoEnviar: () => void }) {
  return (
    <>
      <Heroi />
      <Faixa />
      <Autoridade />
      <Fases />
      <ComoFunciona />
      <Diferenciais />
      <Objetivos />
      <Localizacao />
      <Fecho aoEnviar={aoEnviar} />
      <section className="bg-white py-16 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <h2 className="titulo-secao text-[2rem] sm:text-[2.4rem]">Perguntas frequentes</h2>
          <Perguntas itens={FAQ} />
        </div>
      </section>
    </>
  )
}

/**
 * O vídeo real da escola (drone do Parque Vaca Brava até a fachada) ao fundo
 * do herói — o sitemap pede "priorizar foto/vídeo real da International".
 * No desktop, o vídeo toca em laço; no celular, fica o quadro dele (mesma
 * imagem real, sem gastar o plano de dados de quem veio do anúncio).
 */
function FundoReal() {
  const [video, setVideo] = useState(false)
  useEffect(() => {
    setVideo(window.matchMedia('(min-width: 1024px)').matches && !prefersReducedMotion())
  }, [])
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <Foto
        nome="trajeto-inicio"
        alt=""
        sizes="100vw"
        prioridade
        className="absolute inset-0 h-full w-full"
      />
      {video && (
        <video
          src="/videos/trajeto.mp4"
          muted
          loop
          playsInline
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {/* Véu nas cores do manual: Azul Intenso → Royal, "do céu e do mar". */}
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(37,55,106,0.97)_0%,rgba(37,55,106,0.9)_42%,rgba(7,75,174,0.55)_100%)]" />
      <Horizonte className="absolute right-0 bottom-0 left-0 opacity-[0.18]" />
    </div>
  )
}

/**
 * Etiquetas que flutuam em volta do celular: o que o inglês destrava. Só
 * decoração (aria-hidden), em CSS (`flutua`); paradas com movimento reduzido.
 */
const ETIQUETAS = [
  { texto: '“How are you?”', classe: '-left-10 top-16 rotate-[-6deg]', atraso: '0s' },
  { texto: 'Preparatório TOEFL® · SAT', classe: '-right-6 top-6 rotate-[5deg]', atraso: '1.2s' },
  { texto: '✈ Londres', classe: '-left-14 bottom-36 rotate-[4deg]', atraso: '0.6s' },
  { texto: 'Nível B2', classe: '-right-10 bottom-24 rotate-[-4deg]', atraso: '1.8s' },
]

/** 01 · Herói — a promessa à esquerda, a conversa à direita, o vídeo real atrás. */
function Heroi() {
  return (
    <section
      data-tema="escuro"
      className="relative isolate overflow-hidden pt-24 pb-16 text-white sm:pt-32 lg:pt-36 lg:pb-24"
    >
      <FundoReal />
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <p className="rotulo flex items-center gap-2 text-claro">
            <IconePino className="h-4 w-4 text-marca" />
            {HEROI.sobretitulo}
          </p>
          <h1 className="titulo-largo mt-5 text-[2.7rem] sm:text-[3.6rem] lg:text-[4.1rem]">
            {HEROI.titulo}{' '}
            <span className="marca-texto marca-cheia marca-heroi">{HEROI.destaque}</span>
          </h1>
          <p className="subtitulo mt-5 max-w-[34rem] text-[1.12rem] leading-relaxed text-nevoa sm:text-[1.22rem]">
            {HEROI.subtitulo}
          </p>
          <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {HEROI.diferenciais.map((d) => (
              <li key={d} className="flex items-center gap-2.5 font-semibold">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-marca text-noite">
                  <IconeCheck className="h-3 w-3" />
                </span>
                {d}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <BotaoWhatsApp
              origem="heroi"
              className="pulso-suave min-h-14 bg-whats px-7 text-[1.05rem] text-white shadow-[0_16px_40px_-12px_rgba(37,211,102,0.65)] before:bg-[#18643f]"
            >
              {HEROI.cta}
            </BotaoWhatsApp>
            <a
              href="#descubra"
              className="px-2 text-sm font-semibold text-claro underline underline-offset-4 lg:hidden"
            >
              Ou descubra seu curso em 3 toques
            </a>
          </div>
          {/* A prova logo abaixo do botão: nota, avaliações, alunos, anos. */}
          <a
            href={ESCOLA.google}
            target="_blank"
            rel="noopener"
            className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-nevoa hover:text-white"
          >
            <span className="flex items-center gap-1.5">
              <span className="flex text-[#f4b300]" role="img" aria-label="5 estrelas">
                {[0, 1, 2, 3, 4].map((i) => (
                  <IconeEstrela key={i} className="h-4 w-4" />
                ))}
              </span>
              <span className="text-white">
                {PROVAS.google.nota} no Google · mais de {PROVAS.google.total} avaliações
              </span>
              <IconeSetaDiagonal className="h-3.5 w-3.5" />
            </span>
            <span aria-hidden="true" className="hidden h-4 w-px bg-white/25 sm:block" />
            <span>{PROVAS.alunos.texto}</span>
            <span aria-hidden="true" className="h-4 w-px bg-white/25" />
            <span>{PROVAS.anos.texto}</span>
          </a>
          {/* As credenciais em exame, ditas pelo dono (02/10/2026). */}
          <ul className="mt-4 flex flex-wrap gap-2 text-[0.8rem] font-bold">
            <li className="rounded-full bg-marca px-3 py-1.5 text-noite">{PROVAS.sat.texto}</li>
            {[PROVAS.especialidade, PROVAS.aplicador]
              .filter((x) => x.confirmado)
              .map((x) => (
                <li
                  key={x.texto}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-white ring-1 ring-white/20"
                >
                  {x.texto}
                </li>
              ))}
          </ul>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 scale-110 rounded-full bg-claro/30 blur-3xl"
          />
          {ETIQUETAS.map((e) => (
            <span
              key={e.texto}
              aria-hidden="true"
              style={{ animationDelay: e.atraso }}
              className={cn(
                'flutua absolute z-20 hidden rounded-2xl bg-white px-4 py-2.5 text-sm font-bold whitespace-nowrap text-marinho shadow-[0_18px_40px_-16px_rgba(0,18,32,0.6)] sm:block',
                e.classe,
              )}
            >
              {e.texto}
            </span>
          ))}
          <ChatQuiz />
        </div>
      </div>
    </section>
  )
}

/** A faixa que corre logo abaixo do herói: os exames e os públicos. */
function Faixa() {
  const itens = [
    ...EXAMES.map((x) => x.sigla),
    'Kids',
    'Teens',
    'Adults',
    'Business',
    'Setor Bueno · Goiânia',
    'Setor Carvelo · Trindade',
  ]
  const lista = (oculta: boolean) => (
    <ul
      aria-hidden={oculta || undefined}
      className={cn(
        'titulo-largo flex shrink-0 animate-[marquee-x_36s_linear_infinite] items-center text-[1.25rem] whitespace-nowrap sm:text-[1.5rem]',
        'motion-reduce:container-x motion-reduce:shrink motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-1',
        oculta && 'motion-reduce:hidden',
      )}
    >
      {itens.map((t) => (
        <li key={t} className="flex items-center gap-7 pr-7">
          {t}
          <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-marinho" />
        </li>
      ))}
    </ul>
  )
  return (
    <div className="flex overflow-hidden bg-claro py-3.5 text-marinho">
      {lista(false)}
      {lista(true)}
    </div>
  )
}

/** 02 · Autoridade, credibilidade e prova social. */
function Autoridade() {
  return (
    <section id="depoimentos" className="bg-white py-16 sm:py-24">
      <div className="container-x">
        <Reveal className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <h2 className="titulo-secao text-[2rem] text-marinho sm:text-[2.7rem]">
              {AUTORIDADE.titulo} <Marca>{AUTORIDADE.destaque}</Marca>
            </h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-cinza">{AUTORIDADE.texto}</p>
          </div>
          <div>
            <p className="rotulo text-azul">{AUTORIDADE.rotuloExames}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {EXAMES.map((x) => (
                <li
                  key={x.sigla}
                  title={x.nome}
                  className={cn(
                    'titulo-largo rounded-xl px-4 py-2 text-[1.1rem]',
                    x.especialidade ? 'bg-marca text-noite' : 'bg-marinho text-white',
                  )}
                >
                  {x.sigla}
                </li>
              ))}
            </ul>
            <ul className="mt-4 grid gap-1.5 text-[0.95rem] font-semibold text-marinho">
              {[PROVAS.especialidade, PROVAS.aplicador]
                .filter((x) => x.confirmado)
                .map((x) => (
                  <li key={x.texto} className="flex items-center gap-2">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-azul text-white">
                      <IconeCheck className="h-3 w-3" />
                    </span>
                    {x.texto}
                  </li>
                ))}
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-cinza">{AUTORIDADE.notaExames}</p>
            <Selos className="mt-6" />
          </div>
        </Reveal>

        <div className="mt-14 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="titulo-secao text-[1.6rem] text-marinho sm:text-[2rem]">
              {PROVA_SOCIAL.titulo}
            </h3>
            <p className="mt-1 text-cinza">{PROVA_SOCIAL.subtitulo}</p>
          </div>
        </div>
        <div className="mt-6">
          <Carrossel
            rotulo="Vídeos de alunos"
            itens={DEPOIMENTOS.map((d) => ({
              chave: d.id,
              conteudo: (
                <>
                  <VideoYouTube
                    id={d.youtube}
                    titulo={d.titulo}
                    poster={d.foto}
                    className="aspect-[4/5] rounded-3xl"
                  />
                  <p className="mt-3 font-semibold leading-snug text-marinho">{d.frase}</p>
                  <p className="mt-1 text-sm text-cinza">
                    <strong>{d.nome}</strong> · {d.contexto}
                  </p>
                </>
              ),
            }))}
          />
        </div>
        <div className="mt-12 flex flex-wrap items-end justify-between gap-3">
          <p className="titulo-secao text-[1.3rem] text-marinho sm:text-[1.6rem]">
            {PROVAS.google.nota} no Google, com +{PROVAS.google.total} avaliações
          </p>
          <a
            href={ESCOLA.google}
            target="_blank"
            rel="noopener"
            className="text-sm font-semibold text-azul hover:underline"
          >
            Ver todas no Google
          </a>
        </div>
        <Avaliacoes claro />
        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-cinza/80">{PROVA_SOCIAL.avisoResultados}</p>
          <BotaoWhatsApp origem="depoimentos" className="botao-azul">
            {PROVA_SOCIAL.cta}
          </BotaoWhatsApp>
        </div>
        <p className="mt-6 text-[0.7rem] text-cinza/70">{AUTORIDADE.aviso}</p>
      </div>
    </section>
  )
}

/** As quatro fases do sitemap da LP (o High School fica no site). */
const FASES_LP: readonly CursoId[] = ['kids', 'teens', 'adults', 'business']

/**
 * A cor de cada fase. Kids e Business usam as paletas das SUBMARCAS do manual
 * (Interkids: roxo e ciano; Business: azul profundo e ouro); Teens e Adults,
 * os azuis da marca-mãe.
 */
const COR_FASE: Record<string, { faixa: string; texto: string }> = {
  kids: { faixa: 'bg-[linear-gradient(90deg,#7907ae,#0cc0df)]', texto: 'text-[#7907ae]' },
  teens: { faixa: 'bg-[linear-gradient(90deg,#074bae,#75aff0)]', texto: 'text-azul' },
  adults: { faixa: 'bg-[linear-gradient(90deg,#25376a,#074bae)]', texto: 'text-marinho' },
  business: { faixa: 'bg-[linear-gradient(90deg,#001220,#f4b300)]', texto: 'text-[#b78600]' },
}

/** 03 · Inglês para cada fase — cada cartão abre o WhatsApp sobre aquele curso. */
function Fases() {
  return (
    <section id="cursos" className="bg-papel py-16 sm:py-24">
      <div className="container-x">
        <Reveal>
          <h2 className="titulo-secao text-[2rem] text-marinho sm:text-[2.7rem]">
            Inglês para <Marca>cada fase</Marca> da vida.
          </h2>
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FASES_LP.map((id, i) => {
            const c = CURSOS[id]
            return (
              <Reveal
                as="li"
                key={id}
                delay={i * 0.06}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-6 pt-8 ring-1 ring-linha transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(37,55,106,0.5)]"
              >
                <span
                  aria-hidden="true"
                  className={cn('absolute inset-x-0 top-0 h-2', COR_FASE[id].faixa)}
                />
                <span
                  aria-hidden="true"
                  className="titulo-largo pointer-events-none absolute -right-3 -bottom-4 text-[5.5rem] leading-none text-transparent opacity-60 [-webkit-text-stroke:1.5px_var(--color-linha)]"
                >
                  {c.rotulo}
                </span>
                <div className="flex items-center justify-between gap-3">
                  <p className={cn('rotulo', COR_FASE[id].texto)}>{c.rotulo}</p>
                  <Idiomas curso={c.nome} idiomas={IDIOMAS_DO_CURSO[id]} />
                </div>
                <h3 className="titulo-secao mt-2 text-[1.35rem] text-marinho">{c.para}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-cinza">{c.resumo}</p>
                <BotaoWhatsApp
                  origem={`fase-${id}`}
                  complemento={`Tenho interesse em: ${c.para} (${c.nome}).`}
                  className="botao-azul mt-6 w-full !min-h-12 text-[0.92rem]"
                >
                  Falar sobre o {c.rotulo}
                </BotaoWhatsApp>
              </Reveal>
            )
          })}
        </ul>
        <div className="mt-8 text-center">
          <a href="#descubra" className="font-semibold text-azul underline underline-offset-4">
            {SECAO_FASES.cta}
          </a>
        </div>
      </div>
    </section>
  )
}

/** 04 · Como funciona — quatro passos numa linha, sem cena. */
function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-white py-16 sm:py-24">
      <div className="container-x">
        <Reveal>
          <h2 className="titulo-secao text-[2rem] text-marinho sm:text-[2.7rem]">
            {SECAO_PASSOS.titulo}
          </h2>
        </Reveal>
        <ol className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
          {/* A linha que liga os passos se enche quando a seção cruza a tela
              (scroll-driven, CSS puro; sem suporte, nasce cheia). */}
          <span
            aria-hidden="true"
            className="absolute top-7 right-0 left-0 hidden h-1 rounded-full bg-linha md:block"
          >
            <span className="linha-passos block h-full origin-left rounded-full bg-[linear-gradient(90deg,var(--color-azul),var(--color-claro))]" />
          </span>
          {PASSOS.map((p, i) => (
            <Reveal as="li" key={p.titulo} delay={i * 0.07} className="relative">
              <span className="titulo-largo relative grid h-14 w-14 place-items-center rounded-full bg-azul text-[1.3rem] text-white ring-8 ring-white">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="titulo-secao mt-3 text-[1.2rem] text-marinho">{p.titulo}</h3>
              <p className="mt-2 leading-relaxed text-cinza">{p.texto}</p>
            </Reveal>
          ))}
        </ol>
        <BotaoWhatsApp origem="como-funciona" className="botao-azul mt-10">
          {SECAO_PASSOS.cta}
        </BotaoWhatsApp>
      </div>
    </section>
  )
}

/** 05 · Diferenciais — cinco cartões em azul, o bloco "por que nós". */
function Diferenciais() {
  return (
    <section id="diferenciais" data-tema="escuro" className="bg-azul py-16 text-white sm:py-24">
      <div className="container-x">
        <Reveal>
          <h2 className="titulo-secao text-[2rem] sm:text-[2.7rem]">
            {SECAO_DIFERENCIAIS.titulo}{' '}
            <Marca className="marca-cheia">{SECAO_DIFERENCIAIS.destaque}</Marca>
          </h2>
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {DIFERENCIAIS.map((d, i) => (
            <Reveal
              as="li"
              key={d.titulo}
              delay={i * 0.05}
              className="rounded-3xl bg-white/[0.08] p-6 ring-1 ring-white/15"
            >
              <h3 className="titulo-secao text-[1.15rem]">{d.titulo}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-white/85">{d.texto}</p>
              <p className="mt-3 text-[0.8rem] leading-relaxed text-white/60">{d.detalhe}</p>
            </Reveal>
          ))}
        </ul>
        <BotaoWhatsApp origem="diferenciais" className="botao-marca mt-10">
          {SECAO_DIFERENCIAIS.cta}
        </BotaoWhatsApp>
      </div>
    </section>
  )
}

const ICONES: Record<ObjetivoId, typeof IconeAviao> = {
  viagens: IconeAviao,
  carreira: IconeMaleta,
  estudos: IconeCapelo,
  intercambio: IconeGlobo,
  pessoal: IconeBalao,
}

/** 06 · Objetivos — cada um é um botão de WhatsApp com o objetivo dito. */
function Objetivos() {
  return (
    <section id="objetivos" className="relative overflow-hidden bg-papel py-16 sm:py-24">
      <div className="container-x">
        <Reveal>
          <h2 className="titulo-secao text-[2rem] text-marinho sm:text-[2.7rem]">
            {SECAO_OBJETIVOS.titulo}
          </h2>
          <p className="mt-3 text-cinza">{SECAO_OBJETIVOS.texto}</p>
        </Reveal>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {OBJETIVOS.map((o, i) => {
            const Icone = ICONES[o.id]
            return (
              <Reveal as="li" key={o.id} delay={i * 0.05}>
                <BotaoWhatsApp
                  origem={`objetivo-${o.id}`}
                  complemento={`Meu objetivo: ${o.mensagem}.`}
                  icone={false}
                  className={cn(
                    'group !flex h-full w-full !flex-col !items-start !justify-start !rounded-3xl bg-white !p-6 text-left !font-normal text-marinho ring-1 ring-linha before:!bg-marinho hover:text-white',
                  )}
                >
                  <Icone className="h-8 w-8 text-azul transition-colors group-hover:text-claro" />
                  <span className="titulo-secao mt-4 block text-[1.2rem]">{o.titulo}</span>
                  <span className="rotulo mt-1 block text-[0.62rem] text-azul group-hover:text-claro">
                    Goiânia → {DESTINOS[i].cidade}
                  </span>
                  <span className="mt-1 block text-[0.92rem] leading-snug text-cinza group-hover:text-white/80">
                    {o.texto}
                  </span>
                </BotaoWhatsApp>
              </Reveal>
            )
          })}
        </ul>
        <BotaoWhatsApp origem="objetivos" className="botao-azul mt-10">
          {SECAO_OBJETIVOS.cta}
        </BotaoWhatsApp>
      </div>
      <Horizonte className="pointer-events-none absolute right-0 bottom-0 left-0 opacity-[0.07] invert" />
    </section>
  )
}
