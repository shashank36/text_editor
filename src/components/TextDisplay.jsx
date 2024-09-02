import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuSection from './MenuSection';
import TextEditor from './TextEditor';
import OriginalTextViewer from './OriginalTextViewer';
import config from '../../app_config';
import { Box, Flex, VStack, Heading, Button } from '@chakra-ui/react';

const TextDisplay = ({ text, sessionArea, filename }) => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState('');
  const [filteredLines, setFilteredLines] = useState([]);
  const [filteredLineIndices, setFilteredLineIndices] = useState([]);
  const [highlightedText, setHighlightedText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedWord, setSelectedWord] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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
    const urlRegex = /(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-&?=%.]+/g;
    const pageBreakRegex = /^=!pgB!=.*=!Epg!=/;
    const englishWordRegex = /\b[a-zA-Z]+\b/g;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
  
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
    setIsEditing(true);
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
    <Flex className="text-display-container" h="100vh" bg="gray.100">
      <Box className="sidebar" w="250px" bg="white" boxShadow="md" p={4}>
        <Heading as="h2" size="md" mb={4}>Text Correction Tools</Heading>
        <MenuSection 
          selectedPattern={selectedPattern} 
          setSelectedPattern={setSelectedPattern} 
        />
      </Box>
      <VStack className="main-content" flex={1} p={6} spacing={6} align="stretch">
        <Heading as="h1" size="xl">Text Correction Prototype v0.1</Heading>
        <Flex className="text-content-wrapper" flex={1} gap={6}>
          <Box className="text-editor-container" flex={1} bg="white" boxShadow="md" borderRadius="md" overflow="hidden">
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
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
            <Flex className="editor-controls" justifyContent="center" p={4} borderTop="1px" borderColor="gray.200">
              <Button onClick={handleUpClick} mr={2} colorScheme="blue">Up</Button>
              <Button onClick={handleDownClick} colorScheme="blue">Down</Button>
            </Flex>
          </Box>
          <Box className="original-viewer-container" flex={1}>
            <OriginalTextViewer 
              lines={lines}
              filteredLineIndices={filteredLineIndices}
              currentLine={currentLine}
            />
          </Box>
        </Flex>
        <Flex className="main-controls" justifyContent="center">
          <Button onClick={downloadModifiedText} mr={2} colorScheme="green">Download Modified Text</Button>
          <Button onClick={uploadModifiedText} colorScheme="green">Upload Modified Text</Button>
        </Flex>
        {suggestions.length > 0 && (
          <Box className="suggestions" bg="white" p={4} borderRadius="md" boxShadow="md">
            <Heading as="h4" size="md" mb={2}>Suggestions:</Heading>
            <Flex flexWrap="wrap">
              {suggestions.map((suggestion, index) => (
                <Button key={index} onClick={() => handleSuggestionClick(suggestion)} mr={2} mb={2} colorScheme="purple" variant="outline">
                  {suggestion}
                </Button>
              ))}
            </Flex>
          </Box>
        )}
      </VStack>
    </Flex>
  );
};

export default TextDisplay;