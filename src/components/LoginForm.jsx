import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onSwitch }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        localStorage.setItem('username', username);
        localStorage.setItem('userEmail', `${username.toLowerCase().replace(/\s+/g, '.')}@example.com`); // Mock email
        navigate('/modes');
    };

    return (
        <form onSubmit={handleLogin}>
            <div className="form-group">
                <label>Username</label>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <div className="password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-input"
                        placeholder="Enter your password"
                        required
                    />
                    <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
            </div>
            <button type="submit" className="cta-button">Login</button>
            <p className="switch-text">
                New user? <button type="button" className="switch-btn" onClick={onSwitch}>Create an account</button>
            </p>
        </form>
    );
};
export default LoginForm;
