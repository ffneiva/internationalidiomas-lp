/**
 * De onde a pessoa veio — UTM e identificadores de clique.
 *
 * O tráfego desta página é pago (Google Ads e Meta Ads), e a conversão
 * principal acontece FORA dela, numa conversa de WhatsApp. Sem isto, a escola
 * recebe uma mensagem e não sabe qual campanha a trouxe. Duas saídas:
 *
 *   · o formulário envia a origem completa, e ela chega no e-mail do lead;
 *   · a mensagem do WhatsApp ganha uma linha no fim dizendo o canal ("Vim
 *     por um anúncio no Google") — é o que a atendente consegue anotar.
 *
 * A origem fica guardada por 30 dias no aparelho (a pessoa clica no anúncio
 * hoje e volta pelo favorito amanhã). Uma visita nova COM parâmetros substitui
 * a anterior; sem parâmetros, mantém. Tudo aqui é função pura sobre strings e
 * um `Storage` injetado, para ser testável sem navegador.
 */

const CHAVES = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
] as const

export type Origem = Partial<Record<(typeof CHAVES)[number], string>>

const CHAVE_STORAGE = 'inter-origem'
const TRINTA_DIAS = 30 * 24 * 60 * 60 * 1000

export function lerDaUrl(search: string): Origem {
  const p = new URLSearchParams(search)
  const o: Origem = {}
  for (const c of CHAVES) {
    const v = p.get(c)?.trim().slice(0, 300)
    if (v) o[c] = v
  }
  return o
}

type Guardado = { origem: Origem; em: number }

/** Lê a origem guardada, se ainda estiver no prazo. Nunca lança. */
export function lerGuardada(storage: Pick<Storage, 'getItem'> | null, agora: number): Origem {
  try {
    const bruto = storage?.getItem(CHAVE_STORAGE)
    if (!bruto) return {}
    const g = JSON.parse(bruto) as Guardado
    if (typeof g?.em !== 'number' || agora - g.em > TRINTA_DIAS) return {}
    return g.origem ?? {}
  } catch {
    return {}
  }
}

/**
 * Resolve a origem da visita atual e a grava. Aba anônima, cota cheia ou
 * armazenamento bloqueado não quebram nada: a origem só não persiste.
 */
export function resolverOrigem(
  search: string,
  storage: Pick<Storage, 'getItem' | 'setItem'> | null,
  agora: number,
): Origem {
  const daUrl = lerDaUrl(search)
  if (Object.keys(daUrl).length === 0) return lerGuardada(storage, agora)
  try {
    storage?.setItem(CHAVE_STORAGE, JSON.stringify({ origem: daUrl, em: agora } satisfies Guardado))
  } catch {
    /* sem persistência — a visita atual continua atribuída */
  }
  return daUrl
}

export type Canal = 'google' | 'meta' | null

export function canalDe(o: Origem): Canal {
  const fonte = (o.utm_source ?? '').toLowerCase()
  if (o.gclid || o.gbraid || o.wbraid || /google|adwords|gads/.test(fonte)) return 'google'
  if (o.fbclid || /facebook|instagram|meta|^fb$|^ig$/.test(fonte)) return 'meta'
  return null
}

/**
 * Uma linha sobre o canal, acrescentada DEPOIS da mensagem do briefing — que
 * fica intacta: regra de resposta automática ou etiqueta do WhatsApp Business
 * pode depender do texto exato.
 */
export function linhaDeOrigem(canal: Canal): string | null {
  if (canal === 'google') return '(Vim por um anúncio no Google.)'
  if (canal === 'meta') return '(Vim por um anúncio no Instagram/Facebook.)'
  return null
}

// ── Estado da visita (navegador) ─────────────────────────────────────────

let atual: Origem | null = null

function storageSeguro(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

/* c8 ignore start — cola de navegador, exercitada pelo Playwright */
export function origemDaVisita(): Origem {
  if (atual) return atual
  if (typeof window === 'undefined') return {}
  atual = resolverOrigem(window.location.search, storageSeguro(), Date.now())
  return atual
}

export function origemDaMensagem(): string | null {
  return linhaDeOrigem(canalDe(origemDaVisita()))
}
/* c8 ignore stop */
