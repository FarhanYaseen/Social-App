import React from 'react';
import './style.css';

const FileCard = ({ file, onView }) => {
    const handleView = () => {
        onView(file._id);
    };

    return (
        <div className="file-card">
            <img src={file.previewLink} alt={file.name} onClick={handleView} />
            <h3>{file.name}</h3>
            <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
            <p>Type: {file.mimeType}</p>
            <p>Views: {file.viewCount}</p>
        </div>
    );
};

export default FileCard;
