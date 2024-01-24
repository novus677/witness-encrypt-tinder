import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import NavBar from './components/NavBar';

import AddMembers from './pages/AddMembers';
import Commit from './pages/Commit';
import Groups from './pages/Groups';
import NotFound from './pages/NotFound';

const App = () => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // if (token) {
    //   setUserId(1);
    // }
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem('token');
    setUserId(null);
    navigate('/login');
  };

  return (
    <>
      <NavBar handleLogout={handleLogout} userId={userId} />
      <Routes>
        <Route path="/login" element={<Login setUserId={setUserId} />} />
        <Route path="/" element={userId ? <Groups userId={userId} /> : <Navigate to="/login" />} />
        <Route path="/add-members/:groupId" element={<AddMembers />} />
        <Route path="/group/:groupId" element={<Commit />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
