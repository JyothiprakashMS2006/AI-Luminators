import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import ChatWindow from '../components/ChatWindow';
import { Bug, Zap, BarChart3 } from 'lucide-react';
import '../components/ChatInterface.css';

import { streamChatResponse } from '../api/chatService';

const ChatPage = () => {
    const { mode } = useParams(); // 'debugger', 'optimizer', 'evaluator'

    // Mode config mapping
    const modeConfig = {
        debugger: {
            name: 'Debugger',
            color: '#ff0055', // Neon Pink
            icon: <Bug size={24} />,
            welcome: "Hello! I'm here to help you debug your code. Paste your snippet below."
        },
        optimizer: {
            name: 'Optimizer',
            color: '#bc13fe', // Neon Purple
            icon: <Zap size={24} />,
            welcome: "Ready to optimize? Share your code and I'll make it faster."
        },
        evaluator: {
            name: 'Evaluator',
            color: '#00f2ff', // Neon Cyan
            icon: <BarChart3 size={24} />,
            welcome: "Let's evaluate your code quality and architecture."
        }
    };

    const activeMode = modeConfig[mode.toLowerCase()] || modeConfig.debugger;

    // Dummy State
    const [history, setHistory] = useState([
        { id: 1, title: 'Fixing React specific bug' },
        { id: 2, title: 'Optimizing API calls' },
    ]);

    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: activeMode.welcome }
    ]);

    useEffect(() => {
        // Reset chat when mode changes
        setMessages([{ id: Date.now(), sender: 'ai', text: activeMode.welcome }]);
    }, [mode]);



    const handleSendMessage = async (text, files = []) => {
        if (!text.trim() && files.length === 0) return;

        // 1. Add User Message
        const newUserMsg = {
            id: Date.now(),
            sender: 'user',
            text,
            files: files.map(f => f.name) // valid serializable data
        };

        // Optimistic update
        const currentCheckId = Date.now();
        setMessages(prev => [...prev, newUserMsg]);

        // 2. Add Placeholder AI Message
        const aiMsgId = Date.now() + 1;
        setMessages(prev => [...prev, { id: aiMsgId, sender: 'ai', text: '...', isStreaming: true }]);

        // 3. Call API
        let fullText = '';

        // Prepare context (simplified: last 10 messages)
        const contextMessages = messages.slice(-10).map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
        contextMessages.push({ role: 'user', content: text });

        await streamChatResponse(
            mode, // 'debugger', etc.
            contextMessages,
            files,
            (chunk) => {
                // On Chunk
                fullText += chunk;
                setMessages(prev => prev.map(msg =>
                    msg.id === aiMsgId ? { ...msg, text: fullText, isStreaming: true } : msg
                ));
            },
            () => {
                // On Complete
                setMessages(prev => prev.map(msg =>
                    msg.id === aiMsgId ? { ...msg, isStreaming: false } : msg
                ));
            },
            (err) => {
                // On Error
                setMessages(prev => prev.map(msg =>
                    msg.id === aiMsgId ? { ...msg, text: "Error: " + err.message, isStreaming: false, isError: true } : msg
                ));
            }
        );
    };

    const handleNewChat = () => {
        setMessages([{ id: Date.now(), sender: 'ai', text: activeMode.welcome }]);
    };

    return (
        <div className="chat-layout">
            <Sidebar history={history} onNewChat={handleNewChat} activeMode={activeMode} />
            <div className="chat-content-wrapper">
                <main className="main-chat-area">
                    <TopNav activeMode={activeMode} />
                    <ChatWindow
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        activeMode={activeMode}
                    />
                </main>
            </div>
        </div>
    );
};

export default ChatPage;
