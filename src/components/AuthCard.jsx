import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './AuthCard.css';

const AuthCard = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleAuthMode = () => {
        setIsLogin((prev) => !prev);
    };

    return (
        <div className="auth-card">
            <div className="auth-header">
                <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p>{isLogin ? 'Enter your details to login' : 'Start your futuristic journey with us'}</p>
            </div>

            <div className="auth-body">
                {isLogin ? (
                    <div className="fade-in">
                        <LoginForm onSwitch={toggleAuthMode} />
                    </div>
                ) : (
                    <div className="fade-in">
                        <SignupForm onSwitch={toggleAuthMode} />
                    </div>
                )}
            </div>
        </div>
    );
};
export default AuthCard;
