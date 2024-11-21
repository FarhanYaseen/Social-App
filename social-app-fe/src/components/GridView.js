import React from 'react';

const GridView = ({ files, onView }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {files.map((file) => (
                <div
                    key={file._id}
                    style={{
                        border: '1px solid #ccc',
                        padding: '10px',
                        textAlign: 'center',
                        cursor: 'pointer',
                    }}
                    onClick={() => onView(file._id)}
                >
                    <p>{file.name}</p>
                    <p>Views: {file.viewCount}</p>
                    <button > Share Link </button>
                </div>
            ))}
        </div>
    );
};

export default GridView;
