// import React from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // Import Quill's snow theme
// import '../styles/TextEditor.css';

// const TextEditor = ({ value, onChange }) => {
//   return (
//     <div className="text-editor">
//       <ReactQuill theme="snow" value={value} onChange={onChange} />
//     </div>
//   );
// };

// export default TextEditor;


import React, { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's snow theme
import '../styles/TextEditor.css';

const TextEditor = ({ value, onChange }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const quillRef = useRef(null); // Use ref to access the Quill instance

  // Function to split text into lines
  const getLines = (text) => text.split('\n');

  // Function to highlight the current line
  const highlightLine = (lineIndex) => {
    const editor = quillRef.current.getEditor(); // Get the Quill editor instance
    const lines = getLines(value);

    // Handle looping at the start and end of the text
    if (lineIndex < 0) {
      setCurrentLine(lines.length - 1); // Loop back to the last line
      lineIndex = lines.length - 1;
    } else if (lineIndex >= lines.length) {
      setCurrentLine(0); // Loop back to the first line
      lineIndex = 0;
    }

    const start = value.split('\n', lineIndex).join('\n').length; // Calculate start index
    const end = start + lines[lineIndex].length;

    editor.formatText(0, value.length, { background: 'transparent' }); // Clear existing highlights
    editor.formatText(start, end, { background: '#ffff99' }); // Highlight the current line
  };

  // Handle Up button click
  const handleUpClick = () => {
    setCurrentLine((prevLine) => prevLine - 1);
  };

  // Handle Down button click
  const handleDownClick = () => {
    setCurrentLine((prevLine) => prevLine + 1);
  };

  // Highlight the new line when currentLine changes
  useEffect(() => {
    highlightLine(currentLine);
  }, [currentLine]);

  return (
    <div className="text-editor-container">
      <div className="editor-buttons">
        <button onClick={handleUpClick}>Up</button>
        <button onClick={handleDownClick}>Down</button>
      </div>
      <div className="text-editor">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          readOnly={true} // Make editor read-only
        />
      </div>
    </div>
  );
};

export default TextEditor;
