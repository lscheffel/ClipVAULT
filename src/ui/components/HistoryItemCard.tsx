import type { HistoryItemProps } from "../contracts";

const formatTimestamp = (value: string): string => {
  return new Date(value).toLocaleString("pt-BR");
};

export const HistoryItemCard = ({ item, onCopy, onDelete }: HistoryItemProps) => {
  const handleSaveText = () => {
    const blob = new Blob([item.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `clipboard-${item.id}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <article className="rounded-2xl border border-brand-100 bg-white p-4 shadow-panel transition hover:-translate-y-0.5 hover:shadow-lg">
      <header className="mb-2 flex items-center justify-between gap-4 text-xs text-slate-500">
        <span>#{item.id}</span>
        <time dateTime={item.timestamp}>{formatTimestamp(item.timestamp)}</time>
      </header>

      <p className="line-clamp-3 whitespace-pre-wrap break-words text-sm text-slate-700">{item.content}</p>

      <footer className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onCopy(item.id)}
          className="rounded-xl bg-brand-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-700"
        >
          Copiar
        </button>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          Excluir
        </button>
        <button
          type="button"
          onClick={handleSaveText}
          className="rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
        >
          Salvar .txt
        </button>
      </footer>
    </article>
  );
};
