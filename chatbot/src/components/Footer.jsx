import React from "react";
import { Box, TextField, styled } from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddIcon from "@mui/icons-material/Add";

const Footer = () => {
  const inputStyle = {
    width: "60%",
    backgroundColor: "#FFF",
    position: "fixed",
    bottom: "10px",
    left: "20%",
    right: "20%",
    borderRadius: "8px",
    padding: "8px",
  };

  const adornmentStyle = {
    marginRight: "10px",
    display: "flex",
    cursor: "pointer",
  };

  const StyledTextField = styled(TextField)`
    & label.Mui-focused {
      border-color: white;
    }
    & .MuiOutlinedInput-root {
      &.Mui-focused fieldset {
        border-color: #F2F2F2;
        border: "none"
      }
    }
    &:hover fieldset {
      border-color: transparent; /* Remove hover border color */
    }
  `;

  return (
    <Box>
      <StyledTextField
        id="outlined-basic"
        placeholder="Type your message here..."
        variant="outlined"
        sx={{
          border: "none",
          outline: "none",
          "& .MuiInput-root": {
            border: "none",
            borderRadius: "8px",
            "&:focus": {
              border: "none",
              outline: "none",
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <div style={adornmentStyle}>
              <ExpandLessIcon color="action" sx={{ marginRight: "10px" }} />
              <AddIcon color="action" />
            </div>
          ),
          endAdornment: (
            <div style={adornmentStyle}>
              <TelegramIcon color="action" />
            </div>
          ),
          style: {
            backgroundColor: "#fff",
          },
        }}
        style={inputStyle}
      />
    </Box>
  );
};

export default Footer;
