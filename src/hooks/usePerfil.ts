import { useSyncExternalStore } from 'react'
import type { Respostas } from '@/lib/perfil'

/**
 * As respostas do "Descubra seu curso", compartilhadas pela página inteira.
 *
 * O quiz do herói, os botões de WhatsApp e o formulário leem o mesmo perfil:
 * quem responde lá em cima e rola até o formulário não precisa repetir nada.
 * Fica na sessionStorage — sobrevive a um recarregar, morre com a aba.
 *
 * `useSyncExternalStore` com um snapshot de servidor vazio: na hidratação o
 * React usa o vazio (igual ao HTML pré-renderizado) e troca pelo guardado logo
 * em seguida, sem aviso de divergência.
 */
const CHAVE = 'inter-perfil'
const VAZIO: Respostas = Object.freeze({}) as Respostas

let atual: Respostas | null = null
const ouvintes = new Set<() => void>()

function ler(): Respostas {
  if (atual) return atual
  try {
    const bruto = window.sessionStorage.getItem(CHAVE)
    atual = bruto ? (JSON.parse(bruto) as Respostas) : VAZIO
  } catch {
    atual = VAZIO
  }
  return atual
}

export function definirPerfil(novo: Respostas): void {
  atual = novo
  try {
    window.sessionStorage.setItem(CHAVE, JSON.stringify(novo))
  } catch {
    /* aba anônima com cota zero: o perfil vale só enquanto a página estiver aberta */
  }
  for (const f of ouvintes) f()
}

function assinar(f: () => void) {
  ouvintes.add(f)
  return () => ouvintes.delete(f)
}

export function usePerfil(): Respostas {
  return useSyncExternalStore(assinar, ler, () => VAZIO)
}

/** Leitura fora do React (no clique de um link, por exemplo). */
export function perfilAtual(): Respostas {
  return typeof window === 'undefined' ? VAZIO : ler()
}
