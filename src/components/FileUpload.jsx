import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileUpload.css';

const FileUpload = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'text/plain' });

  return (
    <div {...getRootProps()} className="file-upload">
      <input {...getInputProps()} />
      <p>{isDragActive ? "Drop the file here ..." : "Drag 'n' drop a text file here, or click to select a file"}</p>
      <button className="select-file-btn" onClick={() => document.querySelector('input[type="file"]').click()}>
        Select File
      </button>
    </div>
  );
};

export default FileUpload;
