/**
 * Gera os arquivos de marca: logo e globo em SVG, favicon, ícones e as artes
 * de compartilhamento (a prévia do link no WhatsApp).
 *
 *   npm run brand
 *
 * Duas fontes: a marca em vetor (src/lib/marca.ts — vetorizada do logo
 * oficial) e a lista de rotas (src/lib/routes.ts). Uma rota nova ganha a sua
 * arte sem ninguém abrir um editor.
 *
 * O logo horizontal é o arquivo oficial da escola (src/assets/logo.webp) —
 * ver o comentário em src/components/Logo.tsx.
 *
 * As artes são renderizadas por um Chromium de verdade (o do Playwright), com
 * a fonte do próprio site.
 *
 * Roda com --experimental-strip-types para importar os .ts sem build.
 */
import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from '@playwright/test'
import sharp from 'sharp'
import { GLOBO } from '../src/lib/marca.ts'
import { ogArquivoDe, ROTAS } from '../src/lib/routes.ts'

const RAIZ = path.resolve(import.meta.dirname, '..')
const PUBLIC = path.join(RAIZ, 'public')

const AZUL = '#074cae'
const MARINHO = '#25376a'
const MARCA = '#fff133'

function globoSvg(cor = '#ffffff') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GLOBO.w} ${GLOBO.h}" fill="${cor}"><path d="${GLOBO.d}"/></svg>`
}

/** O favicon: o globo branco num quadrado azul de cantos redondos. */
function faviconSvg() {
  const L = Math.max(GLOBO.w, GLOBO.h) * 1.32
  const e = (L * 0.8) / GLOBO.h
  const dx = (L - GLOBO.w * e) / 2
  const dy = (L - GLOBO.h * e) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L.toFixed(0)} ${L.toFixed(0)}"><rect width="${L.toFixed(0)}" height="${L.toFixed(0)}" rx="${(L * 0.22).toFixed(0)}" fill="${AZUL}"/><path d="${GLOBO.d}" transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)}) scale(${e.toFixed(5)})" fill="#fff"/></svg>`
}

/** Ícone de tela inicial: quadrado cheio (o sistema recorta). */
function iconeSvg() {
  const L = 1000
  const e = (L * 0.62) / GLOBO.h
  const dx = (L - GLOBO.w * e) / 2
  const dy = (L - GLOBO.h * e) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L} ${L}"><rect width="${L}" height="${L}" fill="${AZUL}"/><path d="${GLOBO.d}" transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)}) scale(${e.toFixed(5)})" fill="#fff"/></svg>`
}

/** O .ico que o navegador pede sozinho: cabeçalho de 22 bytes + PNG de 32 px. */
function icoDePng(png) {
  const c = Buffer.alloc(22)
  c.writeUInt16LE(0, 0)
  c.writeUInt16LE(1, 2)
  c.writeUInt16LE(1, 4)
  c.writeUInt8(32, 6)
  c.writeUInt8(32, 7)
  c.writeUInt16LE(1, 10)
  c.writeUInt16LE(32, 12)
  c.writeUInt32LE(png.length, 14)
  c.writeUInt32LE(22, 18)
  return Buffer.concat([c, png])
}

async function icones() {
  // O globo vai para src/assets: importado pelo componente, ganha hash no
  // nome e pode ter cache de um ano sem risco de arquivo velho. O logo
  // horizontal é o arquivo oficial da escola (src/assets/logo.webp).
  await writeFile(path.join(RAIZ, 'src/assets/globo.svg'), globoSvg())
  await writeFile(path.join(PUBLIC, 'favicon.svg'), faviconSvg())
  console.log('  src/assets/globo.svg, favicon.svg')

  const png = async (nome, svg, tamanho) => {
    await sharp(Buffer.from(svg), { density: 300 })
      .resize(tamanho, tamanho)
      .png({ compressionLevel: 9 })
      .toFile(path.join(PUBLIC, nome))
    console.log(`  ${nome}`)
  }
  await png('favicon-32.png', faviconSvg(), 32)
  await png('apple-touch-icon.png', iconeSvg(), 180)
  await png('icon-192.png', iconeSvg(), 192)
  await png('icon-512.png', iconeSvg(), 512)
  await writeFile(
    path.join(PUBLIC, 'favicon.ico'),
    icoDePng(await readFile(path.join(PUBLIC, 'favicon-32.png'))),
  )
  console.log('  favicon.ico')

  const v = async (arquivo) =>
    createHash('sha1')
      .update(await readFile(path.join(PUBLIC, arquivo)))
      .digest('hex')
      .slice(0, 8)
  const versoes = { 192: await v('icon-192.png'), 512: await v('icon-512.png') }
  const manifesto = {
    name: 'International Idiomas',
    short_name: 'International',
    description: 'Curso de inglês em Goiânia, no Setor Bueno.',
    lang: 'pt-BR',
    start_url: '/',
    display: 'standalone',
    background_color: MARINHO,
    theme_color: MARINHO,
    icons: [192, 512].map((l) => ({
      src: `/icon-${l}.png?v=${versoes[l]}`,
      sizes: `${l}x${l}`,
      type: 'image/png',
      purpose: 'any maskable',
    })),
  }
  await writeFile(path.join(PUBLIC, 'site.webmanifest'), `${JSON.stringify(manifesto, null, 2)}\n`)
  console.log('  site.webmanifest')
}

async function artes() {
  const fonte = (await readFile(path.join(PUBLIC, 'fonts', 'exo2-latin.woff2'))).toString('base64')
  const logo = `data:image/webp;base64,${(await readFile(path.join(RAIZ, 'src/assets/logo.webp'))).toString('base64')}`
  const globo = `data:image/svg+xml;base64,${Buffer.from(globoSvg('rgba(255,255,255,0.07)')).toString('base64')}`
  const foto = `data:image/jpeg;base64,${(
    await sharp(path.join(RAIZ, 'assets-src/fotos/fachada-atual.jpg'))
      .resize(420, 630, { fit: 'cover', position: 'right' })
      .jpeg({ quality: 88 })
      .toBuffer()
  ).toString('base64')}`

  const navegador = await chromium.launch()
  const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } })
  const feitas = new Set()

  for (const rota of ROTAS) {
    const arquivo = ogArquivoDe(rota)
    if (feitas.has(arquivo) || !rota.og) continue
    feitas.add(arquivo)
    const [linha1, linha2] = rota.og

    await pagina.setContent(`<!doctype html><html><head><style>
      @font-face{font-family:A;src:url(data:font/woff2;base64,${fonte}) format('woff2');font-weight:400 800}
      *{margin:0;box-sizing:border-box}
      body{width:1200px;height:630px;background:radial-gradient(110% 90% at 80% 0%,#074bae,${MARINHO} 60%);color:#fff;font-family:A;position:relative;overflow:hidden}
      .globo{position:absolute;right:300px;top:-80px;height:820px}
      .foto{position:absolute;inset:0 0 0 auto;width:420px;background:url(${foto}) center/cover}
      .foto::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,${MARINHO} 0%,rgba(6,33,79,.35) 40%,rgba(6,33,79,0) 70%)}
      .logo{position:absolute;left:72px;top:60px;height:74px}
      .txt{position:absolute;left:72px;top:190px;width:720px}
      h1{font-weight:800;font-size:70px;line-height:1.02;letter-spacing:-.01em}
      mark{background:${MARCA};color:#031634;padding:0 .12em;margin:0 -.04em;box-decoration-break:clone;-webkit-box-decoration-break:clone}
      p{margin-top:34px;font-size:22px;letter-spacing:.14em;text-transform:uppercase;font-weight:650;color:#c9d3e6}
    </style></head><body>
      <img class="globo" src="${globo}">
      <div class="foto"></div>
      <img class="logo" src="${logo}">
      <div class="txt"><h1>${linha1}<br><mark>${linha2}</mark></h1>${rota.ogNota ? `<p>${rota.ogNota}</p>` : ''}</div>
    </body></html>`)
    await pagina.evaluate(() => document.fonts.ready)
    const png = await pagina.screenshot({ type: 'png' })
    await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(PUBLIC, arquivo))
    console.log(`  ${arquivo}`)
  }
  await navegador.close()
}

console.log('Ícones:')
await icones()
console.log('Artes de compartilhamento:')
await artes()
