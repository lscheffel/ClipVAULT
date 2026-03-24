import { useEffect } from "react";

import { useClipboardStore } from "./store/clipboardStore";
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

  const filteredItems = useFilteredItems(items, search);

  useEffect(() => {
    startPolling();
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  const handleExport = async () => {
    const outputPath = await exportHistory();
    if (outputPath) {
      window.alert(`Exportação concluída em:\n${outputPath}`);
    }
  };

  return (
    <main className="min-h-screen bg-app px-4 py-8 text-slate-800">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <HeaderBar onRefresh={() => void syncTick()} onExport={() => void handleExport()} total={items.length} />
        <SearchBar value={search} onChange={setSearch} />
        <StatusStrip lastSyncAt={lastSyncAt} errorMessage={errorMessage} />
        <HistoryList
          items={filteredItems}
          isLoading={status === "loading" && items.length === 0}
          onCopy={(input) => void copyItem(input)}
          onDelete={(id) => void deleteItem(id)}
        />
      </section>
    </main>
  );
};

export default App;
