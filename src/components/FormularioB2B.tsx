import { type FormEvent, useId, useRef, useState } from 'react'
import { conversaoLead } from '@/lib/analytics'
import { CONSENTIMENTO } from '@/lib/business'
import {
  type CamposB2B,
  type ErrosB2B,
  enviar,
  mascararTelefone,
  type TipoB2B,
  validarB2B,
} from '@/lib/lead'
import { origemDaVisita } from '@/lib/origem'
import { cn } from '@/lib/utils'
import { BotaoWhatsApp } from './BotaoWhatsApp'
import { IconeSeta } from './Icones'

/**
 * O pedido de avaliação de uma instituição (escola, 09/10/2026):
 *
 *   escola  → "Quero avaliar meus alunos" (Parcerias: TOEFL® Young Students Series)
 *   empresa → "Quero avaliar meus colaboradores" (In Company: TOEIC®)
 *
 * Os campos que a escola pediu — instituição, quantidade, local, cargo,
 * telefone e e-mail — mais o nome de quem preenche, que o CRM precisa. Vai
 * para a mesma API de leads, com o bloco `b2b`: o WeSales recebe a empresa,
 * etiquetas próprias e a oportunidade com o nome da instituição.
 */
const TEXTOS: Record<
  TipoB2B,
  { instituicao: string; quantidade: string; local: string; botao: string; exemplo: string }
> = {
  escola: {
    instituicao: 'Nome da instituição',
    quantidade: 'Número de alunos',
    local: 'Local da escola (cidade e bairro)',
    botao: 'Quero avaliar meus alunos',
    exemplo: 'Colégio, polo ou faculdade',
  },
  empresa: {
    instituicao: 'Nome da empresa',
    quantidade: 'Número de colaboradores',
    local: 'Local da empresa (cidade e bairro)',
    botao: 'Quero avaliar meus colaboradores',
    exemplo: 'Razão social ou nome fantasia',
  },
}

export function FormularioB2B({ tipo, aoEnviar }: { tipo: TipoB2B; aoEnviar: () => void }) {
  const t = TEXTOS[tipo]
  const id = useId()
  const [campos, setCampos] = useState<CamposB2B>({
    nome: '',
    email: '',
    whatsapp: '',
    instituicao: '',
    quantidade: '',
    local: '',
    cargo: '',
  })
  const [erros, setErros] = useState<ErrosB2B>({})
  const [estado, setEstado] = useState<'livre' | 'enviando' | 'falhou'>('livre')
  const [aceite, setAceite] = useState(false)
  const [erroAceite, setErroAceite] = useState(false)
  const inicio = useRef(Date.now())
  const isca = useRef<HTMLInputElement>(null)

  const mudar = (k: keyof CamposB2B, v: string) => {
    const valor =
      k === 'whatsapp' ? mascararTelefone(v) : k === 'quantidade' ? v.replace(/\D/g, '') : v
    setCampos((c) => ({ ...c, [k]: valor }))
    if (erros[k]) setErros((e) => ({ ...e, [k]: undefined }))
  }

  const ordem: (keyof CamposB2B)[] = [
    'instituicao',
    'quantidade',
    'local',
    'nome',
    'cargo',
    'whatsapp',
    'email',
  ]

  const aoSubmeter = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const novos = validarB2B(campos, tipo)
    setErros(novos)
    setErroAceite(!aceite)
    const primeiro = ordem.find((k) => novos[k])
    if (primeiro) {
      document.getElementById(`${id}-${primeiro}`)?.focus()
      return
    }
    if (!aceite) {
      document.getElementById(`${id}-aceite`)?.focus()
      return
    }
    setEstado('enviando')
    const r = await enviar({
      nome: campos.nome,
      email: campos.email,
      whatsapp: campos.whatsapp,
      perfil: {},
      origem: {
        ...origemDaVisita(),
        pagina: window.location.pathname,
        referencia: document.referrer,
      },
      tempo: Date.now() - inicio.current,
      site: isca.current?.value ?? '',
      consentimento: true,
      consentimentoVersao: CONSENTIMENTO.versao,
      novidades: false,
      b2b: {
        tipo,
        instituicao: campos.instituicao,
        quantidade: campos.quantidade,
        local: campos.local,
        cargo: campos.cargo,
      },
    })
    if (r.ok) {
      conversaoLead(`b2b-${tipo}`)
      aoEnviar()
    } else {
      setEstado('falhou')
    }
  }

  const campo = (
    k: keyof CamposB2B,
    rotulo: string,
    props: React.InputHTMLAttributes<HTMLInputElement>,
    largo = false,
  ) => (
    <div className={cn(largo && 'sm:col-span-2')}>
      <label htmlFor={`${id}-${k}`} className="mb-1.5 block text-sm font-semibold">
        {rotulo}
      </label>
      <input
        id={`${id}-${k}`}
        name={k}
        value={campos[k]}
        onChange={(ev) => mudar(k, ev.target.value)}
        aria-invalid={erros[k] ? true : undefined}
        aria-describedby={erros[k] ? `${id}-${k}-erro` : undefined}
        className={cn(
          'h-13 w-full rounded-2xl border bg-white px-4 text-[1rem] text-tinta outline-none transition-[border-color,box-shadow] placeholder:text-cinza/60 focus:border-azul focus:ring-4 focus:ring-azul/15',
          erros[k] ? 'border-red-500' : 'border-linha',
        )}
        {...props}
      />
      {erros[k] && (
        <p id={`${id}-${k}-erro`} className="mt-1.5 text-sm font-medium text-red-600">
          {erros[k]}
        </p>
      )}
    </div>
  )

  return (
    <form
      onSubmit={aoSubmeter}
      noValidate
      className="grid gap-4 sm:grid-cols-2"
      aria-busy={estado === 'enviando'}
      data-b2b={tipo}
    >
      {campo(
        'instituicao',
        t.instituicao,
        { autoComplete: 'organization', placeholder: t.exemplo },
        true,
      )}
      {campo('quantidade', t.quantidade, { inputMode: 'numeric', placeholder: 'Ex.: 300' })}
      {campo('local', t.local, {
        autoComplete: 'address-level2',
        placeholder: 'Goiânia · Setor Bueno',
      })}
      {campo('nome', 'Seu nome', { autoComplete: 'name', placeholder: 'Nome completo' })}
      {campo('cargo', 'Seu cargo', {
        autoComplete: 'organization-title',
        placeholder:
          tipo === 'escola' ? 'Diretor(a), coordenador(a)…' : 'RH, gestor(a), diretor(a)…',
      })}
      {campo('whatsapp', 'Telefone / WhatsApp', {
        type: 'tel',
        autoComplete: 'tel-national',
        inputMode: 'tel',
        placeholder: '(62) 99999-9999',
      })}
      {campo('email', 'E-mail', {
        type: 'email',
        autoComplete: 'email',
        inputMode: 'email',
        placeholder: 'voce@instituicao.com.br',
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

      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 text-[0.88rem] leading-snug text-tinta">
          <input
            id={`${id}-aceite`}
            type="checkbox"
            checked={aceite}
            onChange={(ev) => {
              setAceite(ev.target.checked)
              if (ev.target.checked) setErroAceite(false)
            }}
            aria-invalid={erroAceite || undefined}
            aria-describedby={erroAceite ? `${id}-aceite-erro` : undefined}
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
          <p id={`${id}-aceite-erro`} className="mt-1.5 text-sm font-medium text-red-600">
            {CONSENTIMENTO.erro}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={estado === 'enviando'}
        className="botao botao-azul w-full cursor-pointer disabled:cursor-wait disabled:opacity-70 sm:col-span-2"
      >
        {estado === 'enviando' ? 'Enviando…' : t.botao}
        {estado !== 'enviando' && <IconeSeta className="h-5 w-5" />}
      </button>

      {estado === 'falhou' && (
        <div role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-800 sm:col-span-2">
          Não conseguimos enviar agora. Tente de novo em instantes — ou fale direto pelo WhatsApp:
          <BotaoWhatsApp origem={`b2b-${tipo}-falhou`} className="botao-azul mt-3 w-full">
            Falar pelo WhatsApp
          </BotaoWhatsApp>
        </div>
      )}
    </form>
  )
}
