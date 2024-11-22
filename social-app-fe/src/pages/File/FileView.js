import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './FileView.css';
import { fetchFileUrl, incrementViewByFileView } from '../../services/api';

const FileView = () => {
    const { fileId } = useParams();
    const [fileUrl, setFileUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        if (!fileId) {
            setLoading(false);
            setError('Invalid file ID');
            return;
        }

        const fetchFile = async () => {
            try {
                const url = await fetchFileUrl(fileId);
                setFileUrl(url);
                incrementViewByFileView(fileId);
                setLoading(false);

            } catch (error) {
                setLoading(false);
                setError('Error fetching file');
                console.error('Error fetching file:', error);
            }
        };
        fetchFile();
    }, [fileId]);

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    const handleStop = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="file-view-wrapper">

            {fileUrl ? (
                fileUrl.endsWith('.mov') || fileUrl.endsWith('.mp4') ? (
                    <div className="video-container">
                        <video ref={videoRef} className="file-viewer" src={fileUrl} />
                        <div className="video-controls">
                            <button onClick={handlePlay}>Play</button>
                            <button onClick={handleStop}>Stop</button>
                        </div>
                    </div>
                ) : fileUrl.endsWith('.jpg') || fileUrl.endsWith('.jpeg') || fileUrl.endsWith('.png') ? (
                    <img src={fileUrl} alt="File Viewer" className="file-viewer" />
                ) : (
                    <iframe src={fileUrl} title="File Viewer" className="file-viewer" />
                )
            ) : (
                <div className="no-file">No file to display</div>
            )}
        </div>
    );
};

export default FileView;
