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
  setLines,
  selectedPattern,
  onWhitespaceClick,
  isInsertSuggestions,
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

  const handleWhitespaceClick = (event) => {
    const lineElement = event.target.closest('p');
    if (lineElement && lineElement.classList.contains('highlight')) {
      onWhitespaceClick();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCurrentLine((prevLine) => Math.max(0, prevLine - 1));
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCurrentLine((prevLine) => Math.min(filteredLines.length - 1, prevLine + 1));
    }
  };

  

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

    if (selectedText && selection.anchorNode.parentElement.classList.contains('highlight')) {
      setSelectedWord(selectedText);
      setHighlightedText(filteredLines[currentLine]);

      switch (selectedPattern) {
        case 'Modify Number Hyphen':
          if (/-(\d|[\u0966-\u096F])/.test(selectedText)) {
            setSuggestions([selectedText.replace(/-(\d|[\u0966-\u096F])/, '- $1')]);
          }
          break;
        case 'Modify Character Hyphen':
          if (/(\p{L})-(\p{L})/u.test(selectedText)) {
            setSuggestions(generateHyphenSuggestions(selectedText));
          }
          break;
        case 'Modify Hindi Short Forms':
          if (/वं\.|वं०/.test(selectedText)) {
            setSuggestions(['वंदनीया', 'वंदनीय']);
          } else if (/पं\.|पं०/.test(selectedText)) {
            setSuggestions(['पंडित']);
          } else if (/मि\.|मि०/.test(selectedText)) {
            setSuggestions(['मिस्टर']);
          }
          break;
        case 'Modify Hindi Numerals':
          if (/[\u0966-\u096F]/.test(selectedText)) {
            setSuggestions(getHindiNumeralSuggestions(selectedText));
          }
          break;
        case 'Remove URLs':
          if (/(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-&?=%.]+/.test(selectedText)) {
            setSuggestions(['Remove URL']);
          }
          break;
        case 'Remove English Words':
          if (/\b[a-zA-Z]+\b/.test(selectedText)) {
            setSuggestions(['Remove English Word']);
          }
          break;
        case 'Remove Special Characters':
          if (/[!@#$%^&*(),.?":{}|<>]/.test(selectedText)) {
            setSuggestions(['Remove Special Character']);
          }
          break;
        default:
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
      onClick={handleWhitespaceClick}
    > 
      {(isInsertSuggestions ? lines : filteredLines).map((line, index) => (
        <Typography
          key={index}
          ref={(el) => (lineRefs.current[index] = el)}
          variant="body1"
          component="p"
          className={
            index === (isInsertSuggestions ? index : currentLine)
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