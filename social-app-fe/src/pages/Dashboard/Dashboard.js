// Dashboard.js
import React, { useState, useEffect } from 'react';
import { useTokenContext } from '../../context/TokenContext';
import axios from 'axios';
import FileOrganizer from '../../components/FileOrganizer';
import { incrementView } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const { token, logout } = useTokenContext();
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [tags, setTags] = useState('');


    const handleView = async (id) => {
        await incrementView(id, token);
        setFileList((prev) =>
            prev.map((file) =>
                file._id === id ? { ...file, viewCount: file.viewCount + 1 } : file
            )
        );
    };

    useEffect(() => {
        fetchFileList();
    }, []);

    const fetchFileList = async () => {
        try {
            const response = await axios.get('http://localhost:6080/api/files/list', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFileList(response.data);
        } catch (error) {
            console.error('Error fetching file list:', error);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('tags', tags);

        try {
            await axios.post('http://localhost:6080/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            setSelectedFile(null)
            setTags(null)
            await fetchFileList();

        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="dashboard-container">
            <div className="logout-container">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            <h2>Dashboard</h2>

            <div className="upload-container">
                <h3>Upload File</h3>
                <input type="file" onChange={handleFileChange} />
                <input
                    type="text"
                    placeholder="Tags (comma-separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <button className="upload-button" onClick={handleFileUpload}>Upload</button>
            </div>

            <FileOrganizer files={fileList} setFiles={setFileList} />

        </div>
    );
};

export default Dashboard;
