import { Fragment, useEffect, useRef, useState } from 'react'
import { BotaoWhatsApp } from '@/components/BotaoWhatsApp'
import { Globo3D, useTem3D } from '@/components/Globo3D'
import {
  IconeAviao,
  IconeBalao,
  IconeCapelo,
  IconeGlobo,
  IconeMaleta,
  IconeSeta,
} from '@/components/Icones'
import { Marca, Reveal } from '@/components/Reveal'
import { useGsap } from '@/hooks/useGsap'
import {
  DESTINOS,
  DIFERENCIAIS,
  GOIANIA,
  OBJETIVOS,
  type ObjetivoId,
  PASSOS,
  SECAO_DIFERENCIAIS,
  SECAO_OBJETIVOS,
  SECAO_PASSOS,
} from '@/lib/business'
import { cn, prefersReducedMotion } from '@/lib/utils'

/** Colunas (de 12) de cada item abaixo dos dois grandes do bento. */
function spanDoResto(n: number): string {
  if (n === 4) return 'md:col-span-6 xl:col-span-3'
  if (n === 2) return 'md:col-span-6'
  if (n === 1) return 'md:col-span-12'
  return 'md:col-span-4'
}

/** Rolagem horizontal pinada: só no desktop com ponteiro fino e sem movimento reduzido. */
function usaHorizontal(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches &&
    !prefersReducedMotion()
  )
}

/**
 * 04 · Como funciona.
 *
 * No desktop, a seção PINA e os quatro passos atravessam a tela na
 * horizontal enquanto a pessoa rola para baixo — o gesto lateral é o próprio
 * "avançar no processo". Uma barra amarela embaixo mostra em que passo se
 * está.
 *
 * O modo horizontal só existe depois de o GSAP carregar: a classe
 * `trilho-horizontal` é posta pelo próprio efeito e tirada no `revert`. Sem
 * GSAP (bloqueado, celular, movimento reduzido) os passos ficam numa grade
 * comum, todos visíveis — o estado de reserva é o estado completo.
 */
type Passo = { titulo: string; texto: string }

export function ComoFunciona({
  titulo = SECAO_PASSOS.titulo,
  passos = PASSOS,
  cta = SECAO_PASSOS.cta,
}: {
  titulo?: string
  passos?: readonly Passo[]
  cta?: string
} = {}) {
  const secao = useRef<HTMLDivElement>(null)
  const trilho = useRef<HTMLOListElement>(null)
  const barra = useRef<HTMLSpanElement>(null)
  const [horizontal, setHorizontal] = useState(false)
  useEffect(() => setHorizontal(usaHorizontal()), [])

  useGsap(
    (gsap) => {
      const el = trilho.current
      const s = secao.current
      if (!el || !s) return
      el.classList.add('trilho-horizontal')
      const distancia = () => Math.max(0, el.scrollWidth - window.innerWidth)
      const gatilho = {
        trigger: s,
        start: 'top top',
        end: () => `+=${distancia()}`,
        scrub: 0.7,
        invalidateOnRefresh: true,
      }
      gsap.to(el, { x: () => -distancia(), ease: 'none', scrollTrigger: { ...gatilho, pin: true } })
      if (barra.current) {
        gsap.fromTo(
          barra.current,
          { scaleX: 0.02 },
          { scaleX: 1, ease: 'none', scrollTrigger: gatilho },
        )
      }
      return () => el.classList.remove('trilho-horizontal')
    },
    secao,
    horizontal,
  )

  return (
    // O GSAP pina o <div> de dentro, nunca a <section>: o pin embrulha o
    // elemento num pin-spacer, e o nó que o React remove ao trocar de página
    // precisa continuar sendo filho de quem o React acha que é.
    <section
      id="como-funciona"
      data-tema="escuro"
      className="relative overflow-hidden bg-azul text-white"
    >
      <div
        ref={secao}
        // A altura de tela cheia só serve ao modo pinado; na grade comum (celular,
        // movimento reduzido) ela deixava um vão vazio em cima e embaixo.
        className={cn(
          'py-20 sm:py-28',
          horizontal && 'lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center',
        )}
      >
        <div className="container-x">
          <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="titulo-secao max-w-[34rem] text-[2.1rem] sm:text-[3rem]">{titulo}</h2>
            <BotaoWhatsApp origem="como-funciona" className="botao-marca self-start md:self-auto">
              {cta}
            </BotaoWhatsApp>
          </Reveal>
        </div>

        <ol
          ref={trilho}
          className={cn(
            'container-x mt-14 grid gap-10 md:gap-8',
            passos.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 xl:grid-cols-4',
          )}
        >
          {passos.map((p, i) => (
            <li key={p.titulo} className="passo relative">
              <span
                aria-hidden="true"
                className="numero block text-[4.5rem] leading-none font-extrabold text-transparent [-webkit-text-stroke:1.5px_var(--color-marca)]"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="titulo-secao mt-5 text-[1.45rem]">{p.titulo}</h3>
              <p className="mt-2 max-w-[24rem] leading-relaxed text-white/80">{p.texto}</p>
            </li>
          ))}
        </ol>

        <div className="container-x mt-12 hidden lg:block" aria-hidden="true">
          <span className="block h-[3px] overflow-hidden rounded-full bg-white/15">
            <span ref={barra} className="block h-full origin-left rounded-full bg-marca" />
          </span>
        </div>
      </div>
    </section>
  )
}

/**
 * O título dos diferenciais como manifesto: grande, e acendendo palavra a
 * palavra conforme a rolagem (GSAP scrub). Impõe ritmo de leitura à frase
 * que resume a escola. As palavras nascem ACESAS no HTML; só apagam para
 * acender quando o GSAP chega — sem ele, é um título comum.
 */
function Manifesto({ titulo, destaque }: { titulo: string; destaque: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [ativo, setAtivo] = useState(false)
  useEffect(() => setAtivo(!prefersReducedMotion()), [])
  useGsap(
    (gsap) => {
      const palavras = ref.current?.querySelectorAll('[data-palavra]')
      if (!palavras?.length) return
      gsap.fromTo(
        palavras,
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'bottom 45%', scrub: true },
        },
      )
    },
    ref,
    ativo,
  )
  const quebrar = (t: string) =>
    t.split(' ').map((p, i, a) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: frase fixa; a posição da palavra é a identidade dela
      <Fragment key={`${p}-${i}`}>
        <span data-palavra className="inline-block">
          {p}
        </span>
        {i < a.length - 1 ? ' ' : null}
      </Fragment>
    ))
  return (
    <h2
      ref={ref}
      className="titulo-largo mt-5 max-w-[60rem] text-[2.5rem] sm:text-[4rem] lg:text-[5rem]"
    >
      {quebrar(titulo)} <Marca delay={0.1}>{quebrar(destaque)}</Marca>
    </h2>
  )
}

/** 05 · Por que International? */
type Diferencial = { titulo: string; texto: string; detalhe?: string }

export function Diferenciais({
  rotulo = 'Por que International?',
  titulo = SECAO_DIFERENCIAIS.titulo,
  destaque = SECAO_DIFERENCIAIS.destaque,
  itens = DIFERENCIAIS,
  cta = SECAO_DIFERENCIAIS.cta,
}: {
  rotulo?: string
  titulo?: string
  destaque?: string
  itens?: readonly Diferencial[]
  cta?: string
} = {}) {
  return (
    <section id="diferenciais" className="bg-papel py-20 sm:py-28">
      <div className="container-x">
        <p className="rotulo text-azul">{rotulo}</p>
        <Manifesto titulo={titulo} destaque={destaque} />

        <ul className="mt-12 grid gap-4 md:grid-cols-12">
          {itens.map((d, i) => (
            <Reveal
              as="li"
              key={d.titulo}
              delay={i * 0.06}
              className={cn(
                'rounded-3xl p-7 transition-transform duration-500 ease-[var(--ease-inter)] hover:-translate-y-1',
                // Bento: dois grandes em cima e o resto dividido por igual — com
                // seis itens, antes, o último sobrava sozinho numa linha.
                i < 2 ? 'md:col-span-6' : spanDoResto(itens.length - 2),
                i === 0 ? 'bg-marinho text-white' : 'bg-white',
              )}
            >
              <span
                className={cn(
                  'rotulo inline-block rounded-full px-3 py-1 text-[0.66rem]',
                  i === 0 ? 'bg-marca text-noite' : 'bg-papel text-azul',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className={cn('titulo-secao mt-5', i < 2 ? 'text-[1.7rem]' : 'text-[1.35rem]')}>
                {d.titulo}
              </h3>
              <p className={cn('mt-3 leading-relaxed', i === 0 ? 'text-nevoa' : 'text-cinza')}>
                {d.texto}
              </p>
              {d.detalhe && (
                <p
                  className={cn(
                    'mt-3 text-[0.85rem] leading-relaxed',
                    i === 0 ? 'text-nevoa/70' : 'text-cinza/80',
                  )}
                >
                  {d.detalhe}
                </p>
              )}
            </Reveal>
          ))}
        </ul>

        <div className="mt-10">
          <BotaoWhatsApp origem="diferenciais" className="botao-azul">
            {cta}
          </BotaoWhatsApp>
        </div>
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

/**
 * 06 · Onde o inglês pode levar você?
 *
 * Cada objetivo é um botão de WhatsApp: a mensagem sai com ele dito ("Meu
 * objetivo: quero inglês para a carreira"). No desktop, o globo 3D da marca
 * fica fixo ao lado e gira até a cidade do objetivo sob o ponteiro (ou em
 * foco, pelo teclado) — de Goiânia a Nova York, Londres, Toronto, Dublin,
 * Sydney. Sem 3D (celular, movimento reduzido), a lista funciona sozinha.
 */
export function Objetivos() {
  const [ativo, setAtivo] = useState<number | null>(null)
  const [rota, setRota] = useState(0)
  const tem3D = useTem3D()
  const mostrado = ativo ?? rota

  return (
    <section
      id="objetivos"
      data-tema="escuro"
      className="relative overflow-hidden bg-noite py-20 text-white sm:py-28"
    >
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-10">
        <div>
          <Reveal>
            <h2 className="titulo-secao text-[2.1rem] sm:text-[3rem]">{SECAO_OBJETIVOS.titulo}</h2>
            <p className="mt-5 max-w-[26rem] text-[1.02rem] leading-relaxed text-nevoa">
              {SECAO_OBJETIVOS.texto}
            </p>
          </Reveal>

          <ul className="mt-10 border-t border-white/15" onPointerLeave={() => setAtivo(null)}>
            {OBJETIVOS.map((o, i) => {
              const Icone = ICONES[o.id]
              return (
                <Reveal as="li" key={o.id} delay={i * 0.05} className="border-b border-white/15">
                  {/* biome-ignore lint/a11y/noStaticElementInteractions: o foco/ponteiro só escolhe a rota do globo decorativo */}
                  <div onPointerEnter={() => setAtivo(i)} onFocus={() => setAtivo(i)}>
                    <BotaoWhatsApp
                      origem={`objetivo-${o.id}`}
                      complemento={`Meu objetivo: ${o.mensagem}.`}
                      icone={false}
                      className="group !flex !min-h-0 w-full !justify-start !rounded-none !px-2 !py-6 text-left !font-normal before:!bg-claro hover:text-noite focus-visible:text-noite sm:!px-4"
                    >
                      <Icone className="h-7 w-7 shrink-0 text-marca transition-colors group-hover:text-noite" />
                      <span className="flex-1">
                        <span className="titulo-secao block text-[1.5rem] sm:text-[1.9rem]">
                          {o.titulo}
                        </span>
                        <span className="mt-1 block text-[0.98rem] text-nevoa group-hover:text-tinta">
                          {o.texto}
                        </span>
                      </span>
                      <IconeSeta className="h-6 w-6 shrink-0 -translate-x-2 opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-x-0 group-hover:opacity-100 max-sm:translate-x-0 max-sm:opacity-60" />
                    </BotaoWhatsApp>
                  </div>
                </Reveal>
              )
            })}
          </ul>
          <div className="mt-10">
            <BotaoWhatsApp origem="objetivos" className="botao-marca">
              {SECAO_OBJETIVOS.cta}
            </BotaoWhatsApp>
          </div>
        </div>

        <div aria-hidden="true" className="relative hidden lg:block">
          <div className="sticky top-16 -mr-24 h-[calc(100svh-4rem)] max-h-[48rem]">
            <Globo3D
              destinos={DESTINOS}
              origem={GOIANIA}
              escolhido={ativo}
              aoTrocar={setRota}
              ciclo={3200}
              className="h-full w-full"
            />
            {tem3D && (
              <p className="absolute bottom-10 left-8 text-white">
                <span className="rotulo block text-[0.66rem] text-nevoa">Goiânia →</span>
                <span
                  key={mostrado}
                  className="legenda-entra titulo-largo mt-1 block text-[2.6rem] text-marca"
                >
                  {DESTINOS[mostrado].cidade}
                </span>
                <span className="mt-1 block text-sm text-nevoa">{OBJETIVOS[mostrado].titulo}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
