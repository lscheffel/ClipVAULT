# DEV-Incremental

## Módulo Core
Core isolado em `src/core`. Regras puras: persistir clipboard apenas quando não vazio e diferente do último valor, normalizar input de cópia (`id` ou conteúdo literal), limitar consultas e gerar payload de exportação. Casos de uso (`createClipboardUseCases`) recebem portas por injeção (`ClipboardRepository`, `ClipboardGateway`, `ExportGateway`), evitando acoplamento com React, SQLite e APIs do SO.

## Módulo API Node
API em `server/` com Express e adapters explícitos: SQLite (`better-sqlite3`), clipboard do sistema (`clipboardy`) e exportação JSON (`fs`). Endpoints: `GET /api/history`, `POST /api/sync`, `POST /api/copy`, `DELETE /api/history/:id`, `POST /api/export`. Monitor contínuo do clipboard executa no servidor com intervalo configurável por `.env`.
Paridade de erro alinhada ao legado: entradas inválidas retornam fallback seguro (`[]`, `{ ok: false }`, `{ path: "" }`) sem crash de processo.
Hardening aplicado: limite de body (`CLIPVAULT_BODY_LIMIT_KB`), validação de payload/ids/limites e middleware global de erro.
Logs estruturados por rota em JSON (`request`, `response`, `warn`, `error`) para facilitar observabilidade.

## Módulo UI React
UI em Vite + React + Tailwind + Zustand. Store centraliza estado global (`items`, `lastClipboardText`, `status`, `search`, polling) e ações assíncronas. Componentes granulares (`HeaderBar`, `SearchBar`, `HistoryList`, `HistoryItemCard`, `StatusStrip`) apenas renderizam dados e disparam callbacks.

## Evidência
Smoke de API registrado em `SMOKE_EVIDENCE.md` (`npm run smoke`).
Testes críticos de API adicionados em `server/__tests__/api.spec.ts`.
Pipeline CI configurado em `.github/workflows/ci.yml` com `npm ci` e `npm run check`.
Release final documentado em `CHANGELOG.md`, `OPERATIONS.md` e `INTEGRATION_CHECKLIST.md`.
