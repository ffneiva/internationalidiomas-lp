import { expect, type Page, test } from '@playwright/test'

/**
 * Ponta a ponta do SITE institucional. Roda com `VITE_ALVO=site npm run e2e`
 * (o build e o preview herdam a variável).
 */
test.skip(process.env.VITE_ALVO !== 'site', 'bateria do site')

async function abrir(page: Page, rota = '/') {
  await page.goto(rota)
  await page.locator('html[data-hidratado]').waitFor({ state: 'attached' })
}

const PAGINAS: [string, string][] = [
  ['/', 'Aprenda inglês em Goiânia'],
  ['/sobre-a-inter', 'Cada pessoa é única'],
  ['/kids', 'Interkids'],
  ['/teens', 'Global Teens'],
  ['/high-school', 'High School Program'],
  ['/inter-adults', 'Inter Adults'],
  ['/in-company', 'In Company'],
  // Páginas pedidas pela escola em 08/10/2026.
  ['/preparatorios-e-certificacoes', 'Para cada objetivo, o exame certo.'],
  ['/parcerias', 'Um centro de línguas dentro da sua instituição.'],
  ['/blog', 'Ler o artigo'],
  ['/blog/qual-exame-de-ingles-fazer', 'Resumo rápido'],
]

test('as URLs do site de hoje continuam existindo, com HTML pronto antes do JS', async ({
  request,
}) => {
  for (const [rota, texto] of PAGINAS) {
    const r = await request.get(rota)
    expect(r.status(), rota).toBe(200)
    expect(await r.text(), rota).toContain(texto)
  }
  expect((await request.get('/pagina-que-nao-existe')).status()).toBe(404)
})

test('hidrata todas as páginas sem erro nem aviso', async ({ page }) => {
  const problemas: string[] = []
  page.on('console', (m) => {
    // Só o que é do site: o iframe do Google Maps (carregado por padrão) às
    // vezes escreve avisos próprios no console, que não são deste código.
    const origem = m.location().url
    if (origem && !origem.startsWith('http://127.0.0.1')) return
    if (m.type() === 'error' || m.type() === 'warning') problemas.push(`${page.url()} ${m.text()}`)
  })
  page.on('pageerror', (e) => problemas.push(e.message))
  for (const [rota] of PAGINAS) await abrir(page, rota)
  expect(problemas).toEqual([])
})

test('a mensagem do WhatsApp é a do documento, e a de cada curso cita o curso', async ({
  page,
}) => {
  await abrir(page)
  const home = await page.locator('a[data-whatsapp="heroi"]').getAttribute('href')
  expect(decodeURIComponent(home ?? '')).toContain(
    'Olá! Vim pelo site da International e gostaria de saber mais sobre os cursos.',
  )
  await abrir(page, '/kids')
  const kids = await page.locator('a[data-whatsapp^="heroi-"]').getAttribute('href')
  expect(decodeURIComponent(kids ?? '')).toContain('Interkids')
})

test('menu leva às páginas sem recarregar', async ({ page, isMobile }) => {
  await abrir(page)
  if (isMobile) {
    await page.getByRole('button', { name: 'Abrir o menu' }).click()
    // Os itens entram em cascata (subindo 40%): até assentarem, o de baixo
    // passa por cima do de cima e "rouba" o clique.
    await page.waitForFunction(() =>
      [...document.querySelectorAll('.menu-item')]
        .flatMap((el) => el.getAnimations())
        .every((a) => a.playState !== 'running'),
    )
  }
  // No celular, o menu (portal no fim do <body>) cobre os links "Teens" da
  // página: o clique tem de ser no do menu.
  const onde = isMobile ? page.locator('#menu-cheio') : page
  await onde.getByRole('link', { name: 'Teens', exact: true }).first().click()
  await expect(page).toHaveURL(/\/teens$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page).toHaveTitle(/Teens|Global Teens/)
})

test('um <h1> por página, e a prova imediata com os números do cliente', async ({ page }) => {
  for (const [rota] of PAGINAS) {
    await abrir(page, rota)
    await expect(page.locator('h1'), rota).toHaveCount(1)
  }
  // Os maiores números publicados pela escola (decisão do cliente). O HTML
  // pré-renderizado já traz o número final; na tela, o contador sobe do zero
  // quando a faixa aparece.
  const html = await (await page.request.get('/')).text()
  expect(html).toContain('10.000')
  expect(html).not.toContain('3.000+')
})

test('sair da home depois de passar pelas cenas não quebra a página (regressão)', async ({
  page,
}) => {
  const erros: string[] = []
  page.on('pageerror', (e) => erros.push(e.message))
  await abrir(page)
  // Passa pelo "Como funciona" (seção pinada pelo GSAP) e volta aos cursos.
  for (let y = 0; y < 9000; y += 600) {
    await page.mouse.wheel(0, 600)
    await page.waitForTimeout(60)
  }
  await page.waitForTimeout(800)
  await page.locator('a[href="/kids"]').filter({ hasText: 'Ver o curso' }).first().click()
  await expect(page).toHaveURL(/\/kids$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  // A página nova tem altura de página, e não a tela de erro.
  expect(await page.evaluate(() => document.body.scrollHeight)).toBeGreaterThan(3000)
  expect(erros).toEqual([])
})

test('menu do celular cobre a tela inteira mesmo com a página rolada (regressão)', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'o menu em tela cheia é do celular')
  await abrir(page)
  await page.evaluate(() => window.scrollTo(0, 900))
  await page.waitForTimeout(600)
  await page.getByRole('button', { name: 'Abrir o menu' }).click()
  const menu = page.locator('#menu-cheio')
  await expect(menu).toBeVisible()
  const alt = await menu.evaluate((el) => el.getBoundingClientRect().height)
  expect(alt).toBeGreaterThanOrEqual(page.viewportSize()?.height ?? 0)
})

for (const [rota, tipo, botao] of [
  ['/parcerias', 'escola', 'Quero avaliar meus alunos'],
  ['/in-company', 'empresa', 'Quero avaliar meus colaboradores'],
] as const) {
  test(`${rota}: o pedido de avaliação (${tipo}) valida e envia com os dados da instituição`, async ({
    page,
  }) => {
    let corpo: Record<string, unknown> | null = null
    await page.route('**/*lambda-url*/**', async (r) => {
      corpo = r.request().postDataJSON()
      await r.fulfill({ status: 200, body: '{"ok":true}' })
    })
    await abrir(page, rota)
    // O botão do herói leva ao contêiner.
    await page
      .locator(`a[href="#${tipo === 'escola' ? 'avaliar-alunos' : 'avaliar-colaboradores'}"]`)
      .first()
      .click()
    const ancora = tipo === 'escola' ? 'avaliar-alunos' : 'avaliar-colaboradores'
    await expect(page.locator(`#${ancora}`)).toBeInViewport()
    const form = page.locator(`form[data-b2b="${tipo}"]`)
    await form.getByRole('button', { name: botao }).click()
    // Primeiro erro: a instituição, com foco nela.
    await expect(form.getByRole('textbox').first()).toBeFocused()
    await expect(form.locator('[aria-invalid="true"]').first()).toBeVisible()

    const campos = form.locator('input:not([type=checkbox]):not([name=site])')
    const valores: Record<string, string> = {
      instituicao: 'Instituição Teste',
      quantidade: '250',
      local: 'Goiânia · Setor Bueno',
      nome: 'Ana Teste',
      cargo: 'Diretora',
      whatsapp: '62998765432',
      email: 'ana@teste.com.br',
    }
    for (const [nome, valor] of Object.entries(valores)) {
      await campos.and(page.locator(`[name="${nome}"]`)).fill(valor)
    }
    await form.locator('input[type=checkbox]').check()
    await form.getByRole('button', { name: botao }).click()

    // Sem VITE_LEADS_URL no build de teste, cai no caminho de falha (com o
    // WhatsApp); com ela, envia o bloco b2b e vai a /obrigado.
    await expect(
      page.getByRole('heading', { name: 'Recebemos seu contato.' }).or(form.getByRole('alert')),
    ).toBeVisible()
    if (corpo) {
      expect((corpo as { b2b: Record<string, string> }).b2b).toMatchObject({
        tipo,
        instituicao: 'Instituição Teste',
        quantidade: '250',
        cargo: 'Diretora',
      })
    }
  })
}
