

// Preferences.js
import React from 'react';
import { useTokenContext } from '../../context/TokenContext';

const Preferences = () => {
    const { logout } = useTokenContext();

    const handleLogout = () => {
        logout();
    };

    return (
        <div>
            <h2>Preferences</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Preferences;
