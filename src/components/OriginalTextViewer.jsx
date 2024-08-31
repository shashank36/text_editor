import React, { useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import './TextDisplay.css';

const OriginalTextViewer = ({ lines, filteredLineIndices, currentLine }) => {
  const containerRef = useRef(null);
  const lineRefs = useRef([]);

  // Map currentLine to the correct index in filteredLineIndices
  const highlightIndex = filteredLineIndices[currentLine];

  useEffect(() => {
    if (highlightIndex !== undefined && lineRefs.current[highlightIndex]) {
      const container = containerRef.current;
      const lineElement = lineRefs.current[highlightIndex];

      // Scroll to make the highlighted line visible in the center of the container
      const lineRect = lineElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (lineRect.top < containerRect.top || lineRect.bottom > containerRect.bottom) {
        const offset = lineRect.top - containerRect.top;
        container.scrollTop += offset - containerRect.height / 2 + lineRect.height / 2;
      }
    }
    console.log("Original: ", lines[highlightIndex]);

  }, [highlightIndex]);

  return (
    <Box
      ref={containerRef}
      className="text-display-original"
      sx={{ 
        overflowY: 'auto', 
        height: 'calc(100vh - 48px)', // Adjusted height to fit the viewport
        width: '35vw',    // Adjust width as needed
        backgroundColor: '#ffffff', 
        padding: 2, 
        borderLeft: '1px solid #ccc' // Add a border to separate from TextEditor
      }}
    >
      {lines.map((line, index) => (
        <Typography
          key={index}
          ref={(el) => (lineRefs.current[index] = el)}
          variant="body1"
          component="p"
          className={index === highlightIndex ? 'highlight' : ''}
          sx={{ padding: '4px 0' }}
        >
          {line}
        </Typography>
      ))}
    </Box>
  );
};

export default OriginalTextViewer;
