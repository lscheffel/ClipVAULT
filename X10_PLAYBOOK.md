# X10 PLAYBOOK

## Como executar o roadmap
1. Abrir fase no backlog e fixar owner primário.
2. Implementar apenas escopo da fase.
3. Rodar gate obrigatório da fase.
4. Registrar evidências no changelog/PR.
5. Só então avançar de versão pre-release.

## R2-1 (2.0.0-alpha.1)
1. Criar Electron shell e manter `npm run dev` funcional.
2. Integrar tema MUI + Tailwind Cyber Workspace.
3. Entregar Command Palette e densidade.
4. Gate G1: unit UI/store + smoke Electron.

## R2-2 (2.0.0-alpha.2)
1. Evoluir `ClipboardItem` v2 e migração de schema.
2. Implementar detecção de tipo e dedupe.
3. Implementar snippets + expander + preview.
4. Gate G2: unit core + integração API v2 draft.

## R2-3 (2.0.0-rc.1 -> 2.0.0)
1. Implementar vault criptografado local.
2. Implementar expiração e limpeza automática.
3. Implementar atalhos globais Electron.
4. Gate G3: testes de cripto/expiração/atalhos + regressão.

## R3-1 (3.0.0-alpha.1)
1. Publicar API v2 base.
2. Implementar links locais assinados com expiração.
3. Entregar runtime de plugins base.
4. Gate G4: testes de assinatura e contratos de plugins.

## R3-2 (3.0.0-alpha.2)
1. Implementar `AiProvider` pluggable.
2. Implementar ações IA por item.
3. Implementar classificação semântica.
4. Implementar conectores/webhooks v1.
5. Gate G5: IA mock + webhooks + classificação.

## R3-3 (3.0.0-rc.1 -> 3.0.0)
1. Implementar analytics de timeline.
2. Versionar API pública e contratos de plugin.
3. Hardening final de performance e segurança.
4. Gate G6: E2E + carga leve + segurança.

## Regra fixa de qualidade
- `npm run check` verde.
- `npm run smoke` verde.
- Cobertura Core >= 85%.
- API crítica 100% verde.
