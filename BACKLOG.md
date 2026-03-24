# BACKLOG

Ciclo ativo: **X10 / Releases 2.0.0 e 3.0.0**.

## R2-1 Foundation UX + Runtime
- [ ] R21-01 (P0, Agent C) Criar shell Electron (`main`, `preload`) e boot do app.
- [ ] R21-02 (P0, Agent A) Integrar Material UI ao tema Tailwind Cyber Workspace.
- [ ] R21-03 (P0, Agent A) Implementar Command Palette (`Ctrl+K`).
- [ ] R21-04 (P1, Agent A) Implementar modo de densidade (compacto/confortável).
- [ ] R21-05 (P0, Agent E) Gate G1: testes UI/store + smoke Electron.

## R2-2 Produtividade
- [ ] R22-01 (P0, Agent B) Evoluir modelo `ClipboardItem` v2 e migração DB inicial.
- [ ] R22-02 (P0, Agent B) Detecção automática de tipo.
- [ ] R22-03 (P0, Agent B) Dedupe por hash/similaridade.
- [ ] R22-04 (P0, Agent B) Snippets com variáveis e text expander.
- [ ] R22-05 (P1, Agent A) Preview rico (Markdown/HTML/JSON/code).
- [ ] R22-06 (P0, Agent E) Gate G2: testes dedupe/tipo/snippet + integração API v2 draft.

## R2-3 Segurança + Lifecycle + Atalhos
- [ ] R23-01 (P0, Agent C) Implementar vault local criptografado (AES-GCM).
- [ ] R23-02 (P0, Agent B) Implementar expiração automática e limpeza.
- [ ] R23-03 (P0, Agent C) Atalhos globais com `globalShortcut`.
- [ ] R23-04 (P0, Agent E) Gate G3: testes de cripto/expiração/atalhos + regressão.

## R3-1 Compartilhamento + API/Plugins Base
- [ ] R31-01 (P0, Agent E) Publicar API v2 base (`/api/v2/...`).
- [ ] R31-02 (P0, Agent C) Links locais assinados com expiração.
- [ ] R31-03 (P0, Agent E) Runtime de plugins com hooks base.
- [ ] R31-04 (P0, Agent E) Gate G4: testes de assinatura + contratos de plugins.

## R3-2 IA + Integrações
- [ ] R32-01 (P0, Agent D) Interface `AiProvider` e provider mock/pluggable.
- [ ] R32-02 (P0, Agent D) Ações IA por item (`summarize`, `rewrite`, `classify`).
- [ ] R32-03 (P0, Agent D) Classificação semântica automática.
- [ ] R32-04 (P1, Agent D) Webhooks/conectores Slack/Notion/Jira v1.
- [ ] R32-05 (P0, Agent E) Gate G5: testes IA mock + webhooks + classificação.

## R3-3 Analytics + Hardening Plataforma
- [ ] R33-01 (P0, Agent E) Timeline analítica por hora/tipo/tag/ação.
- [ ] R33-02 (P0, Agent E) API pública e contratos plugin versionados.
- [ ] R33-03 (P0, Agent E) Hardening final (performance, auditoria, docs operacionais).
- [ ] R33-04 (P0, Agent E) Gate G6: E2E Playwright + carga leve + segurança.

## Versionamento
- [ ] V-01 (P0, Agent E) `2.0.0-alpha.1` (fim R2-1).
- [ ] V-02 (P0, Agent E) `2.0.0-alpha.2` (fim R2-2).
- [ ] V-03 (P0, Agent E) `2.0.0-rc.1` (fim R2-3).
- [ ] V-04 (P0, Agent E) `2.0.0`.
- [ ] V-05 (P0, Agent E) `3.0.0-alpha.1` (fim R3-1).
- [ ] V-06 (P0, Agent E) `3.0.0-alpha.2` (fim R3-2).
- [ ] V-07 (P0, Agent E) `3.0.0-rc.1` (fim R3-3).
- [ ] V-08 (P0, Agent E) `3.0.0`.
