import type { ClipboardItem } from "../core/contracts";

export type ViewStatus = "idle" | "loading" | "ready" | "error";
export type DensityMode = "comfortable" | "compact";

export interface ClipboardState {
  items: ClipboardItem[];
  lastClipboardText: string;
  search: string;
  status: ViewStatus;
  errorMessage: string | null;
  isPolling: boolean;
  pollIntervalMs: number;
  lastSyncAt: string | null;
  densityMode: DensityMode;
}

export interface ClipboardActions {
  hydrate(limit?: number): Promise<void>;
  syncTick(): Promise<void>;
  startPolling(): void;
  stopPolling(): void;
  setSearch(value: string): void;
  setDensityMode(mode: DensityMode): void;
  toggleDensityMode(): void;
  copyItem(input: number | string): Promise<boolean>;
  deleteItem(id: number): Promise<boolean>;
  exportHistory(): Promise<string>;
}

export type ClipboardStore = ClipboardState & ClipboardActions;
