import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthCard from './components/AuthCard';
import ModeSelection from './components/ModeSelection';
import ChatPage from './pages/ChatPage';
import bgImage from './assets/background.jpg';

function AppLayout({ children }) {
  return (
    <div className="app-container">
      <img src={bgImage} alt="Background" className="background-image" />
      <div className="auth-wrapper">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<AuthCard />} />
          <Route path="/modes" element={<ModeSelection />} />
          <Route path="/chat/:mode" element={<ChatPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
