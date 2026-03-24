export type ClipboardContentType = "text";

export interface ClipboardItem {
  id: number;
  content: string;
  type: ClipboardContentType;
  timestamp: string;
}

export interface NewClipboardItem {
  content: string;
  type: ClipboardContentType;
  timestamp?: string;
}

export interface ClipboardRepository {
  insert(item: NewClipboardItem): Promise<ClipboardItem>;
  listRecent(limit: number): Promise<ClipboardItem[]>;
  findById(id: number): Promise<ClipboardItem | null>;
  deleteById(id: number): Promise<boolean>;
}

export interface ClipboardGateway {
  readText(): Promise<string>;
  writeText(value: string): Promise<void>;
}

export interface ExportGateway {
  exportJson(filename: string, payload: ClipboardItem[]): Promise<string>;
}

export interface ClipboardUseCases {
  syncClipboard(lastClipboard: string): Promise<{ saved: boolean; nextLastClipboard: string }>;
  getHistory(limit: number): Promise<ClipboardItem[]>;
  copyItem(input: number | string): Promise<boolean>;
  deleteItem(id: number): Promise<boolean>;
  exportHistory(): Promise<string>;
}

export interface ClipboardUseCaseDeps {
  repository: ClipboardRepository;
  clipboard: ClipboardGateway;
  exporter: ExportGateway;
  clock?: () => Date;
}
