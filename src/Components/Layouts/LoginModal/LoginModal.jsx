import React from "react";
import "./LoginModal.css";
import iconGoogle from "../../../assets/icons/google.png";
import iconFacebook from "../../../assets/icons/facebook.png";

export const LoginModal = ({ isOpen, onClose, onLoginSuccess}) => {
    const handleSubmit = (e) => {
        e.preventDefault();

        // Simular login exitoso
        onClose(); // cerrar el modal de login
        onLoginSuccess(); // mostrar modal de bienvenida
    };

    return (
        <div className={`modal-overlay ${isOpen ? "active" : ""}`}>
            <div className={`login-modal-box ${isOpen ? "active" : ""}`}>
                <button className="close-btn" onClick={onClose}>×</button>

                <div className="modal-form-container">
                    <h2>INICIAR SESIÓN</h2>
                    <form onSubmit={handleSubmit}>

                        <div className="input-group">
                            <div className="input-field">
                                <label>Correo *</label>
                                <input type="email" placeholder="example@example.com" required />
                            </div>
                            <div className="input-field">
                                <label>Contraseña *</label>
                                <input type="password" placeholder="Contraseña" required />
                                <u>¿Olvidaste tu contraseña?</u>
                            </div>
                        </div>

                        <div className="group-bottom">
                            <button type="submit" className="submit-btn">
                                <span>Iniciar Sesión</span>
                            </button>

                            <div className="divider">o</div>

                            <div className="social-icons">
                                <button type="button" className="social facebook"><img src={iconFacebook} alt="facebook" /></button>
                                <span className="divider-vertical"></span>
                                <button type="button" className="social google"><img src={iconGoogle} alt="google" /></button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
