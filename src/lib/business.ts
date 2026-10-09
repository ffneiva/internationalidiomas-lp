/**
 * TODO o conteúdo da landing page. Fonte única de verdade.
 *
 * Daqui saem a página, o JSON-LD, o llms.txt, o <noscript> e todas as
 * mensagens de WhatsApp. Texto que o visitante lê não mora em componente.
 *
 * Importado também pelo vite.config.ts (no build), então nada aqui pode tocar
 * em `window` ou em DOM.
 *
 * ── Regras de conteúdo (ver AGENTS.md) ──────────────────────────────────────
 *
 * · Nada inventado. Número sem fonte não vai para a tela.
 * · O que não foi confirmado com a escola está marcado CONFIRMAR e listado no
 *   DEPLOY.md. Os números do briefing que ainda não têm prova (nota do Google,
 *   total de alunos…) ficam em PROVAS com `confirmado: false` — a página NÃO
 *   os mostra enquanto a chave não virar.
 * · Nenhuma promessa de prazo ou resultado ("fluente em X meses"). Política do
 *   Google Ads (alegações não confiáveis) e CDC art. 37.
 * · TOEIC, TOEFL, IELTS, Cambridge e SAT são marcas dos donos delas. A escola
 *   PREPARA para os exames e é Centro Autorizado ETS (TOEFL ITP, TOEIC e TOEFL
 *   Young Students Series). NÃO aplica o TOEFL iBT — só prepara. Selos: só os
 *   do material autorizado pela escola (SELOS), sem alterar.
 */

import { ALVO } from './alvo.ts'

/**
 * O endereço oficial de cada produto, no domínio da escola (hospedado no
 * cPanel dela desde 10/2026): o site em internationalidiomas.com.br e a LP em
 * ingles.internationalidiomas.com.br. As prévias em *.abramdigital.com.br
 * usam o mesmo build — a canonical aponta para cá, então o Google consolida
 * tudo no domínio da escola.
 */
export const SITE_URL =
  ALVO === 'site'
    ? 'https://internationalidiomas.com.br'
    : 'https://ingles.internationalidiomas.com.br'

/**
 * No índice do Google: o site institucional, sim (é o endereço da escola);
 * a LP de anúncio, não — ela repete o site e competiria com ele. Uma prévia
 * pode forçar `VITE_INDEXAVEL=0` no build.
 */
const indexavelEnv = (
  (import.meta as { env?: Record<string, string | undefined> }).env ??
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
)?.VITE_INDEXAVEL
export const INDEXAVEL = indexavelEnv ? indexavelEnv === '1' : ALVO === 'site'

export const ESCOLA = {
  nome: 'International Idiomas',
  curto: 'International',
  /** O lema do logo novo (Canva da escola, 08/10/2026). "Idiomas e tecnologia"
   *  saiu: a escola não oferece mais cursos de tecnologia (Intertech). */
  lema: 'idiomas personalizados',
  /** "desde 2017" é o que a própria escola publica (site e LinkedIn). O CNPJ
   *  (AA Idiomas Ltda) é de 04/2018. CONFIRMAR antes de usar em anúncio. */
  desde: 2017,
  telefone: '(62) 3928-2166',
  /** O mesmo número do fixo, com WhatsApp: confirmado pela escola (03/10/2026). */
  whatsapp: '556239282166',
  endereco: {
    rua: 'Av. T-1, 2642',
    complemento: 'Quadra 105-A, Lote 65',
    bairro: 'Setor Bueno',
    cidade: 'Goiânia',
    uf: 'GO',
    cep: '74215-022',
  },
  instagram: 'interidiomas',
  youtube: 'https://www.youtube.com/@international760',
  facebook: 'https://www.facebook.com/inglesinternational/',
  linkedin: 'https://br.linkedin.com/company/international-escola-de-idiomas',
  /** O perfil da unidade Setor Bueno no Google (kgmid do rodapé do site). */
  google:
    'https://www.google.com/search?kgmid=/g/11h3kwy7zz&q=International+Idiomas+%7C+Curso+de+Ingl%C3%AAs+Goi%C3%A2nia',
} as const

/**
 * As duas unidades (Sobre a Inter / Correios). A de Trindade entrou na LP e no
 * JSON-LD a pedido da escola (08/10/2026: "Setor Bueno em Goiânia - Setor
 * Carvelo em Trindade").
 */
export const UNIDADES = [
  {
    id: 'goiania',
    nome: 'Goiânia · Setor Bueno',
    rua: 'Av. T-1, 2642, Qd. 105-A, Lt. 65',
    bairro: 'Setor Bueno',
    cidade: 'Goiânia',
    uf: 'GO',
    cep: '74215-022',
  },
  {
    id: 'trindade',
    nome: 'Trindade · Setor Carvelo',
    rua: 'Av. Manoel Monteiro, 55',
    bairro: 'Setor Carvelo',
    cidade: 'Trindade',
    uf: 'GO',
    cep: '75388-600',
  },
] as const

/** "Como chegar" no Google Maps, para cada unidade. */
export function rotaDaUnidade(u: (typeof UNIDADES)[number]): string {
  const destino = `International Idiomas, ${u.rua}, ${u.bairro}, ${u.cidade} - ${u.uf}, ${u.cep}`
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}`
}

export const ENDERECO_LINHA = `${ESCOLA.endereco.rua} – ${ESCOLA.endereco.bairro}, ${ESCOLA.endereco.cidade} – ${ESCOLA.endereco.uf}`

const destino = encodeURIComponent(
  `International Idiomas, ${ESCOLA.endereco.rua}, ${ESCOLA.endereco.bairro}, ${ESCOLA.endereco.cidade} - ${ESCOLA.endereco.uf}, ${ESCOLA.endereco.cep}`,
)
export const MAPA = {
  rota: `https://www.google.com/maps/dir/?api=1&destination=${destino}`,
  embed: `https://www.google.com/maps?q=${destino}&z=16&output=embed`,
}

/**
 * A mensagem que abre a conversa. É a do briefing, com o final que o
 * documento cortou ("…do curso de inglês da") completado com o nome.
 */
export const MENSAGEM_PADRAO =
  ALVO === 'site'
    ? // A do 2º documento (site institucional), sem alteração.
      'Olá! Vim pelo site da International e gostaria de saber mais sobre os cursos.'
    : 'Olá! Vim pelo site e gostaria de saber mais sobre o curso de inglês da International.'

/**
 * Provas do briefing que ainda não têm fonte. A página só mostra o que estiver
 * `confirmado: true` — virar a chave é uma linha, e o bloco aparece.
 */
export const PROVAS = {
  /** Escola, 08/10/2026: "mais de 150 avaliações 5 estrelas" (antes, +140). */
  google: { nota: '5,0', total: 150, confirmado: true },
  /** Site: "3000+"; Instagram: "+10 mil alunos já passaram por aqui". Vale o
   *  maior, por decisão do cliente (via Felipe). */
  alunos: { texto: '+10 mil alunos', confirmado: true },
  /** "10 anos de experiência" (contador da home do site atual). Vale o maior. */
  anos: { texto: '10+ anos de experiência', confirmado: true },
  /** Escola, 03/10/2026: "Somos centro aplicador (TOEFL iTP, TOEIC, TOEFL
   *  Young Learners). Não aplicamos TOEFL iBT". O nome oficial da linha
   *  infantil, no selo, é TOEFL Young Students Series (Primary e Junior). */
  aplicador: {
    texto: 'Centro aplicador TOEFL ITP, TOEIC e TOEFL Young Students',
    confirmado: true,
  },
  /** Escola, 08/10/2026: "Preparatórios de IELTS, TOEFL, TOEIC e SAT" (antes,
   *  só TOEFL e SAT). */
  especialidade: {
    texto: 'Especialistas nos preparatórios de IELTS, TOEFL, TOEIC e SAT',
    confirmado: true,
  },
} as const

/**
 * As marcas ETS no padrão NOVO que a escola usa ("Cabeçalho 2023", páginas 1
 * e 2; 08/10/2026: "não podemos mais usar estas logos" — os selos redondos).
 * Vetorizadas dos originais do PDF, com as cores originais; `largura` é a
 * proporção para 40 px de altura.
 */
export const SELOS = {
  ets: [
    { arquivo: 'ets-toefl-young-students.svg', nome: 'TOEFL Young Students Series', largura: 68 },
    { arquivo: 'ets-toefl-primary.svg', nome: 'TOEFL Primary', largura: 73 },
    { arquivo: 'ets-toefl-junior.svg', nome: 'TOEFL Junior', largura: 61 },
    { arquivo: 'ets-toeic.svg', nome: 'TOEIC', largura: 107 },
  ],
  sat: { nome: 'SAT', legenda: 'SAT · personalized prep course' },
} as const

// ── Herói ─────────────────────────────────────────────────────────────────

export const HEROI = {
  sobretitulo: 'Curso de inglês em Goiânia',
  titulo: 'Aprenda inglês para usar',
  destaque: 'de verdade.',
  subtitulo:
    'Curso de inglês para crianças, adolescentes e adultos, com aprendizado que respeita seu ritmo e seus objetivos.',
  diferenciais: [
    'Crianças, adolescentes e adultos',
    'Unidades em Goiânia e Trindade',
    'Ensino personalizado',
    'Do iniciante ao avançado',
  ],
  cta: 'Quero conhecer o curso',
} as const

// ── Autoridade e prova ────────────────────────────────────────────────────

export const AUTORIDADE = {
  sobretitulo: 'Autoridade e certificações',
  // Textos do sitemap validado pela agência (seção 02), sem alteração.
  titulo: 'Um ensino reconhecido',
  destaque: 'dentro e fora do Brasil.',
  texto:
    'Na International, você aprende inglês com uma formação que te prepara para oportunidades acadêmicas, profissionais e internacionais.',
  rotuloExames: 'Preparação para certificações internacionais:',
  notaExames:
    'Certificações reconhecidas internacionalmente para quem busca estudar, trabalhar e construir oportunidades no exterior.',
  aviso:
    'TOEIC®, TOEFL®, TOEFL Young Students Series e TFI® são marcas registradas da ETS; SAT® é marca registrada do College Board; IELTS e Cambridge pertencem aos respectivos proprietários. A International é Centro Autorizado ETS para TOEIC, TOEFL ITP, TOEFL Young Students Series e TFI e oferece preparação para os demais exames (não aplica o TOEFL iBT).',
} as const

/**
 * Os preparatórios que a escola listou (03/10/2026): TOEFL iBT e ITP, TOEIC,
 * Cambridge, IELTS e SAT R&W, a partir de 14 anos, presenciais ou online.
 * O DET (Duolingo English Test) entrou com o catálogo de serviços (08/10/2026,
 * "DET PREP"). O CELPIP do briefing saiu: não está na lista da escola.
 * `especialidade`: IELTS, TOEFL, TOEIC e SAT (escola, 08/10/2026).
 */
export type Exame = { sigla: string; nome: string; para: string; especialidade?: true }

export const EXAMES: readonly Exame[] = [
  {
    sigla: 'TOEFL',
    nome: 'Test of English as a Foreign Language',
    para: 'Universidades nos EUA e no Canadá',
    especialidade: true,
  },
  {
    sigla: 'SAT',
    nome: 'SAT — preparatório de Reading & Writing',
    para: 'Graduação nos Estados Unidos',
    especialidade: true,
  },
  {
    sigla: 'IELTS',
    nome: 'International English Language Testing System',
    para: 'Estudo, trabalho e imigração',
    especialidade: true,
  },
  {
    sigla: 'TOEIC',
    nome: 'Test of English for International Communication',
    para: 'Inglês no mercado de trabalho',
    especialidade: true,
  },
  {
    sigla: 'DET',
    nome: 'Duolingo English Test',
    para: 'Admissão em universidades que aceitam o DET',
  },
  {
    sigla: 'Cambridge',
    nome: 'Cambridge English Qualifications',
    para: 'Do Young Learners ao C2',
  },
]

export type Depoimento = {
  id: string
  nome: string
  contexto: string
  /** Frase publicada pela escola no site (primeira pessoa quando é do aluno). */
  frase: string
  youtube: string
  foto: string
  titulo: string
}

/**
 * Vídeos reais do canal da escola no YouTube (@international760). O texto é o
 * que a própria escola publicou junto de cada um no site atual.
 */
export const DEPOIMENTOS: readonly Depoimento[] = [
  {
    id: 'anna',
    nome: 'Anna',
    contexto: 'Aluna há um ano e meio',
    frase: 'Entrei sem falar nada. Hoje eu me sinto segura para falar inglês.',
    youtube: 'FE6KPie2PK4',
    foto: 'depoimento-anna',
    titulo: 'Vídeo depoimento – Anna',
  },
  {
    id: 'ronan',
    nome: 'Ronan',
    contexto: 'Advogado · aluno desde 2019',
    frase:
      'Numa viagem à Europa, sentiu falta de conversar com as pessoas de lá. Voltou, virou aluno — e a viagem seguinte foi outra.',
    youtube: 'qa21WSLAcWc',
    foto: 'depoimento-ronan',
    titulo: 'Vídeo depoimento – Ronan',
  },
  {
    id: 'festival',
    nome: 'Projeto de aluno',
    contexto: 'Nível Pré-Intermediário',
    frase:
      '“A festival I have been to” — o projeto de fim de módulo, em inglês, no lugar da prova.',
    youtube: 'da7CROvlkgI',
    foto: 'projeto-festival',
    titulo: 'Projeto Pré-Intermediário – A Festival I have been to',
  },
]

/**
 * Avaliações do Google (seção 02 do sitemap: "prints das melhores avaliações,
 * carrossel ou cards"). Transcritas do perfil da escola no Google Maps (levantado
 * pelo Felipe em 10/2026), com o nome encurtado (nome + inicial). Ficaram de
 * fora as que prometem prazo ("1 ano e já estou quase fluente") — política do
 * Google Ads — e as de outros cursos (informática).
 */
export const AVALIACOES: readonly {
  nome: string
  texto: string
  /** O ano, calculado da data relativa que o Google mostra ("há 3 meses"). */
  quando: string
  /** A nota daquela avaliação, como está no perfil. */
  estrelas: 1 | 2 | 3 | 4 | 5
}[] = [
  {
    nome: 'Geovanna G.',
    quando: '2026',
    estrelas: 5,
    texto:
      'Minhas aulas começaram em agosto e foi uma das melhores decisões que tomei em 2026. Eu estava com medo de ser “velha demais” para começar o inglês, porém as aulas têm me ajudado muito, não só com o inglês, mas também na minha vida pessoal.',
  },
  {
    nome: 'Anna V.',
    quando: '2024',
    estrelas: 5,
    texto:
      'É uma escola muito boa porque são turmas pequenas com no máximo 8/9 alunos e os professores nos estimulam a falar o tempo todo. A didática é incrível.',
  },
  {
    nome: 'Carolina P.',
    quando: '2026',
    estrelas: 5,
    texto:
      'Simplesmente incrível, tive 20 aulas com o professor Carlos que mudaram a visão de que eu não iria conseguir uma boa nota para uma aluna confiante que soube resolver muitos problemas que apareceram pela frente. Obrigada por tanto!',
  },
  {
    nome: 'Luiz Guilherme A.',
    quando: '2023',
    estrelas: 5,
    texto:
      'Gosto muito da metodologia de ensino da escola e estou aprendendo muito! Já passei por outras escolas de inglês e hoje sinto que finalmente “tá fluindo”. Inclusive indiquei minha mãe para poder começar a estudar também.',
  },
  {
    nome: 'Rita A.',
    quando: '2024',
    estrelas: 5,
    texto:
      'Estou muito satisfeita com o resultado do meu filho no curso. Pela primeira vez, após muitos cursos, vejo entusiasmo e vontade dele em fazer as aulas de inglês. Gratidão!',
  },
  {
    nome: 'Deborah V.',
    quando: '2026',
    estrelas: 5,
    texto:
      'Estive tendo acesso às aulas de preparação para a seção de Reading & Writing do SAT e a minha experiência foi incrível! Professores muito atenciosos e dedicados, além de uma excelente didática que contribuiu muito para a minha evolução.',
  },
  {
    nome: 'Eduarda S.',
    quando: '2026',
    estrelas: 5,
    texto:
      'Excelente escola de inglês! Professores muito qualificados, atenciosos. As aulas são dinâmicas, bem organizadas e ajudam bastante no desenvolvimento da conversação, gramática e vocabulário.',
  },
  {
    nome: 'Thalia S.',
    quando: '2024',
    estrelas: 5,
    texto:
      'Experiência incrível, a conversação desde a primeira aula ajuda bastante no desenvolvimento.',
  },
  {
    nome: 'Sabrina D.',
    quando: '2025',
    estrelas: 5,
    texto:
      'Uma ótima escola que acolhe as crianças de forma inclusiva e carinhosa. Meu filho está amando estudar aqui.',
  },
  {
    nome: 'Isabela A.',
    quando: '2025',
    estrelas: 5,
    texto:
      'Eu adoro o inglês daqui, porque eu me sinto mais livre pra perguntar e os professores explicam de uma forma claríssima!',
  },
  {
    nome: 'Kassya A.',
    quando: '2023',
    estrelas: 5,
    texto:
      'Ótimo, ambiente super agradável, professores sensacionais! Já fiz inglês em outros locais e admito que esse, com certeza, foi o melhor!',
  },
  {
    nome: 'Maria Eduarda B.',
    quando: '2026',
    estrelas: 5,
    texto:
      'Tive a incrível oportunidade de estudar para o SAT com a International Idiomas. Em pouco tempo, aprendi técnicas valiosas para a prova e recebi materiais de estudos para continuar colocando em prática o que aprendi nas aulas!',
  },
  {
    nome: 'Hiedil M.',
    quando: '2022',
    estrelas: 5,
    texto:
      'Estou gostando muito da experiência da minha filha com o aprendizado na escola. É a primeira experiência com o inglês e ela está amando; a professora é muito prestativa e atenciosa.',
  },
  {
    nome: 'Gabriela C.',
    quando: '2021',
    estrelas: 5,
    texto:
      'Uma ótima escola de inglês. Me proporcionou viajar e entender artigos e congressos em inglês.',
  },
]

export const PROVA_SOCIAL = {
  titulo: 'Quem estuda na International recomenda.',
  subtitulo: 'Veja a experiência de quem já estuda com a gente.',
  avisoResultados: 'Experiências individuais: o ritmo de cada aluno varia.',
  googleSemNota: 'Veja as avaliações no Google',
  cta: 'Quero viver essa experiência',
} as const

// ── Fases ────────────────────────────────────────────────────────────────

export type CursoId = 'kids' | 'teens' | 'highschool' | 'adults' | 'business' | 'incompany'

export type Curso = {
  id: CursoId
  rotulo: string
  nome: string
  para: string
  /** O texto do cartão no sitemap validado pela agência. */
  resumo: string
  /** O detalhe do programa, do site da escola — complemento, em letra menor. */
  texto: string
  marcas: readonly string[]
}

/**
 * Os programas, com o nome que a escola usa. Idades da escola (03/10/2026):
 * Young Learners 4–7, Kids 7–10, High School 10–16, adultos 14+. Teens não
 * entrou na lista dela: fica sem idade até confirmar.
 */
export const CURSOS: Record<CursoId, Curso> = {
  kids: {
    id: 'kids',
    resumo:
      'Aprendizado adequado à idade para construir familiaridade e confiança com o idioma desde cedo.',
    rotulo: 'Kids',
    nome: 'Interkids',
    para: 'Inglês para crianças de 4 a 10 anos',
    texto:
      'O inglês entra brincando: arte, culinária, histórias e a cultura de crianças do mundo todo. Nos primeiros níveis não é preciso saber ler nem escrever.',
    marcas: ['Sem provas: avaliação aula a aula', 'Cambridge Young Learners opcional'],
  },
  teens: {
    id: 'teens',
    resumo: 'Inglês conectado aos estudos, viagens e oportunidades acadêmicas.',
    rotulo: 'Teens',
    nome: 'Global Teens',
    para: 'Inglês para adolescentes',
    texto:
      'Aprendizado por projetos, conectado aos estudos, às viagens e às oportunidades acadêmicas. Prepara para os exames KET, PET e TOEIC.',
    marcas: ['Projetos no lugar de provas', 'Cidadania global'],
  },
  highschool: {
    id: 'highschool',
    resumo: 'Preparação para oportunidades acadêmicas internacionais.',
    rotulo: 'High School',
    nome: 'High School Program',
    para: 'Inglês acadêmico, de 10 a 16 anos',
    texto:
      'Para adolescentes que já têm base: seis níveis de 120 horas, do Pré-A1 ao C1, com o TOEIC como referência e base para TOEFL e IELTS.',
    marcas: ['Turmas reduzidas', 'Debates e apresentações'],
  },
  adults: {
    id: 'adults',
    resumo: 'Desenvolva seu inglês para viagens, carreira, estudos e situações do dia a dia.',
    rotulo: 'Adults',
    nome: 'Inter Adults',
    para: 'Inglês a partir de 14 anos',
    texto: 'Material da National Geographic Learning, em turma ou em aulas individuais.',
    marcas: ['Presencial ou online', 'Turmas de até 8 alunos ou aula individual'],
  },
  business: {
    id: 'business',
    resumo: 'Desenvolva sua comunicação para situações profissionais e novas oportunidades.',
    rotulo: 'Business',
    nome: 'Inglês profissional',
    para: 'Inglês profissional',
    texto:
      'Reuniões, apresentações e negociações — em turma, em aulas individuais ou na sua empresa.',
    marcas: ['Aulas individuais de 1 a 5x por semana', 'Preparatório TOEIC'],
  },
  incompany: {
    id: 'incompany',
    resumo: 'Aulas no próprio ambiente de trabalho da equipe.',
    rotulo: 'In Company',
    nome: 'In Company',
    para: 'Inglês na sua empresa',
    texto:
      'Aulas no próprio ambiente de trabalho, no intervalo, no almoço ou depois do expediente.',
    marcas: ['No horário da equipe'],
  },
}

/**
 * Os idiomas de cada curso — as bandeiras com balão (escola e agência,
 * 08/10/2026: "deixar os idiomas mais explícitos em todas as páginas").
 * A escola informou (03/10/2026) que todos os cursos existem também em
 * espanhol e francês — e o site antigo, o texto do balão que a escola mandou
 * e a prova de francês (TFI) confirmam o francês. As bandeiras do catálogo
 * (só inglês e espanhol) são decorativas. Se algum curso perder um idioma, é
 * uma linha aqui.
 */
export type Idioma = 'en' | 'es' | 'fr'
export const IDIOMAS: Record<Idioma, { nome: string }> = {
  en: { nome: 'Inglês' },
  es: { nome: 'Espanhol' },
  fr: { nome: 'Francês' },
}
const TODOS: readonly Idioma[] = ['en', 'es', 'fr']
export const IDIOMAS_DO_CURSO: Record<CursoId, readonly Idioma[]> = {
  kids: TODOS,
  teens: TODOS,
  highschool: TODOS,
  adults: TODOS,
  business: TODOS,
  incompany: TODOS,
}

/** Os idiomas pela página do site (/kids, /teens…). */
const CURSO_DA_PAGINA: Record<string, CursoId> = {
  '/kids': 'kids',
  '/teens': 'teens',
  '/high-school': 'highschool',
  '/inter-adults': 'adults',
  '/in-company': 'incompany',
}
export function idiomasDaPagina(path: string): readonly Idioma[] | null {
  const id = CURSO_DA_PAGINA[path]
  return id ? IDIOMAS_DO_CURSO[id] : null
}

/** A ordem da seção "Inglês para cada fase da vida". */
export const FASES: readonly CursoId[] = ['kids', 'teens', 'highschool', 'adults', 'business']

export const SECAO_FASES = {
  titulo: 'Inglês para cada fase da vida.',
  texto:
    'Da primeira palavra da criança à reunião em inglês: um caminho só, na mesma escola, com o nível medido pela mesma régua.',
  cta: 'Quero encontrar meu curso',
} as const

// ── Como funciona ────────────────────────────────────────────────────────

export const PASSOS = [
  {
    titulo: 'Entendemos seu momento',
    texto: 'Identificamos seu nível atual e seus objetivos com o inglês.',
  },
  {
    titulo: 'Encontramos o curso ideal',
    texto: 'Você é direcionado para a turma e nível adequado ao seu momento.',
  },
  {
    titulo: 'Inglês na prática',
    texto: 'O idioma é desenvolvido para que você consiga utilizá-lo em situações reais.',
  },
  {
    titulo: 'Acompanhamos sua evolução',
    texto: 'Seu desenvolvimento acontece de forma progressiva ao longo da jornada.',
  },
] as const

export const SECAO_PASSOS = {
  titulo: 'Como você aprende na International?',
  cta: 'Quero conhecer a metodologia',
} as const

// ── Diferenciais ─────────────────────────────────────────────────────────

/**
 * Título e texto de cada cartão: o sitemap validado, sem alteração. O
 * `detalhe` é o que a escola publica no próprio site sobre aquele ponto — a
 * prova concreta do cartão, em letra menor.
 */
export const DIFERENCIAIS = [
  {
    titulo: 'Ensino personalizado',
    texto: 'Aprendizado que considera diferentes ritmos, níveis e objetivos.',
    detalhe:
      'Turma regular duas vezes por semana, aulas individuais de uma a cinco vezes por semana ou grupos fechados do mesmo nível.',
  },
  {
    titulo: 'Conversação',
    texto: 'Desenvolvimento da comunicação para situações reais.',
    detalhe: 'A conversa é o centro das aulas, do básico ao avançado — e há os conversation clubs.',
  },
  {
    titulo: 'Experiência cultural',
    texto: 'Contato com o idioma para além do conteúdo tradicional.',
    detalhe: 'Aulas culturais semanais para praticar fora do livro.',
  },
  {
    titulo: 'Diferentes níveis',
    texto: 'Uma jornada de desenvolvimento do iniciante ao avançado.',
    detalhe: 'Níveis pelo Quadro Europeu (CEFR), do Pré-A1 ao C1.',
  },
  {
    titulo: 'Acompanhamento',
    texto: 'Proximidade durante o processo de aprendizagem.',
    detalhe: 'Cada turma tem um grupo de WhatsApp com professores e learning advisors.',
  },
] as const

export const SECAO_DIFERENCIAIS = {
  titulo: 'Mais do que estudar inglês.',
  destaque: 'Aprenda para usar.',
  cta: 'Quero estudar na International',
} as const

// ── Objetivos ────────────────────────────────────────────────────────────

export type ObjetivoId = 'viagens' | 'carreira' | 'estudos' | 'intercambio' | 'pessoal'

export const OBJETIVOS: readonly {
  id: ObjetivoId
  titulo: string
  texto: string
  mensagem: string
}[] = [
  {
    id: 'viagens',
    titulo: 'Viagens',
    texto: 'Tenha mais autonomia para se comunicar pelo mundo.',
    mensagem: 'quero inglês para viajar',
  },
  {
    id: 'carreira',
    titulo: 'Carreira',
    texto: 'Esteja mais preparado para oportunidades profissionais.',
    mensagem: 'quero inglês para a carreira',
  },
  {
    id: 'estudos',
    titulo: 'Estudos',
    texto: 'Amplie suas possibilidades acadêmicas.',
    mensagem: 'quero inglês para os estudos',
  },
  {
    id: 'intercambio',
    titulo: 'Experiências internacionais',
    texto: 'Prepare-se para intercâmbios e novas experiências.',
    mensagem: 'quero me preparar para um intercâmbio',
  },
  {
    id: 'pessoal',
    titulo: 'Vida pessoal',
    texto: 'Consuma conteúdos e converse com mais confiança.',
    mensagem: 'quero inglês para o dia a dia',
  },
]

/**
 * As rotas do globo 3D: de Goiânia a uma cidade onde o inglês é a língua do
 * dia a dia, uma por objetivo (mesma ordem de OBJETIVOS). Ilustração do
 * "onde o inglês pode levar você" — não é oferta de intercâmbio da escola.
 */
export const GOIANIA = { lat: -16.6869, lon: -49.2648 }

export const DESTINOS = [
  { cidade: 'Nova York', lat: 40.7128, lon: -74.006 },
  { cidade: 'Londres', lat: 51.5074, lon: -0.1278 },
  { cidade: 'Toronto', lat: 43.6532, lon: -79.3832 },
  { cidade: 'Dublin', lat: 53.3498, lon: -6.2603 },
  { cidade: 'Sydney', lat: -33.8688, lon: 151.2093 },
] as const

export const SECAO_OBJETIVOS = {
  titulo: 'Onde o inglês pode levar você?',
  texto: 'Toque no seu objetivo e fale com a equipe — a mensagem já vai com ele.',
  cta: 'Quero dar o próximo passo',
} as const

// ── Localização ──────────────────────────────────────────────────────────

export const LOCALIZACAO = {
  titulo: 'Curso de inglês no Setor Bueno e em Trindade',
  texto:
    'Duas unidades: na Av. T-1, no Setor Bueno, em Goiânia, e no Setor Carvelo, em Trindade. O vídeo mostra o caminho da unidade do Setor Bueno, a partir do Parque Vaca Brava.',
  cta: 'Quero conhecer a escola',
  rota: 'Como chegar',
  mapa: 'Ver no mapa',
} as const

// ── LGPD ─────────────────────────────────────────────────────────────────

/**
 * Os textos de autorização do formulário (escola, 08/10/2026: "caixinha de
 * autorização do tratamento de dados por causa da LGPD"). Duas caixas, nenhuma
 * pré-marcada: o contato é obrigatório para o formulário existir; novidades é
 * opcional e separado (consentimento livre e destacado, art. 8º da LGPD).
 * A `versao` vai junto de cada lead: se o texto mudar, troque a versão — é ela
 * que prova o QUE a pessoa aceitou.
 */
export const CONSENTIMENTO = {
  versao: '2026-10-08',
  contato:
    'Autorizo a International Idiomas a usar meu nome, e-mail e WhatsApp para entrar em contato sobre os cursos.',
  novidades: 'Quero receber novidades e condições especiais da International (opcional).',
  erro: 'Para a gente chamar você, precisamos da sua autorização.',
} as const

// ── Conversão ────────────────────────────────────────────────────────────

export const FECHO = {
  titulo: 'Seu próximo passo no inglês começa aqui.',
  texto:
    'Conte para nossa equipe qual é o seu objetivo e descubra o curso mais adequado para você.',
  cta: 'Quero falar com um consultor',
  nota: 'Atendimento pelo WhatsApp.',
  formTitulo: 'Prefere que a gente fale com você?',
  formTexto: 'Deixe seu contato e a equipe da International chama você.',
  formBotao: 'Quero saber mais',
} as const

export const OBRIGADO = {
  titulo: 'Recebemos seu contato.',
  texto:
    'A equipe da International vai chamar você no WhatsApp informado. Se preferir adiantar a conversa, é só chamar agora.',
  cta: 'Chamar no WhatsApp agora',
  voltar: 'Voltar para a página',
} as const

// ── Perguntas ────────────────────────────────────────────────────────────

/**
 * As respostas saem do FAQ que a escola publica no site. Tempo de curso é
 * dado como a escola dá — média de referência, nunca promessa.
 */
export const FAQ = [
  {
    pergunta: 'Preciso saber meu nível antes de começar?',
    resposta:
      'Não. O primeiro passo é justamente entender seu momento: a equipe identifica seu nível atual e seus objetivos e indica a turma certa.',
  },
  {
    pergunta: 'Vocês têm aulas de conversação?',
    resposta:
      'Sim. A metodologia é imersiva, então a conversação é o centro de todas as aulas, das mais básicas às avançadas. Há também os conversation clubs, só de conversação.',
  },
  {
    pergunta: 'Quanto tempo leva para aprender?',
    resposta:
      'Depende do seu ponto de partida e da carga horária. Como referência, a escola trabalha com uma média de 400 horas-aula para a fluência operacional partindo do básico. Em aulas individuais, dá para chegar a até 800 horas-aula em um ano.',
  },
  {
    pergunta: 'Recebo certificado?',
    resposta:
      'Sim. Ao final de cada curso, o aluno recebe um certificado com as competências de comunicação adquiridas, de acordo com o Quadro Europeu (CEFR).',
  },
  {
    pergunta: 'Vocês preparam para IELTS, TOEFL, TOEIC e SAT? E aplicam provas?',
    resposta:
      'Sim. A International é especialista nos preparatórios de IELTS, TOEFL, TOEIC e SAT (Reading & Writing) — a única escola de idiomas de Goiás com programa completo de SAT Reading & Writing —, e prepara também para o Duolingo English Test e Cambridge, a partir de 14 anos, presencial ou online. E é Centro Autorizado ETS: aplica TOEIC, TOEFL ITP, TOEFL Young Students Series e TFI, de francês (o TOEFL iBT não é aplicado na escola). Datas e inscrição a equipe passa pelo WhatsApp.',
  },
  {
    pergunta: 'O que é o CEFR?',
    resposta:
      'É o Quadro Europeu Comum de Referência para Línguas, a régua internacional de nível: de A1 (iniciante) a C2 (proficiência). Escolas, universidades, empresas e exames como IELTS e TOEFL usam a mesma escala.',
  },
] as const

// ── Rodapé e legal ───────────────────────────────────────────────────────

export const RODAPE = {
  privacidade: 'Política de privacidade',
} as const
