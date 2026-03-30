# Contributing to ClipVault Modern

Please adhere to the 10 Fundamental Laws of documentation:

1. **Scarcity Lock (Lei nº 4)**: Synchronize all canonical artifacts to precisely reflect the current application state.
2. **Extreme Conciseness (Lei nº 8)**: Documentation must be ultra-concise (max 150 words per file). Skip generic introductions.
3. **State Registration**: Update `.kilo/STATE.md` with an ultra-compact summary of current decisions and next task ID.
4. **Explicit Tracking**: Maintain a TodoWrite checklist in chat at every file transition.
5. **Self-Verification**: Before presenting text, internally verify it reflects only real code and has no redundancies.
6. **Show, Don't Tell**: Prefer tables, schemas, and Mermaid diagrams over long paragraphs.
7. **Fidelity and SemVer**: CHANGELOG.md must be based exclusively on code diff; determine new SemVer increment based on change magnitude.
8. **Quality Gate (Debt Lock)**: During audit, track TODO/FIXME comments in code; if present, they must head the next RFC's task list.
9. **Bridge to Future (Scarcity Lock - Next RFC)**: Immediately after documentation sync, propose next RFC-XXX covering Architectural Scope, Performance Goals, and Core New Features.
10. **Developer-Centric Thinking**: Anticipate integration issues, misunderstandings, and platform differences; write for real-world implementation.