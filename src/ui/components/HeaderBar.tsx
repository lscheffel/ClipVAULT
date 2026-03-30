import { AutoAwesome, DensitySmall, Hub, Refresh } from "@mui/icons-material";
import { Button } from "@mui/material";

import type { HeaderBarProps } from "../contracts";

export const HeaderBar = ({ onRefresh, onExport, onToggleDensity, onOpenPalette, densityMode, total }: HeaderBarProps) => {
  return (
    <header className="rounded-3xl border border-cyan-400/20 bg-[#0a1126]/90 p-6 text-white shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">ClipVault X10</p>
          <h1 className="mt-2 text-2xl font-semibold">Biblioteca da Área de Transferência</h1>
          <p className="mt-2 text-sm text-cyan-100">Itens capturados: {total}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outlined"
            onClick={onRefresh}
            size="small"
            startIcon={<Refresh fontSize="small" />}
            sx={{ borderColor: "rgba(34,211,238,.45)", color: "#67e8f9" }}
          >
            Atualizar
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DensitySmall fontSize="small" />}
            onClick={onToggleDensity}
            sx={{ borderColor: "rgba(34,211,238,.45)", color: "#67e8f9" }}
          >
            Densidade: {densityMode === "comfortable" ? "Confortável" : "Compacta"}
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Hub fontSize="small" />}
            onClick={onOpenPalette}
            sx={{ borderColor: "rgba(34,211,238,.45)", color: "#67e8f9" }}
          >
            Command Palette
          </Button>
          <Button
            variant="contained"
            onClick={onExport}
            size="small"
            startIcon={<AutoAwesome fontSize="small" />}
            sx={{ background: "linear-gradient(90deg,#00e5ff,#ff4ecd)", color: "#04111f" }}
          >
            Exportar JSON
          </Button>
        </div>
      </div>
    </header>
  );
};
