import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Phone from "./pages/Phone";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
      <AppContent />
  );
}

function AppContent() {
  const location = useLocation();
  const [showLayout, setShowLayout] = useState(true);

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/signup") {
      setShowLayout(false);
    } else {
      setShowLayout(true);
    }
  }, [location.pathname]);

  return (
    <>
      {showLayout && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/phone" element={<Phone />} />
        <Route path="/login" element={<Login setShowLayout={setShowLayout} />} />
        <Route path="/signup" element={<Signup setShowLayout={setShowLayout} />} />
      </Routes>
      {showLayout && <Footer />}
    </>
  );
}

export default App;
