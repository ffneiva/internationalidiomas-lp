/**
 * Baixa as fontes do Google e escreve os @font-face já apontando para /fonts.
 *
 * A fonte é a do MANUAL DE MARCA da escola: família Exo 2 — títulos
 * ExtraBold, subtítulos SemiBold, corpo Medium. Uma família variável (eixo de
 * peso) cobre os três pesos num arquivo só. Só os subsets latin e latin-ext:
 * o português inteiro, com folga.
 *
 *   npm run fonts
 */
import { execFileSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const RAIZ = path.resolve(import.meta.dirname, '..')
const OUT = path.join(RAIZ, 'public/fonts')

// O Google só devolve woff2 para User-Agents que reconhece.
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

const FAMILIAS = [{ query: 'family=Exo+2:wght@400..800', slug: 'exo2' }]

const SUBSETS = new Set(['latin', 'latin-ext'])

/**
 * A faixa de pesos que o site usa de fato. O Google entrega a variável
 * inteira (peso 100–900) mesmo quando a query pede menos;
 * cortar os eixos com o instancer do fontTools tira ~34% do arquivo, e é o
 * arquivo que está no caminho crítico. Sem Python/fontTools na máquina, a
 * fonte fica inteira — funciona igual, só pesa mais.
 */
const EIXOS = ['wght=400:800']
const PY = process.platform === 'win32' ? 'python' : 'python3'

function cortarEixos(arquivo) {
  const ttf = `${arquivo}.tmp.ttf`
  try {
    execFileSync(PY, ['-m', 'fontTools.varLib.instancer', arquivo, ...EIXOS, '-o', ttf, '-q'], {
      stdio: 'ignore',
    })
    execFileSync(PY, ['-m', 'fontTools.ttLib.woff2', 'compress', '-o', arquivo, ttf], {
      stdio: 'ignore',
    })
    return true
  } catch {
    return false
  } finally {
    rmSync(ttf, { force: true })
  }
}

async function baixar(url, nome) {
  const bin = await fetch(url).then((r) => r.arrayBuffer())
  const destino = path.join(OUT, nome)
  await writeFile(destino, Buffer.from(bin))
  const cortou = cortarEixos(destino)
  const kb = ((await stat(destino)).size / 1024).toFixed(1)
  console.log(`  ${nome}  ${kb} kB${cortou ? ' (eixos cortados)' : ''}`)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const blocos = []

  for (const { query, slug } of FAMILIAS) {
    const css = await fetch(`https://fonts.googleapis.com/css2?${query}&display=swap`, {
      headers: { 'User-Agent': UA },
    }).then((r) => r.text())

    for (const [, subset, bloco] of css.matchAll(
      /\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[\s\S]*?\})/g,
    )) {
      if (!SUBSETS.has(subset)) continue
      const url = bloco.match(/url\((https:[^)]+)\)/)?.[1]
      if (!url) continue
      const nome = `${slug}-${subset}.woff2`
      await baixar(url, nome)
      blocos.push(
        bloco
          .replace(/src:\s*url\([^)]+\)/, `src: url(/fonts/${nome})`)
          .replace(/font-weight:[^;]+;/, 'font-weight: 400 800;'),
      )
    }
  }

  await writeFile(
    path.join(RAIZ, 'src/styles/fonts.css'),
    `/* Gerado por scripts/fetch-fonts.mjs — não editar à mão. */\n\n${blocos.join('\n\n')}\n`,
  )
  console.log('  → src/styles/fonts.css')
}

main().catch((erro) => {
  console.error(erro)
  process.exit(1)
})
