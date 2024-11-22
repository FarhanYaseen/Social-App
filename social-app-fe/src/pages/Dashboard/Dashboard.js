import React, { useEffect, useState } from 'react';
import { useTokenContext } from '../../context/TokenContext';
import FileUploader from '../../components/FileUploader/FileUploader';
import FileList from '../../components/FileList/FileList';
import { fetchFiles } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const { token, logout } = useTokenContext();
    const [fileList, setFileList] = useState([]);
    const [error, setError] = useState('');

    const fetchFileList = async () => {
        try {
            const response = await fetchFiles(token);
            setFileList(response);
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
                <span className="page-name">Dashboard</span>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <FileUploader fetchFileList={fetchFileList} setError={setError} />
            {error && <p className="error-message">{error}</p>}
            {fileList?.length > 0 && <FileList files={fileList} setFiles={setFileList} />}
        </div>
    );
};

export default Dashboard;
