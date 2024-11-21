import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';
import { useTokenContext } from '../context/TokenContext';

const FileOrganizer = ({ files, setFiles }) => {
    const { token } = useTokenContext();


    const handleOnDragEnd = async (result) => {
        if (!result.destination) return; 

        const reorderedFiles = Array.from(files);
        const [movedItem] = reorderedFiles.splice(result.source.index, 1);
        reorderedFiles.splice(result.destination.index, 0, movedItem);

        setFiles(reorderedFiles);
        try {
            await axios.put('http://localhost:6080/api/files/reorder', { reorderedFiles }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Failed to update file order:', error);
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
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )

};

export default FileOrganizer;
