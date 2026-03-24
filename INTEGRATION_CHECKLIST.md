# INTEGRATION CHECKLIST

- [ ] Versão `1.0.0` confirmada em `package.json`.
- [ ] `.env` criado a partir de `.env.example`.
- [ ] `npm ci` executado sem erro.
- [ ] `npm run smoke` com todos os cenários PASS.
- [ ] `npm run check` com testes e build verdes.
- [ ] Cobertura Core >= 80% confirmada.
- [ ] CI (`.github/workflows/ci.yml`) validado em PR.
- [ ] Export JSON criado em `CLIPVAULT_EXPORT_DIR`.
- [ ] Rotas críticas testadas: health/history/copy/delete/export.
- [ ] Aprovação técnica registrada.
