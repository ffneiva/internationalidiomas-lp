import * as THREE from 'three'

/**
 * O globo da International em 3D — inteiro em código.
 *
 * O logo da escola é um globo desenhado com faixas: listras horizontais que
 * não fecham a volta, cortadas por um arco alongado de um lado. A cena é esse
 * desenho levado para o espaço:
 *
 * · **As faixas** são pedaços de esfera (`SphereGeometry` com início e
 *   comprimento de ângulo), mais largas no equador e mais finas nos polos, em
 *   azul metálico. Elas não fecham: dá para ver a faixa de trás pela abertura,
 *   e é isso que dá profundidade sem precisar de textura.
 * · **O arco** é o traço branco do logo, perolado, abraçando o globo.
 * · **Goiânia** é um ponto amarelo (a cor da marca) com um anel pulsando; dele
 *   saem as **rotas** — arcos de voo até cidades onde o inglês é a língua do
 *   dia a dia —, desenhadas aos poucos, com um brilho que percorre o caminho.
 *
 * Nenhum `.glb`, nenhum HDRI, nenhuma textura em arquivo. O ambiente que dá
 * o reflexo do metal é "cozido" na hora (`PMREMGenerator`) a partir de
 * retângulos de luz — sem ele, metal é cinza chapado.
 */

export type Destino = { cidade: string; lat: number; lon: number }

export type OpcoesGlobo = {
  destinos: readonly Destino[]
  origem: { lat: number; lon: number }
  /** Sem ninguém escolhendo, troca de destino sozinho a cada `ciclo` ms. */
  ciclo?: number
  /** Celular: menos segmentos, sem antisserrilhado, resolução 1×. */
  compacto?: boolean
  /**
   * "Reduzir movimento" ligado (o Windows liga sem a pessoa saber): o globo
   * aparece, mas já montado, sem balanço nem pulso, trocando devagar.
   */
  calmo?: boolean
}

const AZUL = new THREE.Color('#0d5cc2')
const AZUL_ESCURO = new THREE.Color('#25376a')
const MARCA = new THREE.Color('#fff133')

/** lat/lon em graus → ponto na esfera (convenção: +z olha para a câmera em lon = -90). */
function ponto(lat: number, lon: number, raio = 1): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lon + 180)
  return new THREE.Vector3(
    -raio * Math.sin(phi) * Math.cos(theta),
    raio * Math.cos(phi),
    raio * Math.sin(phi) * Math.sin(theta),
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Estúdio
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Luz de estúdio fotográfico, cozida em mapa de ambiente. As faixas são
 * metal: o que elas mostram é o que refletem. Uma luz de preenchimento
 * fraca demais deixa as faixas de trás pretas contra o fundo marinho — por
 * isso há um retângulo grande e frio ATRÁS do globo (lição do monograma da
 * Delamayer: metal reflete o que existe atrás, e atrás era preto).
 */
const SOFTBOXES = [
  { pos: [0, 5, 3], escala: [10, 3], intensidade: 5, cor: '#ffffff' },
  { pos: [-6, 1, 2], escala: [3, 8], intensidade: 3.2, cor: '#cfe0ff' },
  { pos: [6, -1, 3], escala: [3, 7], intensidade: 2.4, cor: '#fff7c2' },
  { pos: [0, 0, -7], escala: [14, 9], intensidade: 1.8, cor: '#5b8cff' },
  { pos: [0, -5, 0], escala: [12, 12], intensidade: 0.5, cor: '#25376a' },
] as const

function montarAmbiente(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer)
  const estudio = new THREE.Scene()
  estudio.background = new THREE.Color('#061a3d')
  const descartar: Array<{ dispose(): void }> = []
  for (const b of SOFTBOXES) {
    const geo = new THREE.PlaneGeometry(b.escala[0], b.escala[1])
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(b.cor).multiplyScalar(b.intensidade),
      side: THREE.DoubleSide,
    })
    const m = new THREE.Mesh(geo, mat)
    m.position.set(b.pos[0], b.pos[1], b.pos[2])
    m.lookAt(0, 0, 0)
    estudio.add(m)
    descartar.push(geo, mat)
  }
  const alvo = pmrem.fromScene(estudio, 0.035)
  pmrem.dispose()
  for (const d of descartar) d.dispose()
  return alvo.texture
}

// ─────────────────────────────────────────────────────────────────────────────
// Peças
// ─────────────────────────────────────────────────────────────────────────────

/**
 * As faixas do logo: nove listras, da calota de cima até perto do polo sul.
 * Largura segue um seno (finas nos polos, largas no equador) e a abertura
 * gira um pouco a cada faixa — no logo, as pontas das listras não se alinham.
 */
function faixas(material: THREE.Material, segmentos: number): THREE.Group {
  const g = new THREE.Group()
  const N = 9
  const inicio = 0.2 // ângulo polar da primeira faixa (0 = polo norte)
  const fim = Math.PI - 0.32
  const passo = (fim - inicio) / N
  for (let i = 0; i < N; i++) {
    const centro = inicio + passo * (i + 0.5)
    const largura = passo * (0.34 + 0.34 * Math.sin(centro))
    const abertura = 0.62 + 0.18 * Math.cos(i * 1.3)
    const geo = new THREE.SphereGeometry(
      1,
      segmentos,
      6,
      // phiStart / phiLength: a volta em longitude, sem fechar
      abertura + i * 0.07,
      Math.PI * 2 - abertura * 2,
      // thetaStart / thetaLength: a faixa em latitude
      centro - largura / 2,
      largura,
    )
    const m = new THREE.Mesh(geo, material)
    g.add(m)
  }
  return g
}

/** O arco branco do logo: uma meia-lua fina, mais grossa no meio. */
function arco(material: THREE.Material): THREE.Mesh {
  const pontos: THREE.Vector3[] = []
  const N = 120
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const a = -Math.PI * 0.62 + t * Math.PI * 1.24
    pontos.push(new THREE.Vector3(Math.sin(a) * 1.13, Math.cos(a) * 1.13, 0))
  }
  const curva = new THREE.CatmullRomCurve3(pontos)
  const geo = new THREE.TubeGeometry(curva, 160, 0.028, 12, false)
  // Afina as pontas: escala a seção do tubo pelo seno da posição na curva.
  const pos = geo.attributes.position
  const v = new THREE.Vector3()
  const segs = 161
  const radiais = 13
  for (let s = 0; s < segs; s++) {
    const t = s / (segs - 1)
    const c = curva.getPointAt(t)
    const k = 0.15 + 0.85 * Math.sin(Math.PI * t)
    for (let r = 0; r < radiais; r++) {
      const idx = s * radiais + r
      v.fromBufferAttribute(pos, idx).sub(c).multiplyScalar(k).add(c)
      pos.setXYZ(idx, v.x, v.y, v.z)
    }
  }
  geo.computeVertexNormals()
  const m = new THREE.Mesh(geo, material)
  // No logo o arco fica à direita, inclinado, abraçando as faixas.
  m.rotation.set(0.12, 0.7, -0.38)
  return m
}

type Rota = {
  tubo: THREE.Mesh
  brilho: THREE.Mesh
  curva: THREE.QuadraticBezierCurve3
  totalIndices: number
  alvo: THREE.Vector3
  pino: THREE.Mesh
}

function rota(origem: THREE.Vector3, destino: THREE.Vector3): Rota {
  const meio = origem.clone().add(destino).multiplyScalar(0.5)
  const distancia = origem.distanceTo(destino)
  meio.normalize().multiplyScalar(1 + 0.22 + distancia * 0.28)
  const curva = new THREE.QuadraticBezierCurve3(origem, meio, destino)
  const geo = new THREE.TubeGeometry(curva, 96, 0.0075, 6, false)
  const tubo = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ color: MARCA, transparent: true, opacity: 0.95 }),
  )
  const totalIndices = geo.index?.count ?? 0
  geo.setDrawRange(0, 0)
  const brilho = new THREE.Mesh(
    new THREE.SphereGeometry(0.022, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ffffff' }),
  )
  brilho.visible = false
  const pino = new THREE.Mesh(
    new THREE.SphereGeometry(0.02, 16, 16),
    new THREE.MeshBasicMaterial({ color: MARCA }),
  )
  pino.position.copy(destino)
  pino.scale.setScalar(0.001)
  return { tubo, brilho, curva, totalIndices, alvo: destino, pino }
}

// ─────────────────────────────────────────────────────────────────────────────
// A cena
// ─────────────────────────────────────────────────────────────────────────────

const amortecer = (atual: number, alvo: number, k: number, dt: number) =>
  atual + (alvo - atual) * (1 - Math.exp(-k * dt))

export class CenaGlobo {
  private renderer: THREE.WebGLRenderer
  private cena = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
  private globo = new THREE.Group()
  private rotas: Rota[] = []
  private anel: THREE.Mesh
  private relogio = new THREE.Timer()
  private frame = 0
  private rodando = false
  private descartaveis: Array<{ dispose(): void }> = []

  private ativo = 0
  private escolhido: number | null = null
  private desdeTroca = 0
  private progressoRota = 0
  private ciclo: number
  private rot = { x: 0.25, y: 0 }
  private alvoRot = { x: 0.25, y: 0 }
  private ponteiro = { x: 0, y: 0 }
  private ponteiroSuave = { x: 0, y: 0 }
  private giroLivre = 0
  private calmo = false
  private faixas: THREE.Object3D[] = []
  private arco: THREE.Mesh
  /** Segundos desde que a cena começou a rodar — conduz a montagem. */
  private tempo = 0
  /** Giro dado pela pessoa (arrasto), com inércia. */
  private arrasto = { x: 0, y: 0 }
  private velArrasto = { x: 0, y: 0 }
  /** Avisa quem mostra a legenda ("Goiânia → Londres") que a rota mudou. */
  aoTrocar?: (i: number) => void

  constructor(canvas: HTMLCanvasElement, opcoes: OpcoesGlobo) {
    this.calmo = opcoes.calmo ?? false
    this.ciclo = (opcoes.ciclo ?? 3800) * (this.calmo ? 2 : 1)
    // Modo calmo: começa depois da montagem (sem as faixas chegando girando).
    if (this.calmo) this.tempo = 2
    const compacto = opcoes.compacto ?? false
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: !compacto, alpha: true })
    this.renderer.setPixelRatio(compacto ? 1 : Math.min(window.devicePixelRatio, 1.75))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    const ambiente = montarAmbiente(this.renderer)
    this.cena.environment = ambiente
    this.descartaveis.push(ambiente)

    this.camera.position.set(0, 0, 4.4)

    const metal = new THREE.MeshPhysicalMaterial({
      color: AZUL,
      metalness: 0.75,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      side: THREE.DoubleSide,
      envMapIntensity: 1.25,
    })
    const perola = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      metalness: 0.1,
      roughness: 0.18,
      clearcoat: 1,
      sheen: 1,
      sheenColor: new THREE.Color('#dce8ff'),
      envMapIntensity: 1.4,
    })
    // O miolo: uma esfera escura e translúcida, só para as faixas de trás não
    // "atravessarem" as da frente na leitura — dá volume sem esconder nada.
    const miolo = new THREE.MeshPhysicalMaterial({
      color: AZUL_ESCURO,
      metalness: 0,
      roughness: 0.6,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    })
    this.descartaveis.push(metal, perola, miolo)

    const grupoFaixas = faixas(metal, compacto ? 48 : 96)
    this.faixas = [...grupoFaixas.children]
    this.globo.add(grupoFaixas)
    const nucleo = new THREE.Mesh(new THREE.SphereGeometry(0.965, 64, 48), miolo)
    this.globo.add(nucleo)
    this.cena.add(this.globo)
    // O arco fica fora do grupo que gira: no logo ele é o "traço" parado que
    // abraça o globo; as faixas giram por dentro dele.
    this.arco = arco(perola)
    this.cena.add(this.arco)

    // Goiânia
    const origem = ponto(opcoes.origem.lat, opcoes.origem.lon, 1.012)
    const casa = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 20, 20),
      new THREE.MeshBasicMaterial({ color: MARCA }),
    )
    casa.position.copy(origem)
    this.globo.add(casa)
    this.anel = new THREE.Mesh(
      new THREE.RingGeometry(0.04, 0.052, 48),
      new THREE.MeshBasicMaterial({
        color: MARCA,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    )
    this.anel.position.copy(origem.clone().multiplyScalar(1.002))
    this.anel.lookAt(origem.clone().multiplyScalar(2))
    this.globo.add(this.anel)

    for (const d of opcoes.destinos) {
      const r = rota(origem, ponto(d.lat, d.lon, 1.012))
      this.globo.add(r.tubo, r.brilho, r.pino)
      this.rotas.push(r)
    }

    const luz = new THREE.DirectionalLight('#ffffff', 1.2)
    luz.position.set(2, 3, 4)
    this.cena.add(luz, new THREE.AmbientLight('#8fb0ff', 0.35))

    this.apontarPara(0, true)
  }

  /** Gira o globo para deixar a rota `i` de frente para a câmera. */
  private apontarPara(i: number, imediato = false) {
    const r = this.rotas[i]
    if (!r) return
    const meio = r.curva.getPoint(0.5).normalize()
    // Rotação em Y que traz o ponto para +z, e uma inclinação parcial em X.
    // Com o meio da rota exatamente de frente, o arco é visto "de cima" e
    // vira uma linha reta. Girando um pouco além, ele aparece de perfil — a
    // curva de voo fica legível.
    const y = -Math.atan2(meio.x, meio.z) - 0.55
    const x = THREE.MathUtils.clamp(Math.asin(meio.y) * 0.7, -0.5, 0.6)
    // Menor caminho a partir da rotação atual (sem dar a volta inteira).
    const atual = this.alvoRot.y
    const volta = Math.round((atual - y) / (Math.PI * 2)) * Math.PI * 2
    this.alvoRot = { x, y: y + volta }
    if (imediato) this.rot = { ...this.alvoRot }
  }

  /** Destino escolhido por fora (hover num objetivo). `null` volta ao ciclo. */
  escolher(i: number | null) {
    this.escolhido = i
    if (i !== null && i !== this.ativo) this.trocar(i)
  }

  private trocar(i: number) {
    const antiga = this.rotas[this.ativo]
    if (antiga) {
      antiga.tubo.geometry.setDrawRange(0, 0)
      antiga.brilho.visible = false
      antiga.pino.scale.setScalar(0.001)
    }
    this.ativo = i
    this.progressoRota = 0
    this.desdeTroca = 0
    this.apontarPara(i)
    this.aoTrocar?.(i)
  }

  /**
   * Arrasto da pessoa, em pixels desde o último evento. Vira velocidade: ao
   * soltar, o globo continua girando e para devagar (inércia), como um globo
   * de mesa de verdade.
   */
  arrastar(dx: number, dy: number) {
    this.velArrasto.y = dx * 0.5
    this.velArrasto.x = dy * 0.3
    this.arrasto.y += dx * 0.008
    this.arrasto.x = THREE.MathUtils.clamp(this.arrasto.x + dy * 0.005, -0.6, 0.6)
  }

  /** Ponteiro em coordenadas normalizadas (-1…1). */
  apontar(x: number, y: number) {
    this.ponteiro = { x, y }
  }

  redimensionar(largura: number, altura: number) {
    this.renderer.setSize(largura, altura, false)
    this.camera.aspect = largura / altura
    this.camera.updateProjectionMatrix()
  }

  iniciar() {
    if (this.rodando) return
    this.rodando = true
    this.relogio.update()
    const laco = (agora: number) => {
      if (!this.rodando) return
      this.relogio.update(agora)
      this.quadro(Math.min(0.05, this.relogio.getDelta()))
      this.frame = requestAnimationFrame(laco)
    }
    this.frame = requestAnimationFrame(laco)
  }

  parar() {
    this.rodando = false
    cancelAnimationFrame(this.frame)
  }

  /**
   * A montagem da abertura: as faixas chegam girando, uma a uma de cima para
   * baixo, crescem até o tamanho certo e se encaixam; depois o arco varre e
   * abraça o globo. Só então a primeira rota é desenhada. ~1,8 s no total.
   */
  private montar(): boolean {
    const t = this.tempo
    const saida = (x: number) => 1 - (1 - x) ** 4
    const mola = (x: number) => {
      // passa um pouco do lugar e volta — o "encaixe"
      const c = 1.4
      return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2
    }
    for (const [i, f] of this.faixas.entries()) {
      const p = THREE.MathUtils.clamp((t - 0.1 - i * 0.075) / 0.85, 0, 1)
      f.scale.setScalar(Math.max(0.001, mola(p)))
      f.rotation.y = (1 - saida(p)) * (2.4 + i * 0.25)
    }
    const pa = THREE.MathUtils.clamp((t - 0.75) / 0.9, 0, 1)
    this.arco.scale.setScalar(Math.max(0.001, saida(pa)))
    this.arco.rotation.z = -0.38 - (1 - saida(pa)) * 1.6
    return t > 1.7
  }

  private quadro(dt: number) {
    this.tempo += dt
    const montado = this.montar()
    if (!montado) {
      this.desdeTroca = 0
      this.progressoRota = 0
    }
    this.desdeTroca += dt * 1000
    if (this.escolhido === null && this.desdeTroca > this.ciclo && this.rotas.length > 1) {
      this.trocar((this.ativo + 1) % this.rotas.length)
    }

    // Rota: desenha em ~1,1 s, depois o brilho percorre em laço.
    if (montado) this.progressoRota = Math.min(1, this.progressoRota + dt / 1.1)
    const r = this.rotas[this.ativo]
    if (r) {
      const e = 1 - (1 - this.progressoRota) ** 3
      const n = Math.floor((e * r.totalIndices) / 6) * 6
      r.tubo.geometry.setDrawRange(0, n)
      r.pino.scale.setScalar(Math.max(0.001, e ** 4))
      if (this.progressoRota >= 1) {
        r.brilho.visible = true
        const t = (((this.desdeTroca / 1400) % 1) + 1) % 1
        r.brilho.position.copy(r.curva.getPoint(t))
      }
    }

    // Anel de Goiânia pulsando.
    const pulso = this.calmo ? 0.25 : (((performance.now() / 1600) % 1) + 1) % 1
    this.anel.scale.setScalar(1 + pulso * 1.8)
    ;(this.anel.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - pulso)

    // Giro: vai ao destino, com um balanço lento por cima e o ponteiro
    // inclinando um pouco — a peça responde a quem está olhando.
    if (!this.calmo) this.giroLivre += dt * 0.08
    this.ponteiroSuave.x = amortecer(this.ponteiroSuave.x, this.ponteiro.x, 3, dt)
    this.ponteiroSuave.y = amortecer(this.ponteiroSuave.y, this.ponteiro.y, 3, dt)
    this.rot.x = amortecer(this.rot.x, this.alvoRot.x, 2.2, dt)
    this.rot.y = amortecer(this.rot.y, this.alvoRot.y, 2.2, dt)
    // Inércia do arrasto: a velocidade decai exponencialmente (atrito).
    this.arrasto.y += this.velArrasto.y * dt
    this.velArrasto.y *= Math.exp(-2.6 * dt)
    // O arrasto vertical volta ao centro devagar; o horizontal fica onde a
    // pessoa deixou.
    this.arrasto.x = amortecer(this.arrasto.x, 0, 0.8, dt)
    this.globo.rotation.x = this.rot.x + this.arrasto.x - this.ponteiroSuave.y * 0.18
    this.globo.rotation.y =
      this.rot.y + this.arrasto.y + Math.sin(this.giroLivre) * 0.12 + this.ponteiroSuave.x * 0.3

    this.renderer.render(this.cena, this.camera)
  }

  destruir() {
    this.parar()
    this.cena.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose()
        const m = o.material as THREE.Material | THREE.Material[]
        for (const x of Array.isArray(m) ? m : [m]) x.dispose()
      }
    })
    for (const d of this.descartaveis) d.dispose()
    this.renderer.dispose()
  }
}
