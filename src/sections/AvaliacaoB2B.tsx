import { FormularioB2B } from '@/components/FormularioB2B'
import { IconeCheck } from '@/components/Icones'
import { Reveal } from '@/components/Reveal'
import type { TipoB2B } from '@/lib/lead'
import { AVALIACAO_B2B } from '@/lib/paginas-novas'

/**
 * O contêiner direcionado de cada pedido B2B (escola, 09/10/2026): de um lado
 * o que a instituição contrata, do outro o formulário com os dados que o CRM
 * precisa. Parcerias → avaliar alunos; In Company → avaliar colaboradores.
 */
export function AvaliacaoB2B({ tipo, aoEnviar }: { tipo: TipoB2B; aoEnviar: () => void }) {
  const a = AVALIACAO_B2B[tipo]
  const inicio = a.titulo.slice(0, a.titulo.length - a.destaque.length).trim()
  return (
    <section
      id={a.id}
      data-tema="escuro"
      className="scroll-mt-24 bg-noite py-20 text-white sm:py-28"
    >
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="rotulo text-marca">{a.sobretitulo}</p>
          <h2 className="titulo-largo mt-4 text-[2.3rem] sm:text-[3.2rem]">
            {inicio} <span className="marca-texto marca-cheia">{a.destaque}</span>
          </h2>
          <p className="mt-6 max-w-[34rem] text-[1.05rem] leading-relaxed text-nevoa">{a.texto}</p>
          <ul className="mt-8 grid gap-3.5">
            {a.pontos.map((p) => (
              <li key={p} className="flex gap-3 leading-relaxed">
                <IconeCheck className="mt-1 h-5 w-5 shrink-0 text-marca" />
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="rounded-[2rem] bg-white p-6 text-tinta sm:p-9">
          <p className="titulo-secao text-[1.5rem]">{a.tituloFormulario}</p>
          <p className="mt-2 mb-6 text-sm leading-relaxed text-cinza">{a.textoFormulario}</p>
          <FormularioB2B tipo={tipo} aoEnviar={aoEnviar} />
        </Reveal>
      </div>
    </section>
  )
}
