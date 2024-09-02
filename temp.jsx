const handleTextSelect = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
  
    if (selectedText && selection.anchorNode.parentElement.classList.contains('highlight')) {
      setSelectedWord(selectedText);
      setHighlightedText(filteredLines[currentLine]);
  
      // Provide suggestions based on the selected pattern
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