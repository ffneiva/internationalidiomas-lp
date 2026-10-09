# CLAUDE.md

As regras deste repositório estão em [AGENTS.md](AGENTS.md) — valem para
qualquer agente, de qualquer modelo. Leia antes de mudar qualquer coisa.

O essencial:

- Todo texto da página mora em `src/lib/business.ts`.
- Número sem fonte não aparece (`PROVAS` com `confirmado: false`).
- O HTML é pré-renderizado: nada de `window` durante o render.
- Issue → branch → PR. Nada na `main` direto.
