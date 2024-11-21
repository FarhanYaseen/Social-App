import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, 
});

const getAuthHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`
    }
});

export const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    } catch (error) {
        console.error('Error during login:', error.message);
        throw error;
    }
};

export const register = async (username, password) => {
    try {
        const response = await api.post('/auth/register', { username, password });
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error.message);
        throw error;
    }
};

export const incrementView = async (fileId, token) => {
    try {
        const response = await api.post(
            `/files/${fileId}/increment-view`,
            {},
            getAuthHeaders(token)
        );
        return response.data;
    } catch (error) {
        console.error(`Error incrementing view for file ID ${fileId}:`, error.message);
        throw error;
    }
};

export const uploadFile = async (file, tags, token) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tags', tags);

    try {
        const response = await api.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error.message);
        throw error;
    }
};

export const fetchFiles = async (token) => {
    try {
        const response = await api.get('/files/list', getAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error fetching file list:', error.message);
        throw error;
    }
};

export const updateFileOrder = async (reorderedFiles, token) => {
    try {
        const response = await api.put('/files/reorder', { reorderedFiles }, getAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error updating file order:', error.message);
        throw error;
    }
};

export const generateShareableLink = async (fileId, token) => {
    try {
        const response = await api.post(`/files/${fileId}/shareable-link`, {}, getAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error(`Error generating shareable link for file ID ${fileId}:`, error.message);
        throw error;
    }
};
