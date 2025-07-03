import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import styles from './FloatingChatbot.module.css';
import imgAvatar from '../../../assets/icons/avatar-chatbot2.png';

export const FloatingChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "¡Hola! Soy tu asistente virtual de Accesorios Apolo. ¿En qué puedo ayudarte hoy?",
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

    const sendMessageToAPI = async (userMessage) => {
        try {
            const response = await fetch('https://accesoriosapolobackend.onrender.com/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.respuesta || "Lo siento, no pude procesar tu solicitud en este momento.";
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            return "Lo siento, hubo un problema de conexión. Por favor, inténtalo de nuevo.";
        }
    };

    const handleSendMessage = async () => {
        if (message.trim() === '' || isLoading) return;

        const userMessage = message.trim();
        const newMessage = {
            id: Date.now(),
            text: userMessage,
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');
        setIsLoading(true);

        try {
            const botResponse = await sendMessageToAPI(userMessage);

            const botMessage = {
                id: Date.now() + 1,
                text: botResponse,
                isBot: true,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                text: "Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.",
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
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
                                <p className={styles.botStatus}>
                                    {isLoading ? 'Escribiendo...' : 'En línea'}
                                </p>
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

                        {/* Indicador de carga */}
                        {isLoading && (
                            <div className={`${styles.messageWrapper} ${styles.botMessage}`}>
                                <div className={styles.messageContent}>
                                    <div className={`${styles.messageAvatar} ${styles.botMessageAvatar}`}>
                                        <Bot size={12} />
                                    </div>
                                    <div className={`${styles.messageBubble} ${styles.botBubble}`}>
                                        <div className={styles.typingIndicator}>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

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
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={message.trim() === '' || isLoading}
                                className={`${styles.sendButton} ${(message.trim() === '' || isLoading) ? styles.sendButtonDisabled : ''}`}
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