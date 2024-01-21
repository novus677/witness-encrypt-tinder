import React, { useState } from 'react';
import './NavBar.css';

const NavBar = ({ userId, handleLogout }) => {
    return (
        <nav className="NavBar-container">
            <div className="NavBar-title">
                <span className="gradient1-text">WE Tinder</span>
            </div>
            <div className="NavBar-linkContainer">
                {userId && (
                    <button
                        className="NavBar-loginbutton"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                )}
            </div>
            <div className="NavBar-docs">
                <a href="https://github.com/novus677/witness-encrypt-tinder" target="_blank" rel="noopener noreferrer">Docs</a>
            </div>
        </nav>
    );
};

export default NavBar;
