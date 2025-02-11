import { Box, Button, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import image from "../assets/Netaji-logo.png";
import { pink } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

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
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePhoneClick = () => {
    navigate("/phone");
  };

  const handleChatClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <StyledBox>
      {/* Left Section */}
      <Box width="50%" display="flex" alignItems="center">
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
        <Button
          sx={{
            padding: "5px 20px",
            backgroundColor: lightPink,
            display: { xs: "none", md: "flex" },
            color: darkPink,
            textTransform: "inherit",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "16px",
            borderRadius: "6px",
            marginRight: "20px",
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

        <Typography
          color={"#696469"}
          sx={{
            cursor: "pointer",
            display: { xs: "none", md: "flex" },
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
          }}
          onClick={handlePhoneClick}
        >
          Phone
        </Typography>
      </Box>

      {/* Right Section */}
      <Box
        width="50%"
        display="flex"
        sx={{
          display: { xs: "none", md: "flex" },
        }}
        justifyContent="flex-end"
        alignItems="center"
      >
        <Button
          sx={{
            padding: "5px 24px",
            backgroundColor: "#fff",
            border: "2px solid lightPink",
            color: darkPink,
            borderRadius: "6px",
            textTransform: "inherit",
            display: { xs: "none", md: "flex" },
            marginRight: "20px",
            cursor: "pointer",
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
              display: { xs: "none", md: "flex" },
            }}
          >
            New Chat
          </Typography>
        </Button>
        <IconButton
          sx={{
            margin: "0",
            backgroundColor: darkPink,
            display: { xs: "none", md: "flex" },
            color: "#fff",
            fontSize: "16px",
            padding: "8px",
            "&:hover": {
              backgroundColor: darkPink,
            },
          }}
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <i className="fa-solid fa-user"></i>
        </IconButton>
      </Box>

      {/* Menu Button for Small Devices */}
      <IconButton
        sx={{
          display: { xs: "flex", md: "none" },
          margin: 0,
          backgroundColor: darkPink,
          color: "#fff",
          fontSize: "16px",
          padding: "8px",
          "&:hover": {
            backgroundColor: darkPink,
          },
        }}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <i className="fa-solid fa-bars"></i>
      </IconButton>

      {/* Menu for Small Devices */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem sx={{
          display: { xs: "flex", md: "none" }
        }} onClick={handleChatClick}>Chat</MenuItem>
        <MenuItem sx={{
          display: { xs: "flex", md: "none" }
        }} onClick={handlePhoneClick}>Phone</MenuItem>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </StyledBox>
  );
};

export default Header;
