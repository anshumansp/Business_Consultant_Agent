import React, { useState, useEffect, useCallback } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route, Navigate } from "react-router-dom";
import ChatInterface from "./components/Chat/ChatInterface";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { theme } from "./utils/theme";
import { auth } from "./firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./App.css";

const App = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const token = await userCredential.user.getIdToken(true);
      localStorage.setItem("accessToken", token);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && token) {
        try {
          const currentToken = await user.getIdToken();
          if (currentToken === token) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("accessToken");
            setIsAuthenticated(false);
          }
        } catch (error) {
          localStorage.removeItem("accessToken");
          setIsAuthenticated(false);
        }
      } else {
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Make handleLogin available globally
    window.handleLogin = handleLogin;
    return () => {
      delete window.handleLogin;
    };
  }, [handleLogin]);

  if (!authChecked || isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#fff",
          }}
        >
          Loading...
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <div className="app">
                <header
                  className="app-header"
                  style={{ background: theme.palette.primary.main }}
                >
                  <h1>BusinessTech Advisor AI</h1>
                  <p>Your AI Business Consultant & IT Project Manager</p>
                </header>
                <main className="app-main">
                  <ChatInterface />
                </main>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
