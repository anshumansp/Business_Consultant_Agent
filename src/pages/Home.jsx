import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect } from "react";
import { pink } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const darkPink = pink[500];
const StyledBox = styled(Box)({
  marginBlock: "30px",
  height: "10vh",
  padding: "2vh 22vw",
  display: "flex",
  "@media (max-width: 768px)": {
    padding: "2vh 10vw", // Adjust padding for smaller screens
  },
});

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const usertoken = localStorage.getItem("accessToken");
    if (!usertoken) {
      navigate("/login");
    }
  }, []);
  return (
    <Box sx={{ backgroundColor: "#F2F2F2" }}>
      <StyledBox>
        <Box
          sx={{
            marginRight: "50px",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              color: darkPink,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              marginBottom: "4px",
            }}
          >
            Chatbot
          </Typography>
          <Typography
            sx={{
              color: "#b4b8b5",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "14px",
            }}
          >
            13:33:47
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "16px",
              "@media (max-width: 768px)": {
                fontSize: "14px", // Adjust font size for smaller screens
              },
            }}
          >
            What is your Name?
          </Typography>
        </Box>
      </StyledBox>
    </Box>
  );
};

export default Home;
