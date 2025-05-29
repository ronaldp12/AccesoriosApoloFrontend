import React from "react";
import "./ConfirmModal.css";

export const ConfirmModal = ({ isOpen, onClose, title, message, confirmText, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-modal-overlay">
            <div className="confirm-modal">
                <h3 className="confirm-title">{title}</h3>
                <p className="confirm-message">{message}</p>
                <div className="confirm-actions">
                    <button className="btn-cancel" onClick={onClose}>Cancelar</button>
                    <button className="btn-confirm" onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
};
