import React, { useState, useEffect } from 'react';
import { useTokenContext } from '../../context/TokenContext';
import { uploadFile } from '../../services/api';
import { validateFile } from '../../utils/fileValidation';
import './FileUploader.css';

const FileUploader = ({ fetchFileList, setError }) => {
    const { token } = useTokenContext();
    const [selectedFile, setSelectedFile] = useState(null);
    const [tags, setTags] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setError('');
        setSelectedFile(null);
        setPreviewUrl('');

        if (file && validateFile(file)) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setError('Please select a valid file to upload.');
            return;
        }

        if (!tags.trim()) {
            setError('Please provide at least one tag.');
            return;
        }

        const trimmedTags = tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);

        if (trimmedTags.length === 0) {
            setError('Tags must be comma-separated and non-empty.');
            return;
        }

        try {
            await uploadFile(selectedFile, trimmedTags.join(','), token);
            setSelectedFile(null);
            setTags('');
            setPreviewUrl('');
            setError('');
            alert('File uploaded successfully!');
            document.querySelector('input[type="file"]').value = '';
            await fetchFileList();
        } catch (err) {
            console.error('Error uploading file:', err);
            setError('Error uploading file. Please try again later.');
            alert('Error uploading file. Please try again later.');
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <div className="upload-container">
            <h3>Upload File</h3>
            <div className="file-input-container">
                <input type="file" onChange={handleFileChange} accept="image/*, video/*" />
                {selectedFile && (
                    <div className="selected-file-info">
                        <p>Selected: {selectedFile.name}</p>
                        <p>Type: {selectedFile.type}</p>
                        <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                )}
            </div>
            {previewUrl && (
                <div className="preview-container">
                    {selectedFile.type.startsWith('image/') ? (
                        <img src={previewUrl} alt="Preview" className="file-preview" />
                    ) : (
                        <video src={previewUrl} type={selectedFile.type} controls className="file-preview" preload="metadata" />
                    )}
                </div>
            )}
            <input type="text" placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
            <button className="upload-button" onClick={handleFileUpload} disabled={!selectedFile}>
                Upload
            </button>
        </div>
    );
};

export default FileUploader;
