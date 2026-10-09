import { expect, type Page, test } from '@playwright/test'

// Esta bateria é da LP; o site tem a sua (site.spec.ts).
test.skip(process.env.VITE_ALVO === 'site', 'bateria da LP')

/** Abre a rota e espera a hidratação — antes dela, os botões ainda não respondem. */
async function abrir(page: Page, rota = '/') {
  await page.goto(rota)
  await page.locator('html[data-hidratado]').waitFor({ state: 'attached' })
}

/**
 * Ponta a ponta, contra o build de produção (vite preview imitando a borda).
 * Roda em desktop e em celular (playwright.config.ts).
 */

test.describe('rotas e HTML pré-renderizado', () => {
  test('cada rota chega com o <head> e o conteúdo próprios, antes do JS', async ({ request }) => {
    for (const [rota, titulo, texto] of [
      ['/', 'Curso de inglês em Goiânia', 'Aprenda inglês para usar'],
      ['/obrigado', 'Contato recebido', 'Recebemos seu contato'],
      ['/politica-de-privacidade', 'Política de privacidade', 'O que coletamos'],
    ]) {
      const html = await (await request.get(rota)).text()
      expect(html, rota).toContain(`<title>${titulo}`)
      // O texto está no HTML — não depende de JavaScript para existir.
      expect(html, rota).toContain(texto)
    }
  })

  test('endereço inexistente devolve 404 de verdade, com noindex', async ({ request }) => {
    const r = await request.get('/nao-existe')
    expect(r.status()).toBe(404)
    expect(await r.text()).toContain('noindex')
  })

  test('hidrata sem erro nem aviso no console', async ({ page }) => {
    const problemas: string[] = []
    page.on('console', (m) => {
      // Só o que é do site (o iframe do Google Maps tem avisos próprios).
      const origem = m.location().url
      if (origem && !origem.startsWith('http://127.0.0.1')) return
      if (m.type() === 'error' || m.type() === 'warning') problemas.push(m.text())
    })
    page.on('pageerror', (e) => problemas.push(e.message))
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    expect(problemas.filter((p) => !p.includes('web-vitals'))).toEqual([])
  })
})

test.describe('conversão', () => {
  test('o quiz monta a mensagem qualificada do WhatsApp', async ({ page }) => {
    await abrir(page, '/?utm_source=google&gclid=abc')
    await page.getByRole('button', { name: 'Para mim' }).click()
    await page.getByRole('button', { name: 'Crescer na carreira' }).click()
    await page.getByRole('button', { name: 'Sei o básico' }).click()
    await expect(page.locator('#descubra')).toContainText('Inglês profissional')

    const link = page.getByRole('link', { name: 'Enviar no WhatsApp' })
    // O clique reescreve o href; o evento de popup é ignorado.
    await link.evaluate((a) => a.addEventListener('click', (e) => e.preventDefault()))
    await link.click()
    const texto = decodeURIComponent((await link.getAttribute('href'))?.split('text=')[1] ?? '')
    expect(texto.startsWith('Olá! Vim pelo site e gostaria de saber mais')).toBe(true)
    expect(texto).toContain('(Vim por um anúncio no Google.)')
    expect(texto).toContain('Objetivo: crescer na carreira')
    expect(texto).toContain('Curso indicado pelo site: Inglês profissional')
    expect(
      await page.evaluate(() =>
        (window.dataLayer ?? []).map((e) => (e as { event?: string }).event),
      ),
    ).toContain('whatsapp_click')
  })

  test('todo botão de WhatsApp é link direto wa.me', async ({ page }) => {
    await page.goto('/')
    const hrefs = await page
      .locator('a[data-whatsapp]')
      .evaluateAll((as) => as.map((a) => a.getAttribute('href')))
    expect(hrefs.length).toBeGreaterThan(8)
    for (const h of hrefs) expect(h).toMatch(/^https:\/\/wa\.me\/\d+\?text=/)
  })

  test('formulário: valida, envia e leva a /obrigado', async ({ page }) => {
    await page.route('**/*lambda-url*/**', (r) => r.fulfill({ status: 200, body: '{"ok":true}' }))
    await abrir(page)
    await page.getByRole('button', { name: 'Quero saber mais' }).click()
    await expect(page.getByText('Como podemos chamar você?')).toBeVisible()
    await expect(page.locator('#lead-nome')).toBeFocused()

    await page.locator('#lead-nome').fill('Maria Teste')
    await page.locator('#lead-email').fill('maria@teste.com')
    await page.locator('#lead-whatsapp').fill('62998765432')
    await expect(page.locator('#lead-whatsapp')).toHaveValue('(62) 99876-5432')
    // LGPD: sem a autorização (que começa desmarcada), o formulário não envia.
    await expect(page.locator('#lead-aceite')).not.toBeChecked()
    await expect(page.locator('#lead-novidades')).not.toBeChecked()
    await page.getByRole('button', { name: 'Quero saber mais' }).click()
    await expect(page.locator('#lead-aceite-erro')).toBeVisible()
    await expect(page.locator('#lead-aceite')).toBeFocused()
    await page.locator('#lead-aceite').check()
    await page.getByRole('button', { name: 'Quero saber mais' }).click()

    // Sem VITE_LEADS_URL no build de teste, o formulário cai no caminho de
    // falha e oferece o WhatsApp; com ela, vai a /obrigado. Os dois são válidos.
    await expect(
      page.getByRole('heading', { name: 'Recebemos seu contato.' }).or(page.getByRole('alert')),
    ).toBeVisible()
    if (await page.getByRole('alert').isVisible()) {
      await expect(page.getByRole('alert').getByRole('link', { name: /WhatsApp/ })).toBeVisible()
    } else {
      await expect(page).toHaveURL(/\/obrigado$/)
    }
  })
})

test.describe('peso e privacidade', () => {
  test('YouTube só carrega depois do clique (o mapa já vem carregado)', async ({ page }) => {
    const terceiros: string[] = []
    page.on('request', (r) => {
      if (/youtube|ytimg/.test(r.url())) terceiros.push(r.url())
    })
    await abrir(page)
    for (let y = 0; y < 12000; y += 700) await page.evaluate((y) => window.scrollTo(0, y), y)
    await page.waitForTimeout(800)
    expect(terceiros).toEqual([])

    await page.getByRole('button', { name: /Assistir: Vídeo depoimento – Anna/ }).click()
    await expect(
      page.locator('iframe[src*="youtube-nocookie.com/embed/FE6KPie2PK4"]'),
    ).toBeAttached()
  })

  test('um <h1> por página e todo botão com nome', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toHaveCount(1)
    const semNome = await page
      .locator('button, a')
      .evaluateAll(
        (els) => els.filter((e) => !(e.textContent?.trim() || e.getAttribute('aria-label'))).length,
      )
    expect(semNome).toBe(0)
  })
})

test.describe('movimento reduzido', () => {
  test.use({ reducedMotion: 'reduce' })
  test('tudo visível, sem vídeo tocando', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.locator('#localizacao').scrollIntoViewIfNeeded()
    await expect(page.locator('#localizacao video')).toHaveCount(0)
    await expect(page.locator('#diferenciais li').first()).toHaveCSS('opacity', '1')
  })
})

test.describe('leveza da LP', () => {
  test('a LP não baixa three.js nem GSAP — nada entre o anúncio e o botão', async ({ page }) => {
    const pesados: string[] = []
    page.on('request', (r) => {
      if (/\/assets\/(globo|gsap|ScrollTrigger)-/.test(r.url())) pesados.push(r.url())
    })
    await abrir(page)
    for (let y = 0; y < 12000; y += 900) await page.evaluate((y) => window.scrollTo(0, y), y)
    await page.waitForTimeout(1500)
    expect(pesados).toEqual([])
  })

  test('o chat do herói leva ao WhatsApp com o perfil', async ({ page }) => {
    await abrir(page)
    await page.getByRole('button', { name: 'Para meu filho ou filha' }).click()
    await page.getByRole('button', { name: 'Até 6 anos' }).click()
    await expect(page.locator('#descubra')).toContainText('Interkids')
    const link = page.getByRole('link', { name: 'Enviar no WhatsApp' })
    await link.evaluate((a) => a.addEventListener('click', (e) => e.preventDefault()))
    await link.click()
    const texto = decodeURIComponent((await link.getAttribute('href'))?.split('text=')[1] ?? '')
    expect(texto).toContain('Curso indicado pelo site: Interkids')
  })
})
