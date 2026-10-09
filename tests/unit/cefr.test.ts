import { describe, expect, it } from 'vitest'
import { DEGRAUS, marcasDe, porcento, trechoDe } from '@/lib/cefr'
import { PAGINAS_CURSO } from '@/lib/site'

describe('régua CEFR', () => {
  it('lê as marcas de qualquer forma de escrita', () => {
    expect(marcasDe('Pré-A1 → A1/A1+')).toEqual([0, 1, 1.5])
    expect(marcasDe('B1+ / B2')).toEqual([3.5, 4])
    expect(marcasDe('sem nível')).toEqual([])
  })

  it('cada programa com CEFR declarado tem um trecho válido', () => {
    const trechos = PAGINAS_CURSO.map(trechoDe).filter((t) => t !== null)
    expect(trechos.length).toBeGreaterThanOrEqual(3)
    for (const t of trechos) {
      expect(t.de).toBeGreaterThanOrEqual(0)
      expect(t.ate).toBeLessThanOrEqual(DEGRAUS.length - 1)
      expect(t.ate).toBeGreaterThan(t.de)
    }
  })

  it('programa sem CEFR fica fora (nada inventado)', () => {
    const semCefr = PAGINAS_CURSO.filter((c) => !c.niveis.some((n) => n.cefr))
    for (const c of semCefr) expect(trechoDe(c)).toBeNull()
  })

  it('posição em porcentagem', () => {
    expect(porcento(0)).toBe(0)
    expect(porcento(6)).toBe(100)
  })
})
