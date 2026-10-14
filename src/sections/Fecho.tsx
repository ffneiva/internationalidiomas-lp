import { BotaoWhatsApp } from '@/components/BotaoWhatsApp'
import { Formulario } from '@/components/Formulario'
import { Globo } from '@/components/Logo'
import { Perguntas } from '@/components/Perguntas'
import { Marca, Reveal } from '@/components/Reveal'
import { FAQ, FECHO } from '@/lib/business'

/**
 * 08 · CTA final — as duas portas lado a lado: o WhatsApp (principal) e o
 * formulário (para quem prefere ser chamado).
 */
type PropsFecho = {
  aoEnviar: () => void
  titulo?: string
  destaque?: string
  texto?: string
  cta?: string
}

export function Fecho({
  aoEnviar,
  titulo = 'Seu próximo passo no inglês',
  destaque = 'começa aqui.',
  texto = FECHO.texto,
  cta = FECHO.cta,
}: PropsFecho) {
  return (
    <section
      id="contato"
      data-tema="escuro"
      className="relative isolate overflow-hidden bg-marinho py-20 text-white sm:py-28"
    >
      <Globo className="pointer-events-none absolute -bottom-24 -left-24 -z-10 h-[34rem] max-w-none opacity-[0.05]" />
      <div className="container-x grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <Reveal>
          <h2 className="titulo-largo text-[2.4rem] sm:text-[3.4rem]">
            {titulo} <Marca className="marca-cheia">{destaque}</Marca>
          </h2>
          <p className="mt-6 max-w-[32rem] text-[1.12rem] leading-relaxed text-nevoa">{texto}</p>
          <BotaoWhatsApp origem="fecho" className="botao-marca mt-9 min-h-14 px-7 text-[1.02rem]">
            {cta}
          </BotaoWhatsApp>
          <p className="mt-3 text-sm text-nevoa">{FECHO.nota}</p>
        </Reveal>

        <Reveal delay={0.1} className="rounded-[1.75rem] bg-white p-6 text-tinta sm:p-8">
          <h3 className="titulo-secao text-[1.5rem]">{FECHO.formTitulo}</h3>
          <p className="mt-2 mb-6 text-cinza">{FECHO.formTexto}</p>
          <Formulario aoEnviar={aoEnviar} />
        </Reveal>
      </div>
    </section>
  )
}

export function SecaoPerguntas() {
  return (
    <section id="perguntas" className="bg-white py-20 sm:py-28">
      <div className="container-x grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <Reveal>
          <h2 className="titulo-secao text-[2.1rem] sm:text-[2.6rem]">Perguntas frequentes</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <Perguntas itens={FAQ} />
        </Reveal>
      </div>
    </section>
  )
}
