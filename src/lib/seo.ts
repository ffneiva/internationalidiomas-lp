import { ALVO } from './alvo.ts'
import {
  CURSOS,
  ESCOLA,
  EXAMES,
  FAQ,
  FASES,
  HEROI,
  MENSAGEM_PADRAO,
  PROVAS,
  SITE_URL,
  UNIDADES,
} from './business.ts'
import { BLOG, PARCERIAS, POSTS, PREPARATORIOS, postDe } from './paginas-novas.ts'
import { canonicalDe, ROTAS } from './routes.ts'
import { PAGINAS_CURSO } from './site.ts'
import { linkWhatsApp } from './whatsapp.ts'

/**
 * Dados estruturados (JSON-LD) e llms.txt — ambos derivados de business.ts.
 *
 * A escola é `LanguageSchool`... que não existe no schema.org. O tipo certo é
 * `EducationalOrganization` + `LocalBusiness` (o segundo é o que o Google usa
 * para o painel com endereço e telefone). Cada programa é um `Course`.
 *
 * Nenhum `aggregateRating`: nota autodeclarada o Google não mostra e pode
 * punir — e a nota do briefing ainda não foi confirmada (PROVAS.google).
 */
const ID_ESCOLA = `${SITE_URL}/#escola`

function noDaEscola() {
  const e = ESCOLA.endereco
  return {
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': ID_ESCOLA,
    name: ESCOLA.nome,
    alternateName: ESCOLA.curto,
    slogan: ESCOLA.lema,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/icon-512.png`,
    image: `${SITE_URL}/og.jpg`,
    telephone: `+${ESCOLA.whatsapp}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${e.rua}, ${e.complemento}`,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      postalCode: e.cep,
      addressCountry: 'BR',
    },
    areaServed: UNIDADES.map((u) => ({ '@type': 'City', name: `${u.cidade} - ${u.uf}` })),
    // A segunda unidade (Trindade) como filial: o Google entende as duas.
    department: UNIDADES.slice(1).map((u) => ({
      '@type': ['EducationalOrganization', 'LocalBusiness'],
      name: `${ESCOLA.nome} · ${u.nome}`,
      telephone: `+${ESCOLA.whatsapp}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: u.rua,
        addressLocality: u.cidade,
        addressRegion: u.uf,
        postalCode: u.cep,
        addressCountry: 'BR',
      },
    })),
    knowsLanguage: ['pt-BR', 'en'],
    sameAs: [
      `https://www.instagram.com/${ESCOLA.instagram}/`,
      ESCOLA.youtube,
      ESCOLA.facebook,
      ESCOLA.linkedin,
    ],
  }
}

function nosDosCursos() {
  return FASES.map((id) => {
    const c = CURSOS[id]
    return {
      '@type': 'Course',
      '@id': `${SITE_URL}/#curso-${id}`,
      name: `${c.nome} — ${c.para}`,
      description: c.texto,
      inLanguage: 'en',
      provider: { '@id': ID_ESCOLA },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'onsite',
        location: { '@id': ID_ESCOLA },
      },
    }
  })
}

function noDoFaq() {
  return {
    '@type': 'FAQPage',
    mainEntity: FAQ.map((p) => ({
      '@type': 'Question',
      name: p.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: p.resposta },
    })),
  }
}

function trilha(path: string) {
  const rota = ROTAS.find((r) => r.path === path)
  if (!rota || path === '/') return null
  // Post do blog: Início › Blog › post.
  const blog = ALVO === 'site' && path.startsWith(`${BLOG.path}/`)
  const meio = blog
    ? [{ '@type': 'ListItem', position: 2, name: BLOG.rotulo, item: `${SITE_URL}${BLOG.path}` }]
    : []
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
      ...meio,
      {
        '@type': 'ListItem',
        position: meio.length + 2,
        name: rota.rotulo,
        item: canonicalDe(rota),
      },
    ],
  }
}

function faq(itens: readonly { pergunta: string; resposta: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: itens.map((p) => ({
      '@type': 'Question',
      name: p.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: p.resposta },
    })),
  }
}

/** As páginas novas do site (08/10/2026): o que cada uma mostra, para o Google. */
function nosDasPaginasNovas(path: string): Record<string, unknown>[] {
  if (ALVO !== 'site') return []
  if (path === PREPARATORIOS.path) {
    return [
      ...PREPARATORIOS.exames.map((x) => ({
        '@type': 'Course',
        '@id': `${SITE_URL}${PREPARATORIOS.path}#${x.sigla.toLowerCase().replace(/[^a-z0-9]+/g, '')}`,
        name: `Preparatório ${x.sigla}`,
        description: x.oQue,
        provider: { '@id': ID_ESCOLA },
      })),
      faq(PREPARATORIOS.perguntas),
    ]
  }
  if (path === PARCERIAS.path) return [faq(PARCERIAS.perguntas)]
  const post = postDe(path)
  if (post) {
    return [
      {
        '@type': 'BlogPosting',
        '@id': `${SITE_URL}${path}#artigo`,
        headline: post.titulo,
        description: post.resumo,
        datePublished: post.data,
        dateModified: post.data,
        inLanguage: 'pt-BR',
        articleSection: post.categoria,
        mainEntityOfPage: `${SITE_URL}${path}`,
        author: { '@type': 'Organization', name: `Equipe ${ESCOLA.nome}`, url: `${SITE_URL}/` },
        publisher: { '@id': ID_ESCOLA },
        image: `${SITE_URL}/og-site.jpg`,
      },
    ]
  }
  if (path === BLOG.path) {
    return [
      {
        '@type': 'Blog',
        '@id': `${SITE_URL}${BLOG.path}#blog`,
        name: BLOG.titulo,
        publisher: { '@id': ID_ESCOLA },
        blogPost: POSTS.map((p) => ({
          '@type': 'BlogPosting',
          headline: p.titulo,
          url: `${SITE_URL}${BLOG.path}/${p.slug}`,
          datePublished: p.data,
        })),
      },
    ]
  }
  return []
}

/** O grafo de uma rota. Cada página só declara o que mostra. */
export function gerarJsonLd(path = '/') {
  const grafo: Record<string, unknown>[] = [noDaEscola()]
  if (path === '/') grafo.push(...nosDosCursos(), noDoFaq())
  // Site: cada página de curso declara o seu Course e as suas perguntas.
  const curso = ALVO === 'site' ? PAGINAS_CURSO.find((c) => c.path === path) : undefined
  if (curso) {
    grafo.push({
      '@type': 'Course',
      '@id': `${SITE_URL}${curso.path}#curso`,
      name: `${curso.nome} — ${curso.titulo}`,
      description: curso.subtitulo,
      provider: { '@id': ID_ESCOLA },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'onsite',
        location: { '@id': ID_ESCOLA },
      },
    })
    if (curso.perguntas.length) {
      grafo.push({
        '@type': 'FAQPage',
        mainEntity: curso.perguntas.map((p) => ({
          '@type': 'Question',
          name: p.pergunta,
          acceptedAnswer: { '@type': 'Answer', text: p.resposta },
        })),
      })
    }
  }
  grafo.push(...nosDasPaginasNovas(path))
  const b = trilha(path)
  if (b) grafo.push(b)
  return { '@context': 'https://schema.org', '@graph': grafo }
}

/** llms.txt — a página resumida para assistentes de IA. */
export function gerarLlmsTxt(): string {
  const e = ESCOLA.endereco
  const l: string[] = [
    `# ${ESCOLA.nome}`,
    '',
    `> ${HEROI.sobretitulo}. ${HEROI.titulo} ${HEROI.destaque} ${HEROI.subtitulo}`,
    '',
    '## Contato',
    '',
    `- Endereço: ${e.rua}, ${e.complemento} – ${e.bairro}, ${e.cidade} – ${e.uf}, ${e.cep}`,
    `- WhatsApp: ${ESCOLA.telefone} (${linkWhatsApp(MENSAGEM_PADRAO)})`,
    `- Instagram: @${ESCOLA.instagram}`,
    '',
    '## Cursos',
    '',
    ...FASES.map((id) => `- ${CURSOS[id].nome} (${CURSOS[id].para}): ${CURSOS[id].texto}`),
    '',
    '## Preparação para certificações',
    '',
    ...EXAMES.map((x) => `- ${x.sigla} — ${x.para}`),
  ]
  if (PROVAS.aplicador.confirmado) l.push(`- ${PROVAS.aplicador.texto}`)
  l.push('', '## Perguntas frequentes', '')
  for (const p of FAQ) l.push(`**${p.pergunta}**`, p.resposta, '')
  return `${l.join('\n').trim()}\n`
}
