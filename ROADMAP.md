# ROADMAP

Programa ativo: **X10 ClipVault Library (Local-first Pro)**.  
Backlog executável: `BACKLOG.md`.

## Blocos Funcionais
1. UX Pro Cyber: tema moderno, glass/painéis, command palette, densidade.
2. Produtividade: dedupe, detecção de tipo, snippets, expander e preview rico.
3. Segurança/Lifecycle: cofre criptografado e expiração automática.
4. Compartilhamento local-first: links temporários assinados.
5. IA e Classificação: provider pluggable, ações por item e organização semântica.
6. Plataforma: integrações, atalhos globais, analytics e API/plugins públicos.

## Release 2.0.0 — Library Core Pro

### R2-1 Foundation UX + Runtime
- Shell Electron (main/preload) integrado com app React.
- Design system Cyber Workspace com Tailwind + Material UI.
- Command Palette (`Ctrl+K`) e modo de densidade.
- Entrega: desktop app funcional com tema e navegação de produtividade.

### R2-2 Produtividade
- Detecção automática de tipo e dedupe por hash/similaridade.
- Snippets com variáveis, text expander e preview rico.
- Store/API atualizadas para modelo de biblioteca.
- Entrega: fluxo completo criar, classificar, reutilizar.

### R2-3 Segurança + Lifecycle + Atalhos
- Vault local com criptografia AES-GCM e chave derivada.
- Expiração automática e processo de limpeza.
- Atalhos globais Electron (`globalShortcut`).
- Entrega: proteção real de itens sensíveis com operação global.

## Release 3.0.0 — Intelligence & Platform

### R3-1 Compartilhamento + API/Plugins Base
- Links locais assinados com expiração.
- API v2 base e runtime de plugins com sandbox.
- Entrega: compartilhamento local temporário e plugins carregáveis.

### R3-2 IA + Integrações
- Camada de IA pluggable (`summarize`, `rewrite`, `classify`).
- Classificação semântica automática por item.
- Integrações/webhooks (Slack, Notion, Jira v1).
- Entrega: automação inteligente acionada por evento.

### R3-3 Analytics + Hardening Plataforma
- Timeline analítica por tipo/hora/tag/ação.
- API pública expandida e contratos de plugin versionados.
- Hardening final de performance, auditoria e operação.
- Entrega: plataforma pronta para ecossistema.

## Agentes e Ownership
- Agent A — UX/System: tema, motion, palette, densidade.
- Agent B — Core/Data: schema v2, dedupe, tipo, snippets, expiração.
- Agent C — Security/Desktop: vault, Electron, atalhos globais.
- Agent D — AI/Integrations: IA pluggable, classificação, conectores/webhooks.
- Agent E — Platform/QA: API v2, plugins, analytics, E2E, CI e release notes.

## Gates de Testes por Fase
- G1 (fim R2-1): unit UI/store + snapshot visual + smoke Electron boot.
- G2 (fim R2-2): unit dedupe/tipagem/snippets + integração API v2 draft.
- G3 (fim R2-3): criptografia/expiração + atalhos globais + regressão.
- G4 (fim R3-1): assinatura/expiração de links + contratos de plugins.
- G5 (fim R3-2): providers IA mockados + webhooks + classificação.
- G6 (fim R3-3): E2E Playwright + carga leve API + check de segurança.
- Regra fixa: `npm run check`, `npm run smoke`, cobertura Core >= 85%, API crítica 100% verde.

## Versionamento Inteligente
- Linha de manutenção: `1.x`.
- Release 2: `2.0.0-alpha.1`, `2.0.0-alpha.2`, `2.0.0-rc.1`, `2.0.0`.
- Release 3: `3.0.0-alpha.1`, `3.0.0-alpha.2`, `3.0.0-rc.1`, `3.0.0`.
- Hotfix: `x.y.z+hotfix.n`.
- Banco: migrações versionadas com `schema_version` alinhadas ao semver.
