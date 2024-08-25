import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

const GoogleTranslateRedirect = () => {
  const [text, setText] = useState('');

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleTranslate = () => {
    // Encode the text for URL
    const encodedText = encodeURIComponent(text);
    // Google Translate URL with Hindi as the target language
    const translateUrl = `https://translate.google.com/?sl=auto&tl=hi&text=${encodedText}`;

    // Open the URL in a new tab
    window.open(translateUrl, '_blank');
  };

  return (
    <Box sx={{ padding: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        label="Paste Text Here"
        value={text}
        onChange={handleTextChange}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleTranslate}
      >
        Hear How Your Changes Sound
      </Button>
    </Box>
  );
};

export default GoogleTranslateRedirect;
