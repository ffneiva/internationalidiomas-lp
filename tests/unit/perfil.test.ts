import { describe, expect, it } from 'vitest'
import { CURSOS } from '@/lib/business'
import {
  completo,
  mensagemDoPerfil,
  PERGUNTAS,
  perfilParaEnvio,
  progresso,
  proximaPergunta,
  type Respostas,
  recomendar,
  responder,
  resumo,
  roteiro,
  voltar,
} from '@/lib/perfil'

/**
 * Percorre TODOS os caminhos possíveis do quiz, respondendo pela própria
 * função `proximaPergunta` — assim o teste segue o roteiro que a página segue,
 * e um ramo novo entra no teste sem ninguém lembrar de acrescentá-lo.
 */
function todosOsPerfis(): Respostas[] {
  const fim: Respostas[] = []
  const fila: Respostas[] = [{}]
  while (fila.length) {
    const r = fila.shift() as Respostas
    const p = proximaPergunta(r)
    if (!p) {
      fim.push(r)
      continue
    }
    for (const o of p.opcoes) fila.push(responder(r, p.chave, o.valor as never))
  }
  return fim
}

const PERFIS = todosOsPerfis()

describe('o quiz, em todas as combinações', () => {
  it('tem o número esperado de caminhos', () => {
    // eu: 5 objetivos × 5 níveis · filho: 1 (até 6) + 3 idades × 5 níveis · empresa: 3
    expect(PERFIS.length).toBe(25 + 1 + 15 + 3)
  })

  it.each(PERFIS.map((p) => [JSON.stringify(p), p]))('%s', (_, perfil) => {
    const r = perfil as Respostas
    expect(completo(r)).toBe(true)
    const { curso, motivo } = recomendar(r)
    expect(Object.values(CURSOS)).toContain(curso)
    expect(motivo.length).toBeGreaterThan(10)

    const msg = mensagemDoPerfil(r)
    expect(msg).not.toMatch(/undefined|null|NaN/)
    expect(msg).toContain(`Curso indicado pelo site: ${curso.nome}`)
    // Nenhuma promessa de prazo ou resultado na mensagem que a página escreve.
    expect(msg).not.toMatch(/fluente em|garant|\d+\s*(meses|semanas)/i)

    const envio = perfilParaEnvio(r)
    expect(envio.curso).toBe(curso.nome)
    for (const v of Object.values(envio)) expect(v).toBeTruthy()
    expect(resumo(r).length).toBeGreaterThan(0)
  })
})

describe('indicação', () => {
  it('criança pequena vai para o Interkids, sem perguntar nível', () => {
    const r = responder(responder({}, 'para', 'filho'), 'idade', 'ate6')
    expect(completo(r)).toBe(true)
    expect(recomendar(r).curso.id).toBe('kids')
  })

  it('adolescente de 15 a 17 com base vai para o High School', () => {
    const base: Respostas = { para: 'filho', idade: '15a17' }
    expect(recomendar({ ...base, nivel: 'avancado' }).curso.id).toBe('highschool')
    expect(recomendar({ ...base, nivel: 'intermediario' }).curso.id).toBe('highschool')
    expect(recomendar({ ...base, nivel: 'zero' }).curso.id).toBe('teens')
  })

  it('carreira vai para o inglês profissional; empresa, para o In Company', () => {
    expect(recomendar({ para: 'eu', objetivo: 'carreira', nivel: 'basico' }).curso.id).toBe(
      'business',
    )
    expect(recomendar({ para: 'empresa', equipe: '6a15' }).curso.id).toBe('incompany')
  })
})

describe('navegação no quiz', () => {
  it('trocar a primeira resposta descarta as que não valem mais', () => {
    const r: Respostas = { para: 'filho', idade: '7a10', nivel: 'zero' }
    expect(responder(r, 'para', 'eu')).toEqual({ para: 'eu' })
  })

  it('voltar desfaz a última resposta, e nada acontece no começo', () => {
    expect(voltar({ para: 'eu', objetivo: 'viagens' })).toEqual({ para: 'eu' })
    expect(voltar({})).toEqual({})
  })

  it('progresso', () => {
    expect(progresso({})).toEqual({ etapa: 1, total: 3 })
    expect(progresso({ para: 'empresa' })).toEqual({ etapa: 2, total: 2 })
    expect(progresso({ para: 'eu', objetivo: 'viagens' })).toEqual({ etapa: 3, total: 3 })
  })

  it('roteiro sem resposta pede só a primeira pergunta', () => {
    expect(roteiro({})).toEqual(['para'])
    expect(proximaPergunta({})?.chave).toBe('para')
  })

  it('perfil incompleto não gera envio nem muda a mensagem', () => {
    expect(perfilParaEnvio({ para: 'eu' })).toEqual({})
    expect(mensagemDoPerfil({ para: 'eu' }, 'Oi')).toBe('Oi')
  })

  it('toda opção tem rótulo e resumo', () => {
    for (const p of Object.values(PERGUNTAS)) {
      for (const o of p.opcoes) {
        expect(o.rotulo).toBeTruthy()
        expect(o.resumo).toBeTruthy()
      }
    }
  })
})
