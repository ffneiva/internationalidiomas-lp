import { describe, expect, it, vi } from 'vitest'

// Os testes unitários rodam com o alvo da LP; aqui o mesmo código é avaliado
// como o SITE, que é onde moram as páginas de curso, preparatórios, parcerias
// e blog — e o JSON-LD de cada uma.
vi.mock('@/lib/alvo', () => ({ ALVO: 'site' }))

type No = Record<string, unknown> & { '@type': string | string[]; '@id'?: string }
const grafo = async (path: string) => {
  const { gerarJsonLd } = await import('@/lib/seo')
  return gerarJsonLd(path)['@graph'] as No[]
}
const tipos = (g: No[]) => g.flatMap((n) => [n['@type']].flat())

describe('JSON-LD do site', () => {
  it('toda rota do site tem título, descrição e canonical no domínio da escola', async () => {
    const { ROTAS, canonicalDe, ogUrlDe, rotaDe } = await import('@/lib/routes')
    expect(ROTAS.length).toBeGreaterThan(10)
    for (const r of ROTAS) {
      expect(r.titulo.length, r.path).toBeGreaterThan(10)
      expect(canonicalDe(r)).toMatch(/^https:\/\/[^/]+/)
      expect(ogUrlDe(r)).toMatch(/og-site\.jpg/)
      expect(rotaDe(r.path).path).toBe(r.path)
    }
  })

  it('preparatórios: um Course por exame e as perguntas da página', async () => {
    const { PREPARATORIOS } = await import('@/lib/paginas-novas')
    const g = await grafo(PREPARATORIOS.path)
    const cursos = g.filter((n) => n['@type'] === 'Course')
    expect(cursos).toHaveLength(PREPARATORIOS.exames.length)
    expect(tipos(g)).toContain('FAQPage')
  })

  it('nenhum @id leva o ® (marca registrada só no texto, não no endereço)', async () => {
    const { ROTAS } = await import('@/lib/routes')
    for (const r of ROTAS) {
      for (const n of await grafo(r.path)) {
        if (n['@id']) expect(n['@id'], r.path).toMatch(/^https:\/\/[\w.:/#-]+$/)
      }
    }
  })

  it('parcerias e páginas de curso declaram as próprias perguntas', async () => {
    const { PARCERIAS } = await import('@/lib/paginas-novas')
    expect(tipos(await grafo(PARCERIAS.path))).toContain('FAQPage')
    const curso = await grafo('/in-company')
    expect(tipos(curso)).toContain('Course')
  })

  it('post do blog: BlogPosting e trilha Início › Blog › post', async () => {
    const { POSTS } = await import('@/lib/paginas-novas')
    const g = await grafo(`/blog/${POSTS[0].slug}`)
    expect(tipos(g)).toContain('BlogPosting')
    const trilha = g.find((n) => n['@type'] === 'BreadcrumbList') as unknown as {
      itemListElement: unknown[]
    }
    expect(trilha.itemListElement).toHaveLength(3)
    expect(tipos(await grafo('/blog'))).toContain('Blog')
  })
})
