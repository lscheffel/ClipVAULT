import { useMemo } from "react";

import type { ClipboardItem } from "../../core/contracts";

export const useFilteredItems = (items: ClipboardItem[], search: string): ClipboardItem[] => {
  return useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return items;
    }

    return items.filter((item) => item.content.toLowerCase().includes(query));
  }, [items, search]);
};
