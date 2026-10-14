import { ESCOLA } from './business.ts'

/**
 * Link DIRETO para o WhatsApp da escola.
 *
 * O site atual passa por um intermediário (whatsa.me) e o botão flutuante
 * está sem número — é a correção nº 2 do briefing. `wa.me` é o endereço
 * oficial: abre o app no celular e o WhatsApp Web no computador, com a
 * mensagem já escrita.
 */
export function linkWhatsApp(texto: string, numero: string = ESCOLA.whatsapp): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
}
