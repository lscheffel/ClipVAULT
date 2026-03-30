import type { SearchBarProps } from "../contracts";

export const SearchBar = ({ value, onChange, inputRef }: SearchBarProps) => {
  return (
    <label className="flex w-full items-center gap-2 rounded-2xl border border-cyan-400/25 bg-[#0b1020]/90 px-4 py-3 shadow-panel">
      <span className="text-sm font-semibold text-cyan-200">Buscar</span>
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Filtrar por conteúdo..."
        className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
      />
    </label>
  );
};
