import React from 'react';
import FileOrganizer from '../FileOrganizer/FileOrganizer';

const FileList = ({ files, setFiles }) => {
    return (
        <div className="file-list-container">
            <FileOrganizer files={files} setFiles={setFiles} />
        </div>
    );
};

export default FileList;
