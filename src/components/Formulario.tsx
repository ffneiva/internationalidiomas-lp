import { type FormEvent, useRef, useState } from 'react'
import { usePerfil } from '@/hooks/usePerfil'
import { conversaoLead } from '@/lib/analytics'
import { CONSENTIMENTO } from '@/lib/business'
import { type Campos, type Erros, enviar, mascararTelefone, validar } from '@/lib/lead'
import { origemDaVisita } from '@/lib/origem'
import { completo, perfilParaEnvio, recomendar } from '@/lib/perfil'
import { cn } from '@/lib/utils'
import { BotaoWhatsApp } from './BotaoWhatsApp'
import { IconeSeta } from './Icones'

/**
 * "Prefere que a gente fale com você?" — o objetivo secundário do briefing.
 *
 * Três campos (os do briefing), validados na hora e de novo na API. O perfil
 * do quiz e a origem da campanha vão junto, invisíveis para quem preenche e
 * visíveis para a escola, no e-mail do lead.
 *
 * Antirrobô sem captcha (captcha custa conversão): um campo-isca escondido e
 * o tempo entre abrir e enviar. A API descarta os dois casos em silêncio.
 *
 * Sucesso → /obrigado. Uma página própria de conversão é o que o Google Ads e
 * o Pixel sabem medir sem configuração especial ("visitou /obrigado").
 */
export function Formulario({ aoEnviar }: { aoEnviar: () => void }) {
  const perfil = usePerfil()
  const [campos, setCampos] = useState<Campos>({ nome: '', email: '', whatsapp: '' })
  const [erros, setErros] = useState<Erros>({})
  const [estado, setEstado] = useState<'livre' | 'enviando' | 'falhou'>('livre')
  // LGPD: as duas caixas começam DESMARCADAS.
  const [aceite, setAceite] = useState(false)
  const [novidades, setNovidades] = useState(false)
  const [erroAceite, setErroAceite] = useState(false)
  const inicio = useRef(Date.now())
  const isca = useRef<HTMLInputElement>(null)

  const mudar = (k: keyof Campos, v: string) => {
    setCampos((c) => ({ ...c, [k]: k === 'whatsapp' ? mascararTelefone(v) : v }))
    if (erros[k]) setErros((e) => ({ ...e, [k]: undefined }))
  }

  const aoSubmeter = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const novos = validar(campos)
    setErros(novos)
    setErroAceite(!aceite)
    const primeiro = (Object.keys(novos) as (keyof Campos)[])[0]
    if (primeiro) {
      document.getElementById(`lead-${primeiro}`)?.focus()
      return
    }
    if (!aceite) {
      document.getElementById('lead-aceite')?.focus()
      return
    }
    setEstado('enviando')
    const r = await enviar({
      ...campos,
      perfil: perfilParaEnvio(perfil),
      origem: {
        ...origemDaVisita(),
        pagina: window.location.pathname,
        referencia: document.referrer,
      },
      tempo: Date.now() - inicio.current,
      site: isca.current?.value ?? '',
      consentimento: true,
      consentimentoVersao: CONSENTIMENTO.versao,
      novidades,
    })
    if (r.ok) {
      conversaoLead(completo(perfil) ? recomendar(perfil).curso.id : undefined)
      aoEnviar()
    } else {
      setEstado('falhou')
    }
  }

  const campo = (
    k: keyof Campos,
    rotulo: string,
    props: React.InputHTMLAttributes<HTMLInputElement>,
  ) => (
    <div>
      <label htmlFor={`lead-${k}`} className="mb-1.5 block text-sm font-semibold">
        {rotulo}
      </label>
      <input
        id={`lead-${k}`}
        name={k}
        value={campos[k]}
        onChange={(ev) => mudar(k, ev.target.value)}
        aria-invalid={erros[k] ? true : undefined}
        aria-describedby={erros[k] ? `lead-${k}-erro` : undefined}
        className={cn(
          'h-13 w-full rounded-2xl border bg-white px-4 text-[1rem] text-tinta outline-none transition-[border-color,box-shadow] placeholder:text-cinza/60 focus:border-azul focus:ring-4 focus:ring-azul/15',
          erros[k] ? 'border-red-500' : 'border-linha',
        )}
        {...props}
      />
      {erros[k] && (
        <p id={`lead-${k}-erro`} className="mt-1.5 text-sm font-medium text-red-600">
          {erros[k]}
        </p>
      )}
    </div>
  )

  const perfilPronto = completo(perfil)

  return (
    <form onSubmit={aoSubmeter} noValidate className="grid gap-4" aria-busy={estado === 'enviando'}>
      {campo('nome', 'Nome completo', { autoComplete: 'name', placeholder: 'Seu nome' })}
      {campo('email', 'E-mail', {
        type: 'email',
        autoComplete: 'email',
        inputMode: 'email',
        placeholder: 'voce@email.com',
      })}
      {campo('whatsapp', 'WhatsApp (DDD + número)', {
        type: 'tel',
        autoComplete: 'tel-national',
        inputMode: 'tel',
        placeholder: '(62) 99999-9999',
      })}

      {/* Isca para robô: fora da tela, fora da ordem do Tab, sem rótulo lido. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Site
          <input
            ref={isca}
            type="text"
            name="site"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>

      {perfilPronto && (
        <p className="rounded-2xl bg-papel px-4 py-3 text-sm text-cinza">
          Seu perfil vai junto:{' '}
          <strong className="text-tinta">{recomendar(perfil).curso.nome}</strong> —{' '}
          {Object.values(perfilParaEnvio(perfil)).slice(0, -1).join(' · ')}
        </p>
      )}

      <fieldset className="grid gap-3">
        <legend className="sr-only">Autorização para o contato (LGPD)</legend>
        <label className="flex cursor-pointer items-start gap-3 text-[0.88rem] leading-snug text-tinta">
          <input
            id="lead-aceite"
            type="checkbox"
            checked={aceite}
            onChange={(ev) => {
              setAceite(ev.target.checked)
              if (ev.target.checked) setErroAceite(false)
            }}
            aria-invalid={erroAceite || undefined}
            aria-describedby={erroAceite ? 'lead-aceite-erro' : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-azul"
          />
          <span>
            {CONSENTIMENTO.contato}{' '}
            <a href="/politica-de-privacidade" className="underline underline-offset-2">
              Política de privacidade
            </a>
            .
          </span>
        </label>
        {erroAceite && (
          <p id="lead-aceite-erro" className="-mt-1 text-sm font-medium text-red-600">
            {CONSENTIMENTO.erro}
          </p>
        )}
        <label className="flex cursor-pointer items-start gap-3 text-[0.88rem] leading-snug text-cinza">
          <input
            id="lead-novidades"
            type="checkbox"
            checked={novidades}
            onChange={(ev) => setNovidades(ev.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-azul"
          />
          <span>{CONSENTIMENTO.novidades}</span>
        </label>
      </fieldset>

      <button
        type="submit"
        disabled={estado === 'enviando'}
        className="botao botao-azul mt-1 w-full cursor-pointer disabled:cursor-wait disabled:opacity-70"
      >
        {estado === 'enviando' ? 'Enviando…' : 'Quero saber mais'}
        {estado !== 'enviando' && <IconeSeta className="h-5 w-5" />}
      </button>

      {estado === 'falhou' && (
        <div role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-800">
          Não conseguimos enviar agora. Tente de novo em instantes — ou fale direto pelo WhatsApp:
          <BotaoWhatsApp origem="formulario-falhou" className="botao-azul mt-3 w-full">
            Falar pelo WhatsApp
          </BotaoWhatsApp>
        </div>
      )}

      <p className="text-[0.78rem] leading-snug text-cinza">
        Você pode pedir para ver, corrigir ou apagar seus dados quando quiser.
      </p>
    </form>
  )
}
