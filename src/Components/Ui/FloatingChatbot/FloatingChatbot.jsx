import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import styles from './FloatingChatbot.module.css';
import imgAvatar from '../../../assets/icons/avatar-chatbot2.png';

export const FloatingChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (message.trim() === '') return;

        const newMessage = {
            id: messages.length + 1,
            text: message,
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');

        // Simular respuesta del bot después de 1 segundo
        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                text: "Gracias por tu mensaje. Esta sería la respuesta de tu backend una vez que lo conectes.",
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={styles.chatbotContainer}>
            {/* Ventana de Chat */}
            {isOpen && (
                <div className={`${styles.chatWindow} ${isOpen ? styles.slideIn : ''}`}>
                    {/* Header */}
                    <div className={styles.chatHeader}>
                        <div className={styles.botInfo}>
                            <div className={styles.botAvatar}>
                                <Bot size={18} />
                            </div>
                            <div>
                                <h3 className={styles.botName}>Asistente Virtual</h3>
                                <p className={styles.botStatus}>En línea</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className={styles.closeButton}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div className={styles.messagesContainer}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`${styles.messageWrapper} ${msg.isBot ? styles.botMessage : styles.userMessage}`}
                            >
                                <div className={styles.messageContent}>
                                    <div className={`${styles.messageAvatar} ${msg.isBot ? styles.botMessageAvatar : styles.userMessageAvatar}`}>
                                        {msg.isBot ? <Bot size={12} /> : <User size={12} />}
                                    </div>
                                    <div className={`${styles.messageBubble} ${msg.isBot ? styles.botBubble : styles.userBubble}`}>
                                        <p className={styles.messageText}>{msg.text}</p>
                                        <p className={`${styles.messageTime} ${msg.isBot ? styles.botTime : styles.userTime}`}>
                                            {formatTime(msg.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className={styles.inputArea}>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Escribe tu mensaje..."
                                className={styles.messageInput}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={message.trim() === ''}
                                className={`${styles.sendButton} ${message.trim() === '' ? styles.sendButtonDisabled : ''}`}
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <div className={styles.floatingButtonContainer}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={styles.floatingButton}
                >
                    <div className={styles.buttonContent}>
                        {isOpen ? (
                            <X size={24} className={styles.buttonIcon} />
                        ) : (
                            <>
                                <img src={imgAvatar} className={styles.chatbotImage} alt="avatar" />
                                {/* Notification dot */}
                                <div className={styles.notificationDot}></div>
                            </>
                        )}
                    </div>
                </button>

                {/* Tooltip */}
                {!isOpen && (
                    <div className={styles.tooltip}>
                        ¿Necesitas ayuda?
                    </div>
                )}
            </div>
        </div>
    );
};