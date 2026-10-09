import { describe, expect, it } from 'vitest'
import { DEPOIMENTOS, ESCOLA, FAQ, MENSAGEM_PADRAO, PROVAS } from '@/lib/business'
import { mascararTelefone, validar } from '@/lib/lead'
import { canalDe, lerDaUrl, lerGuardada, linhaDeOrigem, resolverOrigem } from '@/lib/origem'
import { canonicalDe, NAO_ENCONTRADA, ogArquivoDe, ROTAS, rotaDe } from '@/lib/routes'
import { gerarJsonLd, gerarLlmsTxt } from '@/lib/seo'
import { linkWhatsApp } from '@/lib/whatsapp'
import { normalizarWhatsApp } from '../../api/lead/index.mjs'

function memoria() {
  const m = new Map<string, string>()
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
  }
}

describe('origem da visita', () => {
  it('lê só os parâmetros conhecidos', () => {
    expect(lerDaUrl('?utm_source=google&gclid=abc&x=1&utm_term=')).toEqual({
      utm_source: 'google',
      gclid: 'abc',
    })
  })

  it('guarda por 30 dias e só troca quando a URL traz parâmetros', () => {
    const s = memoria()
    expect(resolverOrigem('?fbclid=f1', s, 0)).toEqual({ fbclid: 'f1' })
    expect(resolverOrigem('', s, 1000)).toEqual({ fbclid: 'f1' })
    expect(resolverOrigem('?gclid=g1', s, 2000)).toEqual({ gclid: 'g1' })
    expect(resolverOrigem('', s, 2000 + 31 * 864e5)).toEqual({})
  })

  it('não quebra sem armazenamento ou com lixo guardado', () => {
    expect(resolverOrigem('?gclid=x', null, 0)).toEqual({ gclid: 'x' })
    expect(lerGuardada({ getItem: () => '{quebrado' }, 0)).toEqual({})
    const cheio = {
      getItem: () => null,
      setItem: () => {
        throw new Error('cota')
      },
    }
    expect(resolverOrigem('?gclid=x', cheio, 0)).toEqual({ gclid: 'x' })
  })

  it('identifica o canal e muda a abertura da mensagem', () => {
    expect(canalDe({ gclid: 'x' })).toBe('google')
    expect(canalDe({ utm_source: 'Instagram' })).toBe('meta')
    expect(canalDe({ fbclid: 'y' })).toBe('meta')
    expect(canalDe({ utm_source: 'newsletter' })).toBeNull()
    expect(linhaDeOrigem('google')).toContain('anúncio no Google')
    expect(linhaDeOrigem('meta')).toContain('Instagram')
    expect(linhaDeOrigem(null)).toBeNull()
    expect(MENSAGEM_PADRAO).toBe(
      'Olá! Vim pelo site e gostaria de saber mais sobre o curso de inglês da International.',
    )
  })
})

describe('formulário no navegador', () => {
  it('máscara progressiva', () => {
    expect(mascararTelefone('6')).toBe('(6')
    expect(mascararTelefone('6299')).toBe('(62) 99')
    expect(mascararTelefone('6232511234')).toBe('(62) 3251-1234')
    expect(mascararTelefone('62998765432')).toBe('(62) 99876-5432')
    expect(mascararTelefone('+55 62 99876-5432')).toBe('(62) 99876-5432')
    expect(mascararTelefone('')).toBe('')
  })

  it('valida os três campos', () => {
    expect(validar({ nome: 'Ana', email: 'ana@x.com', whatsapp: '(62) 99876-5432' })).toEqual({})
    expect(Object.keys(validar({ nome: '', email: 'x', whatsapp: '12' }))).toEqual([
      'nome',
      'email',
      'whatsapp',
    ])
  })

  it('concorda com a API sobre o que é um WhatsApp válido', () => {
    for (const t of ['(62) 99876-5432', '(62) 3251-1234', '(62) 89876-5432', '(10) 99876-5432']) {
      const navegador =
        validar({ nome: 'Ana', email: 'a@b.co', whatsapp: t }).whatsapp === undefined
      expect(navegador, t).toBe(normalizarWhatsApp(t) !== null)
    }
  })
})

describe('rotas e SEO', () => {
  it('resolve rotas, barra final, caixa e 404', () => {
    expect(rotaDe('/').path).toBe('/')
    expect(rotaDe('/Obrigado/').path).toBe('/obrigado')
    expect(rotaDe('/nada')).toBe(NAO_ENCONTRADA)
    expect(canonicalDe(ROTAS[0])).toMatch(/\/$/)
    expect(ogArquivoDe(ROTAS[0])).toBe('og.jpg')
    expect(ogArquivoDe(ROTAS[1])).toBe('og.jpg')
    expect(ogArquivoDe({ ...ROTAS[1], og: ['a', 'b'] })).toBe('og-obrigado.jpg')
  })

  it('JSON-LD: escola em toda rota, cursos e FAQ só na home, sem nota', () => {
    const home = JSON.stringify(gerarJsonLd('/'))
    expect(home).toContain('EducationalOrganization')
    expect(home).toContain('"Course"')
    expect(home).toContain('FAQPage')
    expect(home).not.toContain('aggregateRating')
    const priv = JSON.stringify(gerarJsonLd('/politica-de-privacidade'))
    expect(priv).not.toContain('FAQPage')
    expect(priv).toContain('BreadcrumbList')
    expect(JSON.stringify(gerarJsonLd('/inexistente'))).not.toContain('BreadcrumbList')
  })

  it('llms.txt traz contato e FAQ, e nenhuma prova não confirmada', () => {
    const t = gerarLlmsTxt()
    expect(t).toContain(ESCOLA.endereco.rua)
    expect(t).toContain(FAQ[0].pergunta)
    if (!PROVAS.aplicador.confirmado) expect(t).not.toContain(PROVAS.aplicador.texto)
  })

  it('link do WhatsApp é direto (wa.me), sem intermediário', () => {
    expect(linkWhatsApp('Olá!')).toBe(`https://wa.me/${ESCOLA.whatsapp}?text=Ol%C3%A1!`)
  })

  it('todo depoimento tem vídeo e foto', () => {
    for (const d of DEPOIMENTOS) {
      expect(d.youtube).toMatch(/^[\w-]{11}$/)
      expect(d.foto).toBeTruthy()
    }
  })
})
