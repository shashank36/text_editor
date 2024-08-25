import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import './TextDisplay.css';

const TextEditor = ({ 
  lines, 
  filteredLines, 
  filteredLineIndices, 
  currentLine, 
  setCurrentLine, 
  setHighlightedText, 
  setSuggestions, 
  setSelectedWord,
  setLines 
}) => {
  const containerRef = useRef(null);
  const lineRefs = useRef([]);

  useEffect(() => {
    if (lineRefs.current[currentLine]) {
      const container = containerRef.current;
      const lineElement = lineRefs.current[currentLine];

      const lineRect = lineElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (lineRect.top < containerRect.top) {
        container.scrollTop -= (containerRect.top - lineRect.top);
      } else if (lineRect.bottom > containerRect.bottom) {
        container.scrollTop += (lineRect.bottom - containerRect.bottom);
      }
    }
  }, [currentLine]);

  const handleTextSelect = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
  
    if (selectedText && selection.anchorNode.parentElement.classList.contains('highlight')) {
      setSelectedWord(selectedText);
      setHighlightedText(filteredLines[currentLine]);
      // Log the selected word
      console.log("Selected Word:", selectedText);
  
      // Add logic for suggestions based on pattern
      if (/-(\d|\p{Nd})/u.test(selectedText)) {
        setSuggestions([selectedText.replace(/-(\d|\p{Nd})/u, '- $1')]);
      } else if (/([a-zA-Z])\-([a-zA-Z])/.test(selectedText)) {
        setSuggestions([selectedText.replace(/([a-zA-Z])\-([a-zA-Z])/, '$1 - $2')]);
      } else if (/वं\.|वं०/.test(selectedText)) {
        setSuggestions(['वंदनीया', 'वंदनीय']);
      } else if (/पं\.|पं०/.test(selectedText)) {
        setSuggestions(['पंडित']);
      } else if (/मि\.|मि०/.test(selectedText)) {
        setSuggestions(['मिस्टर']);
      } else {
        setSuggestions([]);
      }
    } else {
      setSelectedWord('');
      setSuggestions([]);
      setHighlightedText('');
    }
  };
  
  return (
    <Box
      ref={containerRef}
      className="text-display"
      sx={{ overflowY: 'auto', height: '400px', backgroundColor: '#f0f0f0', padding: 2 }}
      onMouseUp={handleTextSelect}
    >
      {filteredLines.map((line, index) => (
        <Typography
          key={index}
          ref={(el) => (lineRefs.current[index] = el)}
          variant="body1"
          component="p"
          className={index === currentLine ? 'highlight' : ''}
          sx={{ padding: '4px 0' }}
        >
          {line}
        </Typography>
      ))}
    </Box>
  );
};

export default TextEditor;