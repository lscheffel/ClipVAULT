import { HistoryItemCard } from "./HistoryItemCard";
import type { HistoryListProps } from "../contracts";

export const HistoryList = ({ items, isLoading, densityMode, onCopy, onDelete }: HistoryListProps) => {
  if (isLoading) {
    return <p className="rounded-2xl bg-[#0b1020]/85 p-6 text-sm text-slate-300 shadow-panel">Sincronizando histórico...</p>;
  }

  if (!items.length) {
    return <p className="rounded-2xl bg-[#0b1020]/85 p-6 text-sm text-slate-300 shadow-panel">Nenhum item no histórico.</p>;
  }

  return (
    <div className={`grid sm:grid-cols-2 lg:grid-cols-3 ${densityMode === "compact" ? "gap-2" : "gap-3"}`}>
      {items.map((item) => (
        <HistoryItemCard key={item.id} item={item} densityMode={densityMode} onCopy={onCopy} onDelete={onDelete} />
      ))}
    </div>
  );
};
