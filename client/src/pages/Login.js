import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.css';

const Login = ({ setUserId }) => {
    const navigate = useNavigate();
    const [usernameLogin, setUsernameLogin] = useState("");
    const [passwordLogin, setPasswordLogin] = useState("");
    const [usernameRegister, setUsernameRegister] = useState("");
    const [passwordRegister, setPasswordRegister] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch('http://localhost:8000/routes/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameLogin, password: passwordLogin }),
            });

            const data = await res.json();
            if (res.status === 200) {
                localStorage.setItem('token', data.token);
                setUserId(data.userId);
                console.log("Successfully logged in:", data);
                navigate('/');
            } else {
                console.error(data);
            }
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch('http://localhost:8000/routes/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameRegister, password: passwordRegister }),
            });

            const data = await res.json();
            if (res.status === 201) {
                console.log("Successfully registered:", data);
            } else {
                console.error("Registration failed:", data);
            }
        } catch (err) {
            console.error("Registration failed:", err);
        }
    }


    return (
        <div className="auth-container">
            <div className="login-box">
                <form onSubmit={handleLogin}>
                    <h2>Login</h2>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={usernameLogin}
                            onChange={(event) => setUsernameLogin(event.target.value)}
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={passwordLogin}
                            onChange={(event) => setPasswordLogin(event.target.value)}
                        />
                    </label>
                    <button type="submit">Login</button>
                </form>
            </div>
            <div className="register-box">
                <form onSubmit={handleRegister}>
                    <h2>Register</h2>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={usernameRegister}
                            onChange={(event) => setUsernameRegister(event.target.value)}
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={passwordRegister}
                            onChange={(event) => setPasswordRegister(event.target.value)}
                        />
                    </label>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
