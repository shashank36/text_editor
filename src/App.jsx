import React, { useState } from 'react';
import TextEditor from './components/TextEditor';
import DragDropArea from './components/DragDropArea';
import './styles/App.css';

function App() {
  const [text, setText] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleFileDrop = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setText(e.target.result);
      setFileUploaded(true);
    };
    reader.readAsText(file);
  };

  return (
    <div className="App">
      {!fileUploaded ? (
        <DragDropArea onFileDrop={handleFileDrop} />
      ) : (
        <TextEditor value={text} onChange={setText} />
      )}
    </div>
  );
}

export default App;
