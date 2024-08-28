import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import TextDisplay from './components/TextDisplay';
import ExplainerSection from './components/ExplainerSection';

function App() {
  const [text, setText] = useState('');
  const location = useLocation();
  const [successfulSessionArea, setSuccessfulSessionArea] = useState('');
  const [successfulFilename, setSuccessfulFilename] = useState('');

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setText(e.target.result);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const fileParam = queryParams.get('file');

    if (fileParam) {
      // Decode the file parameter
      const decodedParam = decodeURIComponent(fileParam);

      // Clean up the file parameter to extract the session area and filename
      const cleanedParam = decodedParam.replace(/[{}'"]/g, '').split(',');
      let sessionArea = cleanedParam[0]?.trim();
      let filename = cleanedParam[1]?.trim();

      // Ensure filename ends with '.txt' and remove any trailing text
      const txtExtensionIndex = filename.lastIndexOf('.txt');
      if (txtExtensionIndex !== -1) {
        filename = filename.substring(0, txtExtensionIndex + 4); // Keep .txt extension
      }
      if (filename.length > txtExtensionIndex + 4) {
        filename = filename.substring(0, txtExtensionIndex + 4); // Remove trailing text after .txt
      }

      // Function to fetch file content
      const fetchFileContent = (sessionArea, filename) => {
        const downloadUrl = `http://127.0.0.1:8000/download2/${sessionArea}|${filename}`;

        axios.get(downloadUrl)
          .then((response) => {
            setText(response.data.file_content);
            setSuccessfulSessionArea(sessionArea);
            setSuccessfulFilename(filename);
          })
          .catch((error) => {
            console.error('There was a problem fetching the file:', error);
            setText('Error fetching file content.');

            // Try swapping sessionArea and filename
            const swappedUrl = `http://127.0.0.1:8000/download2/${filename}|${sessionArea}`;
            axios.get(swappedUrl)
              .then((response) => {
                setText(response.data.file_content);
                setSuccessfulSessionArea(filename);
                setSuccessfulFilename(sessionArea);
              })
              .catch((error) => {
                console.error('There was a problem fetching the file with swapped parameters:', error);
                setText('Error fetching file content with swapped parameters.');
              });
          });
      };

      // Try with the initial order
      fetchFileContent(sessionArea, filename);
    }
  }, [location.search]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 2,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Text Correction Prototype v0.1
      </Typography>
      {!text ? (
        <>
          <ExplainerSection />
          <FileUpload onFileUpload={handleFileUpload} />
        </>
      ) : (
        <TextDisplay
          text={text} 
          sessionArea={successfulSessionArea} 
          filename={successfulFilename}
        />
      )}
    </Container>
  );
}

export default App;
