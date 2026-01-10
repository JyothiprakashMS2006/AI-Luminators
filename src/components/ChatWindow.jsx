import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Paperclip, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatWindow = ({ messages, onSendMessage, activeMode }) => {
    const [input, setInput] = useState('');
    const endOfMessagesRef = useRef(null);

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSend = () => {
        if (!input.trim() && files.length === 0) return;
        onSendMessage(input, files);
        setInput('');
        setFiles([]);
    };

    // ... handleKeyDown remains ...
    // Auto-resize textarea
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`; // Max height approx 10 lines
        }
    }, [input]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (e.ctrlKey || e.metaKey) {
                // Ctrl+Enter -> Send
                e.preventDefault();
                handleSend();
            }
            // Normal Enter -> New line (default behavior)
        }
    };

    return (
        <div className="chat-window">
            {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.sender}`}>
                    <div className="message-avatar">
                        {msg.sender === 'ai' ? <Bot size={20} color={activeMode.color} /> : <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#000' }}></div>}
                    </div>
                    <div
                        className="message-bubble"
                        style={msg.sender === 'user' ? { '--mode-color': activeMode.color } : {}}
                    >
                        {/* Display attached files if any */}
                        {msg.files && msg.files.length > 0 && (
                            <div className="message-files" style={{ marginBottom: 8, fontSize: '0.85em', opacity: 0.8 }}>
                                {msg.files.map((f, i) => <span key={i}>📎 {f} </span>)}
                            </div>
                        )}
                        <div className="markdown-content">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                        {msg.isStreaming && <span className="cursor-blink">|</span>}
                    </div>
                </div>
            ))}
            <div ref={endOfMessagesRef} />

            <div className="input-area">
                {/* File Preview */}
                {files.length > 0 && (
                    <div className="file-preview-area" style={{ display: 'flex', gap: 10, paddingBottom: 10, flexWrap: 'wrap' }}>
                        {files.map((f, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem' }}>
                                <span>{f.name}</span>
                                <button onClick={() => removeFile(i)} style={{ border: 'none', background: 'transparent', color: '#ff4b4b', cursor: 'pointer' }}>×</button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="input-container" style={{ '--mode-color': activeMode.color }}>
                    <div className="input-actions">
                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />
                        <button className="icon-btn" onClick={() => fileInputRef.current?.click()}>
                            <Paperclip size={20} />
                        </button>
                    </div>
                    <textarea
                        ref={textareaRef}
                        className="chat-input"
                        placeholder={`Ask ${activeMode.name}... (Ctrl+Enter to send)`}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />
                    <div className="input-actions">
                        <button className="send-btn" onClick={handleSend}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
