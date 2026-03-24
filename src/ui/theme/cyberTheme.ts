import { createTheme } from "@mui/material/styles";

export const cyberTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00e5ff"
    },
    secondary: {
      main: "#ff4ecd"
    },
    background: {
      default: "#040610",
      paper: "#0b1020"
    },
    success: {
      main: "#00f5b8"
    },
    warning: {
      main: "#ffc857"
    }
  },
  shape: {
    borderRadius: 14
  },
  typography: {
    fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 700
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(56, 189, 248, 0.18)",
          backdropFilter: "blur(10px)"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10
        }
      }
    }
  }
});
