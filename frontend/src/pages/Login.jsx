import {
  Container,
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pink } from "@mui/material/colors";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [creds, setCreds] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setError("");
    setCreds((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateInputs = () => {
    if (!creds.email || !creds.password) {
      setError("Please fill in all fields");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(creds.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (creds.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    setError("");

    try {
      const result = await window.handleLogin(creds.email, creds.password);
      if (result.success) {
        setCreds({ email: "", password: "" });
        navigate("/");
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error("Login error:", error.code, error.message);
      let errorMessage = "An error occurred during login";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address format";
          break;
        case "auth/user-disabled":
          errorMessage =
            "This account has been disabled. Please contact support.";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection.";
          break;
        default:
          errorMessage = error.message || "Failed to login. Please try again.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 12 } }}>
      <div style={{ textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Chatbot Account
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          <span style={{ fontWeight: 800, color: "#000" }}>Log in</span> to your
          ChatBot application.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin} style={{ marginTop: "2rem" }}>
          <TextField
            fullWidth
            required
            margin="normal"
            variant="outlined"
            placeholder="Email"
            type="email"
            name="email"
            value={creds.email}
            onChange={handleChange}
            disabled={loading}
            error={!!error && error.includes("email")}
          />
          <TextField
            fullWidth
            required
            margin="normal"
            variant="outlined"
            placeholder="Password"
            type="password"
            name="password"
            value={creds.password}
            onChange={handleChange}
            disabled={loading}
            error={!!error && error.includes("password")}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              mt: 2,
              bgcolor: pink[500],
              "&:hover": {
                bgcolor: pink[700],
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>

        <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#000" }}>
            Signup Here
          </Link>
        </Typography>
      </div>
    </Container>
  );
};

export default Login;
