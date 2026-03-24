import type { ClipboardItem } from "../core/contracts";

export interface HistoryListProps {
  items: ClipboardItem[];
  isLoading: boolean;
  onCopy: (input: number | string) => void;
  onDelete: (id: number) => void;
}

export interface HistoryItemProps {
  item: ClipboardItem;
  onCopy: (input: number | string) => void;
  onDelete: (id: number) => void;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}
