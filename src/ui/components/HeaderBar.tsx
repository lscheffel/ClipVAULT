interface HeaderBarProps {
  onRefresh: () => void;
  onExport: () => void;
  total: number;
}

export const HeaderBar = ({ onRefresh, onExport, total }: HeaderBarProps) => {
  return (
    <header className="rounded-3xl bg-brand-900/95 p-6 text-white shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-100">ClipVault</p>
          <h1 className="mt-2 text-2xl font-semibold">Histórico da Área de Transferência</h1>
          <p className="mt-2 text-sm text-brand-100">Itens capturados: {total}</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-xl border border-brand-100/30 bg-brand-700 px-3 py-2 text-xs font-semibold transition hover:bg-brand-500"
          >
            Atualizar
          </button>
          <button
            type="button"
            onClick={onExport}
            className="rounded-xl bg-amber-300 px-3 py-2 text-xs font-semibold text-brand-900 transition hover:bg-amber-200"
          >
            Exportar JSON
          </button>
        </div>
      </div>
    </header>
  );
};
