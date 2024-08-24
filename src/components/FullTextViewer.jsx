import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const FullTextViewer = ({ text, onWhitespaceClick, onInsertChapterBreak }) => {
  const handleClick = (e) => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rects = range.getClientRects();

    if (rects.length > 0) {
      const rect = rects[0];
      const { top, bottom, left, right } = rect;
      const isWhitespace = range.toString().trim() === '';

      if (isWhitespace) {
        onWhitespaceClick(rect);
      }
    }
  };

  return (
    <Box
      sx={{ width: '100%', height: '100vh', overflow: 'scroll', backgroundColor: '#f5f5f5' }}
      onMouseUp={handleClick}
    >
      <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
        {text}
      </Typography>
    </Box>
  );
};

export default FullTextViewer;