import React, { useState } from 'react';
import './styles/App.css'; // Import CSS for styling
import FileUpload from './components/FileUpload'; // File upload component

const App = () => {
  return (
    <div className="app-container">
      <h1 className="heading">JPEG to PDF Converter</h1>
      
      {/* Optional API header information */}
      <div className="api-info">
        <p>Upload your JPEG image and get a downloadable PDF.</p>
        {/* <p>Supported formats: JPEG, JPG</p> */}
      </div>
      
      <FileUpload />
    </div>
  );
};

export default App;
