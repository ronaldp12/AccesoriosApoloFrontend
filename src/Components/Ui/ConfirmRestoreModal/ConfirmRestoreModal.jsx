import React, { useState, useEffect, useContext } from "react";
import "./ConfirmRestoreModal.css";
import { context } from "../../../Context/Context.jsx";
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const ConfirmRestoreModal = ({
    isOpen,
    onClose,
    usuario,
    onConfirmSuccess,
    title = "¿Confirmar acción?",
    message,
    confirmText = "CONFIRMAR",
    endpoint,
    method = "PUT",
    payloadKey = "correo"
}) => {
    const [visible, setVisible] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);

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

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ [payloadKey]: usuario[payloadKey] })
            });

            const data = await response.json();

            if (data.success) {
                setSuccessMessage("Usuario recuperado con éxito.");
                if (onConfirmSuccess) onConfirmSuccess();

                setTimeout(() => {
                    setSuccessMessage("");
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al realizar la acción."));
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error en la acción:", error);
            setErrorMessage("Hubo un error al realizar la acción.");
            setIsLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <div className={`modal-overlay-restore ${animateOut ? "animate-fadeOut" : ""}`}>
            <div className={`modal-content-restore ${animateOut ? "animate-dropOut" : ""}`}>
                <h3>{title}</h3>
                <p>
                    {message
                        ? message
                        : `¿Estás seguro que deseas continuar con ${usuario?.nombre} con cédula ${usuario?.cedula}?`}
                </p>
                <div className="modal-buttons-restore">
                    <button className="btn-cancelar-restore" onClick={handleClose}>
                        CANCELAR
                    </button>
                    <button className="btn-eliminar" onClick={handleConfirm}>
                        {isLoading ? (
                            <img src={wheelIcon} alt="Cargando..." className="confirm-restore-user-spinner" />
                        ) : (
                            <span>{confirmText}</span>
                        )}
                    </button>
                </div>

                {errorMessage && (
                    <div className="status-message-restore error">
                        <span>{errorMessage}</span>
                        <i className="bi bi-x-circle"></i>
                    </div>
                )}

                {successMessage && (
                    <div className="status-message-restore success">
                        <span>{successMessage}</span>
                        <i className="bi bi-check-circle"></i>
                        {setIsLoading(false)}
                    </div>
                )}
            </div>
        </div>
    );
};
