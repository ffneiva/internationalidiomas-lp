import { BotaoWhatsApp } from '@/components/BotaoWhatsApp'
import { IconeSeta } from '@/components/Icones'
import { Horizonte } from '@/components/Logo'
import { Reveal } from '@/components/Reveal'
import { BLOG, POSTS, type Post } from '@/lib/paginas-novas'
import { Fecho } from '@/sections/Fecho'

/**
 * O blog: /blog lista os posts; /blog/<slug> é cada um, com o seu `<head>`,
 * o seu JSON-LD (BlogPosting) e o HTML completo pré-renderizado — texto que o
 * Google lê sem executar JavaScript. Os posts moram em lib/paginas-novas.ts.
 */
const dataBR = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

function TopoBlog({
  titulo,
  destaque,
  subtitulo,
  trilha,
}: {
  titulo: string
  destaque?: string
  subtitulo?: string
  trilha: { rotulo: string; path?: string }[]
}) {
  const inicio = destaque ? titulo.slice(0, titulo.length - destaque.length).trim() : titulo
  return (
    <section
      data-tema="escuro"
      className="relative isolate overflow-hidden bg-marinho pt-32 pb-16 text-white sm:pt-40 sm:pb-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Horizonte className="absolute right-0 bottom-0 left-0 opacity-[0.12]" />
      </div>
      <div className="container-x">
        <nav aria-label="Trilha" className="rotulo text-[0.66rem] text-nevoa">
          {trilha.map((t, i) => (
            <span key={t.rotulo}>
              {i > 0 && ' / '}
              {t.path ? (
                <a href={t.path} className="hover:text-white">
                  {t.rotulo}
                </a>
              ) : (
                <span className="text-white">{t.rotulo}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="titulo-largo mt-8 max-w-[56rem] text-[2.3rem] sm:text-[3.4rem] lg:text-[4rem]">
          {inicio}{' '}
          {destaque && <span className="marca-texto marca-cheia marca-heroi">{destaque}</span>}
        </h1>
        {subtitulo && (
          <p className="mt-6 max-w-[40rem] text-[1.1rem] leading-relaxed text-nevoa">{subtitulo}</p>
        )}
      </div>
    </section>
  )
}

export function BlogIndice({ aoEnviar }: { aoEnviar: () => void }) {
  return (
    <>
      <TopoBlog
        titulo={BLOG.titulo}
        destaque={BLOG.destaque}
        subtitulo={BLOG.subtitulo}
        trilha={[{ rotulo: 'Início', path: '/' }, { rotulo: 'Blog' }]}
      />
      <section className="bg-papel py-16 sm:py-24">
        <div className="container-x">
          <ul className="grid gap-5 md:grid-cols-2">
            {POSTS.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 0.05}>
                <a
                  href={`/blog/${p.slug}`}
                  className="group flex h-full flex-col rounded-[1.75rem] bg-white p-7 ring-1 ring-linha transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(37,55,106,0.45)] sm:p-9"
                >
                  <p className="rotulo text-azul">
                    {p.categoria} · {p.minutos} min de leitura
                  </p>
                  <h2 className="titulo-secao mt-4 text-[1.5rem] leading-snug sm:text-[1.75rem]">
                    {p.titulo}
                  </h2>
                  <p className="mt-4 flex-1 leading-relaxed text-cinza">{p.resumo}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-semibold text-azul">
                    Ler o artigo
                    <IconeSeta className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1.5" />
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <Fecho aoEnviar={aoEnviar} />
    </>
  )
}

export function ArtigoBlog({ post, aoEnviar }: { post: Post; aoEnviar: () => void }) {
  const outros = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2)
  return (
    <>
      <TopoBlog
        titulo={post.titulo}
        trilha={[
          { rotulo: 'Início', path: '/' },
          { rotulo: 'Blog', path: '/blog' },
          { rotulo: post.categoria },
        ]}
      />
      <article className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[44rem] px-5">
          <p className="rotulo text-azul">
            <time dateTime={post.data}>{dataBR(post.data)}</time> · {post.minutos} min de leitura ·
            Equipe International
          </p>
          <p className="mt-6 text-[1.2rem] leading-relaxed font-medium text-tinta">{post.resumo}</p>
          <div className="mt-8 grid gap-6 text-[1.06rem] leading-[1.75] text-cinza">
            {post.blocos.map((b, i) => {
              const chave = `${post.slug}-${i}`
              if (b.tipo === 'h2')
                return (
                  <h2 key={chave} className="titulo-secao mt-4 text-[1.6rem] text-tinta">
                    {b.texto}
                  </h2>
                )
              if (b.tipo === 'lista')
                return (
                  <ul key={chave} className="grid list-disc gap-2 pl-6 marker:text-azul">
                    {b.itens.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                )
              if (b.tipo === 'cta')
                return (
                  <a
                    key={chave}
                    href={b.path}
                    className="group mt-2 flex items-center justify-between gap-4 rounded-2xl bg-papel p-5 font-semibold text-azul ring-1 ring-linha hover:bg-white"
                  >
                    {b.texto}
                    <IconeSeta className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                  </a>
                )
              return <p key={chave}>{b.texto}</p>
            })}
          </div>
          <div className="mt-12 rounded-3xl bg-marinho p-7 text-white sm:p-9" data-tema="escuro">
            <p className="titulo-secao text-[1.5rem]">Ficou com alguma dúvida?</p>
            <p className="mt-3 leading-relaxed text-nevoa">
              A equipe da International responde pelo WhatsApp.
            </p>
            <BotaoWhatsApp
              origem={`blog-${post.slug}`}
              complemento={`Li o artigo “${post.titulo}” e tenho uma dúvida.`}
              className="botao-marca mt-6"
            >
              Falar com a equipe
            </BotaoWhatsApp>
          </div>
          {outros.length > 0 && (
            <nav aria-label="Outros artigos" className="mt-14">
              <p className="rotulo text-azul">Leia também</p>
              <ul className="mt-4 grid gap-3">
                {outros.map((o) => (
                  <li key={o.slug}>
                    <a
                      href={`/blog/${o.slug}`}
                      className="font-semibold text-tinta hover:text-azul"
                    >
                      {o.titulo}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </article>
      <Fecho aoEnviar={aoEnviar} />
    </>
  )
}
