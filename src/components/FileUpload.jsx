import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Typography, Paper } from '@mui/material';
import './FileUpload.css'; // If you still need custom styles

const FileUpload = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'text/plain' });

  return (
    <Paper
      {...getRootProps()}
      style={{
        width: '100%',
        padding: '20px',
        textAlign: 'center',
        border: '2px dashed #ccc',
        backgroundColor: '#fafafa',
      }}
    >
      <input {...getInputProps()} />
      <Typography variant="h6">
        {isDragActive ? "Drop the file here ..." : "Drag 'n' drop a text file here, or click to select a file"}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
        onClick={() => document.querySelector('input[type="file"]').click()}
      >
        Select File
      </Button>
    </Paper>
  );
};

export default FileUpload;
