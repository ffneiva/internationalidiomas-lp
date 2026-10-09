import { CURSOS, type Curso, type CursoId, MENSAGEM_PADRAO } from './business.ts'

/**
 * "Descubra seu curso" — duas ou três perguntas que viram uma conversa
 * QUALIFICADA no WhatsApp.
 *
 * O objetivo principal do briefing é conversa qualificada, não clique. Um
 * "Olá, vim pelo site" obriga a equipe a começar do zero ("é para você?
 * qual idade? já estudou?"); a mesma pessoa, depois de três toques, chega
 * dizendo para quem é, o objetivo, o nível e o curso que o site indicou. As
 * respostas também vão para o formulário, e dele para o e-mail da escola.
 *
 * A indicação é INICIAL, e a página diz isso: quem define a turma é o
 * nivelamento. Por isso a regra é simples e explícita, e o teste percorre
 * todas as combinações possíveis.
 */

export type Para = 'eu' | 'filho' | 'empresa'
export type Idade = 'ate6' | '7a10' | '11a14' | '15a17'
export type Objetivo = 'viagens' | 'carreira' | 'estudos' | 'certificacao' | 'pessoal'
export type Nivel = 'zero' | 'basico' | 'intermediario' | 'avancado' | 'naosei'
export type Equipe = '2a5' | '6a15' | 'mais15'

export type Respostas = {
  para?: Para
  idade?: Idade
  objetivo?: Objetivo
  nivel?: Nivel
  equipe?: Equipe
}

type Chave = keyof Respostas

type Opcao<V extends string> = { valor: V; rotulo: string; resumo: string }

type Pergunta = {
  [K in Chave]: { chave: K; titulo: string; opcoes: readonly Opcao<NonNullable<Respostas[K]>>[] }
}[Chave]

export const PERGUNTAS = {
  para: {
    chave: 'para',
    titulo: 'Para quem é o inglês?',
    opcoes: [
      { valor: 'eu', rotulo: 'Para mim', resumo: 'É para mim' },
      { valor: 'filho', rotulo: 'Para meu filho ou filha', resumo: 'É para meu filho ou filha' },
      { valor: 'empresa', rotulo: 'Para minha equipe', resumo: 'É para a equipe da minha empresa' },
    ],
  },
  idade: {
    chave: 'idade',
    titulo: 'Qual a idade?',
    opcoes: [
      { valor: 'ate6', rotulo: 'Até 6 anos', resumo: 'até 6 anos' },
      { valor: '7a10', rotulo: '7 a 10 anos', resumo: 'de 7 a 10 anos' },
      { valor: '11a14', rotulo: '11 a 14 anos', resumo: 'de 11 a 14 anos' },
      { valor: '15a17', rotulo: '15 a 17 anos', resumo: 'de 15 a 17 anos' },
    ],
  },
  objetivo: {
    chave: 'objetivo',
    titulo: 'O que você quer com o inglês?',
    opcoes: [
      { valor: 'viagens', rotulo: 'Viajar', resumo: 'viajar' },
      { valor: 'carreira', rotulo: 'Crescer na carreira', resumo: 'crescer na carreira' },
      {
        valor: 'estudos',
        rotulo: 'Estudar ou fazer intercâmbio',
        resumo: 'estudar ou fazer intercâmbio',
      },
      {
        valor: 'certificacao',
        rotulo: 'Tirar uma certificação',
        resumo: 'tirar uma certificação (TOEFL, IELTS, TOEIC…)',
      },
      { valor: 'pessoal', rotulo: 'Usar no dia a dia', resumo: 'usar no dia a dia' },
    ],
  },
  nivel: {
    chave: 'nivel',
    titulo: 'E o inglês hoje?',
    opcoes: [
      { valor: 'zero', rotulo: 'Nunca estudei', resumo: 'nunca estudou' },
      { valor: 'basico', rotulo: 'Sei o básico', resumo: 'sabe o básico' },
      { valor: 'intermediario', rotulo: 'Me viro numa conversa', resumo: 'se vira numa conversa' },
      { valor: 'avancado', rotulo: 'Avançado', resumo: 'avançado' },
      { valor: 'naosei', rotulo: 'Não sei dizer', resumo: 'não sabe dizer (quer um nivelamento)' },
    ],
  },
  equipe: {
    chave: 'equipe',
    titulo: 'Quantas pessoas?',
    opcoes: [
      { valor: '2a5', rotulo: '2 a 5', resumo: '2 a 5 pessoas' },
      { valor: '6a15', rotulo: '6 a 15', resumo: '6 a 15 pessoas' },
      { valor: 'mais15', rotulo: 'Mais de 15', resumo: 'mais de 15 pessoas' },
    ],
  },
} as const satisfies { [K in Chave]: Extract<Pergunta, { chave: K }> }

/** A sequência de perguntas depende das respostas anteriores. */
export function roteiro(r: Respostas): Chave[] {
  if (r.para === 'empresa') return ['para', 'equipe']
  if (r.para === 'filho') return r.idade === 'ate6' ? ['para', 'idade'] : ['para', 'idade', 'nivel']
  if (r.para === 'eu') return ['para', 'objetivo', 'nivel']
  return ['para']
}

/** A próxima pergunta sem resposta, ou `null` quando o perfil está completo. */
export function proximaPergunta(r: Respostas): Pergunta | null {
  const chave = roteiro(r).find((c) => r[c] === undefined)
  return chave ? (PERGUNTAS[chave] as Pergunta) : null
}

export function completo(r: Respostas): boolean {
  return r.para !== undefined && proximaPergunta(r) === null
}

/** Etapa atual e total, para a barra de progresso. */
export function progresso(r: Respostas): { etapa: number; total: number } {
  const passos = roteiro(r)
  // Antes da primeira resposta o total ainda é desconhecido; 3 é o caminho
  // mais longo, e é o que a pessoa espera ver.
  const total = r.para === undefined ? 3 : passos.length
  const feitas = passos.filter((c) => r[c] !== undefined).length
  return { etapa: Math.min(feitas + 1, total), total }
}

/**
 * Grava uma resposta e descarta tudo o que vinha DEPOIS dela no roteiro.
 * As perguntas dependem umas das outras: o nível respondido para o filho não
 * é o nível de quem troca para "para mim".
 */
export function responder<K extends Chave>(r: Respostas, chave: K, valor: Respostas[K]): Respostas {
  const nova: Respostas = { ...r, [chave]: valor }
  const passos = roteiro(nova)
  const ate = passos.indexOf(chave)
  const validas = new Set(passos.slice(0, ate + 1))
  for (const c of Object.keys(nova) as Chave[]) if (!validas.has(c)) delete nova[c]
  return nova
}

/** Volta uma pergunta. */
export function voltar(r: Respostas): Respostas {
  const respondidas = roteiro(r).filter((c) => r[c] !== undefined)
  const ultima = respondidas.at(-1)
  if (!ultima) return r
  const nova = { ...r }
  delete nova[ultima]
  return nova
}

export type Recomendacao = { curso: Curso; motivo: string }

const AVANCADOS: readonly Nivel[] = ['intermediario', 'avancado']

/** A indicação inicial. Só é chamada com o perfil completo. */
export function recomendar(r: Respostas): Recomendacao {
  const curso = (id: CursoId, motivo: string) => ({ curso: CURSOS[id], motivo })

  if (r.para === 'empresa') {
    return curso('incompany', 'Aulas para a equipe no próprio ambiente de trabalho.')
  }
  if (r.para === 'filho') {
    if (r.idade === 'ate6' || r.idade === '7a10') {
      return curso('kids', 'O inglês entra brincando, no ritmo de cada fase da infância.')
    }
    if (r.idade === '15a17' && r.nivel && AVANCADOS.includes(r.nivel)) {
      return curso('highschool', 'Com base no idioma, o foco passa a ser o inglês acadêmico.')
    }
    return curso('teens', 'Projetos conectados aos estudos e às oportunidades acadêmicas.')
  }
  if (r.objetivo === 'carreira') {
    return curso('business', 'Comunicação para reuniões, apresentações e negociações.')
  }
  if (r.objetivo === 'certificacao') {
    return curso('adults', 'Inglês completo, com preparação para o exame que você precisa.')
  }
  return curso('adults', 'Inglês prático para viagens, estudos e o dia a dia.')
}

const resumoDe = <K extends Chave>(chave: K, valor: Respostas[K]) =>
  (PERGUNTAS[chave].opcoes as readonly Opcao<string>[]).find((o) => o.valor === valor)?.resumo

/**
 * O perfil em frases curtas — o mesmo texto vai na mensagem do WhatsApp, no
 * formulário e no e-mail que a escola recebe.
 */
export function resumo(r: Respostas): string[] {
  const l: string[] = []
  const para = resumoDe('para', r.para)
  if (para) {
    const idade = resumoDe('idade', r.idade)
    const equipe = resumoDe('equipe', r.equipe)
    l.push(idade ? `${para}, ${idade}` : equipe ? `${para} (${equipe})` : para)
  }
  const objetivo = resumoDe('objetivo', r.objetivo)
  if (objetivo) l.push(`Objetivo: ${objetivo}`)
  const nivel = resumoDe('nivel', r.nivel)
  if (nivel) l.push(`Nível: ${nivel}`)
  return l
}

/** O perfil no formato que o formulário envia (e o e-mail da escola exibe). */
export function perfilParaEnvio(r: Respostas): Record<string, string> {
  if (!completo(r)) return {}
  const p: Record<string, string> = {}
  const para = resumoDe('para', r.para)
  if (para) {
    const detalhe = resumoDe('idade', r.idade) ?? resumoDe('equipe', r.equipe)
    p.para = detalhe ? `${para} — ${detalhe}` : para
  }
  const objetivo = resumoDe('objetivo', r.objetivo)
  if (objetivo) p.objetivo = objetivo
  const nivel = resumoDe('nivel', r.nivel)
  if (nivel) p.nivel = nivel
  p.curso = recomendar(r).curso.nome
  return p
}

/** A mensagem do WhatsApp com o perfil completo. */
export function mensagemDoPerfil(r: Respostas, abertura = MENSAGEM_PADRAO): string {
  if (!completo(r)) return abertura
  const linhas = resumo(r).map((l) => `• ${l}`)
  const { curso } = recomendar(r)
  return [abertura, '', ...linhas, `• Curso indicado pelo site: ${curso.nome}`].join('\n')
}
