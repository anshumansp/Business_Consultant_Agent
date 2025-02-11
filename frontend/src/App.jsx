import React from "react";
import { ThemeProvider } from "@emotion/react";
import { Routes, Route, Navigate } from "react-router-dom";
import ChatInterface from "./components/Chat/ChatInterface";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import AuthGuard from "./components/Auth/AuthGuard";
import { theme } from "./utils/theme";
import "./App.css";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <AuthGuard>
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
            </AuthGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;