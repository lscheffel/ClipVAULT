import type { ClipboardItem } from "../core/contracts";
import type { DensityMode } from "../store/clipboardStore.types";
import type { RefObject } from "react";

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
  inputRef?: RefObject<HTMLInputElement>;
}

export interface HeaderBarProps {
  onRefresh: () => void;
  onExport: () => void;
  onToggleDensity: () => void;
  onOpenPalette: () => void;
  densityMode: DensityMode;
  total: number;
}
