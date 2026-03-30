# ClipVault Modern

Migração do legado Python/Tkinter para **Node.js + Vite + React + Tailwind + Zustand**.
Roadmap ativo de evolução: **X10 ClipVault Library (Local-first Pro)**.

## Stack

- Frontend: Vite, React, Tailwind CSS, Zustand
- Backend: Node.js, Express, SQLite (`better-sqlite3`)
- Clipboard: `clipboardy`
- Testes: Vitest com cobertura mínima de 60% no Core

## Estrutura

- `src/core`: contratos e regras de negócio puras
- `src/store`: estado global com Zustand
- `src/ui`: componentes React granulares
- `server`: API Node e adapters (db/clipboard/export)
- `DEV-Incremental.md`: contratos e descrição incremental

## Configuração

1. Copie `.env.example` para `.env`.
2. Instale dependências:
   ```bash
   npm install
   ```
3. Ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Testes + cobertura:
   ```bash
   npm test
   ```

## Baseline (Fase 1)

- Runtime prepara automaticamente os diretórios de `CLIPVAULT_DB_PATH` e `CLIPVAULT_EXPORT_DIR`.
- Variáveis inválidas em `.env` usam fallback seguro com aviso no console.
- API aplica limite de payload via `CLIPVAULT_BODY_LIMIT_KB` e emite logs estruturados JSON.
- Verificação completa local:
  ```bash
  npm run check
  ```

## CI

- Pipeline definido em `.github/workflows/ci.yml`.
- Fluxo do CI: `npm ci` + `npm run check`.

## Release

- Versão atual: `1.0.0`.
- Changelog: `CHANGELOG.md`.
- Guia operacional: `OPERATIONS.md`.
- Checklist de integração: `INTEGRATION_CHECKLIST.md`.
- Roadmap X10: `ROADMAP.md`.
- Backlog X10: `BACKLOG.md`.
- Playbook X10: `X10_PLAYBOOK.md`.

## Troubleshooting

- Erro `Failed to fetch`: o frontend nao conseguiu conectar na API.
- Inicie os dois processos com `npm run dev` (ou apenas API com `npm run dev:api`).
- Se `tsx` falhar no Windows (`spawn EPERM`), o `dev:api` usa `tsc --watch` + `node --watch` sem depender do `tsx`.
- O smoke (`npm run smoke`) também usa runtime compilado + `node` sem depender do `tsx`.
- Se usar porta diferente, ajuste `CLIPVAULT_API_PORT` no `.env` (ou `VITE_API_BASE_URL` para base URL explícita).

## Legado

O legado Python permanece em `main.py` e `ui/index.html` para referência de paridade funcional durante a transição.
