import { Dialog, DialogContent, List, ListItemButton, ListItemText, TextField } from "@mui/material";
import { useMemo, useState } from "react";

import type { DensityMode } from "../../store/clipboardStore.types";

interface PaletteAction {
  id: string;
  label: string;
  subtitle: string;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onExport: () => void;
  onToggleDensity: () => void;
  onFocusSearch: () => void;
  densityMode: DensityMode;
}

export const CommandPalette = ({
  open,
  onClose,
  onRefresh,
  onExport,
  onToggleDensity,
  onFocusSearch,
  densityMode
}: CommandPaletteProps) => {
  const [query, setQuery] = useState("");

  const actions = useMemo<PaletteAction[]>(
    () => [
      { id: "refresh", label: "Atualizar Biblioteca", subtitle: "Sincroniza com clipboard", run: onRefresh },
      { id: "export", label: "Exportar Biblioteca", subtitle: "Gera arquivo JSON", run: onExport },
      {
        id: "density",
        label: `Alternar Densidade (${densityMode === "comfortable" ? "Confortável" : "Compacta"})`,
        subtitle: "Troca entre visual compacto e confortável",
        run: onToggleDensity
      },
      { id: "search", label: "Focar Busca", subtitle: "Cursor direto no campo de filtro", run: onFocusSearch }
    ],
    [densityMode, onExport, onFocusSearch, onRefresh, onToggleDensity]
  );

  const filteredActions = actions.filter((action) => {
    const matcher = query.trim().toLowerCase();
    return !matcher || action.label.toLowerCase().includes(matcher) || action.subtitle.toLowerCase().includes(matcher);
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: "#0b1020", borderRadius: 3 } }}>
      <DialogContent sx={{ p: 2.5 }}>
        <TextField
          autoFocus
          fullWidth
          value={query}
          placeholder="Digite um comando..."
          onChange={(event) => setQuery(event.target.value)}
          size="small"
          sx={{
            mb: 1.5,
            input: { color: "#dbeafe" }
          }}
        />
        <List disablePadding>
          {filteredActions.map((action) => (
            <ListItemButton
              key={action.id}
              onClick={() => {
                action.run();
                onClose();
              }}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemText primary={action.label} secondary={action.subtitle} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};
