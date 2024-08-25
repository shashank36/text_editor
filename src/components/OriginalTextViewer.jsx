import React, { useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import './TextDisplay.css';

const OriginalTextViewer = ({ lines, filteredLineIndices, currentLine }) => {
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

  return (
    <Box
      ref={containerRef}
      className="text-display-original"
      sx={{ 
        overflowY: 'auto', 
        height: 'calc(100vh - 48px)', // Adjusted height to fit the viewport
        width: '35vw',    // Adjust width as needed
        backgroundColor: '#e0e0e0', 
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
          className={filteredLineIndices.includes(index) && index === currentLine ? 'highlight' : ''}
          sx={{ padding: '4px 0' }}
        >
          {line}
        </Typography>
      ))}
    </Box>
  );
};

export default OriginalTextViewer;
