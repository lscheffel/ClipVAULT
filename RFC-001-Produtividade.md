# RFC-001: Produtividade Avançada

## Escopo
Implementar funcionalidades de produtividade avançada conforme definido no Roadmap R2-2 e R2-3:
- Detecção automática de tipo e dedupe por hash/similaridade
- Snippets com variáveis, text expander e preview rico
- Store/API atualizadas para modelo de biblioteca
- Vault local com criptografia AES-GCM e chave derivada
- Expiração automática e processo de limpeza
- Atalhos globais Electron

## Objetivos
1. Melhorar experiência de usuário com detecção inteligente de conteúdo
2. Reduzir duplicação através de algoritmos avançados de dedupe
3. Habilitar reutilização de conteúdo através de snippets parametrizáveis
4. Aumentar segurança com criptografia de dados sensíveis
5. Melhorar performance com expiração automática de dados antigos
6. Expandir acessibilidade com atalhos globais do sistema

## Especificações Técnicas

### 1. Detecção de Tipo e Dedupe
- Implementar algoritmo de hash para detecção exata de duplicatas
- Algoritmo de similaridade (ex: Levenshtein, Jaro-Winkler) para duplicatas próximas
- Classificação automática de tipo de conteúdo (texto, código, JSON, HTML, etc.)
- Tags automáticas baseadas no conteúdo detectado

### 2. Sistema de Snippets
- Definição de schema para snippets com variáveis substituíveis
- Interface para criação/edição de snippets com preview em tempo real
- Expansão de texto através de gatilhos configuráveis
- Preview rico com sintaxe highlighting para diferentes tipos de conteúdo

### 3. Modelo de Biblioteca
- Migração de simples histórico para modelo de biblioteca categorizada
- Suporte a pastas/tags hierárquicas
- Operações em lote (mover, excluir, taggar)
- Filtros avançados e busca faceted

### 4. Segurança e Lifecycle
- Cofre criptografado usando AES-GCM para dados marcados como sensíveis
- Derivação de chave baseada em senha do usuário (PBKDF2)
- Expiração configurável por item ou por política global
- Processo de limpeza automática em segundo plano

### 5. Atalhos Globais
- Registro de atalhos globais do Electron (globalShortcut)
- Ações configuráveis: abrir app, criar nova nota, buscar, etc.
- Fallback gracefully quando atalhos conflitam com outros aplicativos

## Métricas de Sucesso
- Redução de 40% em itens duplicados no histórico
- 30% aumento na reutilização de snippets existentes
- Tempo médio de busca reduzido de 5s para <1s
- Zero perdas de dados devido à expiração inadequada
- 95% de satisfação em pesquisas de usabilidade

## Dependências
- Nenhuma nova dependência externa necessária para implementação inicial
- Utilizar bibliotecas existentes: crypto (Node.js), melhor algoritmo de similaridade disponível

## Riscos e Mitigações
- Performance do algoritmo de similaridade: implementar cache e limitar comparações
- Complexidade de UI: abordagem incremental com testes de usabilidade
- Conflito de atalhos globais: fornecer interface de configuração e detecção de conflitos

## Cronograma
- Fase 1: Detecção de tipo e dedupe básico (2 semanas)
- Fase 2: Sistema de snippets básico (2 semanas)
- Fase 3: Modelo de biblioteca e UI (3 semanas)
- Fase 4: Segurança e lifecycle (2 semanas)
- Fase 5: Atalhos globais e polimento (1 semana)
- Total: 10 semanas

## Aprovação
Este RFC deve ser revisado pelos agentes responsáveis:
- Agent B (Core/Data): schema v2, dedupe, tipo, snippets, expiração
- Agent C (Security/Desktop): vault, Electron, atalhos globais
- Agent A (UX/System): tema, motion, palette, densidade (para UI dos novos recursos)