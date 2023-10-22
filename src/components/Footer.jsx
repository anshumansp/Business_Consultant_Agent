import React from 'react';
import { Box, TextField } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddIcon from '@mui/icons-material/Add';

const Footer = () => {
  const inputStyle = {
    width: '60%',
    backgroundColor: '#FFF',
    position: 'fixed',
    bottom: '10px',
    left: '20%',
    right: '20%',
    borderRadius: '8px',
    padding: '8px',
  };

  const adornmentStyle = {
    marginRight: '10px',
    display: "flex",
    cursor: "pointer"
  };

  return (
    <Box>
      <TextField
        id="outlined-basic"
        placeholder="Type your message here..."
        variant="outlined"
        style={inputStyle}
        InputProps={{
          startAdornment: (
            <div style={adornmentStyle}>
              <ExpandLessIcon color="action" sx={{marginRight: "10px"}} />
              <AddIcon color="action" />
            </div>
          ),
          endAdornment: (
            <div style={adornmentStyle}>
              <TelegramIcon color="action" />
            </div>
          ),
          style: {
            backgroundColor: '#FFF',
            outline: "disabled"
          },
        }}
      />
    </Box>
  );
};

export default Footer;
