import React, { useState } from 'react';
import './WelcomeNoLoginModal.css';

export const WelcomeNoLoginModal = ({ isOpen, onClose, onOpenRegister, onOpenLogin }) => {

    const handleRegisterClick = () => {
        if (onOpenRegister) {
            onOpenRegister();
        }
    };

    const handleLoginClick = () => {
        if (onOpenLogin) {
            onOpenLogin(); 
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay-welcome-no-login">
            <div className="modal-container-welcome-no-login">
                <div className="modal-background-welcome-no-login"></div>

                <button onClick={onClose} className="modal-close-welcome-no-login">
                    ×
                </button>

                <div className="modal-content-welcome-no-login">

                    <h1 className="modal-title-welcome-no-login">¡BIENVENIDO!</h1>

                    <p className="modal-subtitle-welcome-no-login">
                        Inicia sesión si ya tienes cuenta, o<br />
                        crea una nueva para empezar.
                    </p>

                    <div className="modal-actions-welcome-no-login">
                        <div className="action-group-welcome-no-login">
                            <p className="action-label-welcome-no-login">¿Eres nuevo?</p>
                            <button
                                className="btn-primary"
                                onClick={handleRegisterClick}
                            >
                                Regístrate
                            </button>
                        </div>

                        <div className="action-group-welcome-no-login">
                            <p className="action-label-welcome-no-login">¿Ya tienes una cuenta?</p>
                            <button
                                className="btn-secondary"
                                onClick={handleLoginClick}
                            >
                                Inicia sesión
                            </button>
                        </div>
                    </div>

                    <div className="divider-welcome-no-login">
                        <div className="divider-line-welcome-no-login"></div>
                        <span className="divider-text-welcome-no-login">O</span>
                        <div className="divider-line-welcome-no-login"></div>
                    </div>

                    <div className="social-buttons-welcome-no-login">
                        <button className="social-btn facebook-welcome-no-login">
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </button>

                        <button className="social-btn google-welcome-no-login">
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}