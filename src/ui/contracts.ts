import type { ClipboardItem } from "../core/contracts";
import type { DensityMode } from "../store/clipboardStore.types";

export interface HistoryListProps {
  items: ClipboardItem[];
  isLoading: boolean;
  densityMode: DensityMode;
  onCopy: (input: number | string) => void;
  onDelete: (id: number) => void;
}

export interface HistoryItemProps {
  item: ClipboardItem;
  densityMode: DensityMode;
  onCopy: (input: number | string) => void;
  onDelete: (id: number) => void;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export interface HeaderBarProps {
  onRefresh: () => void;
  onExport: () => void;
  onToggleDensity: () => void;
  onOpenPalette: () => void;
  densityMode: DensityMode;
  total: number;
}
