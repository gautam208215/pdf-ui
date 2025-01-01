import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // To store the preview URL
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === "image/jpeg" || selectedFile.type === "image/jpg")) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile)); // Generate a preview URL
      setDownloadUrl(null); // Reset download URL when a new file is selected
    } else {
      alert("Only JPEG files are allowed.");
    }
  };

  const handleUpload = () => {
    if (!file) return alert("Please choose a file to upload");

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://54.237.227.128:8080/image/convert-jpg-to-pdf/v1", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url); // Set the download URL for the PDF
        setIsUploading(false);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        setIsUploading(false);
      });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleConvertMore = () => {
    // Reset everything for the user to select another file
    setFile(null);
    setFilePreview(null);
    setDownloadUrl(null);
  };


  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "image/jpeg" || droppedFile.type === "image/jpg")) {
      setFile(droppedFile);
      setFilePreview(URL.createObjectURL(droppedFile)); // Generate a preview URL
      setDownloadUrl(null); // Reset download URL on new drop
    } else {
      alert("Only JPEG files are allowed.");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null); // Clear the preview
    setDownloadUrl(null); // Reset download URL
  };

  return (
    <div className="">
      <div
        className={`drop-zone ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="file-preview">
            {/* Image Preview Section */}
            <img src={filePreview} alt="Preview" className="image-preview" />
            <div className="file-info">
              <p>{file.name}</p>
              <button className="remove-btn" onClick={handleRemoveFile}>
                ✕
              </button>
            </div>
          </div>
        ) : (
          <p>Drag and drop an image here, or click to select a file</p>
        )}
      </div>

      {/* File Input Hidden (for selecting files manually) */}
      {!file && (
        <input
          type="file"
          accept="image/jpeg, image/jpg"
          onChange={handleFileChange}
          className="file-input"
          style={{ display: "none" }}
          id="fileInput"
        />
      )}

      {/* File Selection Button */}
      {!file && (
        <label htmlFor="fileInput" className="upload-btn">
          Select File
        </label>
      )}

      {/* Convert Button */}
      {file && !downloadUrl && (
        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Convert to PDF"}
        </button>
      )}

      {/* Download Link */}
      {downloadUrl && (
        <div className="download-section">
          <a href={downloadUrl} download="converted.pdf" className="download-btn">
            Download PDF
          </a>
          <br></br>
            {/* Convert More Button */}
            <button className="upload-btn" onClick={handleConvertMore}>
            Convert More
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
