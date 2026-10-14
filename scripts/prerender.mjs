/**
 * Pré-render: escreve o HTML de cada rota dentro do <div id="root">.
 *
 *   npm run build   (roda sozinho depois do `vite build` e do build SSR)
 *
 * Sem isto, a página seria uma SPA como os sites anteriores: o navegador
 * baixa o HTML vazio, depois o JavaScript, e só então desenha o título. Numa
 * landing page de anúncio aberta no celular, esse intervalo É o LCP — e o
 * site atual da escola tem LCP de 13 s. Com o HTML pronto, o <h1> pinta no
 * primeiro quadro, e o React só hidrata o que já está na tela.
 *
 * O mesmo App do navegador, renderizado em Node a partir do bundle SSR
 * (dist-ssr/entry-server.js). Os HTML de rota e o 404 já foram gerados pelo
 * plugin de rotas do vite.config.ts, com o <head> certo; aqui só entra o
 * corpo.
 */
import { existsSync } from 'node:fs'
import { readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const RAIZ = path.resolve(import.meta.dirname, '..')
const DIST = path.join(RAIZ, 'dist')
const SSR = path.join(RAIZ, 'dist-ssr')

const { renderizar, CAMINHOS } = await import(pathToFileURL(path.join(SSR, 'entry-server.js')).href)

const arquivoDe = (caminho) =>
  caminho === '/'
    ? 'index.html'
    : caminho === '/404'
      ? '404.html'
      : `${caminho.slice(1)}/index.html`

let total = 0
for (const caminho of CAMINHOS) {
  const arquivo = path.join(DIST, arquivoDe(caminho))
  if (!existsSync(arquivo)) throw new Error(`Falta ${arquivo} — o plugin de rotas não o gerou.`)
  const html = await readFile(arquivo, 'utf8')
  const marcador = '<div id="root"></div>'
  if (!html.includes(marcador)) throw new Error(`${arquivo} sem <div id="root"></div>`)
  const corpo = renderizar(caminho)
  await writeFile(arquivo, html.replace(marcador, `<div id="root">${corpo}</div>`))
  console.log(`  ${caminho.padEnd(26)} ${(corpo.length / 1024).toFixed(1)} kB de HTML`)
  total++
}

await rm(SSR, { recursive: true, force: true })
console.log(`Pré-render: ${total} rotas.`)
