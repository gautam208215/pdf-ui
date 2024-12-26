// src/components/FileUpload.js
import React, { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return alert("Please choose a file to upload");

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    // Assuming the backend API is '/api/upload' (adjust URL as needed)
    fetch("http://localhost:8080/image/convert-jpg-to-pdf/v1", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setIsUploading(false);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        setIsUploading(false);
      });
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        accept="image/jpeg, image/jpg"
        onChange={handleFileChange}
        className="file-input"
      />
      <button
        className="upload-btn"
        onClick={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
      {downloadUrl && (
        <div className="download-section">
          <a href={downloadUrl} download="converted.pdf" className="download-btn">
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
