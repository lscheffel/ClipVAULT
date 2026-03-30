import { useEffect, useRef, useState } from "react";

import { useClipboardStore } from "./store/clipboardStore";
import { CommandPalette } from "./ui/components/CommandPalette";
import { HeaderBar } from "./ui/components/HeaderBar";
import { HistoryList } from "./ui/components/HistoryList";
import { SearchBar } from "./ui/components/SearchBar";
import { StatusStrip } from "./ui/components/StatusStrip";
import { useFilteredItems } from "./ui/hooks/useFilteredItems";

export const App = () => {
  const items = useClipboardStore((state) => state.items);
  const search = useClipboardStore((state) => state.search);
  const status = useClipboardStore((state) => state.status);
  const errorMessage = useClipboardStore((state) => state.errorMessage);
  const lastSyncAt = useClipboardStore((state) => state.lastSyncAt);
  const startPolling = useClipboardStore((state) => state.startPolling);
  const stopPolling = useClipboardStore((state) => state.stopPolling);
  const syncTick = useClipboardStore((state) => state.syncTick);
  const copyItem = useClipboardStore((state) => state.copyItem);
  const deleteItem = useClipboardStore((state) => state.deleteItem);
  const exportHistory = useClipboardStore((state) => state.exportHistory);
  const setSearch = useClipboardStore((state) => state.setSearch);
  const densityMode = useClipboardStore((state) => state.densityMode);
  const toggleDensityMode = useClipboardStore((state) => state.toggleDensityMode);

  const filteredItems = useFilteredItems(items, search);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    startPolling();
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleExport = async () => {
    const outputPath = await exportHistory();
    if (outputPath) {
      window.alert(`Exportação concluída em:\n${outputPath}`);
    }
  };

  return (
    <main className="min-h-screen bg-app px-4 py-8 text-slate-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <HeaderBar
          onRefresh={() => void syncTick()}
          onExport={() => void handleExport()}
          onToggleDensity={toggleDensityMode}
          onOpenPalette={() => setPaletteOpen(true)}
          densityMode={densityMode}
          total={items.length}
        />
        <SearchBar value={search} onChange={setSearch} inputRef={searchInputRef} />
        <StatusStrip lastSyncAt={lastSyncAt} errorMessage={errorMessage} />
        <HistoryList
          items={filteredItems}
          isLoading={status === "loading" && items.length === 0}
          densityMode={densityMode}
          onCopy={(input) => void copyItem(input)}
          onDelete={(id) => void deleteItem(id)}
        />
        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          onRefresh={() => void syncTick()}
          onExport={() => void handleExport()}
          onToggleDensity={toggleDensityMode}
          onFocusSearch={() => searchInputRef.current?.focus()}
          densityMode={densityMode}
        />
      </section>
    </main>
  );
};

export default App;
