import type { MouseEvent, ReactNode } from 'react'
import { perfilAtual } from '@/hooks/usePerfil'
import { conversaoWhatsApp } from '@/lib/analytics'
import { MENSAGEM_PADRAO } from '@/lib/business'
import { origemDaMensagem } from '@/lib/origem'
import { mensagemDoPerfil } from '@/lib/perfil'
import { cn } from '@/lib/utils'
import { linkWhatsApp } from '@/lib/whatsapp'
import { IconeWhatsApp } from './Icones'

/**
 * Todo botão de WhatsApp da página passa por aqui.
 *
 * O `href` pré-renderizado é o link direto com a mensagem padrão — funciona
 * sem JavaScript e é o que o robô do Google Ads vê. No clique, antes de o
 * navegador seguir o link, a mensagem é reescrita com o que a visita já sabe:
 * o perfil do quiz (para quem, objetivo, nível, curso indicado), o
 * `complemento` do botão (o objetivo do cartão clicado, por exemplo) e, numa
 * linha no fim, o canal do anúncio. A frase do briefing fica intacta. Fazer isso no clique, e não no
 * render, mantém o HTML idêntico ao do servidor — sem divergência na
 * hidratação — e sempre com o perfil mais recente.
 *
 * `origem` identifica o botão no evento de conversão: é assim que dá para
 * saber, no relatório, se quem converte clica no herói, no flutuante ou no
 * fim da página.
 */
type Props = {
  origem: string
  children: ReactNode
  className?: string
  /** Frase acrescentada à mensagem, depois da abertura. */
  complemento?: string
  icone?: boolean
  rotulo?: string
  /** Mensagem própria do botão (a de cada curso, no site). Sem ela, a padrão. */
  mensagem?: string
}

function mensagemNoClique(complemento?: string, mensagem?: string): string {
  const base = mensagem ?? mensagemDoPerfil(perfilAtual())
  const partes = [base, complemento, origemDaMensagem()]
  return partes.filter(Boolean).join('\n\n')
}

export function BotaoWhatsApp({
  origem,
  children,
  className,
  complemento,
  icone = true,
  rotulo,
  mensagem,
}: Props) {
  const aoClicar = (e: MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.href = linkWhatsApp(mensagemNoClique(complemento, mensagem))
    conversaoWhatsApp(origem)
  }

  return (
    <a
      href={linkWhatsApp(mensagem ?? MENSAGEM_PADRAO)}
      target="_blank"
      rel="noopener"
      onClick={aoClicar}
      aria-label={rotulo}
      data-whatsapp={origem}
      className={cn('botao', className)}
    >
      {icone && <IconeWhatsApp className="h-5 w-5 shrink-0" />}
      {children}
    </a>
  )
}
