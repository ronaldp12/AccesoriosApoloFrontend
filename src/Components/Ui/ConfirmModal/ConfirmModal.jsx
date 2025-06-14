import React from "react";
import "./ConfirmModal.css";
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const ConfirmModal = ({ isOpen, onClose, title, message, confirmText, onConfirm, errorMessage, successMessage, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-modal-overlay">
            <div className="confirm-modal">
                <h3 className="confirm-title">{title}</h3>
                <p className="confirm-message">{message}</p>
                <div className="confirm-actions">
                    <button className="btn-cancel" onClick={onClose}>Cancelar</button>
                    <button className="btn-confirm" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? (
                            <img src={wheelIcon} alt="Cargando..." className="register-sticker-spinner" />
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
                {errorMessage && (
                    <div className="status-message-register error">
                        <span>{errorMessage}</span>
                        <i className="bi bi-x-circle"></i>
                    </div>
                )}

                {successMessage && (
                    <div className="status-message-register success">
                        <span>{successMessage}</span>
                        <i className="bi bi-check-circle"></i>
                    </div>
                )}
            </div>
        </div>
    );
};
