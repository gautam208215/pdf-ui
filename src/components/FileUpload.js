import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === "image/jpeg" || selectedFile.type === "image/jpg")) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
      setDownloadUrl(null);
    } else {
      alert("Only JPEG files are allowed.");
    }
  };

  const formatBytes = (bytes) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const handleUpload = () => {
    if (!file) return alert("Please choose a file to upload");

    // Start the uploading UI state immediately
    setIsUploading(true);
    setUploadProgress(0);
    setUploadSpeed(0);
    setStartTime(Date.now());
    setUploadedBytes(0);
    setTotalBytes(file.size);

    // Reset the conversion progress before upload starts
    setIsProcessing(false);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8080/image/convert-jpg-to-pdf/v1", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
        const progress = (event.loaded / event.total) * 100;
        setUploadProgress(progress);
        setUploadedBytes(event.loaded);
        setTotalBytes(event.total);

        // Calculate upload speed in KB/s
        if (elapsedTime > 0) {
          const speed = (event.loaded - uploadedBytes) / elapsedTime; // Bytes per second
          setUploadSpeed(speed / 1024); // Convert to KB/s
        }
      }
    };

    xhr.onload = () => {
      // Only show "Conversion in Progress" after upload completes (100% progress)
      if (xhr.status === 200) {
        setIsUploading(false); // End uploading state
        setUploadProgress(100); // Set upload progress to 100%
        setIsProcessing(true); // Start conversion in progress state

        setTimeout(() => {
          const blob = xhr.response;
          const url = URL.createObjectURL(blob);
          setDownloadUrl(url); // Simulate a successful response from the server
          setIsProcessing(false); // End processing state after conversion is "complete"
        }, 3000); // Simulated backend delay (3 seconds)
      } else {
        console.error("Error uploading file:", xhr.statusText);
      }
    };

    xhr.onerror = () => {
      console.error("Error uploading file.");
      setIsUploading(false);
      setUploadProgress(0);
    };

    xhr.responseType = "blob";
    xhr.send(formData);
  };

  const handleConvertMore = () => {
    setFile(null);
    setFilePreview(null);
    setDownloadUrl(null);
    setUploadProgress(0);
    setUploadSpeed(0);
    setIsProcessing(false);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
    setDownloadUrl(null);
    setUploadProgress(0);
    setUploadSpeed(0);
    setIsProcessing(false);
  };

  return (
    <div className="file-upload-container">
      <div className="drop-zone">
        {file ? (
          <div className="file-preview">
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

      {!file && (
        <label htmlFor="fileInput" className="upload-btn">
          Select File
        </label>
      )}

      {file && !downloadUrl && (
        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={isUploading || isProcessing}
        >
          {isUploading
            ? "Uploading..."
            : isProcessing
            ? "Conversion in Progress..."
            : "Convert to PDF"}
        </button>
      )}

      {isUploading && (
        <div>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: `${uploadProgress}%`,
                backgroundColor: uploadProgress < 50 ? "red" : uploadProgress < 90 ? "orange" : "green",
              }}
            />
          </div>
          <div className="upload-status">
            <p>
              {formatBytes(uploadedBytes)} / {formatBytes(totalBytes)} uploaded ({uploadProgress.toFixed(2)}%)
            </p>
            <p>Upload Speed: {uploadSpeed.toFixed(2)} KB/s</p>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="processing-state">
          <p>Conversion in progress... Please wait.</p>
          <div className="loader" />
        </div>
      )}

      {downloadUrl && (
        <div className="download-section">
          <a href={downloadUrl} download="converted.pdf" className="download-btn">
            Download PDF
          </a>
          <br />
          <button className="upload-btn" onClick={handleConvertMore}>
            Convert More
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
