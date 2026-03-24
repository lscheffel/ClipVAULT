# ROADMAP

Backlog executável: `BACKLOG.md`.

## Fase 1 (23/03/2026-25/03/2026) - Baseline [CONCLUÍDA]
- Validar `.env`, scripts `dev/test/build` e fluxo local completo.
- Entregável: ambiente reproduzível para equipe.
- Aceite: `npm test` e `npm run build` verdes.

## Fase 2 (26/03/2026-30/03/2026) - Paridade Funcional [CONCLUÍDA]
- Fechar paridade com legado Python (copy/delete/export/save txt/polling).
- Entregável: checklist de paridade assinado.
- Aceite: testes de regressão + smoke manual.

## Fase 3 (31/03/2026-03/04/2026) - Hardening [CONCLUÍDA]
- Logs estruturados, tratamento de erro, validação de payload e limites.
- Entregável: API robusta para falhas de clipboard/DB.
- Aceite: sem crash em testes de erro.

## Fase 4 (04/04/2026-08/04/2026) - Qualidade [CONCLUÍDA]
- Cobertura Core >= 80%, testes de API críticos e revisão de código.
- Entregável: suíte estável de CI.
- Aceite: pipeline verde em branch principal.

## Fase 5 (09/04/2026-11/04/2026) - Release [CONCLUÍDA]
- Versionamento, changelog e guia de operação.
- Entregável: pacote pronto para integração.
- Aceite: aprovação técnica final.
