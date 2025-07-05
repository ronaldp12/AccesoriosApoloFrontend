import React, { useContext, useState, useEffect } from "react";
import styles from "./WelcomeModal.module.css";
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
        <div className={`${styles.welcomeModalOverlay} ${isOpen ? styles.active : ""}`}>
            <div
                className={`${styles.welcomeModalBox} ${isOpen ? `${styles.active} ${styles.animated}` : ""} ${isClosing ? styles.closing : ""
                    }`}
            >
                <button className={styles.closeBtn} onClick={handleClose}>
                    ×
                </button>

                <div className={styles.welcomeModalFormContainer}>
                    <h2>¡BIENVENIDO!</h2>
                    <p>
                        {name}, comienza a disfrutar de la experiencia de llevar tu moto al
                        mil, diseña y crea tus calcomanías a tu estilo
                    </p>

                    <div className={styles.welcomeGroupBottom}>
                        <button
                            type="button"
                            className={styles.welcomeSubmitBtn}
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