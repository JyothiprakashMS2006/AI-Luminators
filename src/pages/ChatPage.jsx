import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import ChatWindow from '../components/ChatWindow';
import ParticlesBackground from '../components/ParticlesBackground';
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

    // --- State Management ---
    const [currentChatId, setCurrentChatId] = useState(null);

    const getHistory = (currentMode) => {
        try {
            const stored = localStorage.getItem(`chat_history_${currentMode}`);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Failed to load history", e);
            return [];
        }
    };

    const [history, setHistory] = useState(() => getHistory(mode));

    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: activeMode.welcome }
    ]);

    useEffect(() => {
        // Reset chat when mode changes
        const loadedHistory = getHistory(mode);
        setHistory(loadedHistory);
        setCurrentChatId(null);
        // Start fresh with welcome message
        setMessages([{ id: Date.now(), sender: 'ai', text: activeMode.welcome }]);
    }, [mode]);



    const saveHistory = (updatedHistory) => {
        setHistory(updatedHistory);
        localStorage.setItem(`chat_history_${mode}`, JSON.stringify(updatedHistory));
    };

    const handleSendMessage = async (text, files = []) => {
        if (!text.trim() && files.length === 0) return;

        // 1. Add User Message
        const newUserMsg = {
            id: Date.now(),
            sender: 'user',
            text,
            files: files.map(f => f.name) // valid serializable data
        };

        // determine chat ID and update history immediately
        let chatId = currentChatId;
        let newHistory = [...history];
        let chatMessages = [];

        if (!chatId) {
            // Start New Chat
            chatId = Date.now();
            setCurrentChatId(chatId);

            // Includes welcome message + new user message
            // We need to keep the welcome message in the history as well usually
            const initialMessages = [{ id: Date.now() - 100, sender: 'ai', text: activeMode.welcome }, newUserMsg];

            const newChat = {
                id: chatId,
                title: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
                messages: initialMessages
            };
            newHistory = [newChat, ...newHistory];
            // Update messages state to match
            setMessages(initialMessages);
            // Note: Optimistic update below might add newUserMsg again if we aren't careful.
            // But we can just rely on `messages` state update logic which appends.
            // Let's align `messages` state with `history` state.
        } else {
            newHistory = newHistory.map(h => {
                if (h.id === chatId) {
                    return { ...h, messages: [...h.messages, newUserMsg] };
                }
                return h;
            });
        }

        saveHistory(newHistory);

        // Update UI state (optimistic)
        // If it was a new chat, we already setMessages above. If existing, append.
        if (currentChatId) {
            setMessages(prev => [...prev, newUserMsg]);
        }

        // 2. Add Placeholder AI Message
        const aiMsgId = Date.now() + 1;
        setMessages(prev => [...prev, { id: aiMsgId, sender: 'ai', text: '...', isStreaming: true }]);

        // 3. Call API
        let fullText = '';

        // Prepare context
        const contextMessages = messages.slice(-10).map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
        contextMessages.push({ role: 'user', content: text });

        await streamChatResponse(
            mode,
            contextMessages,
            files,
            (chunk) => {
                fullText += chunk;
                setMessages(prev => prev.map(msg =>
                    msg.id === aiMsgId ? { ...msg, text: fullText, isStreaming: true } : msg
                ));
            },
            () => {
                // On Complete: Update History with final AI message response
                setMessages(prev => prev.map(msg =>
                    msg.id === aiMsgId ? { ...msg, isStreaming: false } : msg
                ));

                const finalAiMsg = { id: aiMsgId, sender: 'ai', text: fullText, isStreaming: false };

                // Save complete interaction to history
                const completeHistory = history.map(h => { // Re-read history? No, rely on state updater pattern if possible or fresh read
                    // Using function update to ensure we have latest history if multiple updates happened (unlikely here)
                    // But `history` variable in this closure is stale from render.
                    // We must use the `setHistory` callback or re-read from localStorage/ref.
                    // Accessing `newHistory` variable from above? 
                    // `newHistory` contains the user message. We need to append AI message to THAT.
                    return h;
                });

                // Better approach: Read from localStorage or functional update.
                setHistory(prevHistory => {
                    const updated = prevHistory.map(h => {
                        if (h.id === chatId) {
                            return { ...h, messages: [...h.messages, finalAiMsg] };
                        }
                        return h;
                    });
                    localStorage.setItem(`chat_history_${mode}`, JSON.stringify(updated));
                    return updated;
                });
            },
            (err) => {
                setMessages(prev => prev.map(msg =>
                    msg.id === aiMsgId ? { ...msg, text: "Error: " + err.message, isStreaming: false, isError: true } : msg
                ));
            }
        );
    };

    const handleNewChat = () => {
        setMessages([{ id: Date.now(), sender: 'ai', text: activeMode.welcome }]);
        setCurrentChatId(null);
    };

    const handleSelectChat = (chatId) => {
        const chat = history.find(c => c.id === chatId);
        if (chat) {
            setMessages(chat.messages);
            setCurrentChatId(chatId);
        }
    };

    return (
        <div className="chat-layout">
            <ParticlesBackground />
            <Sidebar history={history} onNewChat={handleNewChat} activeMode={activeMode} onSelectChat={handleSelectChat} />
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
