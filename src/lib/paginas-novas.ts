/**
 * Conteúdo das páginas pedidas pela escola em 08/10/2026 (só no SITE):
 *
 *   /preparatorios-e-certificacoes — "uma página exclusiva para preparatórios
 *       e certificação internacional, com um botão para vender as provas"
 *   /parcerias — "Leve a Inter para sua escola"
 *   /blog e /blog/<post>
 *
 * Fontes: o catálogo de serviços da escola (08/10/2026 — sem os PREÇOS, que a
 * escola disse ainda não estarem prontos), as confirmações de 02–03/10/2026
 * (Centro Autorizado ETS; NÃO aplica o TOEFL® iBT) e informações públicas dos
 * próprios exames. Nada de preço, prazo de resultado ou promessa de nota.
 *
 * 08/10/2026, tarde: a escola mandou a lista completa de provas e serviços de
 * certificação que aplica ("tudo que está nessa página, nós fazemos") — TOEIC®
 * nas três versões, TOEFL® ITP níveis 1 e 2, Junior, Primary, TFI® (francês),
 * versão on-line, simulados e intensivo de TOEIC®, testes para empresas. O
 * fornecedor NÃO pode ser citado em lugar nenhum. E a pesquisa da escola:
 * "a única escola de idiomas de Goiás com programa completo para o SAT
 * Reading & Writing".
 */
import type { Pergunta } from './site.ts'

/** Uma prova que a escola aplica, com a ficha que aparece ao escolher. */
export type Prova = {
  id: string
  nome: string
  para: string
  /** Presencial na escola, ou também on-line (remota). */
  online?: true
  ficha: readonly string[]
}

/**
 * "O coração da coisa" (escola, 09/10/2026): a primeira escola de idiomas de
 * Goiás a oferecer o preparatório de SAT — e a única com o programa completo
 * de Reading & Writing (pesquisa da escola, 08/10/2026).
 */
const SAT_UNICA =
  'Primeira escola de idiomas de Goiás com preparatório completo para o SAT Reading & Writing'

/**
 * Famílias de exame, cada uma no seu contêiner (escola, 09/10/2026): as
 * marcas ETS separadas das outras, e o Cambridge à parte — certificado sem
 * validade, diferente dos exames de pontuação com validade.
 */
export type GrupoExame = 'ets' | 'outros' | 'cambridge'

export type Exame = {
  sigla: string
  nome: string
  oQue: string
  paraQuem: string
  grupo: GrupoExame
  especialidade?: true
}

/** Uma família de provas no seletor (TOEIC®, TOEFL® Young Students Series…). */
export type FamiliaProva = {
  id: string
  titulo: string
  descricao: string
  opcoes: readonly Prova[]
}

// ── Preparatórios e certificações ─────────────────────────────────────────

export const PREPARATORIOS = {
  path: '/preparatorios-e-certificacoes',
  rotulo: 'Preparatórios',
  sobretitulo: 'Preparatórios e certificações',
  titulo: 'Sua certificação internacional começa aqui',
  destaque: 'começa aqui',
  subtitulo:
    'Preparatórios personalizados por habilidade para SAT, IELTS, TOEFL®, TOEIC® e Duolingo English ' +
    'Test. E, como Centro Autorizado ETS, você faz a prova aqui: TOEIC®, TOEFL® ITP, TOEFL® Young ' +
    'Students Series e o TFI®, de francês.',
  selos: [
    SAT_UNICA,
    'Especialistas em SAT, IELTS, TOEFL® e TOEIC®',
    'Centro Autorizado ETS',
    'Provas presenciais ou on-line',
  ],
  /** O SAT em destaque, logo depois do herói. */
  sat: {
    sobretitulo: 'SAT · Reading & Writing',
    titulo: 'A primeira escola de idiomas de Goiás com preparatório completo para o SAT',
    destaque: 'preparatório completo para o SAT',
    texto:
      'O SAT é o exame de admissão das universidades americanas — e a parte de Reading & Writing é a ' +
      'que mais pesa para quem estudou no Brasil. A International foi a primeira escola de idiomas de ' +
      'Goiás a oferecer um programa completo para ela.',
    pontos: [
      'Programa completo de Reading & Writing, do diagnóstico ao simulado',
      'Professores que conhecem a prova digital e adaptativa',
      'Turma, grupo especial ou aulas individuais, a partir de 14 anos',
      'Também para escolas: o preparatório dentro da sua instituição',
    ],
    cta: 'Quero o preparatório de SAT',
    mensagem: 'Olá! Quero saber sobre o preparatório de SAT Reading & Writing da International.',
  },
  grupos: {
    ets: {
      titulo: 'Exames ETS',
      texto:
        'A International é Centro Autorizado ETS: prepara e também aplica as provas da família TOEFL® e TOEIC®.',
    },
    outros: {
      titulo: 'Outros exames internacionais',
      texto: 'Preparatórios para as provas de admissão e proficiência mais pedidas no mundo.',
    },
    cambridge: {
      titulo: 'Cambridge English',
      selo: 'Certificado sem validade',
      texto:
        'Diferente dos exames de pontuação, que valem por um tempo, o certificado Cambridge comprova o ' +
        'seu nível para sempre.',
    },
  } as Record<GrupoExame, { titulo: string; texto: string; selo?: string }>,
  exames: [
    {
      sigla: 'IELTS',
      nome: 'International English Language Testing System',
      oQue:
        'Avalia leitura, escrita, compreensão oral e conversação. Tem duas versões: Academic, para ' +
        'estudar, e General Training, para trabalho e imigração.',
      paraQuem: 'Universidades no Reino Unido, Canadá, Austrália, Irlanda e muitos outros países.',
      grupo: 'outros',
      especialidade: true,
    },
    {
      sigla: 'TOEFL®',
      nome: 'Test of English as a Foreign Language',
      oQue:
        'O TOEFL® iBT avalia o inglês acadêmico nas quatro habilidades; o TOEFL® ITP, aplicado aqui na ' +
        'escola, avalia compreensão oral, estrutura gramatical e leitura em contexto acadêmico.',
      paraQuem: 'Graduação, pós e intercâmbio, especialmente nos Estados Unidos e no Canadá.',
      grupo: 'ets',
      especialidade: true,
    },
    {
      sigla: 'TOEIC®',
      nome: 'Test of English for International Communication',
      oQue: 'Mede o inglês usado no trabalho: reuniões, e-mails, telefonemas, viagens de negócio.',
      paraQuem: 'Processos seletivos, promoções e empresas que pedem inglês comprovado.',
      grupo: 'ets',
      especialidade: true,
    },
    {
      sigla: 'SAT',
      nome: 'SAT — preparatório de Reading & Writing',
      oQue:
        'O exame de admissão das universidades americanas. A International é a primeira escola de ' +
        'idiomas de Goiás com um preparatório completo para o Reading & Writing.',
      paraQuem: 'Quem sonha com a graduação nos Estados Unidos.',
      grupo: 'outros',
      especialidade: true,
    },
    {
      sigla: 'DET',
      nome: 'Duolingo English Test',
      oQue: 'Prova on-line, adaptativa, feita do computador, com resultado em poucos dias.',
      paraQuem: 'Universidades que aceitam o DET na admissão — confira a lista da instituição.',
      grupo: 'outros',
    },
    {
      sigla: 'Cambridge',
      nome: 'Cambridge English Qualifications',
      oQue: 'Exames por nível, do Young Learners para crianças ao C2 Proficiency.',
      paraQuem: 'Escolas, universidades e empresas que pedem um certificado sem validade.',
      grupo: 'cambridge',
    },
  ] as readonly Exame[],
  /** Do catálogo: "Preparatório personalizável por skill. Monte o seu pacote." */
  comoFunciona: {
    titulo: 'Um preparatório montado para a sua prova',
    destaque: 'para a sua prova',
    itens: [
      {
        titulo: 'Diagnóstico',
        texto:
          'Um nivelamento mostra onde você está em cada habilidade e quanto falta para a nota que você precisa.',
      },
      {
        titulo: 'Pacote por habilidade',
        texto:
          'Reading, Listening, Speaking ou Writing: você reforça o que precisa, em vez de repetir o que já domina.',
      },
      {
        titulo: 'Simulados no formato real',
        texto: 'Questões e tempo de prova de verdade, para chegar no dia sem surpresa.',
      },
      {
        titulo: 'Do seu jeito',
        texto:
          'Turma regular, turma especial ou aulas individuais, presencial ou on-line, a partir de 14 anos.',
      },
    ],
  },
  /**
   * O "botão para vender as provas". A escola aplica on demand (catálogo:
   * "agenda on demand as provas … em qualquer época do ano"). Data, valor e
   * pagamento a equipe passa no WhatsApp.
   */
  provas: {
    sobretitulo: 'Centro Autorizado ETS',
    titulo: 'Faça sua prova na International',
    destaque: 'na International',
    texto:
      'Agende a sua prova em qualquer época do ano, sem esperar calendário — na escola ou, para várias ' +
      'delas, on-line. Escolha a prova e fale com a equipe: ela confirma a data, o valor e como pagar.',
    /**
     * Famílias (padrão ETS, 09/10/2026): o TOEIC® como guarda-chuva das quatro
     * habilidades — a versão tradicional ou a completa —, e a TOEFL® Young
     * Students Series (TYS) reunindo Primary e Junior, dos 8 aos 16+ anos.
     * Dados das fichas: os guias oficiais de cada exame (ETS).
     */
    familias: [
      {
        id: 'toeic',
        titulo: 'TOEIC®',
        descricao:
          'O inglês do trabalho nas quatro habilidades: a versão tradicional ou a avaliação completa.',
        opcoes: [
          {
            id: 'toeic-lr',
            nome: 'TOEIC® Listening & Reading',
            para: 'Versão tradicional · a mais pedida por empresas',
            online: true,
            ficha: [
              '200 questões de múltipla escolha, cerca de 2 horas',
              'Listening (100 questões) e Reading (100 questões)',
              'Nota de 10 a 990',
            ],
          },
          {
            id: 'toeic-4',
            nome: 'TOEIC® 4 Skills',
            para: 'Avaliação completa: Listening, Reading, Speaking e Writing',
            ficha: [
              'Listening & Reading (nota de 10 a 990) + Speaking & Writing (0 a 200 cada)',
              'Speaking: 11 tarefas, cerca de 20 minutos · Writing: 8 tarefas, cerca de 1 hora',
              'Speaking & Writing também pode ser feito à parte',
            ],
          },
        ],
      },
      {
        id: 'tys',
        titulo: 'TOEFL® Young Students Series (TYS)',
        descricao:
          'A solução completa de proficiência escolar, dos 8 aos 16+ anos — também aplicada dentro da sua escola.',
        opcoes: [
          {
            id: 'toefl-primary',
            nome: 'TOEFL® Primary',
            para: 'A partir de 8 anos · ensino fundamental',
            ficha: [
              'Step 1 e Step 2: Reading e Listening, cerca de 1 hora',
              'Speaking, à parte: cerca de 20 minutos',
              'Feito para crianças do ensino fundamental',
            ],
          },
          {
            id: 'toefl-junior',
            nome: 'TOEFL® Junior',
            para: 'A partir de 11 anos · fundamental II e médio',
            online: true,
            ficha: [
              'Standard: Listening, Language Form and Meaning e Reading, nota de 600 a 900',
              'Speaking, à parte: cerca de 18 minutos',
              'Mostra pontos fortes e lacunas e acompanha a evolução ano a ano',
            ],
          },
        ],
      },
      {
        id: 'itp',
        titulo: 'TOEFL® ITP',
        descricao: 'Inglês acadêmico para jovens e adultos.',
        opcoes: [
          {
            id: 'toefl-itp',
            nome: 'TOEFL® ITP',
            para: 'Jovens e adultos · inglês acadêmico',
            online: true,
            ficha: [
              'Nível 1 (intermediário a avançado): nota de 310 a 677',
              'Nível 2 (básico a intermediário): nota de 200 a 500',
              'Compreensão oral, estrutura gramatical e leitura',
            ],
          },
        ],
      },
      {
        id: 'tfi',
        titulo: 'TFI®',
        descricao: 'Francês para o trabalho e os estudos.',
        opcoes: [
          {
            id: 'tfi',
            nome: 'TFI® — Test de Français International',
            para: 'Francês · qualquer nível',
            ficha: [
              '200 questões, cerca de 2 horas: Listening e Reading',
              'Para qualquer nível, de iniciante a avançado',
            ],
          },
        ],
      },
    ] as readonly FamiliaProva[],
    /** O que vem com toda prova. */
    inclui: [
      'Relatório de notas eletrônico e impresso',
      'Adaptações para pessoas com deficiência, com pedido feito com antecedência',
    ],
    cta: 'Quero agendar minha prova',
    aviso:
      'O TOEFL® iBT não é aplicado na escola: a International prepara você para ele, e a prova é feita ' +
      'em centro oficial.',
    passos: [
      'Escolha a prova',
      'Fale com a equipe no WhatsApp',
      'Receba data, valor e forma de pagamento',
      'Faça a prova na International ou on-line',
    ],
  },
  /** Do material da escola: simulados, plataforma on-line e intensivo de TOEIC®. */
  toeic: {
    sobretitulo: 'TOEIC®',
    titulo: 'Para o TOEIC®, três jeitos de chegar pronto',
    destaque: 'chegar pronto',
    itens: [
      {
        titulo: 'Intensivo de 20 horas',
        texto:
          'Para quem tem prazo curto: nivelamento, o formato da prova, estratégia por parte, gestão do ' +
          'tempo e correção comentada, com professores certificados e horários flexíveis.',
      },
      {
        titulo: 'Preparatório on-line',
        texto:
          'Milhares de questões no formato do TOEIC®, para treinar cada habilidade no seu ritmo, de ' +
          'qualquer lugar.',
      },
      {
        titulo: 'Simulados on-line',
        texto:
          'Cinco simulados completos, com acesso por seis meses: você mede onde está antes do dia da prova.',
      },
    ],
  },
  /** Os serviços de certificação para empresas. */
  empresas: {
    titulo: 'Para empresas: inglês comprovado na seleção e na equipe',
    itens: [
      'TOEIC® no processo seletivo, para medir o inglês dos candidatos',
      'Avaliação do nível da equipe e dos resultados do treinamento',
      'Provas aplicadas na empresa, na escola ou on-line',
      'Aulas in company e on-line, com consultoria de idiomas',
    ],
    mensagem:
      'Olá! Quero aplicar o TOEIC® na minha empresa (processo seletivo ou avaliação da equipe).',
  },
  perguntas: [
    {
      pergunta: 'Qual exame eu devo fazer?',
      resposta:
        'O que a instituição de destino pede. Universidades e órgãos de imigração listam os exames ' +
        'aceitos e a nota mínima. Se ainda não tem um destino definido, a equipe ajuda a escolher a ' +
        'partir do seu objetivo — e o nosso guia no blog compara os principais.',
    },
    {
      pergunta: 'Posso agendar só a prova, sem fazer o preparatório?',
      resposta:
        'Sim. Para TOEFL® ITP, TOEIC® e TOEFL® Young Students Series (Primary e Junior), você pode agendar ' +
        'só a prova pelo WhatsApp.',
    },
    {
      pergunta: 'Quanto tempo de preparatório eu preciso?',
      resposta:
        'Depende do seu nível hoje e da nota que você precisa. O nivelamento mostra essa distância, e o ' +
        'pacote é montado em cima dela.',
    },
    {
      pergunta: 'A partir de que idade?',
      resposta:
        'Os preparatórios são a partir de 14 anos. Para crianças e adolescentes, a escola aplica o ' +
        'TOEFL® Primary e o TOEFL® Junior.',
    },
    {
      pergunta: 'É presencial ou on-line?',
      resposta:
        'Os dois. Os preparatórios acontecem na escola ou on-line. As provas são feitas na escola, e o ' +
        'TOEIC® Listening & Reading, o TOEFL® ITP e o TOEFL® Junior também têm versão on-line.',
    },
    {
      pergunta: 'Vocês aplicam prova de francês?',
      resposta:
        'Sim: o TFI® (Test de Français International), que avalia compreensão oral e leitura em francês ' +
        'para o trabalho e os estudos, em qualquer nível.',
    },
    {
      pergunta: 'Como recebo o resultado?',
      resposta:
        'Em relatório de notas eletrônico e impresso. O prazo depende da prova — a equipe informa no ' +
        'agendamento.',
    },
    {
      pergunta: 'A empresa pode aplicar o TOEIC® nos candidatos ou na equipe?',
      resposta:
        'Pode. A International aplica o TOEIC® em processos seletivos e em avaliações de equipe, na ' +
        'empresa, na escola ou on-line.',
    },
  ] as readonly Pergunta[],
  seo: {
    titulo: 'Preparatório SAT, IELTS, TOEFL® e TOEIC® em Goiânia | International',
    descricao:
      'A primeira escola de idiomas de Goiás com preparatório completo de SAT Reading & Writing. ' +
      'Centro Autorizado ETS: TOEIC®, TOEFL® e TFI®.',
  },
}

/** Todas as provas, em ordem — para o seletor e para os testes. */
export const PROVAS_TODAS: readonly Prova[] = PREPARATORIOS.provas.familias.flatMap((f) => f.opcoes)

/** A mensagem do botão de prova, com a prova escolhida. */
export function mensagemDaProva(prova: string): string {
  return `Olá! Quero agendar a prova ${prova} na International. Qual a próxima data disponível, o valor e como faço o pagamento?`
}

// ── Pedidos B2B: avaliar alunos (Parcerias) e colaboradores (In Company) ──

/**
 * Escola, 09/10/2026: diretores, empresários e coordenadores podem
 * subcontratar a International para conduzir as avaliações ETS dentro das
 * instituições (TOEFL® Young Students Series: Primary e Junior); empresas
 * podem contratar os cursos ou a avaliação TOEIC® (contratação e equipe).
 */
export const AVALIACAO_B2B = {
  escola: {
    id: 'avaliar-alunos',
    sobretitulo: 'Certificação internacional na sua escola',
    titulo: 'Quero avaliar meus alunos',
    destaque: 'meus alunos',
    texto:
      'Diretores, coordenadores e mantenedores podem contratar a International para conduzir as ' +
      'avaliações ETS dentro da própria instituição — com a TOEFL® Young Students Series, a solução ' +
      'completa de proficiência escolar dos 8 aos 16+ anos.',
    pontos: [
      'TOEFL® Primary, a partir de 8 anos, e TOEFL® Junior, a partir de 11',
      'Aplicação na sua escola, polo ou faculdade, conduzida pela International — Centro Autorizado ETS',
      'Relatório de cada aluno e o retrato da turma: pontos fortes, lacunas e evolução ano a ano',
      'Um diferencial concreto para apresentar às famílias',
    ],
    tituloFormulario: 'Conte sobre a sua instituição',
    textoFormulario:
      'A equipe da International monta a proposta de avaliação e chama você para conversar.',
  },
  empresa: {
    id: 'avaliar-colaboradores',
    sobretitulo: 'TOEIC® para empresas',
    titulo: 'Quero avaliar meus colaboradores',
    destaque: 'meus colaboradores',
    texto:
      'A sua empresa pode contratar os cursos — ou só a avaliação: o TOEIC® aplicado pela International ' +
      'no processo seletivo ou na equipe atual.',
    pontos: [
      'TOEIC® Listening & Reading ou a avaliação completa das quatro habilidades',
      'Na contratação: o inglês dos candidatos medido no padrão internacional',
      'Na equipe: o nível de cada colaborador e o resultado do treinamento',
      'Aplicação na empresa, na International ou on-line',
    ],
    tituloFormulario: 'Conte sobre a sua empresa',
    textoFormulario:
      'A equipe da International monta a proposta de avaliação e chama você para conversar.',
  },
} as const

// ── Parcerias ─────────────────────────────────────────────────────────────

export const PARCERIAS = {
  path: '/parcerias',
  rotulo: 'Parcerias',
  sobretitulo: 'Parcerias · K-12',
  titulo: 'Leve a International para a sua escola',
  destaque: 'para a sua escola',
  subtitulo:
    'O programa que leva um centro de línguas International — e as certificações internacionais da ' +
    'ETS — para dentro da sua escola ou polo universitário, com descontos para a sua comunidade e ' +
    'coparticipação nos resultados.',
  /** Os três pontos do catálogo (página K-12), com o porquê de cada um. */
  beneficios: [
    {
      titulo: 'Mais serviços, sem montar estrutura',
      texto:
        'A sua instituição passa a oferecer idiomas com a metodologia personalizada da International — ' +
        'sem precisar criar um departamento para isso.',
    },
    {
      titulo: 'Descontos para a comunidade escolar',
      texto:
        'Alunos, famílias e colaboradores da escola parceira estudam com condições exclusivas, perto de ' +
        'onde já estão todos os dias.',
    },
    {
      titulo: 'Coparticipação nos resultados',
      texto: 'A escola parceira recebe uma porcentagem dos resultados do centro de línguas.',
    },
  ],
  publico: [
    {
      titulo: 'Escolas de educação básica',
      texto: 'Educação infantil, ensino fundamental e médio.',
    },
    { titulo: 'Polos universitários', texto: 'Idiomas para alunos de graduação e pós.' },
    {
      titulo: 'Empresas',
      texto:
        'Idiomas como benefício para colaboradores e dependentes, em turma, on-line ou presencial, nos ' +
        'dias e horários que funcionam para a equipe.',
      path: '/in-company',
    },
  ],
  passos: [
    { titulo: 'Conversa', texto: 'Entendemos a sua instituição, o público e o espaço disponível.' },
    {
      titulo: 'Proposta sob medida',
      texto: 'Idiomas, turmas, horários e as condições da parceria.',
    },
    {
      titulo: 'Implantação',
      texto: 'Divulgação para a comunidade, nivelamento e início das turmas.',
    },
    {
      titulo: 'Acompanhamento',
      texto: 'A International segue ao lado da escola durante todo o programa.',
    },
  ],
  idiomas: ['Inglês', 'Espanhol', 'Francês'],
  perguntas: [
    {
      pergunta: 'Que tipo de instituição pode ser parceira?',
      resposta:
        'Escolas de educação básica e polos universitários, pelo programa K-12, e empresas que querem ' +
        'oferecer idiomas como benefício.',
    },
    {
      pergunta: 'A International aplica provas internacionais dentro da minha escola?',
      resposta:
        'Sim. Como Centro Autorizado ETS, a International conduz a TOEFL® Young Students Series ' +
        '(Primary, a partir de 8 anos, e Junior, a partir de 11) dentro da sua instituição, com ' +
        'relatório de cada aluno e da turma.',
    },
    {
      pergunta: 'Onde acontecem as aulas?',
      resposta:
        'Na própria instituição parceira — é um centro de línguas dentro dela. Para empresas, também ' +
        'on-line ou na International.',
    },
    {
      pergunta: 'Quais idiomas o programa oferece?',
      resposta: 'Inglês, espanhol e francês.',
    },
    {
      pergunta: 'Como a escola parceira ganha com isso?',
      resposta:
        'Amplia os serviços que oferece, a comunidade estuda com desconto e a escola recebe coparticipação ' +
        'nos resultados. As condições saem na proposta.',
    },
  ] as readonly Pergunta[],
  mensagem:
    'Olá! Quero saber como levar a International para a minha instituição (programa de parcerias K-12).',
  mensagemEmpresa:
    'Olá! Quero oferecer idiomas como benefício para os colaboradores da minha empresa.',
  seo: {
    titulo: 'Parcerias: leve a International para a sua escola | International',
    descricao:
      'Programa K-12: um centro de línguas International dentro da sua escola ou polo universitário, ' +
      'com descontos para a comunidade e coparticipação nos resultados.',
  },
}

// ── Blog ──────────────────────────────────────────────────────────────────

type BlocoPost =
  | { tipo: 'p'; texto: string }
  | { tipo: 'h2'; texto: string }
  | { tipo: 'lista'; itens: readonly string[] }
  | { tipo: 'cta'; texto: string; path: string }

export type Post = {
  slug: string
  titulo: string
  resumo: string
  /** ISO — a data de publicação, e não a do build. */
  data: string
  categoria: string
  minutos: number
  blocos: readonly BlocoPost[]
}

export const BLOG = {
  path: '/blog',
  rotulo: 'Blog',
  titulo: 'Blog da International',
  destaque: 'International',
  subtitulo: 'Idiomas, exames internacionais e aprendizado — sem enrolação.',
  seo: {
    titulo: 'Blog da International | Idiomas e exames internacionais',
    descricao:
      'Guias sobre exames de inglês (IELTS, TOEFL®, TOEIC®, SAT), níveis do CEFR e aprendizado de ' +
      'idiomas para crianças, adolescentes e adultos.',
  },
} as const

export const POSTS: readonly Post[] = [
  {
    slug: 'qual-exame-de-ingles-fazer',
    titulo: 'IELTS, TOEFL®, TOEIC®, Duolingo ou Cambridge: qual exame de inglês fazer?',
    resumo:
      'Cada exame foi feito para um objetivo. Veja para que serve cada um e como escolher sem perder tempo nem dinheiro.',
    data: '2026-10-08',
    categoria: 'Exames internacionais',
    minutos: 5,
    blocos: [
      {
        tipo: 'p',
        texto:
          'A pergunta certa não é “qual é o melhor exame”, e sim “qual exame o meu destino aceita”. ' +
          'Universidades, empresas e órgãos de imigração dizem quais provas aceitam e qual nota mínima ' +
          'pedem. Comece por lá. Depois, use este guia para entender as diferenças.',
      },
      { tipo: 'h2', texto: 'IELTS' },
      {
        tipo: 'p',
        texto:
          'Avalia as quatro habilidades: leitura, escrita, compreensão oral e conversação. Tem duas ' +
          'versões: Academic, para quem vai estudar, e General Training, comum em processos de ' +
          'trabalho e imigração. É muito aceito no Reino Unido, no Canadá, na Austrália e na Irlanda.',
      },
      { tipo: 'h2', texto: 'TOEFL®' },
      {
        tipo: 'p',
        texto:
          'O TOEFL® iBT mede o inglês acadêmico nas quatro habilidades e é uma das provas mais pedidas ' +
          'por universidades nos Estados Unidos e no Canadá. Já o TOEFL® ITP avalia ' +
          'compreensão oral, estrutura gramatical e leitura, e é usado por instituições em programas ' +
          'próprios, como ' +
          'intercâmbios e nivelamentos — confira se o seu destino aceita o ITP antes de escolher.',
      },
      { tipo: 'h2', texto: 'TOEIC®' },
      {
        tipo: 'p',
        texto:
          'É o exame do inglês no trabalho: reuniões, e-mails, apresentações, viagens de negócio. ' +
          'Empresas usam o TOEIC® em seleção e promoção, e ele é uma boa forma de comprovar o inglês ' +
          'no currículo.',
      },
      { tipo: 'h2', texto: 'Duolingo English Test (DET)' },
      {
        tipo: 'p',
        texto:
          'Feito on-line, do computador, com questões que se adaptam ao seu desempenho. Ganhou espaço ' +
          'em admissões de universidades — mas a aceitação varia de instituição para instituição, ' +
          'então verifique antes.',
      },
      { tipo: 'h2', texto: 'Cambridge English' },
      {
        tipo: 'p',
        texto:
          'Exames por nível, do Young Learners, para crianças, ao C2 Proficiency. O certificado não ' +
          'tem validade, o que faz sentido para quem quer comprovar o nível de forma permanente.',
      },
      { tipo: 'h2', texto: 'Resumo rápido' },
      {
        tipo: 'lista',
        itens: [
          'Vai estudar fora? Veja se o destino pede IELTS Academic, TOEFL® iBT, DET ou Cambridge.',
          'Vai trabalhar com inglês no Brasil ou em multinacional? TOEIC®.',
          'Processo de imigração? Geralmente IELTS General Training — confirme no órgão oficial.',
          'Quer um certificado de nível sem validade? Cambridge.',
          'Quer graduação nos EUA? Além do exame de inglês, muitas universidades pedem o SAT.',
        ],
      },
      {
        tipo: 'cta',
        texto: 'Veja os preparatórios e as provas que você agenda na International',
        path: '/preparatorios-e-certificacoes',
      },
    ],
  },
  {
    slug: 'niveis-cefr-a1-a-c2',
    titulo: 'A1, B2, C1: o que significam os níveis de inglês do CEFR',
    resumo:
      'O CEFR é a régua internacional de idiomas. Entenda os seis níveis e descubra onde você está.',
    data: '2026-10-08',
    categoria: 'Aprendizado',
    minutos: 4,
    blocos: [
      {
        tipo: 'p',
        texto:
          'O Quadro Europeu Comum de Referência para Línguas (CEFR, na sigla em inglês) descreve o que ' +
          'uma pessoa consegue fazer em um idioma, em seis níveis. Escolas, universidades, empresas e ' +
          'exames como IELTS, TOEFL® e Cambridge usam essa mesma escala.',
      },
      { tipo: 'h2', texto: 'Usuário básico: A1 e A2' },
      {
        tipo: 'lista',
        itens: [
          'A1 — entende e usa expressões do dia a dia, apresenta-se e faz perguntas simples.',
          'A2 — conversa sobre assuntos familiares (família, compras, trabalho) e resolve tarefas simples.',
        ],
      },
      { tipo: 'h2', texto: 'Usuário independente: B1 e B2' },
      {
        tipo: 'lista',
        itens: [
          'B1 — se vira em viagens, conta experiências e dá opiniões com frases simples.',
          'B2 — conversa com fluência com falantes nativos e entende textos e discussões mais técnicas.',
        ],
      },
      { tipo: 'h2', texto: 'Usuário proficiente: C1 e C2' },
      {
        tipo: 'lista',
        itens: [
          'C1 — usa o idioma com flexibilidade no trabalho e nos estudos, inclusive em textos longos e complexos.',
          'C2 — entende praticamente tudo o que ouve e lê e se expressa com precisão, mesmo em situações complexas.',
        ],
      },
      {
        tipo: 'p',
        texto:
          'Na International, os certificados de cada curso descrevem as competências de comunicação de ' +
          'acordo com o CEFR — então você sabe exatamente em que nível terminou.',
      },
      { tipo: 'cta', texto: 'Conheça os cursos para cada fase da vida', path: '/' },
    ],
  },
  {
    slug: 'com-que-idade-comecar-ingles',
    titulo: 'Com que idade a criança pode começar a aprender inglês?',
    resumo:
      'Não existe idade mínima para ter contato com outro idioma. O que muda é a forma de ensinar em cada fase.',
    data: '2026-10-08',
    categoria: 'Kids',
    minutos: 3,
    blocos: [
      {
        tipo: 'p',
        texto:
          'Crianças pequenas aprendem idiomas brincando: por música, histórias, jogos e rotina — não por ' +
          'regras de gramática. Por isso o mais importante não é a idade, e sim um método adequado a ela.',
      },
      { tipo: 'h2', texto: 'O que observar em um curso para crianças' },
      {
        tipo: 'lista',
        itens: [
          'Turmas pequenas, para cada criança participar de verdade.',
          'Aulas com atividades, e não só livro e caderno.',
          'Nos primeiros níveis, não exigir que a criança já saiba ler e escrever.',
          'Acompanhamento do progresso sem a pressão de provas tradicionais.',
        ],
      },
      { tipo: 'h2', texto: 'E na International?' },
      {
        tipo: 'p',
        texto:
          'O Interkids começa aos 4 anos, com turmas de até 8 alunos. O inglês entra por arte, culinária, ' +
          'histórias e a cultura de crianças do mundo todo — e também está disponível em espanhol e ' +
          'francês.',
      },
      { tipo: 'cta', texto: 'Conheça o Interkids', path: '/kids' },
    ],
  },
  {
    slug: 'sat-o-que-e',
    titulo: 'SAT: o que é e por que ele importa para estudar nos Estados Unidos',
    resumo:
      'O SAT é um dos exames usados na admissão das universidades americanas. Veja como ele é e como se preparar.',
    data: '2026-10-08',
    categoria: 'Exames internacionais',
    minutos: 4,
    blocos: [
      {
        tipo: 'p',
        texto:
          'O SAT é um exame de admissão aplicado pelo College Board e usado por universidades dos Estados ' +
          'Unidos para avaliar candidatos à graduação. Muitas o exigem; outras aceitam como opcional — e ' +
          'um bom resultado também pesa na disputa por bolsas de estudo.',
      },
      { tipo: 'h2', texto: 'Como a prova é organizada' },
      {
        tipo: 'lista',
        itens: [
          'Duas seções: Reading and Writing (leitura e escrita) e Math (matemática).',
          'A prova é digital e adaptativa: as questões se ajustam ao desempenho.',
          'A nota total vai de 400 a 1600.',
        ],
      },
      { tipo: 'h2', texto: 'O SAT é uma prova de inglês?' },
      {
        tipo: 'p',
        texto:
          'Não exatamente: ele avalia leitura, escrita e matemática — mas tudo em inglês, no nível de quem ' +
          'termina o ensino médio americano. Por isso a parte de Reading and Writing é a que mais exige ' +
          'preparação de quem estudou no Brasil.',
      },
      {
        tipo: 'p',
        texto:
          'A International é a primeira escola de idiomas de Goiás com um preparatório completo ' +
          'para o SAT Reading & Writing, para quem está a caminho de uma universidade americana.',
      },
      { tipo: 'cta', texto: 'Veja o preparatório de SAT', path: '/preparatorios-e-certificacoes' },
    ],
  },
  {
    slug: 'toeic-qual-versao-fazer',
    titulo: 'TOEIC®: Listening & Reading, Speaking & Writing ou 4 Skills?',
    resumo:
      'O TOEIC® tem três versões. Veja o que cada uma mede, quanto tempo leva e qual a sua empresa ou vaga provavelmente pede.',
    data: '2026-10-08',
    categoria: 'Exames internacionais',
    minutos: 4,
    blocos: [
      {
        tipo: 'p',
        texto:
          'O TOEIC® é o exame de inglês mais usado por empresas no mundo para medir o inglês do trabalho. ' +
          'Mas “fazer o TOEIC®” pode significar três provas diferentes — e escolher a errada custa tempo.',
      },
      { tipo: 'h2', texto: 'TOEIC® Listening & Reading' },
      {
        tipo: 'p',
        texto:
          'A versão mais pedida em processos seletivos. São 200 questões de múltipla escolha em cerca de ' +
          'duas horas: 100 de compreensão oral (fotos, perguntas e respostas, diálogos) e 100 de leitura ' +
          '(frases para completar, textos curtos e longos). A nota vai de 10 a 990.',
      },
      { tipo: 'h2', texto: 'TOEIC® Speaking & Writing' },
      {
        tipo: 'p',
        texto:
          'Mede o que você produz: fala (11 tarefas, cerca de 20 minutos) e escrita (8 tarefas, cerca de ' +
          'uma hora), cada parte com nota de 0 a 200. Dá para fazer as duas ou só uma. É a escolha de ' +
          'quem precisa provar que se comunica em reuniões, apresentações e e-mails.',
      },
      { tipo: 'h2', texto: 'TOEIC® 4 Skills' },
      {
        tipo: 'p',
        texto:
          'Junta as quatro habilidades — ouvir, ler, falar e escrever — num só resultado. Faz sentido ' +
          'quando a vaga ou o programa pede o inglês completo.',
      },
      { tipo: 'h2', texto: 'Como escolher' },
      {
        tipo: 'lista',
        itens: [
          'A vaga ou a empresa pede “TOEIC®” sem dizer qual? Quase sempre é o Listening & Reading.',
          'Vai trabalhar falando inglês com clientes ou equipes de fora? Speaking & Writing.',
          'Precisa comprovar tudo de uma vez? 4 Skills.',
          'Prazo curto? Um intensivo focado no formato da prova faz diferença.',
        ],
      },
      {
        tipo: 'p',
        texto:
          'A International é Centro Autorizado ETS e aplica as três versões, presencialmente — e o ' +
          'Listening & Reading também on-line —, além de preparatório, simulados e intensivo de TOEIC®.',
      },
      {
        tipo: 'cta',
        texto: 'Agende o seu TOEIC® ou veja o intensivo',
        path: '/preparatorios-e-certificacoes',
      },
    ],
  },
]

export function postDe(path: string): Post | undefined {
  const slug = path.replace(/^\/blog\//, '')
  return POSTS.find((p) => p.slug === slug)
}
