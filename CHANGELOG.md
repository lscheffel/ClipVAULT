# CHANGELOG

## 1.0.0 - 23/03/2026
- Migração concluída para Node.js + Vite + React + Tailwind + Zustand.
- Core desacoplado com contratos TypeScript e casos de uso injetáveis.
- API Express com adapters para SQLite, clipboard e exportação JSON.
- Hardening aplicado: validação de payload, limites, fallback seguro e middleware de erro.
- Logs estruturados JSON por request/response com `requestId`.
- Testes Core + API crítica com Vitest.
- Cobertura Core acima de 80% (resultado atual: 96.49% linhas).
- CI adicionado em GitHub Actions com `npm ci` e `npm run check`.
- Smoke script para validação operacional local.
