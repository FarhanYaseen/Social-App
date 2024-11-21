// components/FileUpload.js
import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [tags, setTags] = useState('');

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('tags', tags);

        try {
            await axios.post('http://localhost:5000/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('File uploaded successfully');
        } catch (error) {
            console.error(error);
            alert('File upload failed');
        }
    };

    return (
        <div>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;
