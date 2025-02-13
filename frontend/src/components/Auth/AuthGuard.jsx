import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase.config";

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken || !auth.currentUser) {
        navigate("/login", { replace: true });
      }
    };

    checkAuth();

    // Add event listener for storage changes (handles multi-tab logout)
    const handleStorageChange = (e) => {
      if (e.key === "accessToken" && !e.newValue) {
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  return children;
};

export default AuthGuard;
