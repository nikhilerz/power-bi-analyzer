import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileSpreadsheet, X, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (selectedFile) => {
    const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx')) {
      setError('Please upload a valid CSV or Excel file.');
      return false;
    }
    if (selectedFile.size > 200 * 1024 * 1024) {
      setError('File size exceeds 200MB limit.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // We will create this endpoint in the backend
      const response = await axios.post('http://127.0.0.1:8000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      // Pass the dataset_id or results to the dashboard
      navigate('/dashboard', { state: { data: response.data } });
    } catch (err) {
      setError('Upload failed. Please make sure the backend server is running and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Upload Dataset</h2>
          <p className="text-slate-500 mt-2">Upload your CSV or Excel file to get instant Power BI recommendations.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {!file ? (
          <form 
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              accept=".csv, .xlsx, .xls"
              onChange={handleChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
              <UploadIcon className={`h-16 w-16 mb-4 ${dragActive ? 'text-primary-600' : 'text-slate-400'}`} />
              <span className="text-lg font-medium text-slate-700">
                Drag and drop your file here
              </span>
              <span className="text-sm text-slate-500 mt-2">
                or click to browse from your computer
              </span>
              <span className="text-xs text-slate-400 mt-4 block">
                Supports .CSV, .XLSX up to 200MB
              </span>
            </label>
          </form>
        ) : (
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary-100 p-3 rounded-lg text-primary-600">
                  <FileSpreadsheet className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 truncate max-w-xs">{file.name}</h3>
                  <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              
              {!isUploading && (
                <button 
                  onClick={() => setFile(null)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {isUploading && (
              <div className="mb-6">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-700">Uploading and Analyzing...</span>
                  <span className="text-primary-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`w-full bg-primary-500 text-slate-900 font-bold py-4 rounded-xl shadow-lg transition-all ${
                !file || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-400 hover:shadow-xl'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Analyze Dataset'
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Upload;
