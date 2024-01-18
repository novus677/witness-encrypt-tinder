import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch('/routes/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();
            if (res.status === 200) {
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                console.error(data);
            }
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <label>
                Username:
                <input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
            </label>
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
            </label>
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
