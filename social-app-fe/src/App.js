import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Preferences from './pages/Preferences/Preferences';
import Login from './pages/Login/Login';
import { TokenProvider, useTokenContext } from './context/TokenContext';
import Register from './pages/Register/Register';

const ProtectedRoute = ({ children }) => {
  const { token } = useTokenContext();
  return token ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { token } = useTokenContext();
  return !token ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <TokenProvider>
      <div className="wrapper">
        <h1>HeroGram</h1>
        <Router>
          <Routes>
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/preferences"
              element={
                <ProtectedRoute>
                  <Preferences />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </div>
    </TokenProvider>
  );
}

export default App;
