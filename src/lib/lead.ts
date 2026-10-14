/**
 * O formulário "Prefere que a gente fale com você?" — lado do navegador.
 *
 * A validação de verdade é a da API (api/lead/index.mjs), porque o navegador
 * é do visitante. Esta aqui existe para responder na hora, no campo certo, e
 * espelha as mesmas regras — o teste confere que as duas concordam.
 */

export type Campos = { nome: string; email: string; whatsapp: string }
export type Erros = Partial<Record<keyof Campos, string>>

/** Máscara progressiva: "62998765432" → "(62) 99876-5432". */
export function mascararTelefone(bruto: string): string {
  let d = bruto.replace(/\D/g, '')
  if (d.startsWith('55') && d.length > 11) d = d.slice(2)
  d = d.slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  const ddd = d.slice(0, 2)
  const resto = d.slice(2)
  const corte = resto.length > 8 ? 5 : 4
  if (resto.length <= corte) return `(${ddd}) ${resto}`
  return `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`
}

export function validar(c: Campos): Erros {
  const e: Erros = {}
  if (c.nome.trim().length < 2) e.nome = 'Como podemos chamar você?'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email.trim())) e.email = 'Confira o e-mail.'
  const d = c.whatsapp.replace(/\D/g, '')
  const celularOk = d.length === 11 && d[2] === '9'
  if (!(celularOk || d.length === 10) || Number(d.slice(0, 2)) < 11) {
    e.whatsapp = 'Informe o WhatsApp com DDD.'
  }
  return e
}

/** Pedido B2B: a instituição que quer avaliar alunos (escola) ou colaboradores (empresa). */
export type TipoB2B = 'escola' | 'empresa'
export type CamposB2B = Campos & {
  instituicao: string
  quantidade: string
  local: string
  cargo: string
}
export type ErrosB2B = Partial<Record<keyof CamposB2B, string>>

/** As mesmas regras da API (validarB2B em api/lead/index.mjs). */
export function validarB2B(c: CamposB2B, tipo: TipoB2B): ErrosB2B {
  const e: ErrosB2B = validar(c)
  if (c.instituicao.trim().length < 2)
    e.instituicao = tipo === 'escola' ? 'Qual é a instituição?' : 'Qual é a empresa?'
  const n = Number(c.quantidade.replace(/\D/g, ''))
  if (!(n >= 1 && n <= 1_000_000))
    e.quantidade =
      tipo === 'escola' ? 'Quantos alunos, mais ou menos?' : 'Quantos colaboradores, mais ou menos?'
  if (c.local.trim().length < 2) e.local = 'Em que cidade e bairro?'
  if (c.cargo.trim().length < 2) e.cargo = 'Qual é o seu cargo?'
  return e
}

export type Envio = Campos & {
  perfil: Record<string, string>
  origem: Record<string, string>
  tempo: number
  site: string
  consentimento: true
  /** Versão do texto de autorização aceito (CONSENTIMENTO.versao). */
  consentimentoVersao: string
  /** Aceitou receber novidades (opcional, desmarcado por padrão). */
  novidades: boolean
  /** Pedido B2B (formulários de avaliação de Parcerias e In Company). */
  b2b?: { tipo: TipoB2B; instituicao: string; quantidade: string; local: string; cargo: string }
}

export type Resultado = { ok: true } | { ok: false; motivo: 'rede' | 'recusado' | 'indisponivel' }

const URL_API = import.meta.env.VITE_LEADS_URL as string | undefined

/* c8 ignore start — rede; exercitada no Playwright com a rota interceptada */
export async function enviar(dados: Envio, url = URL_API): Promise<Resultado> {
  if (!url) return { ok: false, motivo: 'indisponivel' }
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(dados),
      // Sem cookie, sem credencial: a API não precisa saber quem é.
      credentials: 'omit',
      keepalive: true,
    })
    return r.ok ? { ok: true } : { ok: false, motivo: 'recusado' }
  } catch {
    return { ok: false, motivo: 'rede' }
  }
}
/* c8 ignore stop */
