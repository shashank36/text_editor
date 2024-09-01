import React, { useState, useEffect } from 'react';
import { Container, Grid, Button, Box, Typography } from '@mui/material';
import TextEditor from './TextEditor';
import axios from 'axios';
import OriginalTextViewer from './OriginalTextViewer';
import MenuSection from './MenuSection';
import GoogleTranslateRedirect from './GoogleTranslateRedirect';
import './TextDisplay.css';

const TextDisplay = ({ text, sessionArea, filename }) => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [highlightedText, setHighlightedText] = useState('');
  const [selectedWord, setSelectedWord] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState('');
  const [filteredLines, setFilteredLines] = useState([]);
  const [filteredLineIndices, setFilteredLineIndices] = useState([]);

  useEffect(() => {
    setLines(text.split('\n'));
  }, [text]);

  useEffect(() => {
    if (selectedPattern) {
      applyPattern(selectedPattern);
    }
  }, [selectedPattern, lines]);

  const uploadModifiedText = () => {
    const content = lines.join('\n');

    axios.post('http://127.0.0.1:8000/upload2/', {
      session_area: sessionArea,
      filename: filename,
      content: content
    })
    .then(response => {
      alert('File uploaded successfully!');
    })
    .catch(error => {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
    });
  };

  const applyPattern = (pattern) => {
    let matchedLines = [];
    let matchedIndices = [];
    const urlRegex = /(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-&?=%.]+/g;
    const pageBreakRegex = /^=!pgB!=.*=!Epg!=/;
    const englishWordRegex = /\b[a-zA-Z]+\b/g;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g; // Example special characters
  
    lines.forEach((line, index) => {
      if (pattern === 'Modify Number Hyphen' && /-(\d|\p{Nd})/u.test(line)) {
        matchedLines.push(line);
        matchedIndices.push(index);
      } else if (pattern === 'Modify Character Hyphen' && /([a-zA-Z])\-([a-zA-Z])/.test(line)) {
        matchedLines.push(line);
        matchedIndices.push(index);
      } else if (pattern === 'Modify Hindi Short Forms' && /(वं\.|वं०|पं\.|पं०|मि\.|मि०)/.test(line)) {
        matchedLines.push(line);
        matchedIndices.push(index);
      } else if (pattern === 'Modify Hindi Numerals' && /[\u0966-\u096F]/.test(line)) { 
        matchedLines.push(line);
        matchedIndices.push(index);
      } else if (pattern === 'Remove URLs' && urlRegex.test(line) && !pageBreakRegex.test(line)) {
        matchedLines.push(line);
        matchedIndices.push(index);
      } else if (pattern === 'Remove English Words' && englishWordRegex.test(line) && !pageBreakRegex.test(line)) {
        matchedLines.push(line);
        matchedIndices.push(index);
      } else if (pattern === 'Remove Special Characters' && specialCharRegex.test(line) && !pageBreakRegex.test(line)) {
        matchedLines.push(line);
        matchedIndices.push(index);
      }
    });
  
    setFilteredLines(matchedLines);
    setFilteredLineIndices(matchedIndices);
    setCurrentLine(0);
  };

  const handleUpClick = () => {
    setCurrentLine((prev) => Math.max(prev - 1, 0));
  };

  const handleDownClick = () => {
    setCurrentLine((prev) => Math.min(prev + 1, filteredLines.length - 1));
  };

  const handleMenuClick = (pattern) => {
    setSelectedPattern(pattern);
    setSuggestions([]); // Clear suggestions when changing pattern
  };

  const handleSuggestionClick = (suggestion) => {
    if (selectedWord && filteredLineIndices.length > 0) {
      const originalLineIndex = filteredLineIndices[currentLine];
      let updatedLine;

      if (suggestion === 'Remove URL') {
        updatedLine = lines[originalLineIndex].replace(selectedWord, '');
      } else if (suggestion === 'Remove English Word') {
        updatedLine = lines[originalLineIndex].replace(new RegExp(`\\b${selectedWord}\\b`, 'g'), '');
      } else if (suggestion === 'Remove Special Character') {
        updatedLine = lines[originalLineIndex].replace(new RegExp(`\\${selectedWord}`, 'g'), '');
      } else {
        updatedLine = lines[originalLineIndex].replace(selectedWord, suggestion);
      }

      const updatedLines = [...lines];
      updatedLines[originalLineIndex] = updatedLine;
      setLines(updatedLines);

      const updatedFilteredLines = [...filteredLines];
      updatedFilteredLines[currentLine] = updatedLine;
      setFilteredLines(updatedFilteredLines);

      setHighlightedText(updatedLine);
      setSelectedWord('');
      setSuggestions([]);
    }
  };

  const downloadModifiedText = () => {
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'modified_text.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <MenuSection
            selectedPattern={selectedPattern}
            handleMenuClick={handleMenuClick}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <TextEditor
              lines={lines}
              filteredLines={filteredLines}
              filteredLineIndices={filteredLineIndices}
              currentLine={currentLine}
              setCurrentLine={setCurrentLine}
              setHighlightedText={setHighlightedText}
              setSuggestions={setSuggestions}
              setSelectedWord={setSelectedWord}
              setLines={setLines}
            />
            <Box mt={2}>
              <Button variant="contained" onClick={handleUpClick}>Up</Button>
              <Button variant="contained" onClick={handleDownClick} sx={{ ml: 2 }}>Down</Button>
            </Box>
            <Box mt={2}>
              <GoogleTranslateRedirect />
            </Box>
  
            
            {suggestions.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap', // Wraps to the next line when space runs out
                  marginTop: 2,
                  gap: 1, // Adds some spacing between the buttons
                }}
              >
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      marginBottom: 1, // Spacing between rows
                      flex: '0 1 auto', // Allow the button to grow and shrink
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </Box>
            )}
            
  
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <OriginalTextViewer
            lines={lines}
            filteredLineIndices={filteredLineIndices}
            currentLine={currentLine}
          />
        </Grid>
      </Grid>
      <Box mt={2}>
        <Button variant="contained" onClick={downloadModifiedText}>Download Modified Text</Button>
        <Button variant="contained" onClick={uploadModifiedText} sx={{ ml: 2 }}>Upload to Server</Button>
      </Box>
    </Container>
  );
  
};

export default TextDisplay;
