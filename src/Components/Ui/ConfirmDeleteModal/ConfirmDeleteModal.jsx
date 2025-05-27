import React, { useState, useEffect, useContext } from "react";
import "./ConfirmDeleteModal.css";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { context } from "../../../Context/Context.jsx";

export const ConfirmDeleteModal = ({
    isOpen,
    onClose,
    title = "¿Confirmar eliminación?",
    description,
    usuario,
    onConfirmSuccess,
    confirmText = "ELIMINAR",
    endpoint,
    method = "PUT",
    payloadKey = "nit"
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
        if (!payloadKey || !usuario[payloadKey]) {
            console.error("No se especificó correctamente el payloadKey o su valor en usuario.");
            return;
        }

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
                setSuccessMessage("Eliminación exitosa.");
                if (onConfirmSuccess) onConfirmSuccess();

                setTimeout(() => {
                    setSuccessMessage("");
                    handleClose();
                }, 1000);
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
        <div className={`modal-overlay-delete ${animateOut ? "animate-fadeOut" : ""}`}>
            <div className={`modal-content-delete ${animateOut ? "animate-dropOut" : ""}`}>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="modal-buttons-delete">
                    <button className="btn-cancelar-delete" onClick={handleClose}>
                        CANCELAR
                    </button>
                    <button className="btn-eliminar" onClick={handleConfirm}>
                        {isLoading ? (
                            <img src={wheelIcon} alt="Cargando..." className="delete-user-spinner" />
                        ) : (
                            <span>{confirmText}</span>
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
                        {setIsLoading(false)}
                    </div>
                )}
            </div>
        </div>
    );
};
