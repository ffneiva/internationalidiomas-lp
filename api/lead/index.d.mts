/** Tipos da API de leads (index.mjs), para os testes em TypeScript. */
type Lead = {
  nome: string
  email: string
  whatsapp: string
  perfil: Record<string, string>
  origem: Record<string, string>
  /** LGPD: versão do texto de autorização aceito. */
  consentimentoVersao?: string
  /** LGPD: aceitou receber novidades (opcional). */
  novidades?: boolean
  /** Preenchido pela API no momento do registro. */
  consentidoEm?: string
  /** Pedido B2B: instituição que quer avaliar alunos ou colaboradores. */
  b2b?: {
    tipo: 'escola' | 'empresa'
    instituicao: string
    quantidade: number
    local: string
    cargo: string
  }
}
export type Validacao =
  | { ok: true; lead: Lead; robo?: undefined }
  | { ok: true; robo: true; lead?: undefined }
  | { ok: false; erros: string[] }
export function normalizarWhatsApp(bruto: unknown): string | null
export function validarEmail(bruto: unknown): string | null
export function validarLead(corpo: unknown): Validacao
export function formatarTelefone(whatsapp: string): string
export function montarEmail(
  lead: Lead,
  escola: string,
): { assunto: string; texto: string; html: string }
export function montarContatoIara(lead: Lead): {
  name: string
  email: string
  phone_number: string
  identifier: string
  custom_attributes: Record<string, string>
}
export function notaIara(lead: Lead): string
export function montarContatoWeSales(
  lead: Lead,
  local: string,
  etiquetas: string[],
): {
  locationId: string
  firstName: string
  lastName?: string
  name: string
  email: string
  phone: string
  companyName?: string
  tags: string[]
  source: string
}
export function notaWeSales(lead: Lead): string
export function nomeOportunidade(lead: Lead): string
export function linhasB2B(b2b: Lead['b2b']): [string, string][]
export function handler(evento: unknown): Promise<{ statusCode: number; body?: string }>
