# PARITY MATRIX

## Legado Python -> Stack Moderna

| Legado | Novo | Status |
|---|---|---|
| `clipboard_monitor()` (persistência contínua) | monitor no backend (`server/app.ts`, intervalo configurável) | OK |
| `get_history(limit)` | `GET /api/history?limit=` | OK |
| `copy_item(id|content)` | `POST /api/copy` | OK |
| `delete_item(id)` | `DELETE /api/history/:id` | OK |
| `export_data()` | `POST /api/export` (`clipboard_export.json`) | OK |
| `Salvar como...` no item | botão `Salvar .txt` no card React | OK |
| atualização periódica da UI | polling na store Zustand (`syncTick`) | OK |

## Observações
- O legado original mantém artefatos em Python para comparação (`main.py`, `ui/index.html`).
- A persistência segue SQLite e ordenação por `id DESC`.
