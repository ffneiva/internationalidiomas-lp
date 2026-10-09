import { describe, expect, it } from 'vitest'
import {
  formatarTelefone,
  montarContatoIara,
  montarContatoWeSales,
  montarEmail,
  normalizarWhatsApp,
  notaIara,
  notaWeSales,
  validarEmail,
  validarLead,
} from '../../api/lead/index.mjs'

const valido = {
  nome: 'Maria Souza',
  email: 'Maria@Exemplo.com',
  whatsapp: '(62) 99876-5432',
  consentimento: true,
  tempo: 9000,
  site: '',
}

describe('normalizarWhatsApp', () => {
  it.each([
    ['(62) 99876-5432', '5562998765432'],
    ['62998765432', '5562998765432'],
    ['+55 62 99876-5432', '5562998765432'],
    ['062998765432', '5562998765432'],
    ['(62) 3251-1234', '556232511234'],
  ])('%s → %s', (entrada, saida) => {
    expect(normalizarWhatsApp(entrada)).toBe(saida)
  })

  it.each([
    '',
    '9999',
    '(62) 89876-5432', // 11 dígitos sem o 9 do celular
    '(10) 99876-5432', // DDD inexistente
    '123456789012345',
    null,
    undefined,
  ])('recusa %s', (entrada) => {
    expect(normalizarWhatsApp(entrada)).toBeNull()
  })
})

describe('validarEmail', () => {
  it('normaliza caixa e espaço', () => {
    expect(validarEmail('  Ana@Site.COM.br ')).toBe('ana@site.com.br')
  })
  it.each(['ana', 'ana@', 'ana@site', 'a b@site.com', `${'a'.repeat(160)}@x.com`])(
    'recusa %s',
    (e) => {
      expect(validarEmail(e)).toBeNull()
    },
  )
})

describe('validarLead', () => {
  it('aceita o caso comum e limpa os campos', () => {
    const r = validarLead({
      ...valido,
      nome: '  Maria \n Souza ',
      perfil: { para: 'Para mim', objetivo: 'Carreira', vazio: 'x' },
      origem: { utm_source: 'google', gclid: 'abc', outro: 'ignorado' },
    })
    expect(r).toEqual({
      ok: true,
      lead: {
        nome: 'Maria Souza',
        email: 'maria@exemplo.com',
        whatsapp: '5562998765432',
        perfil: { para: 'Para mim', objetivo: 'Carreira' },
        origem: { utm_source: 'google', gclid: 'abc' },
        consentimentoVersao: 'sem-versao',
        novidades: false,
      },
    })
  })

  it('LGPD: guarda a versão do texto aceito e o opt-in de novidades', () => {
    const r = validarLead({ ...valido, consentimentoVersao: '2026-10-08', novidades: true })
    if (!r.ok || !r.lead) throw new Error('lead inválido')
    expect(r.lead.consentimentoVersao).toBe('2026-10-08')
    expect(r.lead.novidades).toBe(true)
    // "novidades" só vale com true literal: string ou 1 não contam como aceite.
    const r2 = validarLead({ ...valido, novidades: 'true' })
    if (!r2.ok || !r2.lead) throw new Error('lead inválido')
    expect(r2.lead.novidades).toBe(false)
  })

  it('LGPD: sem autorização de contato, o lead é recusado', () => {
    const r = validarLead({ ...valido, consentimento: false })
    expect(r).toEqual({ ok: false, erros: ['consentimento'] })
  })

  it('aponta cada campo inválido', () => {
    const r = validarLead({ nome: 'M', email: 'x', whatsapp: '1', consentimento: false })
    expect(r).toEqual({ ok: false, erros: ['nome', 'email', 'whatsapp', 'consentimento'] })
  })

  it('recusa corpo que não é objeto', () => {
    expect(validarLead(null)).toEqual({ ok: false, erros: ['corpo'] })
  })

  it('trata honeypot preenchido como robô', () => {
    expect(validarLead({ ...valido, site: 'http://spam' })).toEqual({ ok: true, robo: true })
  })

  it('trata envio rápido demais como robô', () => {
    expect(validarLead({ ...valido, tempo: 800 })).toEqual({ ok: true, robo: true })
  })

  it('sem o campo de tempo, não julga', () => {
    const { tempo: _t, ...semTempo } = valido
    expect(validarLead(semTempo).ok).toBe(true)
  })
})

describe('e-mail para a escola', () => {
  const r = validarLead({ ...valido, nome: 'Ana <b>Lima</b>', perfil: { para: 'Meu filho' } })
  if (!r.ok || !r.lead) throw new Error('fixture inválida')
  const email = montarEmail(r.lead, 'International Idiomas')

  it('formata o telefone', () => {
    expect(formatarTelefone('5562998765432')).toBe('(62) 99876-5432')
    expect(formatarTelefone('556232511234')).toBe('(62) 3251-1234')
  })

  it('leva o link do WhatsApp do aluno com saudação pronta', () => {
    expect(email.texto).toContain('https://wa.me/5562998765432?text=Ol%C3%A1%2C%20Ana!')
    expect(email.html).toContain('Chamar Ana no WhatsApp')
  })

  it('escapa HTML vindo do visitante', () => {
    expect(email.html).not.toContain('<b>Lima</b>')
    expect(email.html).toContain('&lt;b&gt;Lima&lt;/b&gt;')
  })

  it('mostra o perfil respondido', () => {
    expect(email.texto).toContain('Para quem: Meu filho')
  })
})

describe('contato na IAra (digi2b)', () => {
  const r = validarLead({
    ...valido,
    perfil: { para: 'É para mim', curso: 'Inter Adults' },
    origem: { utm_campaign: 'ingles-out', gclid: 'abc' },
  })
  if (!r.ok || !r.lead) throw new Error('fixture inválida')

  it('telefone em E.164 e identificador estável por telefone', () => {
    const c = montarContatoIara(r.lead)
    expect(c.phone_number).toBe('+5562998765432')
    expect(c.identifier).toBe('site-5562998765432')
    expect(c.email).toBe('maria@exemplo.com')
    expect(c.name).toBe('Maria Souza')
  })

  it('perfil e origem vão em custom_attributes', () => {
    expect(montarContatoIara(r.lead).custom_attributes).toEqual({
      origem_lead: 'site',
      perfil_para: 'É para mim',
      perfil_curso: 'Inter Adults',
      utm_campaign: 'ingles-out',
      gclid: 'abc',
    })
  })

  it('a nota interna resume o lead para a equipe', () => {
    expect(notaIara(r.lead).split('\n')).toEqual([
      'Contato pelo formulário do site.',
      'Para quem: É para mim',
      'Curso sugerido: Inter Adults',
      'Campanha: ingles-out',
    ])
  })
})

describe('contato no WeSales (HighLevel)', () => {
  const r = validarLead({
    nome: 'Ana Maria Souza',
    email: 'ana@exemplo.com',
    whatsapp: '(62) 99999-0000',
    consentimento: true,
    perfil: { curso: 'Kids' },
    origem: { utm_source: 'google', utm_campaign: 'kids-2026' },
  })
  if (!r.ok || !r.lead) throw new Error('lead de teste inválido')
  const lead = r.lead

  it('separa nome e sobrenome, telefone em E.164 e origem no source', () => {
    const c = montarContatoWeSales(lead, 'LOC123', ['lead-site'])
    expect(c).toMatchObject({
      locationId: 'LOC123',
      firstName: 'Ana',
      lastName: 'Maria Souza',
      phone: '+5562999990000',
      email: 'ana@exemplo.com',
      tags: ['lead-site'],
      source: 'Site · google',
    })
  })

  it('nome de uma palavra não manda sobrenome vazio', () => {
    expect(montarContatoWeSales({ ...lead, nome: 'Ana' }, 'L', []).lastName).toBeUndefined()
  })

  it('a nota traz o perfil e a campanha', () => {
    const n = notaWeSales(lead)
    expect(n).toContain('Kids')
    expect(n).toContain('utm_campaign: kids-2026')
  })

  it('quem aceita novidades ganha a etiqueta, e a nota registra o consentimento', () => {
    const comNovidades = { ...lead, novidades: true, consentimentoVersao: '2026-10-08' }
    expect(montarContatoWeSales(comNovidades, 'L', ['lead-site']).tags).toEqual([
      'lead-site',
      'aceita-novidades',
    ])
    expect(montarContatoWeSales({ ...lead, novidades: false }, 'L', ['lead-site']).tags).toEqual([
      'lead-site',
    ])
    expect(notaWeSales(comNovidades)).toContain('Consentimento LGPD: texto 2026-10-08')
  })

  it('o contato nunca leva token nem segredo', () => {
    expect(JSON.stringify(montarContatoWeSales(lead, 'L', []))).not.toMatch(/pit-|token|bearer/i)
  })
})
