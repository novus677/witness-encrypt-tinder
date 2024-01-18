import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import NavBar from './components/NavBar';

import MainPage from './pages/MainPage';
import NotFound from './pages/NotFound';

const App = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserId(1);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserId(undefined);
    // post logout api call
  };

  return (
    <>
      <NavBar handleLogout={handleLogout} userId={userId} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
