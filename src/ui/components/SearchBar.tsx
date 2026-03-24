import type { SearchBarProps } from "../contracts";

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <label className="flex w-full items-center gap-2 rounded-2xl border border-brand-100 bg-white px-4 py-3 shadow-panel">
      <span className="text-sm font-semibold text-brand-700">Buscar</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Filtrar por conteúdo..."
        className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
      />
    </label>
  );
};
