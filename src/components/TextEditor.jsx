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
    console.log('TextEditor :', lines[filteredLineIndices[currentLine]]);
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
          className={
            index === currentLine
              ? 'highlight'
              : index % 2 === 0
              ? 'even-line'
              : 'odd-line'
          }
          sx={{ padding: '4px 0' }}
        >
          {line}
        </Typography>
      ))}
    </Box>
  );
};

export default TextEditor;