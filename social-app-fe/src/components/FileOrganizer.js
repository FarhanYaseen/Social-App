import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTokenContext } from '../context/TokenContext';
import { incrementView, generateShareableLink, updateFileOrder } from '../services/api'

const FileOrganizer = ({ files, setFiles }) => {
    const { token } = useTokenContext();

    const handleOnDragEnd = async (result) => {
        if (!result.destination) return;

        const reorderedFiles = Array.from(files);
        const [movedItem] = reorderedFiles.splice(result.source.index, 1);
        reorderedFiles.splice(result.destination.index, 0, movedItem);

        setFiles(reorderedFiles);
        try {
            await updateFileOrder(reorderedFiles, token)
        } catch (error) {
            console.error('Failed to update file order:', error);
        }
    };

    const handleGenerateShareableLink = async (fileId) => {
        try {
            const response = await generateShareableLink(fileId, token)
            alert(`Shareable Link: ${response.link}`);
        } catch (error) {
            console.error('Failed to generate shareable link:', error);
        }
    };

    const handleIncrementView = async (fileId) => {
        try {
            await incrementView(fileId, token)
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
                        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                    >
                        {files.map((file, index) => (
                            <Draggable key={file._id} draggableId={String(file._id)} index={index}>
                                {(provided) => (
                                    <div
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            ...provided.draggableProps.style,
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <strong>{file.filename}</strong>
                                            <div style={{ fontSize: '0.85em', color: '#777' }}>
                                                Views: {file.views}
                                            </div>
                                            <div style={{ fontSize: '0.85em', color: '#777' }}>
                                                Share Token: {file.shareToken ? file.shareToken : 'None'}
                                            </div>
                                        </div>
                                        <div style={{ flex: 1, textAlign: 'right' }}>
                                            Tags: {Array.isArray(file.tags) && file.tags.length > 0 ? file.tags.join(', ') : 'None'}
                                        </div>
                                        <div style={{ flex: 1, textAlign: 'right' }}>
                                            <button
                                                style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}
                                                onClick={() => handleGenerateShareableLink(file._id)}
                                            >
                                                Share Link
                                            </button>
                                            <button
                                                style={{ padding: '5px 10px', cursor: 'pointer' }}
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
