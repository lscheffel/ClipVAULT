interface StatusStripProps {
  lastSyncAt: string | null;
  errorMessage: string | null;
}

const formatSync = (value: string | null): string => {
  if (!value) {
    return "Aguardando primeira sincronização";
  }
  return `Última sincronização: ${new Date(value).toLocaleTimeString("pt-BR")}`;
};

export const StatusStrip = ({ lastSyncAt, errorMessage }: StatusStripProps) => {
  return (
    <aside className="rounded-2xl border border-cyan-400/20 bg-[#0b1020]/90 px-4 py-3 text-xs text-slate-300 shadow-panel">
      <p>{formatSync(lastSyncAt)}</p>
      {errorMessage ? <p className="mt-1 text-rose-400">{errorMessage}</p> : null}
    </aside>
  );
};
