# IPC/API Contracts - ClipVault Modern

## Core Contracts (src/core/contracts.ts)

### ClipboardItem
```typescript
interface ClipboardItem {
  id: number;
  content: string;
  type: "text";
  timestamp: string;
}
```

### NewClipboardItem
```typescript
interface NewClipboardItem {
  content: string;
  type: "text";
  timestamp?: string;
}
```

### ClipboardRepository
```typescript
interface ClipboardRepository {
  insert(item: NewClipboardItem): Promise<ClipboardItem>;
  listRecent(limit: number): Promise<ClipboardItem[]>;
  findById(id: number): Promise<ClipboardItem | null>;
  deleteById(id: number): Promise<boolean>;
}
```

### ClipboardGateway
```typescript
interface ClipboardGateway {
  readText(): Promise<string>;
  writeText(value: string): Promise<void>;
}
```

### ExportGateway
```typescript
interface ExportGateway {
  exportJson(filename: string, payload: ClipboardItem[]): Promise<string>;
}
```

### ClipboardUseCases
```typescript
interface ClipboardUseCases {
  syncClipboard(lastClipboard: string): Promise<{ saved: boolean; nextLastClipboard: string }>;
  getHistory(limit: number): Promise<ClipboardItem[]>;
  copyItem(input: number | string): Promise<boolean>;
  deleteItem(id: number): Promise<boolean>;
  exportHistory(): Promise<string>;
}
```

## API Endpoints (server/app.ts)

### GET /api/health
- **Description**: Health check endpoint
- **Response**: `{ ok: true }`
- **Auth**: None

### GET /api/history
- **Description**: Retrieve clipboard history
- **Query Params**: 
  - `limit` (optional): Number of items to return (default: 500, max: 10000)
- **Response**: `ClipboardItem[]`
- **Auth**: None
- **Maps to**: `useCases.getHistory(limit)`

### POST /api/sync
- **Description**: Synchronize clipboard with system
- **Request Body**: None
- **Response**: `{ saved: boolean, nextLastClipboard: string }`
- **Auth**: None
- **Maps to**: `syncClipboard()` internal function

### POST /api/copy
- **Description**: Copy item to clipboard
- **Request Body**: `{ input: number | string }`
- **Constraints**: 
  - Input must be number or string
  - String length ≤ 20000 characters
- **Response**: `{ ok: boolean }`
- **Auth**: None
- **Maps to**: `useCases.copyItem(input)`

### DELETE /api/history/:id
- **Description**: Delete clipboard item by ID
- **Path Params**: 
  - `id`: Item ID (must be valid integer)
- **Response**: `{ ok: boolean }`
- **Auth**: None
- **Maps to**: `useCases.deleteItem(id)`

### POST /api/export
- **Description**: Export history as JSON file
- **Request Body**: None
- **Response**: `{ path: string }` (file path) or `{ path: "" }` on error
- **Auth**: None
- **Maps to**: `useCases.exportHistory()`

## Error Handling
All endpoints follow error pattern:
- Invalid input returns safe fallback (empty array, false ok, empty path) without crashing
- Errors logged with requestId for tracing
- Global error handler catches unhandled exceptions

## Data Flow
1. System clipboard changes detected via `SystemClipboardGateway`
2. Changes processed through `useCases.syncClipboard()`
3. Valid changes persisted to SQLite via `SqliteClipboardRepository`
4. API endpoints expose use cases through Express routes
5. Frontend consumes API via `src/lib/apiClient.ts`