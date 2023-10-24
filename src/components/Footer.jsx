import React from "react";
import { Box, TextField, styled } from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddIcon from "@mui/icons-material/Add";

const Footer = () => {
  const inputStyle = {
    width: "100%", 
    backgroundColor: "#FFF",
    position: "fixed",
    bottom: "10px",
    left: "0%",
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
      border-color: #f2f2f2;
    }
    & .MuiOutlinedInput-root {
      &.Mui-focused fieldset {
        border-color: #F2F2F2;
        border: #f2f2f2; /* Remove border on focus */
      }
    }
    &:hover fieldset {
      border-color: #f2f2f2; /* Remove hover border color */
    }
  `;

  return (
    <Box>
      <StyledTextField
        id="outlined-basic"
        placeholder="Type your message here..."
        variant="outlined"
        sx={{
          border: "#f2f2f2",
          position: "fixed",
          outline: "#f2f2f2",
          "& .MuiInput-root": {
            border: "#f2f2f2",
            borderRadius: "8px",
            "&:focus": {
              border: "#f2f2f2",
              outline: "#f2f2f2",
            },
          },
          width: {
            xs: "95%",
            md: "60%", 
          },
          bottom: {
            xs: "3%",
            md: "3%",
          },
          left: {
            xs: "2%", 
            md: "20%"
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
        // style={inputStyle}
      />
    </Box>
  );
};

export default Footer;
