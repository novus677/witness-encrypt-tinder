import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.css';

const Login = ({ setUserId }) => {
    const navigate = useNavigate();
    const [usernameLogin, setUsernameLogin] = useState("");
    const [passwordLogin, setPasswordLogin] = useState("");
    const [loginError, setLoginError] = useState("");
    const [usernameRegister, setUsernameRegister] = useState("");
    const [passwordRegister, setPasswordRegister] = useState("");
    const [registerError, setRegisterError] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoginError("");
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
                setLoginError(data.message);
            }
        } catch (err) {
            console.error("Login failed:", err);
            setLoginError("Login failed. Please try again.");
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        setRegisterError("");
        try {
            const res = await fetch('http://localhost:8000/routes/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameRegister, password: passwordRegister }),
            });

            const data = await res.json();
            if (res.status === 201) {
                localStorage.setItem('token', data.token);
                setUserId(data.userId);
                console.log("Successfully registered:", data);
                navigate('/');
            } else {
                console.error("Registration failed:", data);
                setRegisterError(data.message);
            }
        } catch (err) {
            console.error("Registration failed:", err);
            setRegisterError("Registration failed. Please try again.");
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
                    {loginError && <div className="error-message">{loginError}</div>}
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
                    {registerError && <div className="error-message">{registerError}</div>}
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
