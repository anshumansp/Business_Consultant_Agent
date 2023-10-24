import { Box, Button, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import image from "../assets/Netaji-logo.png";
import { pink } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const lightPink = pink[50];
const darkPink = pink[500];

const StyledBox = styled(Box)({
  padding: "2vh 2vw",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  height: "10vh",
  backgroundColor: "#fff",
  color: "#000",
  boxShadow: "0 0 0.7px 0px",
  width: "100vw",
});


const Header = () => {
  const navigate = useNavigate();
  const handleClick = ( ) => {
    navigate("/phone")
  }
  const handleChatClick = ( ) => {
    navigate("/")
  }
  return (
    <StyledBox>
      {/* Box-1 */}
      <Box width={"100%"} display={"flex"} alignItems={"center"}>
        {/* Image */}
        <img
          style={{
            width: "210px",
            height: "35px",
            color: "#000",
            backgroundColor: "#000",
            padding: "4px",
            marginRight: "20px",
          }}
          src={image}
          alt="logo"
        />

        {/* Button */}
        <Button
          sx={{
            padding: "5px 20px",
            marginRight: "20px",
            backgroundColor: lightPink,
            color: darkPink,
            textTransform: "inherit",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "16px",
            borderRadius: "6px",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: lightPink,
            },
          }}
          disableRipple
          disableTouchRipple
          onClick={handleChatClick}
        >
          Chat
        </Button>

        {/* Text */}
        <Typography
          color={"#696469"}
          sx={{
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
          }}
          onClick={handleClick}
        >
          Phone
        </Typography>
      </Box>

      {/* Box-2 */}
      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"flex-end"}
        alignItems={"center"}
      >
        <Button
          sx={{
            padding: "5px 24px",
            marginRight: "20px",
            backgroundColor: "#fff",
            border: "2px solid lightPink",
            color: darkPink,
            borderRadius: "6px",
            textTransform: "inherit",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            "&:hover": {
              backgroundColor: lightPink,
            },
          }}
          disableRipple
          disableTouchRipple
        >
          <span
            style={{
              marginRight: "6px",
            }}
            className="material-symbols-outlined"
          >
            add
          </span>
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "16px",
            }}
          >
            New Chat
          </Typography>
        </Button>
        <IconButton
          sx={{
            margin: "0",
            backgroundColor: darkPink,
            color: "#fff",
            fontSize: "16px",
            padding: "8px",
            "&:hover": {
              backgroundColor: darkPink,
            },
          }}
        >
          <i className="fa-solid fa-user"></i>
        </IconButton>
      </Box>
    </StyledBox>
  );
};

export default Header;
