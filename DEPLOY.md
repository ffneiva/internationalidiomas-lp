# Deploy

Um código, dois produtos (ver `src/lib/alvo.ts`):

| | Site institucional | LP do curso de inglês |
|---|---|---|
| No ar | https://internationalidiomas.com.br | https://ingles.internationalidiomas.com.br |
| Build | `VITE_ALVO=site npm run build` | `npm run build` |
| E2E | `VITE_ALVO=site npm run e2e` | `npm run e2e` |
| Indexação | indexável (sitemap) | `noindex` (página de anúncio) |

O site mantém as URLs do WordPress antigo (/kids, /teens, /high-school,
/inter-adults, /in-company, /sobre-a-inter): os links que o Google já conhecia
continuam valendo.

- **Hospedagem:** o cPanel da escola (Apache). Cada build vira uma pasta com um
  `.htaccess` que faz HTTPS, `www` → raiz, `/rota` → `/rota/index.html` sem
  redirecionar, 404 de verdade, cabeçalhos de segurança (CSP) e cache.
- **Formulário:** Lambda com Function URL → DynamoDB (12 meses) + e-mail via
  SES + contato, nota e oportunidade no CRM (WeSales). O token do CRM fica no
  AWS Systems Manager (SecureString), lido só pela Lambda.
- **Medição:** Google Tag Manager; Ads e Pixel são configurados dentro dele.

### Publicar

Da máquina do desenvolvedor, com o toolkit de infraestrutura (fora deste
repositório, que é público — o token do cPanel nunca entra aqui nem no GitHub):

```bash
bash ../_infra-internationalidiomas/publicar.sh             # site + LP
bash ../_infra-internationalidiomas/publicar.sh --completo  # + testes E2E
bash ../_infra-internationalidiomas/publicar.sh --api       # + Lambda dos leads
SO=site bash ../_infra-internationalidiomas/publicar.sh     # só o site (ou SO=lp)
```

O script confere o código (lint, tipos, testes), gera os dois pacotes, sobe
pela API do cPanel — arquivos com hash primeiro, HTML por último — e confere
cada rota no ar. O GitHub roda só o CI (`.github/workflows/ci.yml`).

---

## Dia a dia

Mudar o código → `bash ../_infra-internationalidiomas/publicar.sh` (ver acima).

### Mudar um texto, um curso ou ligar uma prova

Tudo em [`src/lib/business.ts`](src/lib/business.ts). Para exibir a nota do
Google, o total de alunos ou o "centro aplicador": confirme com a escola,
ajuste o valor em `PROVAS` e troque `confirmado` para `true`.

### Trocar o e-mail que recebe os leads

```bash
DESTINO="secretaria@escola.com.br,outro@escola.com.br" bash ../_infra-internationalidiomas/aws-leads.sh
```

### Exportar os leads

```bash
bash ../_infra-internationalidiomas/leads-csv.sh > leads.csv
```

---

## Quando algo dá errado

| Sintoma | Causa |
|---|---|
| Formulário mostra "não conseguimos enviar" | `VITE_LEADS_URL` ausente no build, ou origem fora do CORS (rodar `aws-leads.sh` depois de mudar o domínio) |
| Function URL responde `Forbidden` | Falta a permissão `lambda:InvokeFunction` com `InvokedViaFunctionUrl` (AWS CLI antigo — o script cai para o boto3) |
| Lead gravado mas e-mail não chega | Ver o log da Lambda: permissão SES (identity e configuration-set) ou destinatário |
| Tag do GTM não dispara | Tag "HTML personalizado" é bloqueada pela CSP (sem `unsafe-inline`). Usar tags nativas/da galeria |
| Botão do quiz não responde logo ao abrir | Normal nos primeiros instantes numa rede lenta: o HTML chega antes do JS. O E2E espera `html[data-hidratado]` |
| `/obrigado` devolve a home ou 301 para `/obrigado/` | `.htaccess` não subiu (o pacote tem `DirectorySlash Off` e a reescrita) |
| Publicação para no envio | Token do cPanel expirado ou sem permissão de Gerenciador de Arquivos |
