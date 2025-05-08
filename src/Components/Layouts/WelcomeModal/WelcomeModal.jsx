import React from "react";
import "./WelcomeModal.css";

export const WelcomeModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className={`welcome-modal-overlay ${isOpen ? "active" : ""}`}>
            <div className={`welcome-modal-box ${isOpen ? "active animated" : ""}`}>
                <button className="close-btn" onClick={onClose}>×</button>

                <div className="welcome-modal-form-container">
                    <h2>¡BIENVENIDO!</h2>
                    <p>Nombre, comienza a disfrutar de la experiencia de llevar tu moto al mil, diseña y crea tus calcomanias a tu estilo</p>


                    <div className="welcome-group-bottom">
                        <button type="submit" className="welcome-submit-btn">
                            <span>Entrar</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
