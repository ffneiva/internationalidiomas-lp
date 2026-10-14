import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { escolhaGuardada, HA_MEDICAO, registrarEscolha } from '@/lib/analytics'
import { ENDERECO_LINHA, ESCOLA, RODAPE } from '@/lib/business'
import { cn } from '@/lib/utils'
import { BotaoWhatsApp } from './BotaoWhatsApp'
import { IconeFacebook, IconeInstagram, IconeLinkedin, IconeWhatsApp, IconeYouTube } from './Icones'
import { Horizonte, Logo } from './Logo'

/**
 * A moldura da página: topo, rodapé, botão flutuante e aviso de cookies.
 *
 * Landing page de anúncio não tem menu: cada link que não leva ao WhatsApp é
 * uma saída, e o topo da LP tem o logo e um botão, e só. O site institucional
 * tem menu — as mesmas páginas do site de hoje — e, no celular, um menu em
 * tela cheia que abre num círculo a partir do botão.
 */
/**
 * O que é próprio do site (menu, unidades, aviso de marcas) chega por
 * `extras`, vindo de `@produto`: a moldura não importa o conteúdo do site, e
 * o bundle da LP não o carrega.
 */
/** Item de menu. Itens com o mesmo `grupo` viram um submenu ("Cursos"). */
type ItemMenu = { path: string; rotulo: string; grupo?: string }

/**
 * O menu agrupado: os itens soltos na ordem, e cada grupo no lugar do seu
 * primeiro item. Com as páginas novas (08/10/2026), dez itens soltos não
 * cabiam numa linha; com os cursos num submenu, ficam cinco.
 */
type Entrada = { tipo: 'item'; item: ItemMenu } | { tipo: 'grupo'; nome: string; itens: ItemMenu[] }
function agrupar(menu: readonly ItemMenu[]): Entrada[] {
  const saida: Entrada[] = []
  for (const m of menu) {
    if (!m.grupo) {
      saida.push({ tipo: 'item', item: m })
      continue
    }
    const g = saida.find((e) => e.tipo === 'grupo' && e.nome === m.grupo)
    if (g && g.tipo === 'grupo') g.itens.push(m)
    else saida.push({ tipo: 'grupo', nome: m.grupo, itens: [m] })
  }
  return saida
}

export type ExtrasMoldura = {
  menu: readonly ItemMenu[]
  unidades: readonly { nome: string; endereco: string; cidade: string }[]
  avisoMarcas?: string
}

export function Topo({
  solido = false,
  caminho = '/',
  menu: MENU = [],
}: {
  solido?: boolean
  caminho?: string
  menu?: ExtrasMoldura['menu']
}) {
  const [rolou, setRolou] = useState(false)
  const [menu, setMenu] = useState(false)
  const site = MENU.length > 0

  // Menu aberto: Esc fecha, e a página por baixo não rola.
  useEffect(() => {
    if (!menu) return
    const aoTeclar = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    document.addEventListener('keydown', aoTeclar)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.documentElement.style.overflow = ''
    }
  }, [menu])

  // biome-ignore lint/correctness/useExhaustiveDependencies: fechar ao trocar de rota
  useEffect(() => setMenu(false), [caminho])

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  const fundo = solido || rolou
  return (
    <header
      data-tema="escuro"
      className={cn(
        'fixed inset-x-0 top-0 z-[100] text-white transition-[background-color,box-shadow,padding] duration-500 ease-[var(--ease-inter)]',
        fundo
          ? 'bg-marinho/92 py-2.5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md'
          : 'py-4 sm:py-5',
      )}
    >
      <div className="container-x flex items-center justify-between gap-4">
        <a href="/" aria-label="International Idiomas — início" className="shrink-0">
          <Logo
            className={cn(
              'w-auto transition-[height] duration-500',
              fundo ? 'h-11' : 'h-12 sm:h-16',
            )}
          />
        </a>
        {site && (
          <nav aria-label="Principal" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {agrupar(MENU).map((e) =>
                e.tipo === 'item' ? (
                  <li key={e.item.path}>
                    <a
                      href={e.item.path}
                      aria-current={caminho === e.item.path ? 'page' : undefined}
                      className="relative rounded-full px-3.5 py-2 text-[0.92rem] font-medium whitespace-nowrap text-white/85 transition-colors hover:text-white aria-[current=page]:text-marca"
                    >
                      {e.item.rotulo}
                    </a>
                  </li>
                ) : (
                  // Submenu só com CSS: abre ao passar o mouse e ao entrar com
                  // o Tab (focus-within) — sem estado, sem JS a mais.
                  <li key={e.nome} className="group relative">
                    <button
                      type="button"
                      aria-haspopup="true"
                      className={cn(
                        'flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.92rem] font-medium whitespace-nowrap transition-colors hover:text-white',
                        e.itens.some((m) => m.path === caminho) ? 'text-marca' : 'text-white/85',
                      )}
                    >
                      {e.nome}
                      <svg
                        viewBox="0 0 12 12"
                        aria-hidden="true"
                        className="h-3 w-3 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                      >
                        <path
                          d="M2 4.5 6 8.5l4-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                      </svg>
                    </button>
                    <ul className="invisible absolute top-full left-0 mt-1 w-56 translate-y-1 rounded-2xl bg-marinho p-2 opacity-0 shadow-[0_24px_48px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10 transition-[opacity,transform,visibility] duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      {e.itens.map((m) => (
                        <li key={m.path}>
                          <a
                            href={m.path}
                            aria-current={caminho === m.path ? 'page' : undefined}
                            className="block rounded-xl px-4 py-2.5 text-[0.92rem] font-medium text-white/85 hover:bg-white/10 hover:text-white aria-[current=page]:text-marca"
                          >
                            {m.rotulo}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ),
              )}
            </ul>
          </nav>
        )}
        <div className="flex items-center gap-2">
          {/* No obrigado, nenhum WhatsApp: o lead já veio pelo formulário. */}
          {caminho !== '/obrigado' && (
            <BotaoWhatsApp
              origem="topo"
              rotulo="Falar com a International no WhatsApp"
              className="botao-marca min-h-10 px-4 text-[0.88rem] whitespace-nowrap sm:min-h-11 sm:px-5"
            >
              <span className="max-sm:sr-only">Falar no WhatsApp</span>
            </BotaoWhatsApp>
          )}
          {site && (
            <button
              type="button"
              onClick={() => setMenu((m) => !m)}
              aria-expanded={menu}
              aria-controls="menu-cheio"
              aria-label={menu ? 'Fechar o menu' : 'Abrir o menu'}
              className="relative z-[120] grid h-11 w-11 cursor-pointer place-items-center rounded-full ring-1 ring-white/30 xl:hidden"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={cn(
                    'absolute left-0 h-0.5 w-5 rounded bg-white transition-transform duration-500',
                    menu ? 'top-1.5 rotate-45' : 'top-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 h-0.5 w-5 rounded bg-white transition-transform duration-500',
                    menu ? 'top-1.5 -rotate-45' : 'top-3',
                  )}
                />
              </span>
            </button>
          )}
        </div>
      </div>
      {/* Portal no <body>: com a página rolada, o topo ganha backdrop-blur, e
          um filtro no pai faz o "fixed" do filho valer só dentro dele — o menu
          ficava preso numa faixa no alto da tela. Fora do <header>, cobre tudo. */}
      {site &&
        menu &&
        createPortal(
          <div
            id="menu-cheio"
            data-lenis-prevent
            className="menu-painel fixed inset-0 z-[90] flex flex-col justify-between overflow-y-auto bg-azul px-6 pt-28 pb-10 text-white"
          >
            <nav aria-label="Menu">
              <ul className="grid gap-1">
                {agrupar([{ path: '/', rotulo: 'Início' }, ...MENU]).map((e, i) =>
                  e.tipo === 'item' ? (
                    <li
                      key={e.item.path}
                      className="menu-item"
                      style={{ '--i': i } as React.CSSProperties}
                    >
                      <a
                        href={e.item.path}
                        onClick={() => setMenu(false)}
                        aria-current={caminho === e.item.path ? 'page' : undefined}
                        className="titulo-largo block py-1.5 text-[2.2rem] leading-tight aria-[current=page]:text-marca sm:text-[3rem]"
                      >
                        {e.item.rotulo}
                      </a>
                    </li>
                  ) : (
                    <li
                      key={e.nome}
                      className="menu-item py-2"
                      style={{ '--i': i } as React.CSSProperties}
                    >
                      <p className="rotulo text-[0.7rem] text-white/60">{e.nome}</p>
                      <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
                        {e.itens.map((m) => (
                          <li key={m.path}>
                            <a
                              href={m.path}
                              onClick={() => setMenu(false)}
                              aria-current={caminho === m.path ? 'page' : undefined}
                              className="titulo-largo block py-1 text-[1.5rem] leading-tight aria-[current=page]:text-marca sm:text-[2rem]"
                            >
                              {m.rotulo}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ),
                )}
              </ul>
            </nav>
            <p
              className="menu-item mt-10 text-sm text-white/80"
              style={{ '--i': 8 } as React.CSSProperties}
            >
              Goiânia (Setor Bueno) e Trindade (Setor Carvelo) · {ESCOLA.telefone}
            </p>
          </div>,
          document.body,
        )}
    </header>
  )
}

export function Rodape({ extras, caminho }: { extras?: ExtrasMoldura; caminho?: string }) {
  const MENU = extras?.menu ?? []
  const site = MENU.length > 0
  return (
    <footer data-tema="escuro" className="bg-noite pb-28 text-nevoa sm:pb-14">
      <Horizonte className="mb-10 opacity-[0.12]" />
      <div className="container-x flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo className="h-16 w-auto" />
          <p className="mt-5 max-w-[26rem] text-sm leading-relaxed">
            {ENDERECO_LINHA}, {ESCOLA.endereco.cep}
          </p>
          {/* No obrigado o telefone fica sem link: o lead já veio pelo formulário. */}
          {caminho === '/obrigado' ? (
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-white">
              <IconeWhatsApp className="h-4 w-4" /> {ESCOLA.telefone}
            </p>
          ) : (
            <BotaoWhatsApp
              origem="rodape"
              icone={false}
              className="!min-h-0 !p-0 mt-2 text-sm font-semibold text-white underline-offset-4 hover:underline before:hidden"
            >
              <IconeWhatsApp className="h-4 w-4" /> {ESCOLA.telefone}
            </BotaoWhatsApp>
          )}
        </div>
        {site && (
          <div className="grid gap-8 text-sm sm:grid-cols-2 md:gap-14">
            <nav aria-label="Páginas">
              <p className="rotulo mb-3 text-[0.66rem] text-white/60">Cursos e escola</p>
              <ul className="grid gap-1.5">
                {MENU.map((m) => (
                  <li key={m.path}>
                    <a href={m.path} className="hover:text-white">
                      {m.rotulo}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="rotulo mb-3 text-[0.66rem] text-white/60">Unidades</p>
              <ul className="grid gap-3">
                {(extras?.unidades ?? []).map((u) => (
                  <li key={u.nome} className="leading-snug">
                    <strong className="block text-white">{u.nome}</strong>
                    {u.endereco}, {u.cidade}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-4 text-sm md:items-end">
          {/* Redes sociais: o rodapé do site as pede (2º documento); o da LP é
              "minimalista — apenas logo, endereço e WhatsApp" (1º documento). */}
          {site && (
            <ul className="flex gap-3">
              {[
                {
                  href: `https://www.instagram.com/${ESCOLA.instagram}/`,
                  nome: 'Instagram',
                  Icone: IconeInstagram,
                },
                { href: ESCOLA.facebook, nome: 'Facebook', Icone: IconeFacebook },
                { href: ESCOLA.youtube, nome: 'YouTube', Icone: IconeYouTube },
                { href: ESCOLA.linkedin, nome: 'LinkedIn', Icone: IconeLinkedin },
              ].map(({ href, nome, Icone }) => (
                <li key={nome}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener"
                    aria-label={`${nome} da International`}
                    className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/20 transition-colors hover:bg-white/10"
                  >
                    <Icone className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
          <a href="/politica-de-privacidade" className="hover:text-white">
            {RODAPE.privacidade}
          </a>
          {extras?.avisoMarcas && (
            <p className="max-w-[24rem] text-xs leading-snug text-nevoa/50 md:text-right">
              {extras.avisoMarcas}
            </p>
          )}
          <p className="text-xs text-nevoa/60">
            © {new Date().getFullYear()} {ESCOLA.nome}
          </p>
          <p className="text-xs text-nevoa/60">
            Desenvolvido por{' '}
            <a
              href="https://github.com/ffneiva"
              target="_blank"
              rel="noopener"
              className="underline-offset-4 hover:text-white hover:underline"
            >
              Felipe Neiva
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

/**
 * O WhatsApp flutuante, presente em toda a navegação (briefing: "elementos
 * fixos"). Aparece depois da primeira dobra — no topo, o herói já tem dois
 * botões de WhatsApp, e um terceiro flutuando por cima do quiz competiria
 * com eles.
 */
export function WhatsAppFlutuante() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > window.innerHeight * 0.7)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  return (
    <div
      className={cn(
        'fixed right-4 bottom-4 z-[150] transition-[opacity,transform] duration-500 ease-[var(--ease-inter)] sm:right-6 sm:bottom-6',
        visivel ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <BotaoWhatsApp
        origem="flutuante"
        icone={false}
        rotulo="Falar com a International no WhatsApp"
        className="!h-15 !w-15 !min-h-0 !p-0 bg-whats text-white shadow-[0_16px_36px_-10px_rgba(31,122,77,0.85)] before:bg-[#18643f]"
      >
        <IconeWhatsApp className="h-8 w-8" />
      </BotaoWhatsApp>
    </div>
  )
}

/**
 * LP: a barra de WhatsApp fixa no pé da tela — o "elemento fixo" do sitemap,
 * mais forte que um botão redondo. No celular ocupa a largura toda (é a
 * área que o polegar alcança); no desktop é uma pílula no canto. O
 * documento pede "presente durante toda a navegação": ela está lá desde o
 * primeiro quadro, entrando de baixo.
 */
export function BarraWhatsApp() {
  return (
    <div className="barra-entra fixed inset-x-0 bottom-0 z-[150] p-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:p-0">
      <div className="rounded-[1.4rem] bg-white/95 p-2 shadow-[0_-10px_40px_-12px_rgba(0,18,32,0.35)] ring-1 ring-black/5 backdrop-blur sm:rounded-full sm:p-1.5">
        <BotaoWhatsApp
          origem="barra-fixa"
          className="w-full !min-h-13 bg-whats text-white before:bg-[#18643f] sm:w-auto sm:px-6"
        >
          Falar com a equipe no WhatsApp
        </BotaoWhatsApp>
      </div>
    </div>
  )
}

/**
 * Aviso de cookies (LGPD). Só existe se houver alguma tag de medição
 * configurada — sem medição, não há o que avisar. Discreto, no pé da tela, e
 * não bloqueia nada: página de anúncio com um muro na frente perde o
 * visitante que o anúncio pagou para trazer.
 */
export function AvisoCookies() {
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    if (HA_MEDICAO && escolhaGuardada() === null) setAberto(true)
  }, [])

  if (!aberto) return null

  const escolher = (e: 'aceito' | 'recusado') => {
    registrarEscolha(e)
    setAberto(false)
  }

  return (
    <section
      aria-label="Aviso de cookies"
      className="fixed inset-x-3 bottom-3 z-[160] mx-auto flex max-w-[40rem] flex-col gap-3 rounded-2xl bg-white p-4 text-sm text-tinta shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] ring-1 ring-linha sm:flex-row sm:items-center"
    >
      <p className="flex-1 leading-snug">
        Usamos cookies para medir os anúncios desta página.{' '}
        <a
          href="/politica-de-privacidade"
          className="font-semibold text-azul underline underline-offset-2"
        >
          Saiba mais
        </a>
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => escolher('recusado')}
          className="cursor-pointer rounded-full px-4 py-2 font-semibold text-cinza hover:bg-papel"
        >
          Recusar
        </button>
        <button
          type="button"
          onClick={() => escolher('aceito')}
          className="cursor-pointer rounded-full bg-azul px-4 py-2 font-semibold text-white"
        >
          Ok
        </button>
      </div>
    </section>
  )
}
