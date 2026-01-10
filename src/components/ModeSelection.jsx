import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bug, Zap, BarChart3 } from 'lucide-react';
import './ModeSelection.css';

const ModeSelection = () => {
    const navigate = useNavigate();

    const handleModeSelect = (mode) => {
        navigate(`/chat/${mode.toLowerCase()}`);
    };

    return (
        <div className="mode-container">
            <div className="greeting-section">
                <h1>Welcome back 👋</h1>
                <p>Choose a mode to get started</p>
            </div>

            <div className="modes-grid">
                {/* Debugger Card */}
                <div
                    className="mode-card"
                    style={{ '--accent-color': '#ff0055' }}
                    onClick={() => handleModeSelect('Debugger')}
                >
                    <div className="mode-icon-wrapper">
                        <Bug className="mode-icon" />
                    </div>
                    <h3>Debugger</h3>
                    <p>Find and fix code issues.</p>
                </div>

                {/* Optimizer Card */}
                <div
                    className="mode-card"
                    style={{ '--accent-color': '#bc13fe' }}
                    onClick={() => handleModeSelect('Optimizer')}
                >
                    <div className="mode-icon-wrapper">
                        <Zap className="mode-icon" />
                    </div>
                    <h3>Optimizer</h3>
                    <p>Improve performance and efficiency.</p>
                </div>

                {/* Evaluator Card */}
                <div
                    className="mode-card"
                    style={{ '--accent-color': '#00f2ff' }}
                    onClick={() => handleModeSelect('Evaluator')}
                >
                    <div className="mode-icon-wrapper">
                        <BarChart3 className="mode-icon" />
                    </div>
                    <h3>Evaluator</h3>
                    <p>Analyze and assess your code.</p>
                </div>
            </div>
        </div>
    );
};

export default ModeSelection;
