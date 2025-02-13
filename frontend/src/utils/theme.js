import { createTheme } from "@mui/material/styles";
import { pink } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: {
      main: pink[500],
      light: pink[300],
      dark: pink[700],
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#616161",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: {
      fontWeight: 600,
    },
    body1: {
      fontSize: "16px",
      lineHeight: 1.5,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "16px",
          paddingRight: "16px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});
