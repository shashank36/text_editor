import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import TextDisplay from './components/TextDisplay';
import ExplainerSection from './components/ExplainerSection';
import config from '../app_config';

// Function to extract values from URL
function extractValuesFromURL(url) {
  const urlObject = new URL(url);
  const fileParam = urlObject.searchParams.get('file');

  if (fileParam) {
    const decodedParam = decodeURIComponent(fileParam);

    try {
      const cleanedParam = decodedParam
        .replace(/[{}']/g, '')
        .split(',')
        .map(item => item.trim());

      const [filename, sessionArea] = cleanedParam;
      console.log("FileName: " + filename);
      console.log("SessionArea: " + sessionArea);
      return { filename, sessionArea };
    } catch (error) {
      console.error('Error parsing the file parameter:', error);
      return { filename: null, sessionArea: null };
    }
  } else {
    return { filename: null, sessionArea: null };
  }
}

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
    const queryString = location.search;
    let { filename, sessionArea } = extractValuesFromURL(`http://localhost:8083${queryString}`);

    if (filename && sessionArea) {
      // Ensure filename ends with '.txt' and remove any trailing text
      const txtExtensionIndex = filename.lastIndexOf('.txt');
      if (txtExtensionIndex !== -1) {
        filename = filename.substring(0, txtExtensionIndex + 4); // Keep .txt extension
      }

      console.log("Filename: ", filename);

      // Function to fetch file content
      const fetchFileContent = (sessionArea, filename) => {
        const downloadUrlPre = config.downloadUrl;

        // Encode sessionArea and filename to prevent broken links due to spaces or special characters
        const encodedSessionArea = encodeURIComponent(sessionArea);
        const encodedFilename = encodeURIComponent(filename);

        const downloadUrl = `${downloadUrlPre}${encodedSessionArea}|${encodedFilename}`;
        console.log("Download URL:", downloadUrl);

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
            const swappedUrl = `${downloadUrlPre}${encodedFilename}|${encodedSessionArea}`;
            console.log("Swapped URL:", swappedUrl);

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
