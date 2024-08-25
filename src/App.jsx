import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import FileUpload from './components/FileUpload';
import TextDisplay from './components/TextDisplay';
import ExplainerSection from './components/ExplainerSection';

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
    <Container 
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 2,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Text Correction Prototype v0.1
      </Typography>
      {!text ? (
        <>
          <ExplainerSection />
          <FileUpload onFileUpload={handleFileUpload} />
        </>
      ) : (
        <TextDisplay text={text} />
      )}
    </Container>
  );
}

export default App;
