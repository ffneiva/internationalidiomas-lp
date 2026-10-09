import { ALVO } from './alvo.ts'
import { SITE_URL } from './business.ts'
import { BLOG, PARCERIAS, POSTS, PREPARATORIOS } from './paginas-novas.ts'
import { HOME_SITE, PAGINAS_CURSO, SOBRE } from './site.ts'

/**
 * As rotas e o `<head>` de cada uma.
 *
 * Importado dos dois lados: pelo React e pelo vite.config.ts, que gera um HTML
 * estático por rota. Por isso não toca em `window` nem importa nada de DOM.
 *
 * Mais landing pages (espanhol, kids, preparatórios) entram aqui como rotas
 * novas, cada uma com o seu `<head>` e a sua arte de compartilhamento.
 */
export type Rota = {
  path: string
  rotulo: string
  titulo: string
  descricao: string
  noindex?: boolean
  /** As duas linhas grandes da arte de compartilhamento. */
  og?: readonly [string, string]
  ogNota?: string
}

const ROTAS_LP: Rota[] = [
  {
    path: '/',
    rotulo: 'Curso de inglês',
    titulo: 'Curso de inglês em Goiânia · International Idiomas, Setor Bueno',
    descricao:
      'Curso de inglês para crianças, adolescentes e adultos no Setor Bueno, em Goiânia. Ensino personalizado, do iniciante ao avançado, com preparação para TOEIC, TOEFL e IELTS. Fale pelo WhatsApp.',
    og: ['Aprenda inglês para usar', 'de verdade.'],
    ogNota: 'Curso de inglês · Setor Bueno, Goiânia',
  },
  {
    path: '/obrigado',
    rotulo: 'Contato recebido',
    titulo: 'Contato recebido · International Idiomas',
    descricao: 'Recebemos seu contato. A equipe da International vai chamar você no WhatsApp.',
    // Página de conversão: fora do índice, e é por ela que o anúncio mede.
    noindex: true,
  },
  {
    path: '/politica-de-privacidade',
    rotulo: 'Privacidade',
    titulo: 'Política de privacidade · International Idiomas',
    descricao:
      'Como a International Idiomas trata dados no site: o formulário de contato, o WhatsApp e a medição de anúncios.',
  },
]

/** As páginas comuns aos dois produtos. */
const OBRIGADO_E_PRIVACIDADE = ROTAS_LP.filter((r) => r.path !== '/')

/**
 * O site institucional — MESMOS endereços do WordPress de hoje (/kids,
 * /teens, /sobre-a-inter…), sem a barra final. Quem chega de um link antigo
 * ou do Google cai na página nova certa, e a CloudFront Function tira a
 * barra com 301 (ver aws-setup.sh).
 */
const rotasSite = (): Rota[] => [
  {
    path: '/',
    rotulo: 'Início',
    titulo: HOME_SITE.seo.titulo,
    descricao: HOME_SITE.seo.descricao,
    og: ['Aprenda inglês em Goiânia', 'e amplie suas oportunidades.'],
    ogNota: 'International Idiomas · Setor Bueno, Goiânia',
  },
  {
    path: SOBRE.path,
    rotulo: 'Sobre a Inter',
    titulo: SOBRE.seo.titulo,
    descricao: SOBRE.seo.descricao,
  },
  ...PAGINAS_CURSO.map((c) => ({
    path: c.path,
    rotulo: c.rotulo,
    titulo: c.seo.titulo,
    descricao: c.seo.descricao,
  })),
  // Páginas pedidas pela escola em 08/10/2026.
  {
    path: PREPARATORIOS.path,
    rotulo: PREPARATORIOS.rotulo,
    titulo: PREPARATORIOS.seo.titulo,
    descricao: PREPARATORIOS.seo.descricao,
  },
  {
    path: PARCERIAS.path,
    rotulo: PARCERIAS.rotulo,
    titulo: PARCERIAS.seo.titulo,
    descricao: PARCERIAS.seo.descricao,
  },
  { path: BLOG.path, rotulo: BLOG.rotulo, titulo: BLOG.seo.titulo, descricao: BLOG.seo.descricao },
  ...POSTS.map((p) => ({
    path: `${BLOG.path}/${p.slug}`,
    rotulo: p.titulo,
    titulo: `${p.titulo} | International`,
    descricao: p.resumo,
  })),
  ...OBRIGADO_E_PRIVACIDADE,
]

// Função, e não constante: no build da LP, o ramo do site some inteiro — e,
// com ele, o conteúdo do site (site.ts) sai do bundle.
export const ROTAS: Rota[] = ALVO === 'site' ? rotasSite() : ROTAS_LP

/**
 * Endereço inexistente — servido como 404 de verdade (ver aws-setup.sh).
 * `noindex` evita o *soft 404*: uma URL errada devolvendo a home com 200.
 */
export const NAO_ENCONTRADA: Rota = {
  path: '/404',
  rotulo: 'Não encontrada',
  titulo: 'Página não encontrada · International Idiomas',
  descricao: 'Este endereço não existe.',
  noindex: true,
}

function limpar(pathname: string): string {
  return pathname.replace(/\/+$/, '').toLowerCase() || '/'
}

export function rotaDe(pathname: string): Rota {
  return ROTAS.find((r) => r.path === limpar(pathname)) ?? NAO_ENCONTRADA
}

export function canonicalDe(rota: Rota): string {
  return rota.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${rota.path}`
}

/** Arquivo da arte de compartilhamento — o mesmo no gerador e no `<head>`. */
export function ogArquivoDe(rota: Rota): string {
  // Os dois produtos dividem a pasta public/: a arte da home do site tem nome
  // próprio para não sobrescrever a da LP.
  const base = ALVO === 'site' ? 'og-site' : 'og'
  if (!rota.og || rota.path === '/') return `${base}.jpg`
  return `${base}-${rota.path.replace(/^\//, '').replace(/\//g, '-')}.jpg`
}

export function ogUrlDe(rota: Rota): string {
  return `${SITE_URL}/${ogArquivoDe(rota)}`
}
