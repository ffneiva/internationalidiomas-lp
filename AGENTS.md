# AGENTS.md

Instruções para qualquer agente de IA — de qualquer modelo — que for trabalhar
neste repositório. Também servem para humanos; são as mesmas regras.

> Este arquivo é a fonte. `CLAUDE.md` apenas aponta para cá.

---

## 1. O fluxo é Issue → branch → PR → merge

**Nenhuma mudança entra na `main` direto.** Vale para correção de uma linha,
troca de texto e atualização de dependência.

```
1. Abra uma Issue (templates em .github/ISSUE_TEMPLATE).
2. Branch a partir da main:  fix/12-quiz-voltar · content/13-nota-google
3. Commits em Conventional Commits (seção 2).
4. PR mencionando a Issue:   "Closes #12"
5. CI verde. Squash merge.
```

## 2. Commits

`tipo(escopo): descrição no imperativo, minúscula, sem ponto final`

**Tipos:** `feat`, `fix`, `content`, `refactor`, `perf`, `style`, `test`,
`docs`, `build`, `ci`, `chore`, `revert`.

**Escopos:** `heroi`, `secoes`, `quiz`, `lead`, `midia`, `seo`, `marca`,
`medicao`, `a11y`, `infra`, `ci`, `deps`, `docs`, `testes`.

```
content(secoes): nota do Google confirmada pela escola
fix(quiz): trocar "para quem" descartava o nível errado
feat(lead): perfil do quiz no e-mail do lead
```

## 3. Onde as coisas moram

```
src/lib/business.ts   ← TODO o conteúdo: escola, cursos, provas, FAQ, textos
src/lib/perfil.ts     ← o quiz "Descubra seu curso": roteiro, indicação, mensagem
src/lib/origem.ts     ← UTM/gclid/fbclid: guarda 30 dias, muda a abertura do WhatsApp
src/lib/analytics.ts  ← GTM, Google Ads/GA4, Meta Pixel, consentimento, eventos
src/lib/lead.ts       ← formulário no navegador (máscara, validação, envio)
src/lib/routes.ts     ← rotas e o <head> de cada uma
src/lib/seo.ts        ← JSON-LD e llms.txt, derivados de business.ts
src/lib/marca.ts      ← o logo em vetor (fonte do npm run brand)
src/scene/globo.ts    ← o globo 3D da marca (three.js puro, sob demanda, só desktop)
src/hooks/useGsap.ts  ← GSAP + ScrollTrigger sob demanda, ligado ao Lenis
api/lead/index.mjs    ← a Lambda do formulário (valida, grava, manda e-mail)
src/entry-server.tsx  ← entrada do pré-render (build)
scripts/prerender.mjs ← escreve o HTML de cada rota
src/sections/         ← seções da home, na ordem do sitemap
tests/unit/           ← Vitest — lógica pura, inclusive a API
tests/e2e/            ← Playwright — contra o build de produção
```

**Regra dura:** texto que o visitante lê não fica em componente. Fica em
`business.ts`.

## 4. Regras de conteúdo

- **Nada inventado.** Nenhum depoimento, nenhuma nota, nenhum "+X alunos" sem
  fonte. Os números do briefing sem prova ficam em `PROVAS` com
  `confirmado: false` — a página NÃO os mostra. Virar a chave é uma linha,
  depois de a escola mandar a prova.
- **Cinco estrelas só com a nota confirmada.** Estrelas cheias sem número são
  uma nota implícita.
- **Nenhuma promessa de prazo ou resultado** ("fluente em 6 meses", "garanta
  sua aprovação"). Política do Google Ads e CDC. O teste do quiz procura esses
  termos nas mensagens geradas.
- **Exames são marcas de terceiros.** A escola PREPARA para TOEIC, TOEFL,
  IELTS, CELPIP e SAT. "Centro aplicador" só com o credenciamento em mãos.
- **Foto é foto real.** A escola não tem fotos de aula: o site usa os vídeos
  do canal dela, um quadro do vídeo de drone e a fachada. Nada de banco de
  imagem (o briefing pede isso).
- **O que não foi confirmado está marcado `CONFIRMAR`** em `business.ts` e
  listado no DEPLOY.md.

## 4b. Manual de marca (fonte de verdade visual)

O "Manual de Marca - Booklet.pdf" da escola manda (cópia das páginas em
`../_midia-internationalidiomas/manual/`):

- **Fonte Exo 2**: títulos ExtraBold (800), subtítulos SemiBold (600), corpo
  Medium (500).
- **Cores**: Azul Intenso #25376A (preferencial — fundos escuros e texto),
  Azul Royal #074BAE, Azul Claro #75AFF0, Amarelo destaque #FFF133.
- **O amarelo é "apenas para títulos e detalhes simples"**: marca-texto dos
  títulos, check, pino, ponto da régua. Nunca botão nem faixa grande — o
  botão principal é o Azul Claro.
- **Submarcas**: Interkids (#0CC0DF, roxo #7907AE, amarelo) na página /kids;
  In Company/Business (Azul Profundo #001220, Ouro #F4B300) na /in-company.
- **Logo**: o arquivo oficial do site (`src/assets/logo.webp`); o lema da
  marca-mãe é "idiomas personalizados".
- **Fotografia**: gente real; o tratamento de faixas com véu azul
  (`.listras-marca`) segue o exemplo do manual.
- **Grafismo**: o horizonte de cidades da capa (`src/assets/horizonte.png`).

## 5. Movimento, pré-render e acessibilidade

1. **O HTML chega pré-renderizado.** O React hidrata. Então: nada lê `window`
   durante o render (use efeito), e o que depende do navegador (perfil do
   quiz, origem do anúncio) entra depois da hidratação ou no clique.
2. **O `<h1>` nunca é escondido para animar** — ele é o LCP.
3. **Estado escondido nunca sobrevive a uma falha.** O `<Reveal>` só esconde o
   que está abaixo da tela, e só depois de o JS rodar.
4. **`prefers-reduced-motion`** desliga entradas, vídeo em laço, scroll suave
   e a legenda do herói.
5. **Anime `transform` e `opacity`.** Altura: `grid-template-rows: 0fr → 1fr`.

Um `<h1>` por página, todo botão com nome acessível, foco visível, foco
levado ao título de cada etapa do quiz.

## 6. Desempenho

O CI falha se o caminho crítico passar de **170 kB comprimidos**.

- Ícone: desenhe o SVG. Logo: arquivo em `src/assets` (hash no nome).
- YouTube e Google Maps: facade — iframe só depois do clique.
- Vídeo próprio: sem `src` até perto da tela, pausado fora dela.
- Carregado sob demanda, e precisa continuar sendo: `three` (e só no
  desktop — a decisão vem antes do import), `gsap`, `lenis`, `web-vitals`,
  `@sentry/react`, GTM, Pixel.

## 7. Antes de abrir o PR

```bash
npm run lint && npx tsc -b && npm run test && npm run knip
npm run check:dev && npm run build && npm run e2e
```

## 8. Publicação

Arquivos estáticos no cPanel da escola (Apache + `.htaccess`) e uma Lambda para o formulário.
**Custo operacional próximo de zero é restrição do projeto.**

**Nunca comite chave, ARN, ID de conta ou nome de bucket** — o repositório é
público. A publicação (`publicar.sh`, com o token do cPanel) e a infraestrutura
moram fora do repositório (`../_infra-internationalidiomas`).

## 9. Estilo de código

- **Português** em nomes e comentários.
- Comentário explica o **porquê**.
- Sem `any`, sem `console.log`.
- Aspas simples, sem ponto e vírgula, vírgula final, 100 colunas. O Biome cuida.
