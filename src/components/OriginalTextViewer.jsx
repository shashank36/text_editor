import React, { useRef, useEffect } from 'react';
import './OriginalTextViewer.css';
import { Box, Text, VStack } from '@chakra-ui/react';

const OriginalTextViewer = ({ lines, filteredLineIndices, currentLine }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (viewerRef.current && filteredLineIndices.length > 0) {
      const lineElements = viewerRef.current.querySelectorAll('p');
      const currentLineIndex = filteredLineIndices[currentLine];
      if (lineElements[currentLineIndex]) {
        lineElements[currentLineIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentLine, filteredLineIndices]);

  return (
    <Box 
      ref={viewerRef} 
      className="original-text-viewer"
      borderWidth={1}
      borderColor="gray.300"
      borderRadius="md"
      p={4}
      bg="gray.50"
      overflowY="auto"
      h="100%"
    >
      <VStack spacing={0} align="stretch">
        {lines.map((line, index) => (
          <Text
            key={index}
            className={filteredLineIndices.includes(index) ? 'highlight' : ''}
            p={2}
            bg={filteredLineIndices[currentLine] === index ? 'yellow.200' : 
                filteredLineIndices.includes(index) ? 'yellow.100' : 'transparent'}
          >
            {line}
          </Text>
        ))}
      </VStack>
    </Box>
  );
};

export default OriginalTextViewer;