/**
 * Recebe o formulário "Prefere que a gente fale com você?" da landing page.
 *
 * Uma Lambda com Function URL, sem API Gateway: é um endpoint só, com CORS
 * restrito às origens do site, e o custo de um lead é uma fração de centavo.
 *
 * O que ela faz, em ordem:
 *
 *   1. valida (o navegador já validou, mas o navegador é do visitante)
 *   2. descarta robô em silêncio — honeypot e tempo mínimo de preenchimento
 *   3. grava no DynamoDB, com TTL de 12 meses (LGPD: não guardar para sempre
 *      o que só serve para um primeiro contato)
 *   4. manda um e-mail para a escola com o botão "Chamar no WhatsApp", que já
 *      abre a conversa com o número do aluno e uma saudação pronta
 *   5. registra o contato no WeSales (CRM da escola, sobre a API do
 *      HighLevel) — só quando WESALES_LOCAL está configurado. O token NÃO
 *      fica em variável de ambiente nem no repositório: é lido do Parameter
 *      Store (SecureString) cujo NOME está em WESALES_PARAMETRO
 *   6. registra o contato na IAra (digi2b) — legado, desligado; só quando
 *      IARA_CONTA e IARA_TOKEN estão configurados
 *
 * Se o e-mail ou o CRM falharem, o lead continua gravado e a resposta é 200: quem
 * preencheu fez a parte dele, e o erro aparece no CloudWatch, não na tela.
 *
 * Sem dependência: o runtime nodejs22.x já traz o AWS SDK v3.
 */
import { randomUUID } from 'node:crypto'

const DOZE_MESES = 60 * 60 * 24 * 365

/** Menos que isto entre abrir o formulário e enviar é robô, não gente. */
const TEMPO_MINIMO_MS = 2500

const LIMITES = { nome: 120, email: 160, texto: 300 }

/** Só dígitos, com DDI 55. Aceita "(62) 99999-9999", "62999999999", "+55 62…". */
export function normalizarWhatsApp(bruto) {
  let d = String(bruto ?? '').replace(/\D/g, '')
  if (d.startsWith('55') && (d.length === 12 || d.length === 13)) d = d.slice(2)
  if (d.startsWith('0')) d = d.slice(1)
  // DDD (2) + número (8 fixo ou 9 celular começando com 9)
  if (d.length === 11 && d[2] !== '9') return null
  if (d.length !== 10 && d.length !== 11) return null
  if (Number(d.slice(0, 2)) < 11) return null
  return `55${d}`
}

export function validarEmail(bruto) {
  const email = String(bruto ?? '')
    .trim()
    .toLowerCase()
  if (email.length > LIMITES.email) return null
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? email : null
}

const limpar = (valor, max) =>
  String(valor ?? '')
    .replace(/\p{Cc}/gu, ' ') // caracteres de controle: quebra de linha, tab, NUL…
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)

/**
 * Valida o corpo do POST. Devolve `{ ok: true, lead }`, `{ ok: false, erros }`
 * ou `{ ok: true, robo: true }` — robô recebe o mesmo "obrigado" que gente,
 * para não aprender o que o denunciou.
 */
export function validarLead(corpo) {
  if (!corpo || typeof corpo !== 'object') return { ok: false, erros: ['corpo'] }

  if (limpar(corpo.site, 200) !== '') return { ok: true, robo: true }
  const tempo = Number(corpo.tempo)
  if (Number.isFinite(tempo) && tempo >= 0 && tempo < TEMPO_MINIMO_MS) {
    return { ok: true, robo: true }
  }

  const erros = []
  const nome = limpar(corpo.nome, LIMITES.nome)
  if (nome.length < 2) erros.push('nome')
  const email = validarEmail(corpo.email)
  if (!email) erros.push('email')
  const whatsapp = normalizarWhatsApp(corpo.whatsapp)
  if (!whatsapp) erros.push('whatsapp')
  if (corpo.consentimento !== true) erros.push('consentimento')
  if (erros.length) return { ok: false, erros }

  const perfil = {}
  for (const chave of ['para', 'objetivo', 'nivel', 'curso']) {
    const v = limpar(corpo.perfil?.[chave], LIMITES.texto)
    if (v) perfil[chave] = v
  }
  const origem = {}
  for (const chave of [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'fbclid',
    'pagina',
    'referencia',
  ]) {
    const v = limpar(corpo.origem?.[chave], LIMITES.texto)
    if (v) origem[chave] = v
  }

  // LGPD: qual texto foi aceito (versão) e se a pessoa quer novidades. A
  // autorização para o contato é obrigatória (acima); a de novidades, não.
  const consentimentoVersao = limpar(corpo.consentimentoVersao, 40) || 'sem-versao'
  const novidades = corpo.novidades === true

  return {
    ok: true,
    lead: { nome, email, whatsapp, perfil, origem, consentimentoVersao, novidades },
  }
}

/** "5562999999999" → "(62) 99999-9999" */
export function formatarTelefone(whatsapp) {
  const d = whatsapp.slice(2)
  const ddd = d.slice(0, 2)
  const numero = d.slice(2)
  const corte = numero.length === 9 ? 5 : 4
  return `(${ddd}) ${numero.slice(0, corte)}-${numero.slice(corte)}`
}

const escapar = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )

const ROTULOS_PERFIL = {
  para: 'Para quem',
  objetivo: 'Objetivo',
  nivel: 'Nível',
  curso: 'Curso sugerido',
}

/** O e-mail que a escola recebe. Texto e HTML, montados do mesmo dado. */
export function montarEmail(lead, escola) {
  const primeiroNome = lead.nome.split(' ')[0]
  const saudacao = `Olá, ${primeiroNome}! Aqui é da ${escola}. Recebemos seu contato pelo site sobre o curso de inglês — podemos conversar?`
  const linkWhats = `https://wa.me/${lead.whatsapp}?text=${encodeURIComponent(saudacao)}`
  const telefone = formatarTelefone(lead.whatsapp)

  const perfil = Object.entries(lead.perfil).map(([k, v]) => [ROTULOS_PERFIL[k] ?? k, v])
  const origem = Object.entries(lead.origem)
  const linhas = [
    ['Nome', lead.nome],
    ['WhatsApp', telefone],
    ['E-mail', lead.email],
    ...perfil,
    ['Aceita novidades', lead.novidades ? 'Sim' : 'Não'],
  ]

  const assunto = `Novo contato pelo site: ${lead.nome}`
  const texto = [
    'Novo contato pela landing page do curso de inglês.',
    '',
    ...linhas.map(([k, v]) => `${k}: ${v}`),
    '',
    `Chamar no WhatsApp: ${linkWhats}`,
    ...(origem.length ? ['', 'Origem:', ...origem.map(([k, v]) => `  ${k}: ${v}`)] : []),
  ].join('\n')

  const td = 'padding:6px 12px 6px 0;vertical-align:top'
  const html = `<!doctype html><html lang="pt-BR"><body style="margin:0;padding:24px;background:#f4f6fa;font-family:Arial,Helvetica,sans-serif;color:#0f1b3d">
<div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;padding:28px">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#5b6785">Landing page · curso de inglês</p>
<h1 style="margin:0 0 20px;font-size:22px">${escapar(lead.nome)} quer falar com vocês</h1>
<table style="border-collapse:collapse;font-size:15px">${linhas
    .map(
      ([k, v]) =>
        `<tr><td style="${td};color:#5b6785">${escapar(k)}</td><td style="${td}"><strong>${escapar(v)}</strong></td></tr>`,
    )
    .join('')}</table>
<p style="margin:24px 0 8px"><a href="${linkWhats}" style="display:inline-block;background:#1f7a4d;color:#fff;text-decoration:none;font-weight:bold;padding:14px 22px;border-radius:999px">Chamar ${escapar(primeiroNome)} no WhatsApp</a></p>
<p style="margin:0;font-size:13px;color:#5b6785">Responder este e-mail responde direto para ${escapar(lead.email)}.</p>
${
  origem.length
    ? `<p style="margin:24px 0 0;font-size:12px;color:#8a93aa">Origem: ${origem
        .map(([k, v]) => `${escapar(k)}=${escapar(v)}`)
        .join(' · ')}</p>`
    : ''
}
</div></body></html>`

  return { assunto, texto, html }
}

/**
 * O contato no formato da IAra (API de contatos da digi2b, compatível com a do
 * Chatwoot). Telefone em E.164; `identifier` estável por telefone, para que o
 * mesmo aluno preenchendo duas vezes não vire dois contatos. Perfil e origem
 * vão em `custom_attributes` (a conta pode criar definições com essas chaves
 * para exibi-las como campos).
 */
export function montarContatoIara(lead) {
  const atributos = { origem_lead: 'site' }
  for (const [k, v] of Object.entries(lead.perfil)) atributos[`perfil_${k}`] = v
  for (const [k, v] of Object.entries(lead.origem)) atributos[k] = v
  return {
    name: lead.nome,
    email: lead.email,
    phone_number: `+${lead.whatsapp}`,
    identifier: `site-${lead.whatsapp}`,
    custom_attributes: atributos,
  }
}

/** A nota interna que acompanha a conversa: o resumo do lead para a equipe. */
export function notaIara(lead) {
  const perfil = Object.entries(lead.perfil).map(([k, v]) => `${ROTULOS_PERFIL[k] ?? k}: ${v}`)
  const campanha = lead.origem.utm_campaign ? [`Campanha: ${lead.origem.utm_campaign}`] : []
  return ['Contato pelo formulário do site.', ...perfil, ...campanha].join('\n')
}

/**
 * O contato no formato do WeSales (API v2 do HighLevel, `POST /contacts/upsert`).
 * O upsert usa o telefone e o e-mail para achar o contato: o mesmo aluno
 * preenchendo duas vezes não vira dois contatos. Perfil e campanha vão na
 * nota (campos personalizados exigiriam o ID de cada campo na conta).
 */
export function montarContatoWeSales(lead, local, etiquetasBase) {
  const etiquetas = lead.novidades ? [...etiquetasBase, 'aceita-novidades'] : etiquetasBase
  const [primeiro, ...resto] = lead.nome.split(/\s+/)
  return {
    locationId: local,
    firstName: primeiro,
    lastName: resto.join(' ') || undefined,
    name: lead.nome,
    email: lead.email,
    phone: `+${lead.whatsapp}`,
    tags: etiquetas,
    source: lead.origem.utm_source ? `Site · ${lead.origem.utm_source}` : 'Site',
  }
}

/** A nota que acompanha o contato no CRM: o resumo do lead para a equipe. */
export function notaWeSales(lead) {
  const origem = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'pagina']
    .filter((k) => lead.origem[k])
    .map((k) => `${k}: ${lead.origem[k]}`)
  const lgpd = [
    '',
    `Consentimento LGPD: texto ${lead.consentimentoVersao ?? 'sem-versao'}` +
      (lead.consentidoEm ? `, aceito em ${lead.consentidoEm}` : '') +
      ` · novidades: ${lead.novidades ? 'sim' : 'não'}`,
  ]
  return [notaIara(lead), ...(origem.length ? ['', ...origem] : []), ...lgpd].join('\n')
}

function resposta(status, corpo) {
  return {
    statusCode: status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    body: JSON.stringify(corpo),
  }
}

/* c8 ignore start — a partir daqui é integração com a AWS, exercitada no smoke do deploy */
let clientes
async function aws() {
  if (!clientes) {
    const [{ DynamoDBClient, PutItemCommand }, { SESv2Client, SendEmailCommand }] =
      await Promise.all([import('@aws-sdk/client-dynamodb'), import('@aws-sdk/client-sesv2')])
    clientes = {
      ddb: new DynamoDBClient({}),
      ses: new SESv2Client({}),
      PutItemCommand,
      SendEmailCommand,
    }
  }
  return clientes
}

/** O token do WeSales, lido uma vez do Parameter Store e guardado na memória da Lambda. */
let tokenWeSales
async function lerTokenWeSales() {
  if (!tokenWeSales) {
    const { SSMClient, GetParameterCommand } = await import('@aws-sdk/client-ssm')
    const r = await new SSMClient({}).send(
      new GetParameterCommand({ Name: process.env.WESALES_PARAMETRO, WithDecryption: true }),
    )
    tokenWeSales = r.Parameter?.Value
  }
  return tokenWeSales
}

/**
 * Contato (upsert) → nota → (com WESALES_FUNIL e WESALES_ETAPA) oportunidade
 * no funil. O token nunca aparece em log: só o status e o corpo de erro.
 */
async function enviarParaWeSales(lead) {
  const token = await lerTokenWeSales()
  const local = process.env.WESALES_LOCAL
  const chamar = async (metodo, caminho, corpo) => {
    const r = await fetch(`https://services.leadconnectorhq.com${caminho}`, {
      method: metodo,
      headers: {
        authorization: `Bearer ${token}`,
        version: '2021-07-28',
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: corpo ? JSON.stringify(corpo) : undefined,
      signal: AbortSignal.timeout(4000),
    })
    const texto = await r.text()
    if (!r.ok) throw new Error(`WeSales ${metodo} ${caminho} → ${r.status}: ${texto.slice(0, 300)}`)
    return texto ? JSON.parse(texto) : {}
  }

  const etiquetas = String(process.env.WESALES_ETIQUETAS || 'lead-site')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const { contact } = await chamar(
    'POST',
    '/contacts/upsert',
    montarContatoWeSales(lead, local, etiquetas),
  )
  const contatoId = contact?.id
  if (!contatoId) throw new Error('WeSales: upsert sem id de contato')

  await chamar('POST', `/contacts/${contatoId}/notes`, { body: notaWeSales(lead) })

  if (process.env.WESALES_FUNIL && process.env.WESALES_ETAPA) {
    await chamar('POST', '/opportunities/', {
      locationId: local,
      pipelineId: process.env.WESALES_FUNIL,
      pipelineStageId: process.env.WESALES_ETAPA,
      name: `${lead.nome} · site`,
      status: 'open',
      contactId: contatoId,
      source: 'Site',
    })
  }
  return contatoId
}

/**
 * Busca → cria ou atualiza o contato → etiquetas → (com IARA_CAIXA) abre uma
 * conversa na caixa de entrada com uma nota interna. Nota PRIVADA de
 * propósito: numa caixa de WhatsApp, mensagem comum seria enviada ao aluno.
 */
async function enviarParaIara(lead, id) {
  const base = `${process.env.IARA_URL || 'https://app.digi2b.com'}/api/v1/accounts/${process.env.IARA_CONTA}`
  const chamar = async (metodo, caminho, corpo) => {
    const r = await fetch(base + caminho, {
      method: metodo,
      headers: {
        api_access_token: process.env.IARA_TOKEN,
        'content-type': 'application/json',
      },
      body: corpo ? JSON.stringify(corpo) : undefined,
      signal: AbortSignal.timeout(3000),
    })
    const texto = await r.text()
    if (!r.ok) {
      throw new Error(
        `IAra ${metodo} ${caminho} → ${r.status} (${r.headers.get('x-request-id') ?? '-'}): ${texto.slice(0, 300)}`,
      )
    }
    return texto ? JSON.parse(texto) : {}
  }

  const contato = montarContatoIara(lead)
  const busca = await chamar(
    'GET',
    `/contacts/search?q=${encodeURIComponent(contato.phone_number)}`,
  )
  const achado = (busca.payload ?? []).find((c) => c.phone_number === contato.phone_number)
  let contatoId
  if (achado) {
    contatoId = achado.id
    await chamar('PUT', `/contacts/${contatoId}`, {
      name: contato.name,
      custom_attributes: { ...(achado.custom_attributes ?? {}), ...contato.custom_attributes },
    })
  } else {
    const criado = await chamar('POST', '/contacts', contato)
    contatoId = criado.payload?.contact?.id ?? criado.id
  }

  const etiquetas = String(process.env.IARA_ETIQUETAS || 'lead-site')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (etiquetas.length) await chamar('POST', `/contacts/${contatoId}/labels`, { labels: etiquetas })

  if (process.env.IARA_CAIXA) {
    const conversa = await chamar('POST', '/conversations', {
      source_id: `site-${id}`,
      inbox_id: Number(process.env.IARA_CAIXA),
      contact_id: contatoId,
      status: 'open',
    })
    await chamar('POST', `/conversations/${conversa.id}/messages`, {
      content: notaIara(lead),
      message_type: 'outgoing',
      private: true,
    })
    if (etiquetas.length) {
      await chamar('POST', `/conversations/${conversa.id}/labels`, { labels: etiquetas })
    }
  }
  return contatoId
}

export async function handler(evento) {
  const metodo = evento?.requestContext?.http?.method
  if (metodo === 'OPTIONS') return { statusCode: 204 }
  if (metodo !== 'POST') return resposta(405, { ok: false })

  let corpo
  try {
    const bruto = evento.isBase64Encoded
      ? Buffer.from(evento.body ?? '', 'base64').toString('utf8')
      : (evento.body ?? '')
    if (bruto.length > 8000) return resposta(413, { ok: false })
    corpo = JSON.parse(bruto)
  } catch {
    return resposta(400, { ok: false, erros: ['json'] })
  }

  const r = validarLead(corpo)
  if (!r.ok) return resposta(422, r)
  if (r.robo) return resposta(200, { ok: true })

  const { lead } = r
  const id = randomUUID()
  const agora = new Date()
  lead.consentidoEm = agora.toISOString()
  const { ddb, ses, PutItemCommand, SendEmailCommand } = await aws()

  await ddb.send(
    new PutItemCommand({
      TableName: process.env.TABELA,
      Item: {
        id: { S: id },
        criadoEm: { S: agora.toISOString() },
        expiraEm: { N: String(Math.floor(agora.getTime() / 1000) + DOZE_MESES) },
        nome: { S: lead.nome },
        email: { S: lead.email },
        whatsapp: { S: lead.whatsapp },
        perfil: { S: JSON.stringify(lead.perfil) },
        origem: { S: JSON.stringify(lead.origem) },
        // A prova do consentimento (LGPD): texto aceito, quando e novidades.
        consentimento: {
          S: JSON.stringify({
            versao: lead.consentimentoVersao,
            em: lead.consentidoEm,
            novidades: lead.novidades,
          }),
        },
        ip: { S: evento.requestContext?.http?.sourceIp ?? '' },
      },
    }),
  )

  const destinos = String(process.env.DESTINO ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (destinos.length) {
    const email = montarEmail(lead, process.env.ESCOLA ?? 'International Idiomas')
    try {
      await ses.send(
        new SendEmailCommand({
          FromEmailAddress: process.env.REMETENTE,
          Destination: { ToAddresses: destinos },
          ReplyToAddresses: [lead.email],
          Content: {
            Simple: {
              Subject: { Data: email.assunto, Charset: 'UTF-8' },
              Body: {
                Text: { Data: email.texto, Charset: 'UTF-8' },
                Html: { Data: email.html, Charset: 'UTF-8' },
              },
            },
          },
        }),
      )
    } catch (erro) {
      console.error('[lead] e-mail falhou; lead gravado', id, erro)
    }
  }

  if (process.env.WESALES_LOCAL && process.env.WESALES_PARAMETRO) {
    try {
      const contatoId = await enviarParaWeSales(lead)
      // biome-ignore lint/suspicious/noConsole: a prova, no CloudWatch, de que o lead chegou
      console.log('[lead] WeSales ok', id, contatoId)
    } catch (erro) {
      console.error('[lead] WeSales falhou; lead gravado', id, String(erro))
    }
  }

  if (process.env.IARA_CONTA && process.env.IARA_TOKEN) {
    try {
      const contatoId = await enviarParaIara(lead, id)
      // biome-ignore lint/suspicious/noConsole: a prova, no CloudWatch, de que o lead chegou
      console.log('[lead] IAra ok', id, contatoId)
    } catch (erro) {
      console.error('[lead] IAra falhou; lead gravado', id, erro)
    }
  }

  return resposta(200, { ok: true, id })
}
/* c8 ignore stop */
