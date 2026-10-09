<img src="public/og.jpg" alt="International Idiomas — Aprenda inglês para usar de verdade." width="100%">

# Site e landing page · International Idiomas

**No ar:** https://internationalidiomas.com.br (site) · https://ingles.internationalidiomas.com.br (LP do curso de inglês)

![React 19](https://img.shields.io/badge/React-19-149eca) ![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178c6) ![Vite](https://img.shields.io/badge/Vite-8-646cff) ![Tailwind 4](https://img.shields.io/badge/Tailwind-4-38bdf8) ![cPanel · Lambda](https://img.shields.io/badge/cPanel%20·%20Lambda-ff9900)

Página de destino para anúncios (Google Ads e Meta Ads) de uma escola de
inglês no Setor Bueno, em Goiânia. O objetivo principal é **conversa
qualificada no WhatsApp**; o secundário, **lead por formulário**.

## O problema

O site atual da escola é um WordPress com Elementor, e o diagnóstico da
agência media **PageSpeed mobile 31, LCP de 13 s**. Medido em 4G lento com
CPU de celular, ele leva **31 s** até o maior elemento aparecer e baixa
**12,7 MB**. O botão flutuante de WhatsApp está sem número, e os demais
passam por um redirecionador de terceiro. Todo clique pago que cai ali é
dinheiro perdido antes de a oferta aparecer.

Na mesma medição, esta página leva **2,3–3,4 s** e baixa **164 kB**.

## As decisões

### 1. HTML pré-renderizado, e o React só hidrata

Os sites anteriores deste mesmo padrão eram SPAs: HTML vazio, depois o
JavaScript, depois o título. Aqui, o build renderiza cada rota em Node
(`src/entry-server.tsx` → `scripts/prerender.mjs`) e grava o HTML pronto. O
`<h1>` pinta no primeiro quadro.

Isso muda regras de componente — e elas estão escritas:

```ts
// O <Reveal> nasce VISÍVEL (igual ao HTML do servidor) e só se "arma" num
// efeito, e só se estiver abaixo da tela. O que já está na tela nunca some.
if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return
setEstado('armado')
```

### 2. Um quiz no lugar da foto de banco de imagem

A escola não tem foto de aula, e o briefing pede para evitar banco de imagem.
O visual do herói virou uma ferramenta: **"Descubra seu curso"**, três toques
(para quem, objetivo/idade, nível) que devolvem uma indicação inicial e uma
mensagem de WhatsApp que já diz o que a equipe perguntaria primeiro:

```
Olá! Vim pelo anúncio no Google e gostaria de saber mais sobre o curso de inglês da International.

• É para meu filho ou filha, de 11 a 14 anos
• Nível: sabe o básico
• Curso indicado pelo site: Global Teens
```

O teste percorre **todas as 44 combinações** pelo próprio roteiro do quiz e
confere que nenhuma mensagem tem `undefined` nem promessa de prazo.

### 3. Atribuição que sobrevive ao WhatsApp

A conversão acontece fora da página. `src/lib/origem.ts` guarda UTM, `gclid`
e `fbclid` por 30 dias; a mensagem abre dizendo o canal ("Vim pelo anúncio no
Google"), e o formulário envia a origem completa, que chega no e-mail do lead.

### 4. Formulário sem SaaS

`api/lead/index.mjs`, uma Lambda com Function URL: valida, descarta robô sem
captcha (campo-isca e tempo mínimo), grava no DynamoDB com TTL de 12 meses
(LGPD) e manda à escola um e-mail com o botão **"Chamar no WhatsApp"**, que
já abre a conversa com o número do aluno. Se o e-mail falhar, o lead continua
gravado — [foi exatamente o que aconteceu no primeiro deploy](#um-bug-real).

### 5. Nenhum número sem fonte

O briefing pedia "5 estrelas, +140 avaliações", "10+ anos", "3.000+ alunos" e
"centro aplicador TOEFL". Nenhum tinha fonte verificável (e dois conflitavam
com o próprio site da escola). Eles estão em `PROVAS`, com
`confirmado: false`, e a página não os mostra. Até a nota: estrelas cheias
sem número seriam uma nota implícita.

### 5b. LP e site: o mesmo código, propósitos opostos

O site institucional apresenta a escola: escuro, cinematográfico, globo 3D da
marca, cartões que se empilham, seções pinadas. A LP recebe tráfego pago com
UM objetivo — conversa qualificada no WhatsApp — e é o oposto de propósito:
clara, sem three.js nem GSAP (um teste garante que nenhum dos dois é
baixado), com o herói em forma de conversa de WhatsApp, cada cartão abrindo o
WhatsApp sobre aquele curso e uma barra fixa de WhatsApp no pé da tela.

A separação é de build: `@produto` aponta para `src/produtos/lp.tsx` ou
`site.tsx`, e o bundle de um nem importa o código do outro (LP: ~94 kB de JS
comprimido).

### 6. O globo 3D da marca — só onde ele não custa conversão

O logo da escola é um globo feito de faixas. `src/scene/globo.ts` o leva para
o espaço em three.js puro: as faixas são pedaços de esfera em azul metálico,
o arco branco do logo abraça o conjunto, e de Goiânia saem rotas de voo até
Nova York, Londres, Toronto, Dublin e Sydney. No herói ele gira atrás do quiz;
em "Onde o inglês pode levar você", gira até a cidade do objetivo sob o
ponteiro.

```ts
// A decisão vem ANTES do import: no celular o chunk do three.js nunca é pedido.
if (!caixa || !canvas || !deveMontar3D()) return
import('@/scene/globo').then(({ CenaGlobo }) => { … })
```

Um teste de ponta a ponta garante isso: no celular, nenhum pedido a
`/assets/globo-*`. No desktop, o chunk chega depois do primeiro paint — o LCP
continua sendo o título.

Também do padrão dos outros projetos: **GSAP** (sob demanda) para o manifesto
que acende palavra a palavra e para o "Como funciona" pinado com rolagem
horizontal; **Lenis** ligado ao ScrollTrigger; **cursor** com rótulo
contextual; **faixa infinita** em CSS.

### 7. O que ficou de fora, e por quê

- **Preloader.** Esconde o conteúdo — e numa página de anúncio o LCP é o que
  o Google Ads mede.
- **Captcha.** Custa conversão. Isca + tempo resolve o robô comum.
- **Menu.** Página de anúncio sem saídas: cada link que não é o WhatsApp é
  um vazamento.

## Um bug real

No primeiro teste de ponta a ponta contra a API publicada, o lead gravou e o
e-mail não saiu:

```
AccessDeniedException: ... not authorized to perform 'ses:SendEmail'
on resource '...:configuration-set/my-first-configuration-set'
```

O domínio no SES tinha um *configuration set* padrão, e a permissão da role
cobria só a identidade. O desenho "grava primeiro, e-mail depois, erro no log
e não na tela" fez o lead sobreviver; a permissão foi corrigida no script.

Outro, pego pelo teste: trocar "para meu filho" por "para mim" no quiz
**mantinha o nível** respondido para o filho. Responder uma pergunta agora
descarta tudo o que vinha depois dela no roteiro.

## Infraestrutura

```
 visitante ──HTTPS──▶ cPanel da escola (Apache)
                        .htaccess: HTTPS, www → raiz, /rota → /rota/index.html,
                        404 de verdade, CSP e cabeçalhos de segurança, cache
 formulário ──POST──▶  Lambda Function URL (CORS só dos domínios da escola)
                         ├─▶ DynamoDB (TTL 12 meses)
                         ├─▶ SES ──▶ e-mail da escola (Reply-To: o aluno)
                         └─▶ WeSales (CRM): contato, nota e oportunidade no funil
```

Publicação: `publicar.sh`, fora deste repositório (ver [`DEPLOY.md`](DEPLOY.md)).
Custo operacional: centavos por mês. Nenhuma chave guardada no código.

## Qualidade

- **Vitest** — 94 testes, ~97% de cobertura em `src/lib` e na API
- **Playwright** — 20 testes contra o build de produção, desktop e celular:
  HTML de cada rota antes do JS, 404 real, hidratação sem aviso, quiz →
  mensagem, formulário → `/obrigado`, YouTube/Maps só depois do clique,
  movimento reduzido, three.js nunca baixado no celular
- **Biome**, **TypeScript** strict, **Knip**, **commitlint + lefthook**
- Orçamento de **170 kB** no caminho crítico, verificado no CI

## Rodar

```bash
npm install
npm run dev          # desenvolvimento
npm run build        # tsc + vite build + build SSR + pré-render
npm run test         # unitários
npm run e2e          # ponta a ponta (sobe o preview sozinho)
npm run brand        # logo, favicon, ícones e arte do WhatsApp
```

Veja [DEPLOY.md](DEPLOY.md) para publicação e pendências, e
[AGENTS.md](AGENTS.md) para as regras do repositório.

## Licença e crédito

O **código** está sob a licença [MIT](LICENSE). A marca, as fotos, os vídeos e
os textos pertencem à **International Idiomas** — todos os direitos
reservados; não podem ser reutilizados sem autorização.

Desenvolvido por [Felipe Neiva](https://github.com/ffneiva) ·
[Abram Digital](https://abramdigital.com.br).
