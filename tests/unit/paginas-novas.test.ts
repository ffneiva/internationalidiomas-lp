import { describe, expect, it } from 'vitest'
import { IDIOMAS, IDIOMAS_DO_CURSO, idiomasDaPagina } from '@/lib/business'
import { BLOG, PARCERIAS, POSTS, PREPARATORIOS, PROVAS_TODAS, postDe } from '@/lib/paginas-novas'

/** Conteúdo das páginas pedidas pela escola em 08/10/2026. */
describe('idiomas por curso', () => {
  it('todo curso tem idiomas, e todo idioma tem nome', () => {
    for (const [curso, lista] of Object.entries(IDIOMAS_DO_CURSO)) {
      expect(lista.length, curso).toBeGreaterThan(0)
      for (const i of lista) expect(IDIOMAS[i].nome).toBeTruthy()
    }
  })
  it('cada página de curso do site acha os idiomas; página que não é curso, não', () => {
    for (const p of ['/kids', '/teens', '/high-school', '/inter-adults', '/in-company']) {
      expect(idiomasDaPagina(p), p).not.toBeNull()
    }
    expect(idiomasDaPagina('/blog')).toBeNull()
  })
})

describe('páginas novas', () => {
  it('títulos de SEO cabem no resultado do Google e descrições têm tamanho de snippet', () => {
    for (const seo of [PREPARATORIOS.seo, PARCERIAS.seo, BLOG.seo]) {
      expect(seo.titulo.length).toBeLessThanOrEqual(70)
      expect(seo.descricao.length).toBeGreaterThan(80)
      expect(seo.descricao.length).toBeLessThanOrEqual(170)
    }
  })

  it('nenhuma página nova publica preço, prazo de nota ou promessa', () => {
    const tudo = JSON.stringify([PREPARATORIOS, PARCERIAS, POSTS])
    expect(tudo).not.toMatch(/R\$\s?\d|garantimos|garantia de aprova|100%/i)
  })

  it('a página de provas não oferece TOEFL iBT como prova aplicada na escola', () => {
    const nomes = PROVAS_TODAS.map((o) => o.nome)
    expect(nomes.some((n) => /iBT/i.test(n))).toBe(false)
    expect(PREPARATORIOS.provas.aviso).toMatch(/iBT não é aplicado/)
  })

  it('toda prova tem ficha, e o TFI (francês) está na lista', () => {
    for (const o of PROVAS_TODAS) expect(o.ficha.length, o.id).toBeGreaterThan(0)
    expect(PROVAS_TODAS.some((o) => o.id === 'tfi')).toBe(true)
  })

  it('o fornecedor das provas não aparece em lugar nenhum do site (pedido da escola)', () => {
    const arquivos = import.meta.glob(['/src/**/*', '/index.html'], {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>
    expect(Object.keys(arquivos).length).toBeGreaterThan(20)
    for (const [nome, texto] of Object.entries(arquivos))
      expect(texto, nome).not.toMatch(/up\s?language/i)
  })
})

describe('blog', () => {
  it('slugs únicos, em minúsculas, sem acento', () => {
    const slugs = POSTS.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/)
  })
  it('cada post tem título, resumo, data ISO e corpo; e o endereço acha o post', () => {
    for (const p of POSTS) {
      expect(p.titulo.length).toBeGreaterThan(20)
      expect(p.resumo.length).toBeGreaterThan(40)
      expect(p.data).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(p.blocos.length).toBeGreaterThan(3)
      expect(postDe(`/blog/${p.slug}`)?.slug).toBe(p.slug)
    }
    expect(postDe('/blog/nao-existe')).toBeUndefined()
  })
  it('links internos dos posts apontam para páginas que existem', () => {
    const existentes = new Set([
      '/',
      '/kids',
      '/teens',
      '/high-school',
      '/inter-adults',
      '/in-company',
      PREPARATORIOS.path,
      PARCERIAS.path,
    ])
    for (const p of POSTS)
      for (const b of p.blocos)
        if (b.tipo === 'cta') expect(existentes.has(b.path), b.path).toBe(true)
  })
})

describe('marca registrada da ETS (escola, 09/10/2026)', () => {
  it('TOEFL, TOEIC e TFI aparecem sempre com ® no texto do site', () => {
    const arquivos = import.meta.glob(
      ['/src/lib/*.ts', '/src/pages/**/*.tsx', '/src/sections/*.tsx'],
      {
        query: '?raw',
        import: 'default',
        eager: true,
      },
    ) as Record<string, string>
    for (const [nome, texto] of Object.entries(arquivos)) {
      const sem = texto
        .split('\n')
        .filter((l) => !/^\s*(import|\*|\/\/|\/\*)/.test(l))
        .join('\n')
        .match(/\b(TOEFL|TOEIC|TFI)\b(?![®\w])/g)
      expect(sem, nome).toBeNull()
    }
  })
})

describe('validação B2B no navegador', () => {
  it('espelha a API: instituição, quantidade, local e cargo obrigatórios', async () => {
    const { validarB2B } = await import('@/lib/lead')
    const vazio = {
      nome: '',
      email: '',
      whatsapp: '',
      instituicao: '',
      quantidade: '',
      local: '',
      cargo: '',
    }
    expect(Object.keys(validarB2B(vazio, 'escola')).sort()).toEqual(
      ['cargo', 'email', 'instituicao', 'local', 'nome', 'quantidade', 'whatsapp'].sort(),
    )
    const ok = {
      nome: 'Ana Lima',
      email: 'ana@colegio.com.br',
      whatsapp: '(62) 99876-5432',
      instituicao: 'Colégio',
      quantidade: '300',
      local: 'Goiânia',
      cargo: 'Diretora',
    }
    expect(validarB2B(ok, 'empresa')).toEqual({})
  })
})
