import { HistoryItemCard } from "./HistoryItemCard";
import type { HistoryListProps } from "../contracts";

export const HistoryList = ({ items, isLoading, onCopy, onDelete }: HistoryListProps) => {
  if (isLoading) {
    return <p className="rounded-2xl bg-white/80 p-6 text-sm text-slate-600 shadow-panel">Sincronizando histórico...</p>;
  }

  if (!items.length) {
    return <p className="rounded-2xl bg-white/80 p-6 text-sm text-slate-600 shadow-panel">Nenhum item no histórico.</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <HistoryItemCard key={item.id} item={item} onCopy={onCopy} onDelete={onDelete} />
      ))}
    </div>
  );
};
