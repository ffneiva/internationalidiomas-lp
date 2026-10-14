/**
 * Medição de campanha: Google Tag Manager, Google Ads/GA4 e Meta Pixel.
 *
 * Esta página existe para receber tráfego pago, então a medição é parte do
 * produto — mas continua opcional: sem as variáveis de ambiente, nenhuma
 * linha de código de terceiro é baixada, e os eventos só vão para o
 * `dataLayer` (inofensivo).
 *
 *   VITE_GTM_ID          GTM-XXXXXXX — a agência gerencia as tags por lá
 *   VITE_GTAG_ID         G-XXXX ou AW-XXXX — tag do Google direto, sem GTM
 *   VITE_GADS_WHATSAPP   AW-XXXX/rótulo — conversão "clique no WhatsApp"
 *   VITE_GADS_LEAD       AW-XXXX/rótulo — conversão "formulário enviado"
 *   VITE_META_PIXEL_ID   ID numérico do Pixel da Meta
 *
 * Use GTM OU a tag direta, não os dois para o mesmo GA4: contaria em dobro.
 *
 * Os bootstraps moram no bundle, e não em `<script>` inline no HTML: a CSP
 * não precisa de `'unsafe-inline'` em `script-src`.
 *
 * ── Eventos ──────────────────────────────────────────────────────────────
 *
 * A lista é curta de propósito. Cada um vai para o `dataLayer` com o nome
 * abaixo (é o que o GTM escuta), para o gtag e, os dois de conversão, para o
 * Pixel com o evento-padrão da Meta:
 *
 *   whatsapp_click  {origem}      → Meta: Contact   (conversão principal)
 *   generate_lead   {curso?}      → Meta: Lead      (conversão secundária)
 *   quiz_step       {pergunta}
 *   quiz_complete   {curso}
 *   video_play      {video}
 */

const env = import.meta.env
const GTM_ID = env.VITE_GTM_ID as string | undefined
const GTAG_ID = env.VITE_GTAG_ID as string | undefined
const GADS_WHATSAPP = env.VITE_GADS_WHATSAPP as string | undefined
const GADS_LEAD = env.VITE_GADS_LEAD as string | undefined
const PIXEL_ID = env.VITE_META_PIXEL_ID as string | undefined

type Fn = (...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Fn
    fbq?: Fn & { queue?: unknown[]; loaded?: boolean; version?: string; callMethod?: Fn }
    _fbq?: unknown
  }
}

export const HA_MEDICAO = Boolean(GTM_ID || GTAG_ID || PIXEL_ID)

// ── Consentimento (LGPD) ─────────────────────────────────────────────────

const CHAVE_CONSENTIMENTO = 'inter-consentimento'
export type Escolha = 'aceito' | 'recusado'

export function escolhaGuardada(): Escolha | null {
  try {
    const v = window.localStorage.getItem(CHAVE_CONSENTIMENTO)
    return v === 'aceito' || v === 'recusado' ? v : null
  } catch {
    return null
  }
}

const estadoConsentimento = (escolha: Escolha | null) => {
  // Sem escolha registrada, a medição roda (o aviso informa e oferece a
  // recusa). Ver DEPLOY.md — é decisão da agência/escola, e virar para
  // "negado até aceitar" é trocar o `!== 'recusado'` por `=== 'aceito'`.
  const v = escolha !== 'recusado' ? 'granted' : 'denied'
  return {
    ad_storage: v,
    ad_user_data: v,
    ad_personalization: v,
    analytics_storage: v,
  }
}

function gtagBase(): Fn {
  window.dataLayer = window.dataLayer || []
  if (!window.gtag) {
    // O gtag.js exige que o item empurrado seja o objeto `arguments`, não um
    // array — com array, os comandos são ignorados em silêncio.
    window.gtag = function gtag() {
      // biome-ignore lint/complexity/noArguments: formato exigido pelo gtag.js
      window.dataLayer?.push(arguments)
    }
  }
  return window.gtag
}

export function registrarEscolha(escolha: Escolha): void {
  try {
    window.localStorage.setItem(CHAVE_CONSENTIMENTO, escolha)
  } catch {
    /* sem persistência: vale para esta visita */
  }
  gtagBase()('consent', 'update', estadoConsentimento(escolha))
  if (escolha === 'recusado') window.fbq?.('consent', 'revoke')
  else {
    window.fbq?.('consent', 'grant')
    carregarPixel()
  }
}

// ── Carregamento ─────────────────────────────────────────────────────────

function script(src: string) {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  document.head.appendChild(s)
}

let pixelCarregado = false
function carregarPixel() {
  if (!PIXEL_ID || pixelCarregado || escolhaGuardada() === 'recusado') return
  pixelCarregado = true
  // O stub oficial da Meta, sem o <script> inline: enfileira as chamadas até
  // o fbevents.js chegar e esvaziar a fila.
  type Stub = Fn & { queue: unknown[]; loaded: boolean; version: string; callMethod?: Fn }
  const fbq: Stub = Object.assign(
    (...args: unknown[]) => {
      if (fbq.callMethod) fbq.callMethod(...args)
      else fbq.queue.push(args)
    },
    { queue: [] as unknown[], loaded: true, version: '2.0' },
  )
  window.fbq = fbq
  window._fbq = fbq
  script('https://connect.facebook.net/en_US/fbevents.js')
  fbq('init', PIXEL_ID)
  fbq('track', 'PageView')
}

let iniciado = false

export function iniciarAnalytics(): void {
  if (iniciado || typeof document === 'undefined') return
  iniciado = true
  const gtag = gtagBase()
  gtag('consent', 'default', { ...estadoConsentimento(escolhaGuardada()), wait_for_update: 500 })

  if (GTM_ID) {
    window.dataLayer?.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
    script(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`)
  }
  if (GTAG_ID) {
    script(`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`)
    gtag('js', new Date())
    gtag('config', GTAG_ID)
  }
  carregarPixel()
}

// ── Eventos ──────────────────────────────────────────────────────────────

type Evento = 'whatsapp_click' | 'generate_lead' | 'quiz_step' | 'quiz_complete' | 'video_play'

export function registrar(evento: Evento, dados: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: evento, ...dados })
  // Com GTM, é ele quem repassa ao GA4; a chamada direta é para o caso sem GTM.
  if (GTAG_ID && !GTM_ID) window.gtag?.('event', evento, dados)
}

/** O clique no WhatsApp é a conversão principal: é onde a matrícula começa. */
export function conversaoWhatsApp(origem: string): void {
  registrar('whatsapp_click', { origem })
  if (GADS_WHATSAPP) window.gtag?.('event', 'conversion', { send_to: GADS_WHATSAPP })
  window.fbq?.('track', 'Contact', { content_name: origem })
}

export function conversaoLead(curso?: string): void {
  registrar('generate_lead', curso ? { curso } : {})
  if (GADS_LEAD) window.gtag?.('event', 'conversion', { send_to: GADS_LEAD })
  window.fbq?.('track', 'Lead', curso ? { content_name: curso } : {})
}
