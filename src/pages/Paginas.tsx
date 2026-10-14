import { IconeCheck } from '@/components/Icones'
import { CONSENTIMENTO, ESCOLA, OBRIGADO } from '@/lib/business'

/**
 * /obrigado — a página de conversão do formulário.
 *
 * Existe para ser medida: "visitou /obrigado" é a conversão mais simples de
 * configurar no Google Ads e no Pixel, e não depende de evento nenhum. Fora
 * do índice (noindex em routes.ts).
 */
export function Obrigado() {
  return (
    <section
      data-tema="escuro"
      className="grid min-h-[100svh] place-items-center bg-marinho px-5 pt-28 pb-20 text-white"
    >
      <div className="max-w-[34rem] text-center">
        <span className="carimbo mx-auto grid h-16 w-16 place-items-center rounded-full bg-marca text-noite">
          <IconeCheck className="h-8 w-8" />
        </span>
        <h1 className="titulo-largo mt-8 text-[2.4rem] sm:text-[3rem]">{OBRIGADO.titulo}</h1>
        <p className="mt-5 text-[1.1rem] leading-relaxed text-nevoa">{OBRIGADO.texto}</p>
        <div className="mt-9 flex flex-col items-center gap-4">
          <a
            href="/"
            className="text-sm font-semibold text-nevoa underline underline-offset-4 hover:text-white"
          >
            {OBRIGADO.voltar}
          </a>
        </div>
      </div>
    </section>
  )
}

export function NaoEncontrada() {
  return (
    <section
      data-tema="escuro"
      className="grid min-h-[100svh] place-items-center bg-marinho px-5 text-white"
    >
      <div className="max-w-[30rem] text-center">
        <p className="rotulo text-marca">Erro 404</p>
        <h1 className="titulo-largo mt-4 text-[2.4rem]">
          Page not found. <span className="block text-nevoa">Esta página não existe.</span>
        </h1>
        <a href="/" className="botao botao-marca mt-9">
          Ir para o curso de inglês
        </a>
      </div>
    </section>
  )
}

/**
 * Política de privacidade — exigência do Google Ads para página que coleta
 * dado pessoal, e da LGPD. Escrita para o que a página FAZ, não um modelo
 * genérico: três campos, uma API, um e-mail para a escola, e a medição dos
 * anúncios.
 */
export function Privacidade() {
  const secoes: [string, string][] = [
    [
      'O que coletamos',
      'Pelo formulário, nome, e-mail e WhatsApp — e, se você usou o “Descubra seu curso”, as respostas (para quem é, objetivo e nível). Junto vai a origem da visita: parâmetros do anúncio que trouxe você (como utm_source ou gclid) e a página de onde veio.',
    ],
    [
      'Para que usamos',
      `Só para a equipe da ${ESCOLA.nome} responder ao seu contato sobre os cursos. Os dados não são vendidos nem cedidos a terceiros para outros fins.`,
    ],
    [
      'Onde ficam e por quanto tempo',
      'O contato é enviado por e-mail à escola e guardado em servidor da Amazon Web Services por até 12 meses, quando é apagado automaticamente.',
    ],
    [
      'Sua autorização (LGPD)',
      `O formulário só é enviado com a sua autorização expressa: “${CONSENTIMENTO.contato}” A caixa de novidades é separada e opcional — sem ela, você só recebe o contato que pediu. Junto do seu contato guardamos qual texto você aceitou e quando, como pede a LGPD. Você pode retirar a autorização a qualquer momento pelo WhatsApp.`,
    ],
    [
      'Sistema de atendimento',
      'Para organizar o atendimento, o contato também é registrado no sistema de relacionamento (CRM) usado pela escola, com as mesmas finalidades e o mesmo cuidado.',
    ],
    [
      'WhatsApp',
      'Os botões de WhatsApp abrem uma conversa com a escola, com uma mensagem já escrita que você pode editar antes de enviar. A conversa segue as regras do próprio WhatsApp.',
    ],
    [
      'Cookies e medição de anúncios',
      'Esta página pode usar ferramentas do Google (Google Ads, Analytics, Tag Manager) e da Meta (Pixel) para medir o resultado dos anúncios. Você pode recusar no aviso da página; a recusa vale para este navegador. Vídeos do YouTube e o mapa do Google só carregam quando você clica neles.',
    ],
    [
      'No seu aparelho',
      'Guardamos localmente a origem da visita (por 30 dias), as respostas do “Descubra seu curso” (até fechar a aba) e a sua escolha sobre cookies.',
    ],
    [
      'Seus direitos',
      `Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento, pelo WhatsApp ${ESCOLA.telefone}.`,
    ],
  ]

  return (
    <section className="bg-papel px-5 pt-32 pb-24">
      <div className="mx-auto max-w-[44rem]">
        <p className="rotulo text-azul">{ESCOLA.nome}</p>
        <h1 className="titulo-secao mt-4 text-[2.2rem] sm:text-[2.8rem]">
          Política de privacidade
        </h1>
        <div className="mt-10 grid gap-8">
          {secoes.map(([t, texto]) => (
            <div key={t}>
              <h2 className="text-[1.2rem] font-bold">{t}</h2>
              <p className="mt-2 leading-relaxed text-cinza">{texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
