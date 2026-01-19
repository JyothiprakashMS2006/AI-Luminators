import React, { useState } from 'react';
import { Plus, MessageSquare, ArrowLeftRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ history, onNewChat, activeMode, onSelectChat }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <button
                className="new-chat-btn"
                onClick={onNewChat}
                style={{ '--primary-color': activeMode.color }}
            >
                <Plus size={20} />
                {!collapsed && "New Chat"}
            </button>

            <div className="history-list">
                {!collapsed && <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>History</p>}
                {history.map((chat) => (
                    <div
                        key={chat.id}
                        className="history-item"
                        onClick={() => onSelectChat && onSelectChat(chat.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <MessageSquare size={16} style={{ display: collapsed ? 'block' : 'inline', marginRight: collapsed ? 0 : 10 }} />
                        {!collapsed && chat.title}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 'auto' }}>
                <button className="switch-mode-btn" onClick={() => navigate('/modes')}>
                    <ArrowLeftRight size={18} />
                    {!collapsed && "Switch Mode"}
                </button>
            </div>

            <button
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    marginTop: '10px',
                    alignSelf: collapsed ? 'center' : 'flex-end',
                    cursor: 'pointer'
                }}
            >
                {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
        </div>
    );
};

export default Sidebar;
