// src/App.js
import React, { useState } from 'react';
import './styles/App.css'; // Import CSS for styling
import FileUpload from './components/FileUpload'; // File upload component

const App = () => {
  return (
    <div className="app-container">
      <h1 className="heading">JPEG to PDF Converter</h1>
      <FileUpload />
    </div>
  );
};

export default App;
