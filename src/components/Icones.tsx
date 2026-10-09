/**
 * Os poucos ícones da página, desenhados à mão.
 *
 * Uma biblioteca de ícones inteira por causa de dez glifos é o caso mais
 * comum de bundle inflado neste tipo de projeto (ver AGENTS.md §6).
 */
type P = { className?: string }

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const IconeWhatsApp = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.17-1.5A9.93 9.93 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.07.9.9-2.99-.2-.31a8.18 8.18 0 1 1 6.85 3.72Zm4.5-6.13c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.78.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-3.34-2.92c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04 4.76 4.76 0 0 0 1 2.53 10.9 10.9 0 0 0 4.17 3.68c1.55.67 2.16.73 2.94.61.47-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
  </svg>
)

export const IconeSeta = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const IconeVoltar = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
)

export const IconeSetaDiagonal = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

export const IconeCheck = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base} strokeWidth={2.4}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

export const IconePlay = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
    <path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.4-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5Z" />
  </svg>
)

export const IconePino = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
)

export const IconeMais = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const IconeEstrela = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
    <path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8L12 2.8Z" />
  </svg>
)

export const IconeInstagram = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
)

export const IconeYouTube = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <rect x="2.5" y="5" width="19" height="14" rx="4" />
    <path d="m10 9.2 5 2.8-5 2.8V9.2Z" fill="currentColor" />
  </svg>
)

/* Os ícones dos objetivos — traço simples, mesmo peso dos demais. */

export const IconeAviao = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M10.5 13.5 3 11l1.5-1.5 8 .5 4.5-4.5a2.1 2.1 0 0 1 3 3L15.5 13l.5 8-1.5 1.5-2.5-7.5-3 3v2.5L7.5 22 6 18l-4-1.5L3.5 15H6l3-3" />
  </svg>
)

export const IconeMaleta = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <rect x="3" y="7" width="18" height="13" rx="2.5" />
    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18" />
  </svg>
)

export const IconeCapelo = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="m2 9 10-5 10 5-10 5L2 9Z" />
    <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6" />
  </svg>
)

export const IconeGlobo = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
  </svg>
)

export const IconeBalao = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
    <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12Z" />
    <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth={2.6} />
  </svg>
)

export const IconeFacebook = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4a21 21 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1Z" />
  </svg>
)

export const IconeLinkedin = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
    <path d="M5.3 8.6h3V19h-3V8.6ZM6.8 4a1.7 1.7 0 1 1 0 3.5 1.7 1.7 0 0 1 0-3.5ZM10.2 8.6H13v1.4h.1c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7V19h-3v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V19h-2.9V8.6Z" />
  </svg>
)
