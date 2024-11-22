import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTokenContext } from '../../context/TokenContext';
import { incrementView, generateShareableLink, updateFileOrder } from '../../services/api';
import './FileOrganizer.css';

const FileOrganizer = ({ files, setFiles }) => {
    const { token } = useTokenContext();

    const handleOnDragEnd = async (result) => {
        if (!result.destination) return;

        const reorderedFiles = Array.from(files);
        const [movedItem] = reorderedFiles.splice(result.source.index, 1);
        reorderedFiles.splice(result.destination.index, 0, movedItem);
        console.log(reorderedFiles);
        setFiles(reorderedFiles);

        try {
            await updateFileOrder(reorderedFiles, token);
        } catch (error) {
            console.error('Failed to update file order:', error);
        }
    };

    const handleGenerateShareableLink = async (fileId) => {
        try {
            const path = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;
            const link = `${path}/file/${fileId}`;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(link);
                alert(`Shareable Link (copied to clipboard): ${link}`);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = link;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert(`Shareable Link (copied to clipboard): ${link}`);
            }
        } catch (error) {
            console.error('Failed to generate shareable link:', error);
        }
    };

    const handleIncrementView = async (fileId) => {
        try {
            await incrementView(fileId, token);
            setFiles(prevFiles =>
                prevFiles.map(file =>
                    file._id === fileId ? { ...file, views: file.views + 1 } : file
                )
            );
        } catch (error) {
            console.error('Failed to increment view count:', error);
        }
    };

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="files">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="file-container"
                    >
                        {files.map((file, index) => (
                            <Draggable key={file._id} draggableId={String(file._id)} index={index}>
                                {(provided) => (
                                    <div
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                        className="file-item"
                                    >
                                        <div className="file-info">
                                            <strong>{file.filename}</strong>
                                            <div className="file-views">
                                                Views: {file.views}
                                            </div>
                                        </div>
                                        <div className="file-tags">
                                            Tags: {Array.isArray(file.tags) && file.tags.length > 0 ? file.tags.join(', ') : 'None'}
                                        </div>
                                        <div className="file-actions">
                                            <button
                                                className="share-link-btn"
                                                onClick={() => handleGenerateShareableLink(file.filename)}
                                            >
                                                Share Link
                                            </button>
                                            <button
                                                className="view-btn"
                                                onClick={() => handleIncrementView(file._id)}
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default FileOrganizer;
