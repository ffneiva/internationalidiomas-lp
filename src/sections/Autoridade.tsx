import { BotaoWhatsApp } from '@/components/BotaoWhatsApp'
import { Carrossel } from '@/components/Carrossel'
import { IconeEstrela, IconeSetaDiagonal } from '@/components/Icones'
import { VideoYouTube } from '@/components/Midia'
import { Reveal } from '@/components/Reveal'
import { AVALIACOES, DEPOIMENTOS, ESCOLA, PROVA_SOCIAL, PROVAS } from '@/lib/business'
import { cn } from '@/lib/utils'

export function ProvaSocial({
  titulo = PROVA_SOCIAL.titulo,
  subtitulo = PROVA_SOCIAL.subtitulo,
  cta = PROVA_SOCIAL.cta,
}: {
  titulo?: string
  subtitulo?: string
  cta?: string
} = {}) {
  const g = PROVAS.google
  return (
    <section
      id="depoimentos"
      data-tema="escuro"
      className="relative overflow-hidden bg-noite py-20 text-white sm:py-28"
    >
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-[40rem]">
            <h2 className="titulo-secao text-[2.1rem] sm:text-[3rem]">{titulo}</h2>
            <p className="mt-4 text-[1.08rem] text-nevoa">{subtitulo}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <a
              href={ESCOLA.google}
              target="_blank"
              rel="noopener"
              className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-4 transition-colors hover:border-marca/60"
            >
              {/* Cinco estrelas só com a nota confirmada: estrelas cheias sem
                  número ao lado seriam uma nota implícita que ninguém mediu. */}
              <span className="flex text-marca">
                {(g.confirmado ? [0, 1, 2, 3, 4] : [0]).map((i) => (
                  <IconeEstrela key={i} className="h-5 w-5" />
                ))}
              </span>
              <span className="leading-tight">
                {g.confirmado ? (
                  <>
                    <strong className="block text-[1.05rem]">
                      {g.nota} no Google · +{g.total} avaliações
                    </strong>
                    <span className="text-sm text-nevoa">
                      Ver avaliações da unidade Setor Bueno
                    </span>
                  </>
                ) : (
                  <>
                    <strong className="block text-[1.05rem]">{PROVA_SOCIAL.googleSemNota}</strong>
                    <span className="text-sm text-nevoa">Unidade Setor Bueno, no Google</span>
                  </>
                )}
              </span>
              <IconeSetaDiagonal className="h-5 w-5 text-nevoa transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>

        <Reveal className="mt-12">
          <Carrossel
            escuro
            rotulo="Vídeos de alunos"
            colunas="sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
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
                  <div className="mt-5 px-1">
                    <p className="text-[1.05rem] leading-snug font-medium">{d.frase}</p>
                    <p className="mt-3 text-sm text-nevoa">
                      <strong className="text-white">{d.nome}</strong> · {d.contexto}
                    </p>
                  </div>
                </>
              ),
            }))}
          />
        </Reveal>

        {AVALIACOES.length > 0 && <Avaliacoes />}

        <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8rem] text-nevoa/80">{PROVA_SOCIAL.avisoResultados}</p>
          <BotaoWhatsApp origem="depoimentos" className="botao-marca">
            {cta}
          </BotaoWhatsApp>
        </div>
      </div>
    </section>
  )
}

/**
 * Carrossel das avaliações do Google (transcritas do perfil da escola). Faixa
 * em laço, parando no hover para dar tempo de ler. `claro`: para fundo claro.
 */
export function Avaliacoes({ claro = false }: { claro?: boolean } = {}) {
  const cartoes = (oculto: boolean) => (
    <ul
      aria-hidden={oculto || undefined}
      className={cn(
        'flex shrink-0 animate-[marquee-x_60s_linear_infinite] gap-4 pr-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none',
        oculto && 'motion-reduce:hidden',
      )}
    >
      {AVALIACOES.map((a) => (
        <li
          key={a.nome + a.quando}
          className={
            claro
              ? 'w-[20rem] shrink-0 rounded-3xl bg-white p-6 text-tinta shadow-[0_20px_40px_-28px_rgba(37,55,106,0.5)] ring-1 ring-linha'
              : 'w-[20rem] shrink-0 rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10'
          }
        >
          <span
            className={claro ? 'flex text-[#f4b300]' : 'flex text-marca'}
            role="img"
            aria-label={`${a.estrelas} estrelas`}
          >
            {Array.from({ length: a.estrelas }, (_, i) => i).map((i) => (
              <IconeEstrela key={i} className="h-4 w-4" />
            ))}
          </span>
          <p className="mt-3 text-[0.95rem] leading-relaxed">{a.texto}</p>
          <p className={claro ? 'mt-4 text-sm text-cinza' : 'mt-4 text-sm text-nevoa'}>
            <strong className={claro ? 'text-marinho' : 'text-white'}>{a.nome}</strong> · {a.quando}{' '}
            · Google
          </p>
        </li>
      ))}
    </ul>
  )
  return (
    // Com "reduzir movimento", a faixa para; então ela rola na mão, em vez de
    // ficar cortada na borda.
    <div className="group -mx-5 mt-12 flex overflow-hidden sm:mx-0 motion-reduce:snap-x motion-reduce:overflow-x-auto motion-reduce:pb-4">
      {cartoes(false)}
      {cartoes(true)}
    </div>
  )
}
