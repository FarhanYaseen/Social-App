import React, { useState, useEffect } from 'react';
import { useTokenContext } from '../../context/TokenContext';
import axios from 'axios';
import FileOrganizer from '../../components/FileOrganizer';
import './Dashboard.css';

const Dashboard = () => {
    const { token, logout } = useTokenContext();
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');

    // Allowed file types
    const ALLOWED_FILE_TYPES = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'video/webm',
        'video/x-msvideo'
    ];

    // Maximum file size (10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    const validateFile = (file) => {
        if (!file) {
            setError('No file selected.');
            return false;
        }

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            setError('Invalid file type. Only images and videos are allowed.');
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError(`File is too large. Maximum file size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
            return false;
        }

        setError('');
        return true;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setError('');
        if (file && validateFile(file)) {
            setSelectedFile(file);
        } else {
            setSelectedFile(null);
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

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('tags', trimmedTags.join(','));

        try {
            await axios.post('http://localhost:6080/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            setSelectedFile(null);
            setTags('');
            setError('');
            await fetchFileList();
            alert('File uploaded successfully!');
        } catch (err) {
            console.error('Error uploading file:', err);
            if (err.response) {
                setError(err.response.data.message || 'Error uploading file. Please try again.');
            } else {
                setError('Error uploading file. Please check your connection and try again.');
            }
        }
    };

    const fetchFileList = async () => {
        try {
            const response = await axios.get('http://localhost:6080/api/files/list', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFileList(response.data);
        } catch (err) {
            console.error('Error fetching file list:', err);
            setError('Failed to fetch file list. Please try again later.');
        }
    };

    useEffect(() => {
        fetchFileList();
    }, []);

    const handleLogout = () => logout();

    return (
        <div className="dashboard-container">
            <div className="logout-container">
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <h2>Dashboard</h2>

            <div className="upload-container">
                <h3>Upload File</h3>
                <div className="file-input-container">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*, video/*"
                    />
                    {selectedFile && (
                        <div className="selected-file-info">
                            <p>Selected: {selectedFile.name}</p>
                            <p>Type: {selectedFile.type}</p>
                            <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                    )}
                </div>
                <input
                    type="text"
                    placeholder="Tags (comma-separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <button
                    className="upload-button"
                    onClick={handleFileUpload}
                    disabled={!selectedFile}
                >
                    Upload
                </button>
                {error && <p className="error-message">{error}</p>}
            </div>

            <FileOrganizer files={fileList} setFiles={setFileList} />
        </div>
    );
};

export default Dashboard;
