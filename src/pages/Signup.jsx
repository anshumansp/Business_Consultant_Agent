import { Box, Stack, TextField, Typography, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { pink } from "@mui/material/colors";

const Signup = ({ setShowLayout }) => {
  const darkPink = pink[500];
  const lightPink = pink[700];
  const navigate = useNavigate();
  const [creds, setCreds] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const email = creds.email;
      const password = creds.password;
      const user = await createUserWithEmailAndPassword(auth, email, password);
      const token = user.user.accessToken;
      localStorage.setItem("accessToken", token);
      setShowLayout(true);
      navigate("/");
    } catch (error) {
      console.log(error.message);
    } finally {
      setCreds({
        email: "",
        password: "",
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/");
    }
  }, []);

  return (
    <Stack
      py={{ xs: 6, md: 12, lg: 22 }}
      px={{ xs: 2, md: 4, lg: 8 }}
      justifyContent="center"
      alignItems="center"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={{ xs: "100%", md: "80%", lg: "50%" }}
      >
        <Typography
          variant="h4"
          fontWeight={600}
          mb={2}
          fontFamily="'Plus Jakarta Sans', sans-serif"
        >
          Your Chatbot Account
        </Typography>
        <Typography
          variant="body1"
          color="#616161"
          fontWeight={400}
          fontSize="16px"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          lineHeight="30px"
        >
          <span style={{ fontWeight: 800, color: "#000" }}>Signup</span> to your
          ChatBot application.
        </Typography>

        <Box mt={4} width="80%">
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            placeholder="Email"
            type="email"
            name="email"
            value={creds.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            placeholder="Password"
            type="password"
            name="password"
            value={creds.password}
            onChange={handleChange}
          />
        </Box>
      </Box>

      <Box
        pt={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
        width={{ xs: "100%", md: "40%", lg: "30%" }}
      >
        <Button
          component={Link}
          to="/"
          variant="contained"
          size="large"
          onClick={handleSignup}
          sx={{
            width: "80%",
            backgroundColor: darkPink,
            "&:hover": { backgroundColor: lightPink },
          }}
        >
          Signup
        </Button>
        <Typography variant="body1" color="#616161" mt={2} textAlign="center">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#000" }}>
            Login Here
          </Link>
        </Typography>
      </Box>
    </Stack>
  );
};

export default Signup;
