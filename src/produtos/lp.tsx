import { BarraWhatsApp, type ExtrasMoldura } from '@/components/Moldura'
import { HomeLP } from '@/pages/lp/HomeLP'

/**
 * As páginas próprias da LANDING PAGE. O App importa `@produto`, que o
 * vite.config.ts aponta para este arquivo ou para `site.tsx` conforme o
 * VITE_ALVO — assim o bundle de um produto nem chega a importar o código do
 * outro (a LP não leva o globo 3D, o GSAP nem as páginas de curso).
 */
export function Conteudo({ caminho, aoEnviar }: { caminho: string; aoEnviar: () => void }) {
  return caminho === '/' ? <HomeLP aoEnviar={aoEnviar} /> : null
}

/** O elemento fixo da LP: a barra de WhatsApp. */
export const Fixo = BarraWhatsApp

/** A LP abre clara: o topo é sempre sólido. */
export const TOPO_SOLIDO = true

/** A LP não tem menu (cada link que não é o WhatsApp é uma saída). */
export const EXTRAS: ExtrasMoldura | undefined = undefined
