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
import { auth } from "../firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { pink } from "@mui/material/colors";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [creds, setCreds] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setError("");
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    if (!creds.email || !creds.password || !creds.confirmPassword) {
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
    if (creds.password !== creds.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateInputs()) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        creds.email.trim(),
        creds.password
      );

      if (!userCredential.user) {
        throw new Error("No user data received");
      }

      const token = await userCredential.user.getIdToken();
      localStorage.setItem("accessToken", token);
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error.code, error.message);
      let errorMessage = "An error occurred during signup";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address format";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Email/password accounts are not enabled";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak";
          break;
        default:
          errorMessage = error.message || "Failed to signup. Please try again.";
      }
      setError(errorMessage);
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 12 } }}>
      <div style={{ textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Your Account
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          <span style={{ fontWeight: 800, color: "#000" }}>Sign up</span> to start using
          the ChatBot application.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSignup} style={{ marginTop: "2rem" }}>
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
          <TextField
            fullWidth
            required
            margin="normal"
            variant="outlined"
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
            value={creds.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            error={!!error && error.includes("match")}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
          </Button>
        </form>

        <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#000" }}>
            Login Here
          </Link>
        </Typography>
      </div>
    </Container>
  );
};

export default Signup;
