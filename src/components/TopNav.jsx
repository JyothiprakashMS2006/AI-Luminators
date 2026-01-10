import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopNav = ({ activeMode }) => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'User';
    const email = localStorage.getItem('userEmail') || 'user@example.com';

    const handleSignOut = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('userEmail');
        navigate('/');
    };

    return (
        <div className="top-nav">
            <div className="mode-indicator" style={{ '--mode-color': activeMode.color }}>
                {activeMode.icon}
                <span>{activeMode.name} Agent</span>
            </div>

            <div className="profile-menu">
                <div className="profile-trigger">
                    <span style={{ fontSize: '0.9rem', color: '#ccc' }}>{username}</span>
                    <div className="avatar">
                        <User size={20} />
                    </div>
                </div>

                <div className="dropdown-menu">
                    <div className="dropdown-item">
                        <span style={{ fontSize: '0.9rem' }}>{email}</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-item danger" onClick={handleSignOut}>
                        <LogOut size={16} />
                        Sign Out
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopNav;
