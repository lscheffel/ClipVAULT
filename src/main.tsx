import { CssBaseline, ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./styles.css";
import { cyberTheme } from "./ui/theme/cyberTheme";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container #root não encontrado.");
}

createRoot(container).render(
  <StrictMode>
    <ThemeProvider theme={cyberTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
