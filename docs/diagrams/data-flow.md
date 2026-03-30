flowchart TD
    A[System Clipboard] -->|readText()| B(SystemClipboardGateway)
    B -->|writeText()| A
    B -->|readText()/writeText()| C[Clipboard Use Cases]
    C -->|insert()/listRecent()/findById()/deleteById()| D[SQLite Repository]
    C -->|exportJson()| E[Export Gateway]
    D[(SQLite Database)]
    E[Export Gateway] -->|exportJson()| F[JSON Files]
    
    G[Express API] -->|GET /api/history| C
    G -->|POST /api/sync| C
    G -->|POST /api/copy| C
    G -->|DELETE /api/history/:id| C
    G -->|POST /api/export| C
    
    H[Frontend/UI] -->|apiClient.ts| G
    
    style C fill:#e1f5fe,stroke:#01579b
    style D fill:#fff3e0,stroke:#bf360c
    style E fill:#f3e5f5,stroke:#6a1b9a
    style F fill:#e8f5e8,stroke:#2e7d32
    style G fill:#fff8e1,stroke:#ef6c00
    style H fill:#fce4ec,stroke:#c2185b