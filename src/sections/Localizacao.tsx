import { BotaoWhatsApp } from '@/components/BotaoWhatsApp'
import { IconePino, IconeSetaDiagonal } from '@/components/Icones'
import { Foto, VideoLaco } from '@/components/Midia'
import { Reveal } from '@/components/Reveal'
import { ESCOLA, LOCALIZACAO, MAPA, rotaDaUnidade, UNIDADES } from '@/lib/business'

/**
 * 07 · Localização.
 *
 * O melhor material real que a escola tem é um vídeo de drone do trajeto: do
 * Parque Vaca Brava, pela T-10, até a fachada. Ele entra aqui como "como
 * chegar" de verdade, em laço e sem som, e só é baixado perto da tela. A foto
 * é um quadro do próprio vídeo — a fachada atual, com o logo na vitrine.
 */
export function Localizacao({
  titulo = LOCALIZACAO.titulo,
  texto = LOCALIZACAO.texto,
  cta = LOCALIZACAO.cta,
}: {
  titulo?: string
  texto?: string
  cta?: string
} = {}) {
  const e = ESCOLA.endereco
  return (
    <section id="localizacao" className="bg-papel py-20 sm:py-28">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="rotulo flex items-center gap-2 text-azul">
            <IconePino className="h-4 w-4" />
            {e.cidade} · {e.uf}
          </p>
          <h2 className="titulo-secao mt-4 text-[2.1rem] sm:text-[3rem]">{titulo}</h2>
          <p className="mt-5 max-w-[30rem] text-[1.05rem] leading-relaxed text-cinza">{texto}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {UNIDADES.map((u) => (
              <address key={u.id} className="rounded-3xl bg-white p-6 not-italic ring-1 ring-linha">
                <strong className="block text-[1.05rem]">{u.nome}</strong>
                <span className="mt-2 block text-[0.95rem] leading-relaxed text-cinza">
                  {u.rua}
                  <br />
                  {u.bairro}, {u.cidade} – {u.uf}, {u.cep}
                </span>
                <a
                  href={rotaDaUnidade(u)}
                  target="_blank"
                  rel="noopener"
                  className="mt-4 inline-flex items-center gap-1.5 font-semibold text-azul hover:underline"
                >
                  {LOCALIZACAO.rota}
                  <IconeSetaDiagonal className="h-4 w-4" />
                </a>
              </address>
            ))}
          </div>

          <BotaoWhatsApp
            origem="localizacao"
            className="botao-azul mt-8"
            complemento="Quero agendar uma visita à escola."
          >
            {cta}
          </BotaoWhatsApp>
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <VideoLaco
            arquivo="trajeto"
            poster="trajeto-inicio"
            alt="Vista aérea do Setor Bueno, a partir do Parque Vaca Brava"
            className="aspect-video rounded-3xl shadow-[0_40px_80px_-40px_rgba(6,33,79,0.55)]"
          />
          <figure className="relative z-10 -mt-16 ml-auto w-[62%] max-w-[22rem] overflow-hidden rounded-2xl bg-white p-2 shadow-xl sm:-mt-24">
            <Foto
              nome="fachada-atual"
              alt="Fachada da International Idiomas na Av. T-1"
              className="aspect-video rounded-xl"
            />
            <figcaption className="px-2 pt-2 pb-1 text-[0.78rem] font-medium text-cinza">
              A fachada, na {e.rua}
            </figcaption>
          </figure>
          {/* O mapa já vem carregado (pedido do cliente): o iframe entra com
              loading="lazy", então só baixa quando a seção se aproxima. */}
          <iframe
            src={MAPA.embed}
            title="Mapa da International Idiomas no Setor Bueno"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="mt-6 aspect-[16/8] w-full rounded-3xl border-0 bg-marinho-2"
          />
        </Reveal>
      </div>
    </section>
  )
}
