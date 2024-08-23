// TextDisplay.js
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Grid } from '@mui/material';
import TextEditor from './TextEditor';
import './TextDisplay.css';

const TextDisplay = ({ text }) => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [highlightedText, setHighlightedText] = useState('');

  useEffect(() => {
    setLines(text.split('\n'));
  }, [text]);

  useEffect(() => {
    setHighlightedText(lines[currentLine]);
  }, [currentLine, lines]);

  const handleUpClick = () => {
    setCurrentLine((prev) => Math.max(prev - 1, 0));
  };

  const handleDownClick = () => {
    setCurrentLine((prev) => Math.min(prev + 1, lines.length - 1));
  };

  const handleSave = () => {
    const updatedLines = [...lines];
    updatedLines[currentLine] = highlightedText;
    setLines(updatedLines);
  };

  const handleDownload = () => {
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited_text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box className="text-display" sx={{ overflowY: 'auto', height: '400px', backgroundColor: '#f0f0f0', padding: 2 }}>
            {lines.map((line, index) => (
              <Typography
                key={index}
                variant="body1"
                component="p"
                className={index === currentLine ? 'highlight' : ''}
                sx={{ padding: '4px 0' }}
              >
                {line}
              </Typography>
            ))}
          </Box>
          <Box mt={2}>
            <Button variant="contained" onClick={handleUpClick}>Up</Button>
            <Button variant="contained" onClick={handleDownClick} sx={{ ml: 2 }}>Down</Button>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <TextEditor highlightedText={highlightedText} setHighlightedText={setHighlightedText} />
          <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
            Save Changes
          </Button>
          <Button variant="contained" onClick={handleDownload} sx={{ mt: 2, ml: 2 }}>
            Download
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TextDisplay;
