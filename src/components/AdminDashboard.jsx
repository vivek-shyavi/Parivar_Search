
import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Upload, CheckCircle, XCircle } from 'lucide-react';
import { BASE_URL } from '../config/api.config';

const MainContent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadStatus(null);
      setShowSuccess(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${BASE_URL}/upload-excel`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus({
          type: 'success',
          message: data.message
        });
        setShowSuccess(true);
        setSelectedFile(null);
        const fileInput = document.getElementById('file-upload');
        if (fileInput) fileInput.value = '';
      } else {
        setUploadStatus({
          type: 'error',
          message: data.message || 'Upload failed'
        });
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: 'Error uploading file: ' + error.message
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="flex-grow bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back, Admin!
          </h1>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-700">File uploaded successfully!</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {uploadStatus?.type === 'error' && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700">{uploadStatus.message}</span>
            </div>
          </div>
        )}

        {/* File Upload Widget */}
        <form onSubmit={handleUpload} className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <FileSpreadsheet className="mx-auto h-12 w-12 text-orange-600" />
            <h2 className="mt-4 text-2xl font-semibold text-gray-900">Upload Excel File</h2>
            <p className="mt-2 text-sm text-gray-600">
              Upload an Excel file containing genealogy records
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-600 bg-orange-50 hover:bg-orange-100"
              >
                <Upload className="mr-2 h-5 w-5" />
                Choose from File Explorer
              </label>
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                selectedFile && !uploading
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default MainContent;