import React, { createContext, useContext, useState } from 'react';

const TokenContext = createContext();

export const useTokenContext = () => {
    return useContext(TokenContext);
};

export const TokenProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });

    const saveToken = (userToken) => {
        localStorage.setItem('token', userToken);
        setToken(userToken);
    };
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <TokenContext.Provider value={{ token, setToken: saveToken, logout }}>
            {children}
        </TokenContext.Provider>
    );
};
