import { type ExtrasMoldura, WhatsAppFlutuante } from '@/components/Moldura'
import { BLOG, PARCERIAS, PREPARATORIOS, postDe } from '@/lib/paginas-novas'
import { HOME_SITE, PAGINAS_CURSO, SOBRE } from '@/lib/site'
import { ArtigoBlog, BlogIndice } from '@/pages/site/Blog'
import { HomeSite } from '@/pages/site/HomeSite'
import { PaginaCurso } from '@/pages/site/PaginaCurso'
import { Parcerias } from '@/pages/site/Parcerias'
import { Preparatorios } from '@/pages/site/Preparatorios'
import { Sobre } from '@/pages/site/Sobre'

/** As páginas próprias do SITE institucional (ver o comentário em lp.tsx). */
export function Conteudo({ caminho, aoEnviar }: { caminho: string; aoEnviar: () => void }) {
  if (caminho === '/') return <HomeSite aoEnviar={aoEnviar} />
  if (caminho === SOBRE.path) return <Sobre aoEnviar={aoEnviar} />
  if (caminho === PREPARATORIOS.path) return <Preparatorios aoEnviar={aoEnviar} />
  if (caminho === PARCERIAS.path) return <Parcerias aoEnviar={aoEnviar} />
  if (caminho === BLOG.path) return <BlogIndice aoEnviar={aoEnviar} />
  const post = postDe(caminho)
  if (post) return <ArtigoBlog key={post.slug} post={post} aoEnviar={aoEnviar} />
  const curso = PAGINAS_CURSO.find((c) => c.path === caminho)
  return curso ? <PaginaCurso key={curso.path} curso={curso} aoEnviar={aoEnviar} /> : null
}

export const Fixo = WhatsAppFlutuante

/** No site, toda página abre num herói escuro: o topo começa transparente. */
export const TOPO_SOLIDO = false

/** Menu, unidades e aviso de marcas — topo e rodapé do site. */
export const EXTRAS: ExtrasMoldura | undefined = {
  menu: [
    { path: SOBRE.path, rotulo: 'Sobre a Inter' },
    ...PAGINAS_CURSO.map((c) => ({ path: c.path, rotulo: c.rotulo, grupo: 'Cursos' })),
    { path: PREPARATORIOS.path, rotulo: PREPARATORIOS.rotulo },
    { path: PARCERIAS.path, rotulo: PARCERIAS.rotulo },
    { path: BLOG.path, rotulo: BLOG.rotulo },
  ],
  unidades: SOBRE.unidades,
  avisoMarcas: HOME_SITE.certificacoes.aviso,
}
