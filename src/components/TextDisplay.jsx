import React, { useState, useEffect,useRef } from 'react';
import { Container, Grid, Button, Box, Typography } from '@mui/material';
import TextEditor from './TextEditor';
import axios from 'axios';
import OriginalTextViewer from './OriginalTextViewer';
import MenuSection from './MenuSection';
import GoogleTranslateRedirect from './GoogleTranslateRedirect';
import './TextDisplay.css';
import config from '../../app_config';

const TextDisplay = ({ text, sessionArea, filename }) => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [highlightedText, setHighlightedText] = useState('');
  const [selectedWord, setSelectedWord] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState('');
  const [filteredLines, setFilteredLines] = useState([]);
  const [filteredLineIndices, setFilteredLineIndices] = useState([]);
  const textEditorRef = useRef(null);
  const [showCustomSuggestions, setShowCustomSuggestions] = useState(false);
  const [customSuggestionPosition, setCustomSuggestionPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setLines(text.split('\n'));
  }, [text]);

  useEffect(() => {
    if (selectedPattern) {
      applyPattern(selectedPattern);
    }
  }, [selectedPattern, lines]);

  useEffect(() => {
    if (textEditorRef.current) {
      textEditorRef.current.focus();
    }
  }, [selectedPattern]);

  const handleWhitespaceClick = () => {
    if (selectedPattern === 'Insert Suggestions') {
      setSuggestions([
        "CHAPTER_BREAKING_24422442",
        "।",
        ",",
        ":"
      ]);
    }
  };

  const handleCustomSuggestionClick = (suggestion) => {
    const updatedLines = [...lines];
    const currentLineIndex = filteredLineIndices[currentLine];
    updatedLines[currentLineIndex] += suggestion;
    setLines(updatedLines);
    setSuggestions([]);
  };

  const uploadModifiedText = () => {
    const content = lines.join('\n');
    let upload_url = config.uploadUrl;
    axios.post(upload_url, {
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
  
    lines.forEach((line, index) => {
      switch (pattern) {
        case 'Modify Number Hyphen':
          if (/-(\d|[\u0966-\u096F])/.test(line)) {
            matchedLines.push(line);
            matchedIndices.push(index);
          }
          break;
        case 'Modify Character Hyphen':
          if (/(\p{L})-(\p{L})/u.test(line)) {
            matchedLines.push(line);
            matchedIndices.push(index);
          }
          break;
        case 'Modify Hindi Short Forms':
          if (/(वं\.|वं०|पं\.|पं०|मि\.|मि०)/.test(line)) {
            matchedLines.push(line);
            matchedIndices.push(index);
          }
          break;
        case 'Modify Hindi Numerals':
          if (/[\u0966-\u096F]/.test(line)) {
            matchedLines.push(line);
            matchedIndices.push(index);
          }
          break;
        case 'Remove URLs':
          if (/(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-&?=%.]+/.test(line)) {
            matchedLines.push(line);
            matchedIndices.push(index);
          }
          break;
        case 'Remove English Words':
          if (/\b[a-zA-Z]+\b/.test(line)) {
            matchedLines.push(line);
            matchedIndices.push(index);
          }
          break;
        case 'Remove Special Characters':
          if (/[!@#$%^&*(),.?":{}|<>]/.test(line)) {
            matchedLines.push(line);
            matchedIndices.push(index);
          }
          break;
        
      }
    });
  
    setFilteredLines(matchedLines);
    setFilteredLineIndices(matchedIndices);
    setCurrentLine(0);
  };

  const handleUpClick = () => {
    setCurrentLine((prev) => Math.max(prev - 1, 0));
    if (textEditorRef.current) {
      textEditorRef.current.focus();
    }
  };

  const handleDownClick = () => {
    setCurrentLine((prev) => Math.min(prev + 1, filteredLines.length - 1));
    if (textEditorRef.current) {
      textEditorRef.current.focus();
    }
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
          <Box sx={{ position: 'relative' }}>
          <TextEditor
            ref={textEditorRef}
            lines={lines}
            filteredLines={filteredLines}
            filteredLineIndices={filteredLineIndices}
            currentLine={currentLine}
            setCurrentLine={setCurrentLine}
            setHighlightedText={setHighlightedText}
            setSuggestions={setSuggestions}
            setSelectedWord={setSelectedWord}
            setLines={setLines}
            selectedPattern={selectedPattern}
            onWhitespaceClick={handleWhitespaceClick}
            isInsertSuggestions={selectedPattern === 'Insert Suggestions'}
          />
             {showCustomSuggestions && (
              <CustomSuggestions
              position={customSuggestionPosition}
              onSuggestionClick={handleCustomSuggestionClick}
            />
          )}
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
                  flexWrap: 'wrap',
                  marginTop: 2,
                  gap: 1,
                }}
              >
              {suggestions.map((suggestion, index) => (
            <Button
        key={index}
        variant="outlined"
        onClick={() => selectedPattern === 'Insert Suggestions' 
          ? handleCustomSuggestionClick(suggestion) 
          : handleSuggestionClick(suggestion)
        }
        sx={{
          marginBottom: 1,
          flex: '0 1 auto',
        }}
      >
        {suggestion === "CHAPTER_BREAKING_24422442" ? "Add chapter break" : suggestion}
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
