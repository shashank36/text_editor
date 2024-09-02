import React, { useRef, useEffect } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import './TextEditor.css';
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
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      const lineElements = editorRef.current.querySelectorAll('p');
      if (lineElements[currentLine]) {
        lineElements[currentLine].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentLine]);


  const getHindiNumeralSuggestions = (selectedNumeral) => {
    const hindiNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return hindiNumerals.filter(numeral => numeral !== selectedNumeral);
  };
  
  const generateHyphenSuggestions = (selectedText) => {
    // Extract the parts of the text around the hyphen
    const parts = selectedText.split('-');
    if (parts.length !== 2) {
      return []; // Return empty array if the text does not have exactly one hyphen
    }
  
    const [part1, part2] = parts.map(part => part.trim());
  
    // Generate all possible suggestions
    return [
      `${part1} - ${part2}`,   // word - word
      `${part1}- ${part2}`,    // word- word
      `${part1} -${part2}`,    // word -word
      `${part1}-${part2}`,     // word-word
      `${part1}:- ${part2}`,    // word: word (using colon as an example of a delimiter)
    ];
  };

  const handleTextSelect = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    const urlRegex = /(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-&?=%.]+/g;
    const englishWordRegex = /\b[a-zA-Z]+\b/g;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;



  
    if (selectedText && selection.anchorNode.parentElement.classList.contains('highlight')) {
      setSelectedWord(selectedText);
      setHighlightedText(filteredLines[currentLine]);
  
      // Provide suggestions based on the selected pattern
      if (/-(\d|\p{Nd})/u.test(selectedText)) {
        setSuggestions([selectedText.replace(/-(\d|\p{Nd})/u, '- $1')]);
      } else if (/([a-zA-Z])\-([a-zA-Z])/.test(selectedText)) {
        setSuggestions(generateHyphenSuggestions(selectedText));
      } else if (/वं\.|वं०/.test(selectedText)) {
        setSuggestions(['वंदनीया', 'वंदनीय']);
      } else if (/पं\.|पं०/.test(selectedText)) {
        setSuggestions(['पंडित']);
      } else if (/मि\.|मि०/.test(selectedText)) {
        setSuggestions(['मिस्टर']);
      } else if (/[\u0966-\u096F]/.test(selectedText)) { // Check for Hindi numerals
        setSuggestions(getHindiNumeralSuggestions(selectedText));
      } else if (urlRegex.test(selectedText)) {
        setSuggestions(['Remove URL']);
      } else if (englishWordRegex.test(selectedText)) {
        setSuggestions(['Remove English Word']);
      } else if (specialCharRegex.test(selectedText)) {
        setSuggestions(['Remove Special Character']);
      } else {
        setSuggestions([]);
      }
    } else {
      setSelectedWord('');
      setSuggestions([]);
      setHighlightedText('');
    }
  };

  const handleLineEdit = (index, newContent) => {
    const updatedLines = [...lines];
    updatedLines[filteredLineIndices[index]] = newContent;
    setLines(updatedLines);
  };

  return (
    <Box 
      ref={editorRef}
      className="text-editor"
      onMouseUp={handleTextSelect}
      h="100%"
      overflowY="auto"
    >
      <VStack spacing={0} align="stretch">
        {filteredLines.map((line, index) => (
          <Text
            key={index}
            className={index === currentLine ? 'highlight' : ''}
            p={2}
            bg={index === currentLine ? 'yellow.100' : 'transparent'}
            borderBottom="1px dashed"
            borderColor="gray.200"
            _hover={{ bg: 'blue.50' }}
            cursor="pointer"
            onClick={() => setCurrentLine(index)}
          >
            {line}
          </Text>
        ))}
      </VStack>
    </Box>
  );
};

export default TextEditor;