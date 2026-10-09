/**
 * Qual produto este build gera: a landing page de anúncio ou o site
 * institucional. Um código, dois sites — o sistema visual, o globo 3D, o
 * quiz, o formulário e a medição são os mesmos; mudam as rotas, o conteúdo
 * e o endereço.
 *
 *   VITE_ALVO=lp   npm run build   → a LP do curso de inglês (padrão)
 *   VITE_ALVO=site npm run build   → o site institucional
 *
 * Lido nos dois lados: no navegador o Vite substitui `import.meta.env`; no
 * vite.config.ts (Node) e no pré-render, vale `process.env`.
 */
export type Alvo = 'lp' | 'site'

function lerAlvo(): Alvo {
  const doVite = (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_ALVO
  const doNode = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env?.VITE_ALVO
  return (doVite ?? doNode) === 'site' ? 'site' : 'lp'
}

/**
 * No build, o Vite troca `__ALVO__` por um literal ("lp" ou "site") — ver
 * `define` no vite.config.ts. Com o alvo conhecido em tempo de compilação, o
 * bundler descarta o código do outro produto: a LP não leva as páginas do
 * site, e vice-versa. Fora do Vite (config, testes), vale `lerAlvo()`.
 */
declare const __ALVO__: Alvo | undefined

export const ALVO: Alvo = typeof __ALVO__ !== 'undefined' ? __ALVO__ : lerAlvo()
