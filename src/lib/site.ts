/**
 * Conteúdo do SITE INSTITUCIONAL (home + páginas de curso + Sobre).
 *
 * Fonte: texto do WordPress atual (_midia-internationalidiomas/texto/*.txt),
 * RESUMO.md, PESQUISA.md e o briefing "Sitemap de otimização para performance".
 *
 * ── O que foi corrigido em relação ao site atual ────────────────────────────
 *
 * · "Sobre a Inter" dizia "escola de Espanhol": a International é uma escola de
 *   idiomas com foco em inglês (também oferece espanhol, francês e português).
 * · In Company: as descrições dos níveis 01–08 eram cópia do Interkids (Teddy
 *   Bear, Lollipop…). Não foram usadas; ficaram só os nomes das trilhas.
 * · Inter Adults: o nível 04 duplicava o 03. Mantido uma vez só.
 * · Kids: "certificado ao final do Inter Kids 4" foi reescrito como "ao final
 *   do percurso", sem número de nível.
 * · "CELPI" → CELPIP, "Internacional" → International, erros de digitação.
 * · Sobras do template de glamping (Luxury Camping etc.) ignoradas.
 *
 * ── Regras ──────────────────────────────────────────────────────────────────
 *
 * · Nada inventado: número, idade, preço ou prazo só se estiver na fonte.
 * · Os números do briefing ficam em HOME_SITE.provas com `confirmado` — a
 *   página só mostra o que estiver `true`.
 * · Especialidade em TOEFL® e SAT e Centro Autorizado ETS (TOEFL® ITP, TOEIC® e
 *   TOEFL® Young Students Series; NÃO o iBT): confirmados pela escola em
 *   02–03/10/2026, com os selos autorizados (components/Selos). Datas e
 *   inscrição ficam com a equipe, no WhatsApp.
 * · O que é ambíguo está marcado com `// CONFIRMAR:`.
 */

type Bloco = { titulo: string; texto: string }
type Nivel = { nome: string; cefr?: string; carga?: string; texto: string }
export type Pergunta = { pergunta: string; resposta: string }

export type PaginaCurso = {
  /** caminho atual do site, SEM barra final: '/kids', '/teens', '/high-school',
   *  '/inter-adults', '/in-company' */
  path: string
  rotulo: string
  nome: string
  publico: string
  titulo: string
  /** sufixo literal de `titulo` que recebe o marca-texto */
  destaque: string
  subtitulo: string
  pilares: readonly Bloco[]
  niveis: readonly Nivel[]
  modalidades: readonly string[]
  diferenciais: readonly Bloco[]
  certificacoes: readonly string[]
  perguntas: readonly Pergunta[]
  mensagemWhatsApp: string
  seo: { titulo: string; descricao: string }
  clientes?: readonly string[]
  trilhas?: readonly string[]
}

/* ── Blocos compartilhados ──────────────────────────────────────────────── */

/**
 * Os seis "Diferenciais" que o site atual repete em todas as páginas de curso.
 * Reescritos de forma curta, sem mudar o que afirmam.
 */
const DIF_IMERSAO: Bloco = {
  titulo: 'Ambiente imersivo',
  texto:
    'Aulas e interações dentro e fora da sala acontecem em inglês, para que o aluno ' +
    'pratique o tempo todo. Como em um intercâmbio.',
}
const DIF_INTERCLASSES: Bloco = {
  titulo: 'Interclasses semanais',
  texto: 'Toda semana, aulas culturais abertas aos alunos para praticar ainda mais o idioma.',
}
const DIF_MATERIAIS: Bloco = {
  titulo: 'Materiais premiados',
  texto:
    'Material didático rigorosamente revisado, de editoras internacionais premiadas ' +
    'pelo British Council, entre outras.',
}
const DIF_SUPORTE: Bloco = {
  titulo: 'Suporte ao vivo',
  texto:
    'Cada turma tem um grupo de WhatsApp com professores e learning advisors para ' +
    'tirar dúvidas em tempo real.',
}
const DIF_VIDA_REAL: Bloco = {
  titulo: 'Projetos no lugar de provas',
  texto:
    'Trocamos a prova tradicional por atividades e projetos que simulam a vida real ' +
    'e colocam o idioma em uso.',
}
/**
 * O site atual cita "realidade virtual e aumentada"; a escola respondeu
 * (03/10/2026) que NÃO tem aulas com RV. Saiu do texto.
 */
const DIF_TECNOLOGIA: Bloco = {
  titulo: 'Tecnologia a favor',
  texto: 'Plataformas de apoio ao aprendizado e recursos audiovisuais e multimídia.',
}

/**
 * Formatos que a escola informou (03/10/2026) para TODOS os cursos, e os
 * idiomas em que cada curso existe.
 */
const AULA_INDIVIDUAL = 'Aulas individuais (um para um), com carga horária personalizável'
const TURMA_REGULAR = 'Turmas regulares de até 8 alunos, com carga horária fixa'
const TURMA_EXCLUSIVA = 'Turmas exclusivas (amigos, família…), com carga horária personalizável'
export const IDIOMAS_CURSOS =
  'Todos os cursos também em espanhol, francês e português para estrangeiros ' +
  '(língua de acolhimento e de herança).'

/** Perguntas que o site atual repete em todos os cursos (respostas reescritas). */
const P_CONVERSACAO: Pergunta = {
  pergunta: 'Vocês têm aulas de conversação?',
  resposta:
    'Sim. Há os conversation clubs, só de conversação. E mesmo nos cursos regulares ' +
    'a metodologia é imersiva: a conversa é o centro de todas as aulas, do básico ao ' +
    'avançado.',
}
const P_CERTIFICADO: Pergunta = {
  pergunta: 'Quando recebo um certificado?',
  resposta:
    'Ao final de cada curso, com as competências de comunicação adquiridas descritas ' +
    'segundo o CEFR, o Quadro Europeu Comum de Referência para Línguas.',
}
const P_CEFR: Pergunta = {
  pergunta: 'O que é o CEFR?',
  resposta:
    'É o padrão internacional que descreve a proficiência em idiomas em seis níveis, ' +
    'do A1 (iniciante) ao C2 (proficiência). Ele mostra com clareza o que o aluno ' +
    'consegue fazer no idioma e é usado por escolas, universidades, empresas e exames ' +
    'como Cambridge, IELTS e TOEFL®.',
}
/** CONFIRMAR: "até 800h/aula ao longo de 1 ano" vem do FAQ atual. */
const P_RAPIDO: Pergunta = {
  pergunta: 'Existe um formato mais rápido?',
  resposta:
    'Sim. Em turma ou em aulas individuais, a carga pode chegar a até 800 horas/aula ' +
    'ao longo de um ano, para quem quer acelerar o processo.',
}

/* ── Páginas de curso ───────────────────────────────────────────────────── */

const KIDS: PaginaCurso = {
  path: '/kids',
  rotulo: 'Kids',
  nome: 'Interkids',
  /** Idades da escola (03/10/2026): Young Learners 4–7, Kids 7–10. */
  publico: 'Para crianças de 4 a 10 anos',
  titulo: 'Inglês para crianças que experimentam o mundo',
  destaque: 'experimentam o mundo',
  subtitulo:
    'No Interkids, a criança começa no idioma global brincando, criando memórias ' +
    'afetivas e descobrindo outras culturas, enquanto se alfabetiza na língua materna.',
  pilares: [
    {
      titulo: 'Ênfase na experiência',
      texto:
        'Gramática, leitura e escrita importam, mas sempre a serviço da oralidade. ' +
        'Culinária, artes, cultura e diversidade entram na aula. Nos primeiros níveis ' +
        'não é preciso saber ler nem escrever.',
    },
    {
      titulo: 'Metodologia imersiva',
      texto:
        'Fotografia, cinema, teatro e histórias reais de crianças do mundo todo. Numa ' +
        'aula sobre os móveis do quarto, a turma compara como é o quarto de crianças em ' +
        'outros países, e desenvolve valores humanos e sociais.',
    },
    {
      titulo: 'Avaliação sem provas',
      texto:
        'Os pequenos são acompanhados aula a aula e desenvolvem projetos de acordo com ' +
        'as próprias capacidades. Não existem provas.',
    },
  ],
  /**
   * Fases "por maturidade e capacidade socioafetiva".
   * CONFIRMAR: o site chama as fases 03, 04 e 05 de Interkids 1, 2 e 3 e a 06 de
   * "último nível do Interkids"; o nome "Interkids 4" foi deduzido.
   */
  niveis: [
    {
      nome: 'Teddy Bear',
      texto:
        'Para quem está entrando na pré-alfabetização. Vocabulário do universo da ' +
        'criança e início do letramento em inglês. Ao fim, ela nomeia as próprias ' +
        'emoções e se comunica com colegas e professores.',
    },
    {
      nome: 'Lollipop',
      texto:
        'Reconhece palavras simples escritas e fala sobre brinquedos, cores, animais, ' +
        'amigos e pessoas, amadurecendo emoções e relações.',
    },
    {
      nome: 'Interkids 1',
      cefr: 'Pré-A1',
      texto:
        'Cumprimenta, identifica cores, objetos escolares, brinquedos, animais e lugares, ' +
        'e diz do que gosta e como se sente.',
    },
    {
      nome: 'Interkids 2',
      cefr: 'A1',
      texto:
        'Fala de lugares no campo, partes do corpo, roupas e destinos de férias, ' +
        'vivenciando valores como gentileza.',
    },
    {
      nome: 'Interkids 3',
      cefr: 'A1+',
      texto:
        'A comunicação fica bem mais fluida: trabalhos, rotinas, clima e celebrações, ' +
        'com valores como respeito às diferenças e responsabilidade.',
    },
    {
      nome: 'Interkids 4',
      cefr: 'A2',
      texto:
        'Nomeia países e cidades, fala de tarefas domésticas, faz pedidos em restaurantes ' +
        'e novos amigos. Pronto para seguir mais a fundo no idioma.',
    },
  ],
  /**
   * CONFIRMAR: o site diz "5 anos - 2x por semana / 3 anos - 3x por semana",
   * "400h em sala de aula + 140h de atividades extraclasse" e "até 6 módulos de
   * 1 ano". Lido aqui como duração total do percurso conforme a frequência; a
   * escola precisa confirmar essa leitura (pode ser idade).
   */
  modalidades: [
    'Young Learners: de 4 a 7 anos',
    'Kids: de 7 a 10 anos',
    'Apenas presencial',
    AULA_INDIVIDUAL,
    TURMA_REGULAR,
    TURMA_EXCLUSIVA,
    '2 encontros por semana (percurso em 5 anos)',
    '3 encontros por semana (percurso em 3 anos)',
    '400 h em sala de aula + 140 h de atividades extraclasse',
  ],
  diferenciais: [
    DIF_IMERSAO,
    DIF_INTERCLASSES,
    DIF_MATERIAIS,
    DIF_SUPORTE,
    DIF_VIDA_REAL,
    DIF_TECNOLOGIA,
  ],
  /**
   * Certificado de nível A2 ao final do percurso, com relatório de crescimento.
   * Exames Cambridge são opcionais e decididos com a família.
   */
  certificacoes: [
    'Certificado International de nível A2 com relatório de crescimento',
    'Cambridge YLE Starters (opcional)',
    'Cambridge YLE Movers (opcional)',
  ],
  perguntas: [
    {
      pergunta: 'Meu filho precisa saber ler para começar?',
      resposta:
        'Não. Nos primeiros níveis não é necessário ler nem escrever: a criança é ' +
        'letrada e alfabetizada em inglês aos poucos.',
    },
    {
      pergunta: 'Como as crianças são avaliadas?',
      resposta:
        'Aula a aula e por meio de projetos adequados à idade. No Interkids não ' +
        'existem provas.',
    },
    {
      pergunta: 'A certificação internacional é obrigatória?',
      resposta:
        'Não. Ao final do percurso o aluno recebe o certificado de nível A2 com um ' +
        'relatório de crescimento. Os exames Cambridge YLE (Starters e Movers) são ' +
        'opcionais e avaliados junto com a família, conforme os objetivos da criança.',
    },
    P_CONVERSACAO,
  ],
  mensagemWhatsApp:
    'Olá! Vim pelo site da International e gostaria de saber mais sobre o Interkids.',
  seo: {
    titulo: 'Inglês para crianças em Goiânia | Interkids · International',
    descricao:
      'Interkids: inglês para crianças em alfabetização, com aulas imersivas, projetos ' +
      'no lugar de provas e fases por maturidade. No Setor Bueno, Goiânia.',
  },
}

const TEENS: PaginaCurso = {
  path: '/teens',
  rotulo: 'Teens',
  nome: 'Global Teens',
  publico: 'Para adolescentes',
  titulo: 'Inglês para adolescentes que pensam globalmente',
  destaque: 'pensam globalmente',
  subtitulo:
    'O Global Teens forma comunicadores globais, críticos e confiantes, preparados ' +
    'para desafios acadêmicos e internacionais, respeitando a fase do adolescente.',
  pilares: [
    {
      titulo: 'Visão educacional',
      texto:
        'Vai além do inglês tradicional: desenvolve fluência, pensamento crítico, ' +
        'autonomia e responsabilidade, respeitando a fase emocional e cognitiva do ' +
        'adolescente.',
    },
    {
      titulo: 'Metodologia PBL',
      texto:
        'Aprendizagem Baseada em Projetos: os alunos resolvem problemas reais, ' +
        'desenvolvem projetos, apresentam ideias e trabalham em equipe. A avaliação é ' +
        'contínua, sem provas tradicionais.',
    },
    {
      titulo: 'Cidadania global',
      texto:
        'Consciência cultural, empatia, responsabilidade social e respeito às ' +
        'diferenças, com o inglês como ferramenta de conexão com o mundo.',
    },
  ],
  niveis: [
    {
      nome: 'Connect',
      carga: '6 meses · 40–50 h',
      texto: 'Base comunicativa e adaptação ao curso.',
    },
    {
      nome: 'Global Teens 1',
      carga: '12 meses · 80–100 h',
      texto: 'Expansão de vocabulário e fluência.',
    },
    {
      nome: 'Global Teens 2',
      carga: '12 meses · 80–100 h',
      texto: 'Consolidação da comunicação oral e escrita.',
    },
    {
      nome: 'Global Teens 3',
      carga: '12 meses · 80–100 h',
      texto: 'Preparação acadêmica e projetos complexos.',
    },
    {
      nome: 'Global Teens 4',
      carga: '12 meses · 80–100 h',
      texto: 'Preparação para exames internacionais.',
    },
  ],
  /** O site recomenda aulas 100% presenciais nesta fase (menos tempo de tela). */
  modalidades: [
    'Aulas 100% presenciais',
    'Turmas regulares de até 8 alunos: 2 encontros por semana',
    'Aulas individuais (um para um): de 1 a 5 encontros por semana (sugestão de até 1 h por dia)',
    'Turmas exclusivas: a partir de 2 alunos do mesmo nível e faixa etária, ' +
      'com até 5 encontros por semana',
  ],
  diferenciais: [
    {
      titulo: 'Falar em público',
      texto:
        'Projetos reais e apresentações desenvolvem a segurança para se comunicar e ' +
        'defender ideias.',
    },
    {
      titulo: 'Turmas reduzidas',
      texto: 'Acompanhamento próximo e modalidades flexíveis para a rotina do aluno.',
    },
    DIF_IMERSAO,
    DIF_INTERCLASSES,
    DIF_SUPORTE,
    DIF_MATERIAIS,
  ],
  certificacoes: ['Cambridge A2 Key (KET)', 'Cambridge B1 Preliminary (PET)', 'TOEIC®'],
  perguntas: [
    {
      pergunta: 'O Global Teens tem provas?',
      resposta:
        'Não há provas tradicionais. A avaliação é contínua, por projetos, ' +
        'apresentações e produções orais e escritas.',
    },
    {
      pergunta: 'Como funciona a preparação para exames?',
      resposta:
        'Ao longo do curso, os alunos são preparados aos poucos para exames como ' +
        'Cambridge KET, PET e TOEIC®, de forma integrada às aulas e aos projetos, sem ' +
        'pressão excessiva nem foco exclusivo em prova.',
    },
    {
      pergunta: 'As aulas são online?',
      resposta:
        'Não. Nesta fase a International recomenda aulas 100% presenciais, para reduzir ' +
        'o tempo de tela e ampliar o contato com o mundo real.',
    },
    P_CONVERSACAO,
  ],
  mensagemWhatsApp:
    'Olá! Vim pelo site da International e gostaria de saber mais sobre o Global Teens.',
  seo: {
    titulo: 'Inglês para adolescentes em Goiânia | Global Teens',
    descricao:
      'Global Teens: inglês para adolescentes com projetos (PBL), sem provas ' +
      'tradicionais e preparação para Cambridge KET, PET e TOEIC®. Setor Bueno, Goiânia.',
  },
}

const HIGH_SCHOOL: PaginaCurso = {
  path: '/high-school',
  rotulo: 'High School',
  nome: 'High School Program',
  /** Idade informada pela escola (03/10/2026): 10 a 16 anos. */
  publico: 'Para estudantes de 10 a 16 anos',
  titulo: 'Uma trilha acadêmica internacional em inglês',
  destaque: 'internacional em inglês',
  subtitulo:
    'Desenhado para acompanhar o Ensino Médio brasileiro, com uma formação ' +
    'internacional paralela focada em desempenho real, projetos e certificações.',
  pilares: [
    {
      titulo: 'Não é um curso avançado comum',
      texto:
        'O programa não replica o modelo escolar tradicional: é uma formação paralela, ' +
        'com visão de longo prazo, para estudos e carreira.',
    },
    {
      titulo: 'PBL em nível acadêmico',
      texto:
        'Projetos interdisciplinares, pesquisas guiadas, debates, seminários e escrita ' +
        'formal. Sem provas tradicionais: avaliação contínua, baseada em entregas, ' +
        'participação e evolução.',
    },
    {
      titulo: 'Cidadania global',
      texto:
        'Consciência cultural, empatia, responsabilidade social e visão de mundo, com o ' +
        'inglês como ferramenta de conexão global.',
    },
  ],
  niveis: [
    {
      nome: 'High School Starter',
      cefr: 'Pré-A1 → A1/A1+',
      carga: '120 h',
      texto: 'Do Pré-A1 ao A1+.',
    },
    {
      nome: 'High School Freshman',
      cefr: 'A1 → A2',
      carga: '120 h',
      texto: 'Do A1 ao A2 consolidado.',
    },
    {
      nome: 'High School Sophomore',
      cefr: 'A2 → B1',
      carga: '120 h',
      texto: 'Do A2 ao B1.',
    },
    {
      nome: 'High School Junior',
      cefr: 'B1 → B2',
      carga: '120 h',
      texto: 'Do B1 ao B2. Fase recomendada para a aplicação do TOEIC®.',
    },
    {
      nome: 'High School Senior',
      cefr: 'B2 → B2+',
      carga: '120 h',
      texto: 'Do B2 ao B2+.',
    },
    {
      nome: 'High School Graduate',
      cefr: 'B2+ → C1',
      carga: '120 h',
      texto: 'Do B2+ ao C1.',
    },
  ],
  modalidades: [
    'Presencial ou online',
    'Turmas regulares de até 8 alunos: 2 encontros por semana',
    'Aulas individuais (um para um): de 1 a 5 encontros por semana',
    'Turmas exclusivas: amigos ou família do mesmo nível e objetivos, com carga personalizável',
  ],
  diferenciais: [
    {
      titulo: 'Turmas reduzidas',
      texto: 'Até 8 alunos por turma: acompanhamento próximo e feedback individual.',
    },
    {
      titulo: 'Escrita e debate',
      texto:
        'Escrita formal e argumentativa, leitura crítica de textos longos, ' +
        'apresentações e defesa de ideias.',
    },
    {
      titulo: 'Autonomia acadêmica',
      texto:
        'Pensamento crítico, organização de estudos e segurança para ambientes ' +
        'internacionais.',
    },
    {
      titulo: 'Próximos passos',
      texto:
        'Ao concluir, o aluno está preparado para certificações internacionais e para ' +
        'os preparatórios de IELTS, TOEFL®, TOEIC® e SAT, especialidades da International.',
    },
    DIF_INTERCLASSES,
    DIF_SUPORTE,
  ],
  certificacoes: [
    'TOEIC® (eixo de referência do programa)',
    'Competências alinhadas aos níveis Cambridge B2 e C1',
    'Base para os preparatórios de IELTS, TOEFL®, TOEIC® e SAT (especialidades da escola)',
  ],
  perguntas: [
    {
      pergunta: 'O programa tem provas?',
      resposta:
        'Não há provas tradicionais. A avaliação é contínua e criteriosa, baseada em ' +
        'entregas, participação, evolução linguística e desempenho comunicativo.',
    },
    {
      pergunta: 'Como funciona a preparação para certificações?',
      resposta:
        'De forma integrada ao currículo. O TOEIC® é o eixo de referência, com aplicação ' +
        'recomendada entre o Junior e o Senior, e as competências seguem os níveis ' +
        'Cambridge B2 e C1. O foco é desempenho real, não treino mecânico de prova.',
    },
    {
      pergunta: 'A International prepara para o TOEFL® e o SAT?',
      resposta:
        'Sim, são as especialidades da escola: preparatórios de TOEFL® iBT e ITP e de ' +
        'SAT (Reading & Writing) — a primeira escola de idiomas de Goiás com preparatório completo ' +
        'de SAT Reading & Writing —, a partir de 14 anos, presenciais ou online. A ' +
        'International também é Centro Autorizado ETS e aplica TOEFL® ITP, TOEIC® e ' +
        'TOEFL® Young Students Series (o iBT não é aplicado na escola). Datas e ' +
        'inscrição a equipe passa pelo WhatsApp.',
    },
    {
      pergunta: 'Para quem é o High School Program?',
      resposta:
        'Para quem busca formação acadêmica internacional, precisa de inglês para ' +
        'estudos e carreira e não aprende bem em modelos baseados em prova.',
    },
    P_CERTIFICADO,
    P_CEFR,
  ],
  mensagemWhatsApp:
    'Olá! Vim pelo site da International e gostaria de saber mais sobre o High School ' +
    'Program.',
  seo: {
    titulo: 'High School Program em Goiânia | Inglês acadêmico',
    descricao:
      'Trilha acadêmica de inglês paralela ao Ensino Médio: 6 níveis do Pré-A1 ao C1, ' +
      'projetos no lugar de provas e preparação para o TOEIC®. Setor Bueno, Goiânia.',
  },
}

const ADULTS: PaginaCurso = {
  path: '/inter-adults',
  rotulo: 'Adults',
  nome: 'Inter Adults',
  /** Escola (03/10/2026): cursos de adulto a partir de 14 anos. */
  publico: 'A partir de 14 anos',
  titulo: 'Inglês para a vida real, desde a primeira aula',
  destaque: 'desde a primeira aula',
  subtitulo:
    'Para quem precisa usar o inglês de forma prática e confiante no dia a dia, no ' +
    'trabalho e em viagens, com material da National Geographic Learning.',
  pilares: [
    {
      titulo: 'Comunicação acima de regras',
      texto:
        'Nada de gramática isolada ou memorização. O aluno aprende para se comunicar, ' +
        'opinar e resolver situações reais, num ambiente 100% imersivo.',
    },
    {
      titulo: 'Abordagem comunicativa',
      texto:
        'Foco em speaking e listening, com leitura e escrita funcionais: se lemos ou ' +
        'escrevemos algo, é para conversar sobre. A gramática entra sempre em contexto.',
    },
    {
      titulo: 'Temas globais',
      texto:
        'Assuntos atuais e relevantes que ampliam o repertório cultural e a visão de ' +
        'mundo enquanto o inglês evolui.',
    },
  ],
  niveis: [
    {
      nome: 'Starter',
      cefr: 'A1',
      carga: '80 h',
      texto:
        'Sobrevivência linguística: rotina, apresentações, informações pessoais, ' +
        'lugares e tempo livre.',
    },
    {
      nome: 'Pre-Intermediate',
      cefr: 'A2',
      carga: '80 h',
      texto:
        'Comunicação do cotidiano: experiências, trabalho, viagens, cultura e ' +
        'narrativas simples.',
    },
    {
      nome: 'Pre-Advanced',
      cefr: 'B1+ / B2',
      carga: '80 h',
      texto:
        'Comunicação complexa: debates, argumentos, tecnologia, sociedade, futuro e ' + 'carreira.',
    },
  ],
  modalidades: [
    'Presencial ou online',
    TURMA_REGULAR,
    AULA_INDIVIDUAL,
    'Turmas exclusivas por objetivo (viagem, trabalho ou conversação), ou de amigos e família',
    'Conversation clubs',
  ],
  diferenciais: [
    {
      titulo: 'Material National Geographic',
      texto: 'Conteúdo autêntico e atual, produzido pela National Geographic Learning.',
    },
    {
      titulo: 'Avaliação contínua',
      texto:
        'Participação, desempenho comunicativo, atividades orais e projetos curtos. ' +
        'O foco é o uso real da língua, não a prova.',
    },
    {
      titulo: 'Ouvido treinado',
      texto:
        'Compreensão auditiva em diferentes sotaques, pronúncia e entonação trabalhadas ' +
        'em toda aula.',
    },
    DIF_IMERSAO,
    DIF_INTERCLASSES,
    DIF_SUPORTE,
  ],
  /** O FAQ atual cita preparatórios para Cambridge, IELTS e TOEFL® iBT nas
   *  modalidades personalizadas; a página Adults cita o preparatório TOEIC®. */
  certificacoes: ['TOEIC®', 'Cambridge', 'IELTS', 'TOEFL® iBT'],
  perguntas: [
    {
      pergunta: 'Já tentei outros cursos e não deu certo. O Inter Adults é para mim?',
      resposta:
        'O curso foi pensado também para quem já tentou outros cursos sem resultado: ' +
        'acolhimento, prática constante e evolução consistente, falando inglês desde ' +
        'a primeira aula.',
    },
    {
      pergunta: 'O que vem depois do curso?',
      resposta:
        'O aluno pode seguir para cursos avançados, preparatórios para o TOEIC® ou usar ' +
        'o inglês em contextos profissionais e internacionais.',
    },
    P_RAPIDO,
    P_CONVERSACAO,
    P_CERTIFICADO,
  ],
  mensagemWhatsApp:
    'Olá! Vim pelo site da International e gostaria de saber mais sobre o Inter Adults.',
  seo: {
    titulo: 'Curso de inglês para adultos em Goiânia | Inter Adults',
    descricao:
      'Inter Adults: inglês comunicativo para adultos, imersivo desde a primeira aula, ' +
      'com material National Geographic. Turmas e aulas individuais no Setor Bueno.',
  },
}

/**
 * In Company — inglês e espanhol. A página atual se chama "English in
 * Company" e lista as trilhas de espanhol por área; os dois idiomas entram.
 * Os níveis 01–08 do site eram cópia do Interkids e foram descartados.
 */
const IN_COMPANY: PaginaCurso = {
  path: '/in-company',
  rotulo: 'In Company',
  nome: 'In Company',
  publico: 'Para empresas e suas equipes',
  titulo: 'Idiomas dentro da sua empresa, no ritmo da equipe',
  destaque: 'no ritmo da equipe',
  subtitulo:
    'Inglês e espanhol no próprio ambiente de trabalho, nos intervalos, no almoço ou ' +
    'depois do expediente, para equipes que atendem, recebem e negociam com o mundo todo.',
  pilares: [
    {
      titulo: 'Sem deslocamento',
      texto:
        'O colaborador aprende sem sair da empresa e se relaciona melhor com os colegas ' +
        'enquanto se qualifica.',
    },
    {
      titulo: 'Três metodologias ativas',
      texto:
        'CLL, CLIL e PBL atuam juntas, com foco em criatividade e resolução de ' +
        'problemas, não em conteúdo decorado.',
    },
    {
      titulo: 'Visão global',
      texto:
        'O maior benefício é a visão ampla e global que a equipe passa a ter. A cultura ' +
        'global é o maior agente transformador dos negócios.',
    },
  ],
  niveis: [
    {
      nome: 'English in Company',
      texto:
        'Inglês para a equipe, com o nível de cada um definido no nivelamento e o foco na ' +
        'comunicação do dia a dia da empresa.',
    },
    { nome: 'Espanhol Iniciante', texto: 'Módulos I e II.' },
    { nome: 'Espanhol para Negócios', texto: 'Módulos III a VI.' },
    { nome: 'Espanhol para a Saúde', texto: 'Módulos III a VI.' },
    { nome: 'Espanhol para Agronegócios', texto: 'Módulos III a VI.' },
    { nome: 'Espanhol para Turismo e Hotelaria', texto: 'Módulos II a VII.' },
    { nome: 'Espanhol para Juristas', texto: 'Módulos IV a VIII.' },
    { nome: 'Espanhol para Relações Públicas', texto: 'Módulos II a V.' },
    { nome: 'Espanhol para Sobrevivência', texto: 'Módulo I.' },
  ],
  modalidades: [
    'Aulas no ambiente de trabalho',
    'Nos intervalos, no horário de almoço ou após o expediente',
  ],
  /** "Bônus" listados na página atual. */
  diferenciais: [
    {
      titulo: 'Plantões de dúvidas online',
      texto: 'Apoio fora do horário de aula, sempre que a equipe precisar.',
    },
    {
      titulo: 'Grupo de aprendizes no WhatsApp',
      texto: 'Contato direto com a escola e prática entre os colegas.',
    },
    {
      titulo: 'Plataforma online para prática',
      texto: 'Mais contato com o idioma entre um encontro e outro.',
    },
    {
      titulo: 'Projetos culturais',
      texto: 'Projetos de aprendizagem que aproximam a equipe da cultura do idioma.',
    },
    {
      titulo: 'Oportunidades internacionais',
      texto: 'Suporte para participar de programas internacionais de emprego e estudo.',
    },
    {
      titulo: 'Benefício para a família',
      texto:
        '40% de desconto para dependentes de alunos do In Company, além de rede de ' +
        'convênios com restaurantes, clínicas e outros.',
    },
  ],
  /** Nenhuma certificação é citada especificamente para o In Company. */
  certificacoes: [],
  perguntas: [
    {
      pergunta: 'Onde e quando acontecem as aulas?',
      resposta:
        'Na própria empresa, aproveitando intervalos, o horário de almoço ou o ' +
        'pós-expediente. A equipe não precisa se deslocar até a escola.',
    },
    {
      pergunta: 'Existem trilhas por área de atuação?',
      resposta:
        'Sim. Em espanhol há trilhas para negócios, saúde, agronegócios, turismo e ' +
        'hotelaria, juristas, relações públicas e sobrevivência, além do nível iniciante.',
    },
    {
      pergunta: 'Os familiares dos colaboradores têm algum benefício?',
      resposta: 'Sim. Dependentes de alunos do In Company têm 40% de desconto.',
    },
  ],
  mensagemWhatsApp:
    'Olá! Vim pelo site da International e gostaria de saber mais sobre o In Company.',
  seo: {
    titulo: 'Curso de idiomas In Company em Goiânia | International',
    descricao:
      'Aulas de idiomas dentro da sua empresa, no intervalo, no almoço ou após o ' +
      'expediente. Trilhas de espanhol por área e metodologias CLL, CLIL e PBL.',
  },
  /** Logos do carrossel atual. O monograma "NN" ficou de fora (sem nome legível). */
  clientes: [
    'Total Vidros',
    'Prodata',
    'Coca-Cola Refrescos Bandeirantes',
    'Happy Code',
    'Imobiliária Valus',
    'Medcomerce',
    'Órion Hospital',
    'LedWave',
    'Medcom Distribuidora',
    'ELO Telecomunicações',
  ],
  trilhas: [
    'Iniciante',
    'Negócios',
    'Saúde',
    'Agronegócios',
    'Turismo e Hotelaria',
    'Juristas',
    'Relações Públicas',
    'Sobrevivência',
  ],
}

export const PAGINAS_CURSO: readonly PaginaCurso[] = [KIDS, TEENS, HIGH_SCHOOL, ADULTS, IN_COMPANY]

/* ── Sobre a Inter ──────────────────────────────────────────────────────── */

export const SOBRE = {
  path: '/sobre-a-inter',
  titulo: 'Cada pessoa é única. O aprendizado também.',
  destaque: 'O aprendizado também.',
  subtitulo:
    'Nascemos em 2017 do sonho de dois jovens professores: ensinar idiomas de forma ' +
    'personalizada, para que cada aluno aprenda do seu jeito.',
  /**
   * "Quem é a International?" — texto do MANUAL DE MARCA da escola (pág. 4),
   * que substitui o "Quem somos" do site antigo (que dizia "escola de
   * Espanhol" por engano).
   */
  historia: [
    'Somos uma escola de idiomas diferente de tudo o que você já viu por aí. Nascemos em ' +
      '2017 do sonho de dois jovens professores, buscando habilitar pessoas a serem ' +
      'melhores versões de si mesmas por meio da aprendizagem de um idioma global.',
    'Para nós, cada indivíduo é único no mundo, e o aprendizado também deve seguir esta ' +
      'métrica, sendo adaptado às múltiplas realidades de cada um.',
    'Não ensinamos apenas uma nova língua: buscamos proporcionar uma experiência de ' +
      'desenvolvimento pessoal por meio de aulas personalizadas, com conteúdos de alta ' +
      'relevância para a vida em sociedade no século XXI.',
  ],
  /** Missão, visão e valores — manual de marca, pág. 5, sem alteração. */
  missao:
    'Promover a emancipação cultural por meio do ensino de idiomas estrangeiros, ' +
    'capacitando crianças, jovens e adultos a se tornarem agentes de sua própria cultura ' +
    'em benefício da cooperação entre os povos.',
  visao:
    'Tornar-nos referência no ensino de idiomas no Brasil até 2030 e, por conseguinte, no ' +
    'mundo, sendo reconhecidos por uma estrutura de ensino humanizada e orientada por ' +
    'projetos para a vida real, que ensina idiomas sem causar traumas.',
  valores: [
    'Comprometimento',
    'Confiabilidade',
    'Cooperação',
    'Humanização',
    'Valorização de nossa cultura',
    'Aprender continuamente',
    'Inovação',
  ],
  /**
   * O símbolo, como o manual o explica (pág. 9): o meio globo cortado por um
   * arco invertido.
   */
  simbolo:
    'O símbolo da International representa o mundo em movimento: o meio globo cortado por ' +
    'um arco invertido traz a ideia de transição e de crescimento, que a educação traz. ' +
    'Os semicírculos lembram que cada pessoa, cidade e país, com as suas nuances, ' +
    'contribui com o todo — a cooperação, um dos nossos principais valores.',
  proposito: {
    titulo: 'Nosso propósito',
    texto:
      'Habilitar pessoas a serem melhores versões de si mesmas por meio do aprendizado ' +
      'de idiomas, com ensino personalizado e aplicado à vida real.',
  },
  /**
   * As três metodologias ativas que a escola diz usar "em consonância".
   * Obs.: na literatura, a sigla CLL costuma designar Community Language Learning;
   * a escola usa CLL para a abordagem comunicativa (Communicative Language
   * Learning), e é assim que está descrito aqui.
   */
  metodologias: [
    {
      titulo: 'CLL · Communicative Language Learning',
      texto:
        'Aprendizagem baseada na comunicação: o centro e o objetivo de cada aula é ' +
        'capacitar o aluno a usar o idioma para resolver situações da vida real.',
    },
    {
      titulo: 'CLIL · Content and Language Integrated Learning',
      texto:
        'Conteúdo e língua integrados: temas como ciências, história, saúde, artes e ' +
        'culinária são trabalhados no idioma estudado, levando o conhecimento para ' +
        'outros contextos.',
    },
    {
      titulo: 'PBL · Project-Based Learning',
      texto:
        'Aprendizagem baseada em projetos: pesquisa e solução de problemas do mundo ' +
        'real, com produtos e apresentações para um público de verdade.',
    },
  ],
  /** Português também para estrangeiros. */
  idiomas: ['Inglês', 'Espanhol', 'Francês', 'Português para estrangeiros'],
  /** Endereços conferidos: Receita/LinkedIn (105-A) e Correios (Setor Carvelo, 75388-600). */
  unidades: [
    {
      nome: 'Goiânia · Setor Bueno',
      endereco: 'Av. T-1, 2642, Qd. 105-A, Lt. 65, Setor Bueno',
      cidade: 'Goiânia - GO',
      cep: '74215-022',
      telefone: '(62) 3928-2166',
    },
    {
      nome: 'Trindade · Setor Carvelo',
      endereco: 'Av. Manoel Monteiro, 55, Setor Carvelo',
      cidade: 'Trindade - GO',
      cep: '75388-600',
      telefone: '(62) 3928-2166',
    },
  ],
  seo: {
    titulo: 'Sobre a International | Escola de idiomas em Goiânia',
    descricao:
      'Desde 2017, a International ensina inglês, espanhol, francês e português de ' +
      'forma personalizada, com metodologias CLL, CLIL e PBL. Goiânia e Trindade.',
  },
} as const

/* ── Home institucional (briefing "Sitemap de otimização para performance") ── */

/**
 * Copy da home. Títulos, CTAs e textos marcados no briefing estão literais;
 * os textos de apoio foram escritos a partir das fontes.
 */
export const HOME_SITE = {
  hero: {
    titulo: 'Aprenda inglês em Goiânia e amplie suas oportunidades',
    destaque: 'amplie suas oportunidades',
    subtitulo:
      'Cursos de inglês para diferentes idades e objetivos, com uma metodologia que ' +
      'respeita o seu ritmo de aprendizado.',
    cta: 'Quero conhecer os cursos',
    apoios: ['Presencial em Goiânia', 'Diferentes faixas etárias', 'Metodologia personalizada'],
  },

  /**
   * Bloco de prova imediata. A página só exibe itens com `confirmado: true`.
   * `desde` é a alternativa segura publicada pela própria escola.
   */
  provas: {
    desde: 2017,
    itens: [
      // Os maiores números publicados pela escola, por decisão do cliente:
      // "10 anos" (site) e "+10 mil alunos" (bio do Instagram).
      {
        valor: '10+',
        rotulo: 'anos de experiência',
        confirmado: true,
      },
      {
        valor: '10.000+',
        rotulo: 'alunos já passaram pela International',
        confirmado: true,
      },
      {
        valor: '4+',
        rotulo: 'idiomas disponíveis',
        confirmado: true,
      },
    ],
    /** Item 11 do briefing — confirmado nas avaliações do Google Maps. */
    avaliacoesGoogle: {
      nota: '5,0',
      total: 'mais de 150 avaliações',
      confirmado: true,
    },
  },

  paraQuem: {
    titulo: 'Um caminho para cada fase e objetivo',
    subtitulo: 'Escolha o perfil que mais combina com você e veja os detalhes do curso.',
    cards: [
      {
        rotulo: 'Kids',
        texto: 'Inglês desde cedo, respeitando cada fase do aprendizado.',
        path: '/kids',
      },
      {
        rotulo: 'Teens',
        texto: 'Desenvolvimento do idioma para estudos, intercâmbio e vida pessoal.',
        path: '/teens',
      },
      {
        rotulo: 'Adults',
        texto: 'Inglês para viagens, carreira e desenvolvimento pessoal.',
        path: '/inter-adults',
      },
      {
        rotulo: 'Business',
        texto: 'Comunicação em inglês para o ambiente profissional.',
        path: '/in-company',
      },
      {
        rotulo: 'High School / Acadêmico',
        texto: 'Preparação para oportunidades acadêmicas internacionais.',
        path: '/high-school',
      },
    ],
    cta: 'Quero encontrar o curso ideal',
  },

  porQue: {
    titulo: 'Por que a International?',
    itens: [
      {
        titulo: 'Metodologia personalizada',
        texto:
          'Cada aluno é único. O percurso é pensado para o seu perfil e os seus ' + 'objetivos.',
      },
      {
        titulo: 'Aprendizado no ritmo do aluno',
        texto:
          'Turmas regulares, aulas individuais ou grupos especiais, com a frequência ' +
          'que cabe na sua rotina.',
      },
      {
        titulo: 'Desenvolvimento de conversação',
        texto:
          'Aulas imersivas, em que a conversa é o centro, e conversation clubs para ' +
          'praticar ainda mais.',
      },
      {
        titulo: 'Experiências culturais',
        texto: 'Interclasses semanais: aulas culturais para viver o idioma além da sala.',
      },
      {
        titulo: 'Preparação para objetivos acadêmicos, profissionais e pessoais',
        texto:
          'Da primeira palavra à preparação para certificações internacionais, com ' +
          'níveis referenciados pelo CEFR.',
      },
    ],
    cta: 'Quero conhecer a metodologia',
  },

  metodologia: {
    titulo: 'Como você aprende na International',
    subtitulo:
      'Metodologias ativas (comunicação, conteúdo integrado e projetos) no lugar da ' +
      'decoreba e das provas tradicionais.',
    pilares: [
      {
        titulo: 'Aprendizado personalizado',
        texto: 'Acompanhamento de acordo com o perfil e ritmo do aluno.',
      },
      {
        titulo: 'Prática constante',
        texto: 'Contato frequente com o idioma em situações reais.',
      },
      {
        titulo: 'Evolução contínua',
        texto: 'Desenvolvimento progressivo das principais habilidades.',
      },
    ],
    cta: 'Falar com a equipe',
  },

  /**
   * Preparação, com as duas credenciais que o dono confirmou (02/10/2026). O
   * aviso de marcas vai junto do bloco e no rodapé.
   */
  certificacoes: {
    destaques: [
      {
        titulo: 'Especialistas em IELTS, TOEFL®, TOEIC® e SAT',
        texto:
          'Preparatórios de IELTS, TOEFL® iBT e ITP, TOEIC®, SAT (Reading & Writing), ' +
          'Duolingo English Test e Cambridge, a partir de 14 anos, presenciais ou online.',
      },
      {
        titulo: 'Centro Autorizado ETS',
        texto:
          'Além de preparar, a International aplica TOEIC®, TOEFL® ITP, TOEFL® Young Students ' +
          'Series (Primary e Junior) e o TFI®, de francês — na escola ou on-line.',
      },
    ],
    titulo: 'Formação reconhecida e conectada com oportunidades globais',
    texto:
      'Certificações internacionais abrem portas em processos seletivos, ' +
      'universidades no exterior e programas de imigração. Por isso, a preparação ' +
      'acontece integrada ao curso, e cada nível é referenciado pelo CEFR, o padrão ' +
      'usado no mundo todo para medir o que você consegue fazer no idioma.',
    itens: [
      {
        nome: 'TOEIC®',
        texto: 'Inglês para o mercado de trabalho, usado por empresas para medir proficiência.',
      },
      {
        nome: 'TOEFL®',
        texto: 'Certificação acadêmica amplamente aceita por universidades no exterior.',
      },
      {
        nome: 'SAT',
        texto:
          'O exame de admissão das universidades dos EUA. A primeira escola de idiomas de Goiás com preparatório completo de Reading & Writing.',
      },
      {
        nome: 'IELTS',
        texto: 'Aceito para estudo, trabalho e imigração, como no Reino Unido e na Austrália.',
      },
      {
        nome: 'Cambridge',
        texto: 'Exames por nível, do YLE para crianças ao B2 e C1 para jovens e adultos.',
      },
      {
        nome: 'CEFR',
        texto: 'O Quadro Europeu Comum de Referência: seis níveis, do A1 ao C2.',
      },
    ],
    aviso:
      'TOEIC®, TOEFL®, TOEFL® Young Students Series e TFI® são marcas registradas da ETS; ' +
      'SAT® é marca registrada do College Board; IELTS™ pertence ao British Council, ' +
      'IDP e Cambridge. A International é Centro Autorizado ETS para TOEIC®, TOEFL® ITP, ' +
      'TOEFL® Young Students Series e TFI® e oferece preparação para os demais exames (não ' +
      'aplica o TOEFL® iBT).',
  },

  /**
   * Os depoimentos escritos do site atual (Ronan, Ana, José Manuel) são textos
   * em 3ª pessoa feitos pela escola e não servem como prova social.
   * Vídeos publicados pela própria escola no canal dela: uso autorizado.
   */
  depoimentos: {
    titulo: 'Veja a experiência de quem já estuda na International',
    videos: [
      { youtubeId: 'FE6KPie2PK4', titulo: 'Depoimento da Anna' },
      { youtubeId: 'qa21WSLAcWc', titulo: 'Depoimento do Ronan' },
      { youtubeId: 'da7CROvlkgI', titulo: 'Projeto Pré-Intermediário: A festival I have been to' },
    ],
    cta: 'Quero viver essa experiência',
  },

  localizacao: {
    titulo: 'Estamos no Setor Bueno, em Goiânia, e no Setor Carvelo, em Trindade',
    texto:
      'Duas unidades para você escolher a mais perto: a Av. T-1, no Setor Bueno, e a ' +
      'Av. Manoel Monteiro, no Setor Carvelo, em Trindade.',
    cta: 'Quero agendar uma visita',
  },

  ctaFinal: {
    titulo: 'Pronto para dar o próximo passo no seu inglês?',
    texto: 'Fale com nossa equipe e descubra qual curso faz mais sentido para o seu objetivo.',
    cta: 'Falar agora pelo WhatsApp',
  },

  formulario: {
    campos: ['Nome completo', 'E-mail', 'WhatsApp (DDD + número)'],
    botao: 'Quero saber mais',
  },

  mensagemWhatsApp: 'Olá! Vim pelo site da International e gostaria de saber mais sobre os cursos.',

  seo: {
    titulo: 'Curso de inglês em Goiânia | International Idiomas',
    descricao:
      'Cursos de inglês para crianças, adolescentes, adultos e empresas no Setor Bueno, ' +
      'Goiânia. Metodologia personalizada e preparação para certificações.',
  },
} as const
