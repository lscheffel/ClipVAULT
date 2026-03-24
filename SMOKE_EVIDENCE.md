# SMOKE EVIDENCE

## Execução 22/03/2026
Comando: `npm run smoke`
- PASS health/history/copy inválido/delete inválido/sync/export.

## Execução 23/03/2026 (Hardening)
Comando: `npm run smoke`
- PASS `/api/health`
- PASS `/api/history?limit=abc`
- PASS `/api/copy` com payload inválido (`{}`) retornando `{ ok: false }`
- PASS `/api/history/abc` retornando `{ ok: false }`
- PASS `/api/sync`
- PASS `/api/export`
- Logs estruturados emitidos por request/response/warn.

Conclusão: API permanece estável com validações e sem crash de processo.
