import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import FileUpload from './components/FileUpload';
import TextDisplay from './components/TextDisplay';

function App() {
  const [text, setText] = useState('');

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setText(e.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Text Correction Prototype v0.1
      </Typography>
      {!text ? (
        <FileUpload onFileUpload={handleFileUpload} />
      ) : (
        <TextDisplay text={text} />
      )}
    </Box>
  );
}

export default App;
