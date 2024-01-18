import React, { useState } from 'react';
import './NavBar.css';

const NavBar = ({ userId, handleLogout }) => {
    return (
        <nav className="NavBar-container">
            <div className="NavBar-title u-inlineBlock">
                <span className="gradient1-text">WE Tinder</span>
            </div>
            <div className="NavBar-linkContainer u-inlineBlock">
                {userId && (
                    <button
                        className="button-54"
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
