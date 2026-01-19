import React, { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const TopNav = ({ activeMode }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    // State to hold user info, initialized from localStorage for speed
    const [userInfo, setUserInfo] = useState({
        name: localStorage.getItem('username') || 'User',
        email: localStorage.getItem('userEmail') || 'user@example.com'
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserInfo({
                    name: user.displayName || localStorage.getItem('username') || 'User',
                    email: user.email || 'user@example.com'
                });
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            localStorage.clear(); // Clear local artifacts too
            navigate('/');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className="top-nav">
            <div className="mode-indicator" style={{ '--mode-color': activeMode.color }}>
                {activeMode.icon}
                <span>{activeMode.name} Agent</span>
            </div>

            <div className="profile-menu" onClick={() => setIsOpen(!isOpen)}>
                <div className="profile-trigger">
                    <span style={{ fontSize: '0.9rem', color: '#ccc' }}>{userInfo.name}</span>
                    <div className="avatar">
                        <User size={20} />
                    </div>
                </div>

                {/* Show dropdown if isOpen is true */}
                <div className={`dropdown-menu ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'flex' : 'none' }}>
                    <div className="dropdown-item">
                        <span style={{ fontSize: '0.9rem' }}>{userInfo.email}</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-item danger" onClick={(e) => {
                        e.stopPropagation(); // Prevent bubbling closing it immediately
                        handleSignOut();
                    }}>
                        <LogOut size={16} />
                        Sign Out
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopNav;
