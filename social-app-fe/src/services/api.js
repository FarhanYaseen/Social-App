import axios from 'axios';

const API_URL = 'http://localhost:6080/api';

export const incrementView = async (id, token) => {
    await axios.post(
        `${API_URL}/files/${id}/increment-view`,
        {}, 
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};

