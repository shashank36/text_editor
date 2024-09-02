import React, { useState } from 'react';
// import './GoogleTranslateRedirect.css';

const GoogleTranslateRedirect = () => {
  const [text, setText] = useState('');

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleTranslate = () => {
    const encodedText = encodeURIComponent(text);
    const translateUrl = `https://translate.google.com/?sl=auto&tl=hi&text=${encodedText}`;
    window.open(translateUrl, '_blank');
  };

  return (
    <div className="google-translate-redirect">
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Paste Text Here"
        rows={4}
      />
      <button onClick={handleTranslate}>
        Hear How Your Changes Sound
      </button>
    </div>
  );
};

export default GoogleTranslateRedirect;