import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthCard from './components/AuthCard';
import ModeSelection from './components/ModeSelection';
import ChatPage from './pages/ChatPage';
import bgImage from './assets/background.jpg';
import DustParticles from './components/DustParticles';

function AppLayout({ children }) {
  return (
    <div className="app-container">
      <img src={bgImage} alt="Background" className="background-image" />
      <DustParticles />
      <div className="auth-wrapper">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Route gets the Auth Layout (Grid/Glass effect) */}
        <Route path="/" element={
          <AppLayout>
            <AuthCard />
          </AppLayout>
        } />

        {/* Modes and Chat are full-screen pages that handle their own layout */}
        <Route path="/modes" element={<ModeSelection />} />
        <Route path="/chat/:mode" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
