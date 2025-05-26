import React, { useState, useEffect} from "react";
import "./ConfirmDeleteModal.css";
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const ConfirmDeleteModal = ({
    isOpen, onClose, title, description, onConfirm, isLoading, errorMessage, successMessage }) => {
    const [visible, setVisible] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            setAnimateOut(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        setAnimateOut(true);
        setTimeout(() => {
            setVisible(false);
            onClose();
        }, 500);
    };

    if (!visible) return null;

    return (
        <div className={`modal-overlay-delete ${animateOut ? "animate-fadeOut" : ""}`}>
            <div className={`modal-content-delete ${animateOut ? "animate-dropOut" : ""}`}>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="modal-buttons-delete">
                    <button className="btn-cancelar-delete" onClick={handleClose}>
                        Cancelar
                    </button>
                    <button className="btn-eliminar" onClick={onConfirm}>
                        {isLoading ? (
                            <img src={wheelIcon} alt="Cargando..." className="delete-user-spinner" />
                        ) : (
                            <span>CONFIRMAR</span>
                        )}
                    </button>
                </div>

                {errorMessage && (
                    <div className="status-message-delete error">
                        <span>{errorMessage}</span>
                        <i className="bi bi-x-circle"></i>
                    </div>
                )}

                {successMessage && (
                    <div className="status-message-delete success">
                        <span>{successMessage}</span>
                        <i className="bi bi-check-circle"></i>
                    </div>
                )}
            </div>
        </div>
    );
};
