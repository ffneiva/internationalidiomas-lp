import type { PaginaCurso } from './site.ts'

/**
 * A régua CEFR: onde cada programa começa e onde termina, lido dos níveis
 * que a própria escola publica (`cefr` de cada nível em site.ts). Programa
 * sem nível CEFR declarado (Teens, In Company) fica FORA da régua — sem dado,
 * sem barra; desenhar um trecho "aproximado" seria inventar.
 */
export const DEGRAUS = ['Pré-A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const

const POSICAO: Record<string, number> = {
  'Pré-A1': 0,
  A1: 1,
  'A1+': 1.5,
  A2: 2,
  B1: 3,
  'B1+': 3.5,
  B2: 4,
  'B2+': 4.5,
  C1: 5,
  C2: 6,
}

/** Todas as marcas CEFR citadas num texto ("B1+ / B2", "Pré-A1 → A1/A1+"). */
export function marcasDe(texto: string): number[] {
  return [...texto.matchAll(/Pré-A1|[ABC][12]\+?/g)]
    .map((m) => POSICAO[m[0]])
    .filter((n): n is number => n !== undefined)
}

export type Trecho = { path: string; rotulo: string; nome: string; de: number; ate: number }

export function trechoDe(c: PaginaCurso): Trecho | null {
  const todas = c.niveis.flatMap((n) => (n.cefr ? marcasDe(n.cefr) : []))
  if (todas.length === 0) return null
  return {
    path: c.path,
    rotulo: c.rotulo,
    nome: c.nome,
    de: Math.min(...todas),
    ate: Math.max(...todas),
  }
}

/** Posição na régua, em %, com os sete degraus distribuídos de 0 a 100. */
export const porcento = (pos: number) => (pos / (DEGRAUS.length - 1)) * 100
