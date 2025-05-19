import React, { useContext, useState, useEffect } from "react";
import "./WelcomeModal.css";
import { context } from "../../../Context/Context.jsx";
import { useNavigate } from "react-router-dom";

export const WelcomeModal = ({ isOpen, onClose }) => {
    const { name, setUserLogin } = useContext(context);
    const navigate = useNavigate();

    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(isOpen);

    useEffect(() => {
        if (isOpen) setIsVisible(true);
    }, [isOpen]);

    const handleEnter = () => {
        setIsClosing(true); 
        setUserLogin(name);
        
        setTimeout(() => {
            setIsVisible(false); 
            navigate("/"); 
            setIsClosing(false);
        }, 500); 
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setIsVisible(false);
            onClose();
        }, 400);
    };

    if (!isVisible) return null;

    return (
        <div className={`welcome-modal-overlay ${isOpen ? "active" : ""}`}>
            <div
                className={`welcome-modal-box ${isOpen ? "active animated" : ""} ${isClosing ? "closing" : ""
                    }`}
            >
                <button className="close-btn" onClick={handleClose}>
                    ×
                </button>

                <div className="welcome-modal-form-container">
                    <h2>¡BIENVENIDO!</h2>
                    <p>
                        {name}, comienza a disfrutar de la experiencia de llevar tu moto al
                        mil, diseña y crea tus calcomanías a tu estilo
                    </p>

                    <div className="welcome-group-bottom">
                        <button
                            type="button"
                            className="welcome-submit-btn"
                            onClick={handleEnter}
                        >
                            <span>Entrar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
