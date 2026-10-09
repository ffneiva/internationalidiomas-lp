import { useEffect, useRef, useState } from 'react'
import { definirPerfil, usePerfil } from '@/hooks/usePerfil'
import { registrar } from '@/lib/analytics'
import {
  completo,
  PERGUNTAS,
  proximaPergunta,
  type Respostas,
  recomendar,
  responder,
  roteiro,
} from '@/lib/perfil'
import { cn, prefersReducedMotion } from '@/lib/utils'
import { BotaoWhatsApp } from './BotaoWhatsApp'
import { IconeCheck, IconeWhatsApp } from './Icones'

/**
 * O herói da LP: a conversa de WhatsApp, antes do WhatsApp.
 *
 * Um celular com o chat da International. A escola pergunta, a pessoa toca
 * nas respostas (os "botões de resposta rápida" do próprio chat), e no fim
 * a indicação aparece como mensagem — com o botão que abre o WhatsApp de
 * verdade, com tudo escrito. É o quiz da LP (lib/perfil.ts, testado em todas
 * as combinações) apresentado no formato em que a conversão acontece: quem
 * chega pelo anúncio já "ensaiou" a conversa antes de abri-la.
 *
 * Honestidade: o cabeçalho diz que é uma prévia — quem responde de verdade é
 * a equipe, no WhatsApp.
 *
 * O "digitando…" é só no navegador e só com movimento liberado; no HTML
 * pré-renderizado a primeira pergunta já está lá, com as opções.
 */

const FALAS: Record<string, string> = {
  para: 'Oi! 👋 Aqui é da International. Para indicar o curso certo: para quem é o inglês?',
  idade: 'Que legal! Qual a idade?',
  objetivo: 'Boa! E o que você quer com o inglês?',
  nivel: 'Entendi. E como está o inglês hoje?',
  equipe: 'Ótimo. Quantas pessoas na equipe?',
}

type Linha = { de: 'escola' | 'pessoa'; texto: string; chave: string }

function historico(r: Respostas): Linha[] {
  const linhas: Linha[] = []
  for (const c of roteiro(r)) {
    const valor = r[c]
    if (valor === undefined) break
    const opcao = (PERGUNTAS[c].opcoes as readonly { valor: string; rotulo: string }[]).find(
      (o) => o.valor === valor,
    )
    linhas.push({ de: 'escola', texto: FALAS[c], chave: `p-${c}` })
    linhas.push({ de: 'pessoa', texto: opcao?.rotulo ?? '', chave: `r-${c}` })
  }
  return linhas
}

export function ChatQuiz({ className }: { className?: string }) {
  const perfil = usePerfil()
  const pergunta = proximaPergunta(perfil)
  const pronto = completo(perfil)
  const rolagem = useRef<HTMLDivElement>(null)
  const [digitando, setDigitando] = useState(false)
  const passos = historico(perfil).length

  // A cada resposta: "digitando…" por um instante, e o chat desce até o fim.
  useEffect(() => {
    if (passos === 0 || prefersReducedMotion()) return
    setDigitando(true)
    const t = window.setTimeout(() => setDigitando(false), 650)
    return () => window.clearTimeout(t)
  }, [passos])

  // biome-ignore lint/correctness/useExhaustiveDependencies: desce quando o conteúdo muda
  useEffect(() => {
    const el = rolagem.current
    if (el)
      el.scrollTo({ top: el.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [passos, digitando])

  const escolher = (valor: string) => {
    if (!pergunta) return
    const novo = responder(perfil, pergunta.chave, valor as never)
    definirPerfil(novo)
    registrar('quiz_step', { pergunta: pergunta.chave, resposta: valor })
    if (completo(novo)) registrar('quiz_complete', { curso: recomendar(novo).curso.id })
  }

  const recomendacao = pronto ? recomendar(perfil) : null

  return (
    <div
      id="descubra"
      className={cn(
        'relative mx-auto w-full max-w-[24rem] rounded-[2.6rem] bg-noite p-2.5 shadow-[0_50px_100px_-40px_rgba(0,18,32,0.7)] ring-1 ring-black/10',
        className,
      )}
    >
      <div className="overflow-hidden rounded-[2.1rem] bg-[#efeae2]">
        {/* Cabeçalho do chat */}
        <div className="flex items-center gap-3 bg-marinho px-4 pt-5 pb-3 text-white">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-azul text-white">
            <IconeWhatsApp className="h-5 w-5" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate font-bold">International Idiomas</p>
            <p className="text-xs text-white/70">
              {digitando ? 'digitando…' : 'Prévia · a equipe responde no WhatsApp'}
            </p>
          </div>
        </div>

        {/* Mensagens */}
        {/* data-lenis-prevent: com o scroll suave (Lenis) ligado no desktop, a
            roda do mouse rolaria a PÁGINA e nunca as mensagens. */}
        <div
          ref={rolagem}
          data-lenis-prevent
          className="flex h-[22rem] flex-col gap-2 overflow-y-auto px-3 py-4 sm:h-[24rem]"
          aria-live="polite"
        >
          {historico(perfil).map((l) => (
            <Balao key={l.chave} de={l.de}>
              {l.texto}
            </Balao>
          ))}

          {digitando ? (
            <Balao de="escola">
              <span className="flex gap-1 py-1" role="img" aria-label="digitando">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 animate-bounce rounded-full bg-cinza/60"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </span>
            </Balao>
          ) : pergunta ? (
            <>
              <Balao de="escola">{FALAS[pergunta.chave]}</Balao>
              <div className="mt-1 flex flex-wrap justify-end gap-1.5">
                {pergunta.opcoes.map((o) => (
                  <button
                    key={o.valor}
                    type="button"
                    onClick={() => escolher(o.valor)}
                    className="cursor-pointer rounded-full border border-azul/30 bg-white px-3.5 py-2 text-[0.88rem] font-semibold text-azul shadow-sm transition-[transform,background-color] hover:bg-azul hover:text-white active:scale-95"
                  >
                    {o.rotulo}
                  </button>
                ))}
              </div>
            </>
          ) : (
            recomendacao && (
              <Balao de="escola" largo>
                <span className="block">
                  Perfeito! Pelo que você contou, a indicação inicial é:
                </span>
                <span className="mt-2 flex items-center gap-2 rounded-xl bg-papel px-3 py-2.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-marca text-noite">
                    <IconeCheck className="h-4 w-4" />
                  </span>
                  <span className="leading-tight">
                    <strong className="block text-[1.05rem] text-azul">
                      {recomendacao.curso.nome}
                    </strong>
                    <span className="text-xs text-cinza">{recomendacao.curso.para}</span>
                  </span>
                </span>
                <span className="mt-2 block text-[0.85rem] text-cinza">
                  Toque abaixo para mandar seu perfil — a turma certa a gente define no nivelamento.
                </span>
              </Balao>
            )
          )}
        </div>

        {/* Rodapé: a ação */}
        <div className="border-t border-black/5 bg-[#f6f3ee] p-3">
          {pronto ? (
            <div className="grid gap-2">
              <BotaoWhatsApp
                origem="chat"
                className="w-full bg-whats text-white before:bg-[#18643f]"
              >
                Enviar no WhatsApp
              </BotaoWhatsApp>
              <button
                type="button"
                onClick={() => definirPerfil({})}
                className="cursor-pointer text-xs font-semibold text-cinza hover:text-azul"
              >
                Recomeçar
              </button>
            </div>
          ) : (
            <BotaoWhatsApp
              origem="chat-direto"
              icone
              className="w-full !min-h-11 bg-white text-[0.9rem] text-tinta ring-1 ring-black/10 before:bg-papel"
            >
              Prefiro falar direto no WhatsApp
            </BotaoWhatsApp>
          )}
        </div>
      </div>
    </div>
  )
}

function Balao({
  de,
  children,
  largo,
}: {
  de: 'escola' | 'pessoa'
  children: React.ReactNode
  largo?: boolean
}) {
  return (
    <div className={cn('flex', de === 'pessoa' ? 'justify-end' : 'justify-start')}>
      <p
        className={cn(
          'legenda-entra rounded-2xl px-3.5 py-2 text-[0.92rem] leading-snug shadow-sm',
          largo ? 'max-w-[92%]' : 'max-w-[82%]',
          de === 'pessoa'
            ? 'rounded-br-md bg-[#d9fdd3] text-tinta'
            : 'rounded-bl-md bg-white text-tinta',
        )}
      >
        {children}
      </p>
    </div>
  )
}
