# OPERATIONS

1. Copie `.env.example` para `.env`.
2. Instale dependências com `npm install`.
3. Suba API + frontend com `npm run dev`.
4. Verifique saúde em `GET /api/health`.
5. Execute smoke operacional com `npm run smoke`.
6. Execute validação completa com `npm run check`.

Parâmetros críticos:
- `PORT`: porta da API.
- `CLIPVAULT_DB_PATH`: caminho do SQLite.
- `CLIPVAULT_EXPORT_DIR`: diretório de export.
- `CLIPVAULT_CLIPBOARD_POLL_MS`: intervalo de captura.
- `CLIPVAULT_BODY_LIMIT_KB`: limite do payload JSON.

Falha de inicialização:
- revise permissões de escrita para `db/export`.
- revise logs JSON de `bootstrap.failure` e `api.unhandled_error`.
