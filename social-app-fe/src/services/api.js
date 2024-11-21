import axios from 'axios';

const API_BASE_URL = 'http://localhost:6080/api';

export const incrementView = async (fileId, token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/files/${fileId}/increment-view`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error incrementing view:', error);
        throw error;
    }
};

export const uploadFile = async (file, tags, token) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tags', tags);
    try {
        const response = await axios.post(`${API_BASE_URL}/files/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

export const fetchFiles = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/files/list`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching file list:', error);
        throw error;
    }
};

export const reorderFiles = async (reorderedFiles, token) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/files/reorder`,
            { files: reorderedFiles },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error reordering files:', error);
        throw error;
    }
};