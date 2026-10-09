/**
 * Fotos: assets-src/fotos/ → public/images/fotos/.
 *
 *   npm run assets
 *
 * Cada foto sai em até três larguras (360, 720 e 1200 px — só as que a
 * origem comporta, nunca ampliada), em AVIF e WebP: os dois juntos cobrem
 * todo navegador que roda o resto do site e dispensam o JPEG de reserva. O
 * manifesto guarda a COR dominante, a proporção e as larguras geradas: a cor
 * pinta o quadro enquanto a foto chega, a proporção reserva o espaço (sem
 * salto de layout) e as larguras montam o `srcset` sem apontar para arquivo
 * que não existe.
 *
 * Roda na máquina de quem mexe nas fotos, não no CI: o resultado é versionado
 * em public/images, e o build continua sendo só `vite build` — sem o sharp,
 * que é binário, pesado e lento em runner frio.
 */
import { existsSync } from 'node:fs'
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const RAIZ = path.resolve(import.meta.dirname, '..')
const ORIGEM = path.join(RAIZ, 'assets-src/fotos')
const DESTINO = path.join(RAIZ, 'public/images/fotos')
const LARGURAS = [360, 720, 1200]

const hex = ({ r, g, b }) =>
  `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`

/** Pula o que já está convertido e é mais novo que a origem. */
async function atualizado(origem, alvo) {
  if (!existsSync(alvo)) return false
  return (await stat(alvo)).mtimeMs >= (await stat(origem)).mtimeMs
}

await mkdir(DESTINO, { recursive: true })
const manifesto = {}
const arquivos = (await readdir(ORIGEM)).filter((f) => f.endsWith('.jpg')).sort()

for (const arquivo of arquivos) {
  const nome = path.parse(arquivo).name
  const entrada = path.join(ORIGEM, arquivo)
  const { width, height } = await sharp(entrada).metadata()
  // A própria largura da origem entra quando fica entre dois degraus: um
  // pôster de 405 px serve melhor a tela de alta densidade em 405 do que
  // parado em 360.
  const larguras = LARGURAS.filter((l) => l <= width)
  if (!larguras.length || (width < LARGURAS.at(-1) && width > larguras.at(-1) * 1.1)) {
    larguras.push(width)
  }
  for (const largura of larguras) {
    const avif = path.join(DESTINO, `${nome}-${largura}.avif`)
    if (await atualizado(entrada, avif)) continue
    const base = sharp(entrada).resize({ width: largura, withoutEnlargement: true })
    await base.clone().avif({ quality: 50, effort: 5 }).toFile(avif)
    await base
      .clone()
      .webp({ quality: 72 })
      .toFile(path.join(DESTINO, `${nome}-${largura}.webp`))
  }
  const { dominant } = await sharp(entrada).stats()
  manifesto[nome] = {
    cor: hex(dominant),
    proporcao: Number((width / height).toFixed(4)),
    larguras,
  }
}

await writeFile(path.join(RAIZ, 'src/data/fotos.json'), `${JSON.stringify(manifesto, null, 1)}\n`)
console.log(`Imagens: ${arquivos.length} fotos → public/images/fotos`)
