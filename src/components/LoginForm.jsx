import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const LoginForm = ({ onSwitch }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, username, password);
            const user = userCredential.user;
            if (user.displayName) {
                localStorage.setItem('username', user.displayName);
            }
            localStorage.setItem('userEmail', user.email);
            navigate('/modes');
        } catch (error) {
            console.error("Login Error:", error);
            let message = "Login failed: " + error.message;
            if (error.code === 'auth/invalid-email') {
                message = "Invalid Email Format. Please enter the Email Address you signed up with in the Username field.";
            } else if (error.code === 'auth/user-not-found') {
                message = "Account not found. Please check your email or create a new account.";
            } else if (error.code === 'auth/wrong-password') {
                message = "Incorrect password. Please try again.";
            } else if (error.code === 'auth/invalid-credential') {
                message = "Invalid credentials. Please check your email and password.";
            }
            alert(message);
        }
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
