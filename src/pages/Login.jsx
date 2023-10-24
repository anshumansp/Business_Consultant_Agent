import { Box, Checkbox, Stack, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const [creds, setCreds] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    console.log(creds)
  }

  return (
    <Stack py={16} justifyContent={"center"} alignItems={"center"}>
      <Box
        flexDirection={"column"}
        alignItems={"center"}
        display={"flex"}
        justifyContent={"center"}
        width={"40%"}
      >
        {/* Box for Heading */}
        <Box textAlign={"center"} px={10}>
          <Typography
            sx={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "30px",
              fontWeight: 600,
              marginBottom: "16px",
            }}
          >
            My Chatbot Account
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "16px",
              fontWeight: 400,
              color: "#616161",
              lineHeight: "30px",
            }}
          >
            <span
              style={{
                fontWeight: 800,
                color: "#000",
              }}
            >
              Log in
            </span>{" "}
            to your ChatBot application.
          </Typography>
        </Box>

        <Box flexDirection={"column"} width={"100%"} pt={4}>
          <TextField
            sx={{
              width: "100%",
              marginBottom: "20px",
              backgroundColor: "#F2F2F2",
              "& fieldset": { border: "none" },
            }}
            id="outlined-email-input"
            placeholder="Email"
            type="email"
            name="email"
            value={creds.email}
            onChange={handleChange}
            autoComplete="current-password"
          />
          <TextField
            sx={{
              width: "100%",
              marginBottom: "20px",
              backgroundColor: "#F2F2F2",
              "& fieldset": { border: "none" },
            }}
            id="outlined-password-input"
            placeholder="Password"
            type="password"
            name="password"
            value={creds.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </Box>
      </Box>

      <Box
        pt={2}
        flexDirection={"column"}
        display={"flex"}
        style={{
          width: "20%",
          textAlign: "center",
        }}
      >
        <Link
          style={{
            textDecoration: "none",
            backgroundColor: "#EB1B22",
            padding: "15px 0",
            color: "#fff",
            borderRadius: 0,
            textTransform: "inherit",
            fontSize: "18px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 400,
            display: "block",
            "&:hover": {
              backgroundColor: "#8C8A8C",
            },
          }}
          onClick={handleLogin}
        >
          Login
        </Link>
        <Typography
          style={{
            marginTop: "24px",
            color: "#616161",
            fontSize: "16px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 400,
            display: "block",
            "&:hover": {
              backgroundColor: "#8C8A8C",
            },
          }}
        >
          Don't have an account?{" "}
          <Link
            style={{
              color: "#000",
            }}
            to="/signup"
          >
            {" "}
            Signup Here{" "}
          </Link>
        </Typography>
      </Box>
    </Stack>
  );
};

export default Login;
