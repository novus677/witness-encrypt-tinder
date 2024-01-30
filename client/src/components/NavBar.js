import React from 'react';
import './NavBar.css';

const NavBar = ({ userId, handleLogout }) => {
    return (
        <nav className="NavBar-container">
            <div className="NavBar-title">
                <span className="gradient1-text">Flower</span>
            </div>
            <div>
                {userId && (
                    <button
                        className="NavBar-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                )}
                <a
                    href="https://github.com/novus677/witness-encrypt-tinder"
                    className="NavBar-button"
                    target="_blank"
                    rel="noopener noreferrer">
                    Docs
                </a>
            </div>
        </nav >
    );
};

export default NavBar;
