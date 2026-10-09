import { useRef, useState } from 'react'
import { BotaoWhatsApp } from '@/components/BotaoWhatsApp'
import { IconeCheck } from '@/components/Icones'
import { Horizonte } from '@/components/Logo'
import { Perguntas } from '@/components/Perguntas'
import { Reveal } from '@/components/Reveal'
import { Selos } from '@/components/Selos'
import { useParallax } from '@/hooks/useParallax'
import { mensagemDaProva, PREPARATORIOS } from '@/lib/paginas-novas'
import { cn } from '@/lib/utils'
import { Fecho } from '@/sections/Fecho'

/**
 * /preparatorios-e-certificacoes — os preparatórios viram "curso" com página
 * própria (escola, 08/10/2026), e as provas que a escola aplica ganham o
 * botão de compra: escolhe a prova → WhatsApp com a prova na mensagem.
 */
export function Preparatorios({ aoEnviar }: { aoEnviar: () => void }) {
  const p = PREPARATORIOS
  return (
    <>
      <Heroi />
      <section className="bg-papel py-20 sm:py-28">
        <div className="container-x">
          <Reveal>
            <p className="rotulo text-azul">Exames</p>
            <h2 className="titulo-secao mt-3 max-w-[40rem] text-[2.1rem] sm:text-[2.8rem]">
              Para cada objetivo, o exame certo.
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {p.exames.map((x, i) => (
              <Reveal
                as="li"
                key={x.sigla}
                delay={i * 0.05}
                className="flex flex-col rounded-[1.75rem] bg-white p-7 ring-1 ring-linha"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="titulo-largo text-[2rem] text-marinho">{x.sigla}</h3>
                  {x.especialidade && (
                    <span className="rounded-full bg-marca px-3 py-1 text-[0.72rem] font-bold text-noite">
                      Especialidade
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm font-semibold text-azul">{x.nome}</p>
                <p className="mt-4 leading-relaxed text-cinza">{x.oQue}</p>
                <p className="mt-4 border-t border-linha pt-4 text-sm leading-relaxed">
                  <strong className="text-tinta">Para quem:</strong> {x.paraQuem}
                </p>
                <BotaoWhatsApp
                  origem={`preparatorio-${x.sigla}`}
                  mensagem={`Olá! Quero saber sobre o preparatório de ${x.sigla} da International.`}
                  className="botao-azul mt-6 w-full !min-h-12 text-[0.92rem]"
                >
                  Quero o preparatório de {x.sigla}
                </BotaoWhatsApp>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="container-x">
          <Reveal>
            <h2 className="titulo-secao max-w-[40rem] text-[2.1rem] sm:text-[2.8rem]">
              {p.comoFunciona.titulo.replace(p.comoFunciona.destaque, '').trim()}{' '}
              <span className="marca-texto">{p.comoFunciona.destaque}</span>
            </h2>
          </Reveal>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {p.comoFunciona.itens.map((it, i) => (
              <Reveal as="li" key={it.titulo} delay={i * 0.06} className="rounded-3xl bg-papel p-7">
                <span className="rotulo text-azul">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="titulo-secao mt-4 text-[1.35rem]">{it.titulo}</h3>
                <p className="mt-3 leading-relaxed text-cinza">{it.texto}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <Provas />
      <Toeic />

      <section className="bg-white py-20 sm:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <Reveal>
            <h2 className="titulo-secao text-[2.1rem] sm:text-[2.6rem]">
              Perguntas sobre preparatórios e provas
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <Perguntas itens={p.perguntas} />
          </Reveal>
        </div>
      </section>

      <Fecho
        aoEnviar={aoEnviar}
        titulo="Vamos montar o seu"
        destaque="preparatório?"
        texto="Conte qual exame e qual nota você precisa. A equipe faz o nivelamento e monta o pacote com você."
        cta="Falar agora pelo WhatsApp"
      />
    </>
  )
}

function Heroi() {
  const p = PREPARATORIOS
  const ref = useRef<HTMLElement>(null)
  useParallax(ref)
  const inicio = p.titulo.slice(0, p.titulo.length - p.destaque.length).trim()
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
          className="titulo-largo absolute right-[-4vw] bottom-[-4vw] text-[24vw] leading-none whitespace-nowrap text-transparent uppercase [-webkit-text-stroke:1.5px_rgba(255,249,0,0.16)]"
        >
          Prep
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
        <p className="mt-6 max-w-[40rem] text-[1.1rem] leading-relaxed text-nevoa sm:text-[1.2rem]">
          {p.subtitulo}
        </p>
        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a href="#provas" className="botao botao-marca min-h-14 px-7">
            Quero agendar uma prova
          </a>
          <BotaoWhatsApp
            origem="heroi-preparatorios"
            mensagem="Olá! Quero saber sobre os preparatórios para exames internacionais da International."
            className="botao-linha min-h-14 px-7"
          >
            Falar sobre preparatórios
          </BotaoWhatsApp>
        </div>
        <ul className="mt-12 flex flex-wrap gap-3">
          {p.selos.map((f) => (
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

/** Intensivo, plataforma e simulados de TOEIC — e o TOEIC para empresas. */
function Toeic() {
  const t = PREPARATORIOS.toeic
  const e = PREPARATORIOS.empresas
  const inicio = t.titulo.slice(0, t.titulo.length - t.destaque.length).trim()
  return (
    <section className="bg-papel py-20 sm:py-28">
      <div className="container-x">
        <Reveal>
          <p className="rotulo text-azul">{t.sobretitulo}</p>
          <h2 className="titulo-secao mt-3 max-w-[44rem] text-[2.1rem] sm:text-[2.8rem]">
            {inicio} <span className="marca-texto">{t.destaque}</span>
          </h2>
        </Reveal>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {t.itens.map((it, i) => (
            <Reveal
              as="li"
              key={it.titulo}
              delay={i * 0.06}
              className="flex flex-col rounded-[1.75rem] bg-white p-7 ring-1 ring-linha"
            >
              <h3 className="titulo-secao text-[1.35rem]">{it.titulo}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-cinza">{it.texto}</p>
              <BotaoWhatsApp
                origem={`toeic-${i}`}
                mensagem={`Olá! Quero saber sobre o ${it.titulo.toLowerCase()} de TOEIC da International.`}
                className="botao-azul mt-6 w-full !min-h-12 text-[0.92rem]"
              >
                Quero saber mais
              </BotaoWhatsApp>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-14 grid gap-8 rounded-[2rem] bg-marinho p-7 text-white sm:p-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div data-tema="escuro">
            <h3 className="titulo-secao text-[1.7rem] sm:text-[2rem]">{e.titulo}</h3>
            <BotaoWhatsApp
              origem="toeic-empresas"
              mensagem={e.mensagem}
              className="botao-marca mt-7 min-h-14 px-7"
            >
              Falar sobre a minha empresa
            </BotaoWhatsApp>
          </div>
          <ul className="grid gap-3">
            {e.itens.map((it) => (
              <li key={it} className="flex gap-3 leading-relaxed text-nevoa">
                <IconeCheck className="mt-1 h-5 w-5 shrink-0 text-marca" />
                {it}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

/** "Um botão para a gente vender os produtos provas internacionais." */
function Provas() {
  const v = PREPARATORIOS.provas
  const [escolha, setEscolha] = useState<string>(v.opcoes[0].id)
  const prova = v.opcoes.find((o) => o.id === escolha) ?? v.opcoes[0]
  const inicio = v.titulo.slice(0, v.titulo.length - v.destaque.length).trim()

  return (
    <section
      id="provas"
      data-tema="escuro"
      className="relative isolate scroll-mt-24 overflow-hidden bg-marinho py-20 text-white sm:py-28"
    >
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <Reveal>
          <p className="rotulo text-marca">{v.sobretitulo}</p>
          <h2 className="titulo-largo mt-4 text-[2.3rem] sm:text-[3.2rem]">
            {inicio} <span className="marca-texto marca-cheia">{v.destaque}</span>
          </h2>
          <p className="mt-5 max-w-[34rem] text-[1.05rem] leading-relaxed text-nevoa">{v.texto}</p>
          <ol className="mt-8 grid gap-3">
            {v.passos.map((passo, i) => (
              <li key={passo} className="flex items-center gap-3 text-[0.98rem]">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 font-bold text-marca">
                  {i + 1}
                </span>
                {passo}
              </li>
            ))}
          </ol>
          <Selos escuro className="mt-10" />
        </Reveal>

        <Reveal delay={0.1} className="rounded-[2rem] bg-white p-6 text-tinta sm:p-9">
          <fieldset>
            <legend className="titulo-secao text-[1.5rem]">Qual prova você quer fazer?</legend>
            <div className="mt-6 grid gap-3">
              {v.opcoes.map((o) => (
                <label
                  key={o.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-4 rounded-2xl p-4 ring-1 transition-[background-color,box-shadow]',
                    escolha === o.id ? 'bg-papel ring-2 ring-azul' : 'ring-linha hover:bg-papel',
                  )}
                >
                  <input
                    type="radio"
                    name="prova"
                    value={o.id}
                    checked={escolha === o.id}
                    onChange={() => setEscolha(o.id)}
                    className="h-5 w-5 accent-azul"
                  />
                  <span className="min-w-0">
                    <strong className="block text-[1.05rem] leading-snug">{o.nome}</strong>
                    <span className="text-sm text-cinza">{o.para}</span>
                    {/* No celular o selo vai embaixo: ao lado, espremia o nome da prova. */}
                    {o.online && (
                      <span className="mt-1.5 block w-fit rounded-full bg-azul/10 px-2.5 py-1 text-[0.7rem] font-bold text-azul sm:hidden">
                        Também on-line
                      </span>
                    )}
                  </span>
                  {o.online && (
                    <span className="ml-auto hidden shrink-0 rounded-full bg-azul/10 px-2.5 py-1 text-[0.7rem] font-bold text-azul sm:inline-block">
                      Também on-line
                    </span>
                  )}
                  {escolha === o.id && (
                    <IconeCheck
                      className={cn('ml-auto h-5 w-5 shrink-0 text-azul', o.online && 'sm:ml-0')}
                    />
                  )}
                </label>
              ))}
            </div>
          </fieldset>
          <div aria-live="polite" className="mt-6 rounded-2xl bg-papel p-5">
            <p className="rotulo text-[0.66rem] text-azul">{prova.nome}</p>
            <ul className="mt-3 grid gap-2 text-[0.92rem] leading-relaxed">
              {[...prova.ficha, ...v.inclui].map((f) => (
                <li key={f} className="flex gap-2.5">
                  <IconeCheck className="mt-1 h-4 w-4 shrink-0 text-azul" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <BotaoWhatsApp
            origem={`prova-${prova.id}`}
            mensagem={mensagemDaProva(prova.nome)}
            className="botao-azul mt-7 w-full min-h-14"
          >
            {v.cta}: {prova.nome.split(' — ')[0]}
          </BotaoWhatsApp>
          <p className="mt-4 text-[0.82rem] leading-relaxed text-cinza">{v.aviso}</p>
        </Reveal>
      </div>
    </section>
  )
}
