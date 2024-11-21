import React from 'react';

const GalleryView = ({ files, onView }) => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {files.map((file) => (
                <div
                    key={file._id}
                    style={{
                        border: '1px solid #ccc',
                        padding: '10px',
                        width: '200px',
                        textAlign: 'center',
                        cursor: 'pointer',
                    }}
                    onClick={() => onView(file._id)}
                >
                    <p>{file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name}</p>
                    <p>Views: {file.viewCount}</p>
                </div>
            ))}
        </div>
    );
};

export default GalleryView;
