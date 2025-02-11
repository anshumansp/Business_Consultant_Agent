import React from "react";
import { ThemeProvider } from "@emotion/react";
import ChatInterface from "./components/Chat/ChatInterface";
import { theme } from "./utils/theme";
import "./App.css";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <header
          className="app-header"
          style={{ background: theme.colors.gradient.primary }}
        >
          <h1>BusinessTech Advisor AI</h1>
          <p>Your AI Business Consultant & IT Project Manager</p>
        </header>
        <main className="app-main">
          <ChatInterface />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;
