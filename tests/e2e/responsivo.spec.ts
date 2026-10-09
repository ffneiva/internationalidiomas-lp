import { expect, test } from '@playwright/test'

/**
 * Nenhuma página rola de lado, em nenhuma largura — da tela mais estreita
 * de celular ao notebook. Vale para os dois produtos (o build define qual).
 */
const ROTAS =
  process.env.VITE_ALVO === 'site' ? ['/', '/sobre-a-inter', '/kids', '/in-company'] : ['/']

test.describe('responsividade', () => {
  test.skip(({ isMobile }) => isMobile, 'as larguras são definidas aqui mesmo')
  for (const largura of [360, 412, 520, 768, 1024, 1280]) {
    test(`sem rolagem lateral em ${largura}px`, async ({ page }) => {
      await page.setViewportSize({ width: largura, height: 850 })
      for (const rota of ROTAS) {
        await page.goto(rota)
        for (let y = 0; y < 12000; y += 1000) await page.evaluate((y) => window.scrollTo(0, y), y)
        const lateral = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        expect(lateral, rota).toBeLessThanOrEqual(1)
      }
    })
  }
})
