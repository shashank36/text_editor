import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { getSuggestionsFromTrie } from './trieUtils'; // Updated import

const TextEditor = ({ highlightedText, setHighlightedText }) => {
  const [selectedWord, setSelectedWord] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [editableText, setEditableText] = useState(highlightedText);

  useEffect(() => {
    setEditableText(highlightedText);
  }, [highlightedText]);

  const handleTextSelect = (event) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (selectedText) {
      setSelectedWord(selectedText);
      // Provide suggestions
      const suggestionList = getSuggestionsFromTrie(selectedText);
      setSuggestions(suggestionList);
    } else {
      setSelectedWord('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const updatedText = editableText.replace(selectedWord, suggestion);
    setHighlightedText(updatedText);
    setEditableText(updatedText);
    setSelectedWord('');
    setSuggestions([]);
  };

  return (
    <Box sx={{ backgroundColor: '#e0e0e0', padding: 2 }}>
      <Typography variant="h6">Edit Highlighted Text</Typography>
      <TextField
        value={editableText}
        onChange={(e) => {
          setEditableText(e.target.value);
          setHighlightedText(e.target.value);
        }}
        fullWidth
        multiline
        rows={6}
        variant="outlined"
        sx={{ marginBottom: 2 }}
        onMouseUp={handleTextSelect}
      />
      <Box>
        {suggestions.length > 0 && (
          <Box sx={{ marginTop: 2 }}>
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outlined"
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{ display: 'block', marginBottom: 1 }}
              >
                {suggestion}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TextEditor;
