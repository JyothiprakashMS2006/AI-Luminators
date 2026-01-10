import React, { useState } from 'react';

const SignupForm = ({ onSwitch }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // clear error on change
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        // Simulated signup success
        // In a real app, this would be an API call
        // For UI demo, we simulate a delay then switch
        setTimeout(() => {
            // Save to local storage for demo purposes
            localStorage.setItem('username', formData.fullName);
            localStorage.setItem('userEmail', formData.email);

            alert("Account created successfully! Please login.");
            onSwitch();
        }, 500);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="fullName" className="form-input" placeholder="Enter your full name" required onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" className="form-input" placeholder="Enter your email" required onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Password</label>
                <div className="password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-input"
                        placeholder="Create a password"
                        required
                        onChange={handleChange}
                    />
                    <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
            </div>
            <div className="form-group">
                <label>Confirm Password</label>
                <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Confirm your password"
                    required
                    onChange={handleChange}
                />
            </div>
            {error && <p style={{ color: 'var(--error-color)', fontSize: '0.85rem', marginTop: '-10px', marginBottom: '10px' }}>{error}</p>}

            <button type="submit" className="cta-button">Sign Up</button>
            <p className="switch-text">
                Already have an account? <button type="button" className="switch-btn" onClick={onSwitch}>Login</button>
            </p>
        </form>
    );
};
export default SignupForm;
