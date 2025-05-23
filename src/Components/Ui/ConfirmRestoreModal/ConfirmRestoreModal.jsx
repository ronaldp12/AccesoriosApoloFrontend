import React, { useState, useEffect, useContext } from "react";
import "./ConfirmRestoreModal.css";
import { context } from "../../../Context/Context.jsx";
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const ConfirmRestoreModal = ({ isOpen, onClose, usuario, onRestoreSuccess }) => {
    const [visible, setVisible] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");

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

    const handleRestore = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("https://accesoriosapolobackend.onrender.com/reactivar-usuario", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ correo: usuario.correo })
            });

            const data = await response.json();

            if (data.success) {
                setSuccessMessage("Usuario recuperado con éxito.");
                if (onRestoreSuccess) onRestoreSuccess();

                setTimeout(() => {
                    setSuccessMessage("");
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al recuperar usuario."));
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error al reactivar usuario:", error);
            setErrorMessage("Hubo un error al recuperar usuario.");
            setIsLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <div className={`modal-overlay-restore ${animateOut ? "animate-fadeOut" : ""}`}>
            <div className={`modal-content-restore ${animateOut ? "animate-dropOut" : ""}`}>
                <h3>Recuperar usuario?</h3>
                <p>
                    ¿Estás seguro que deseas recuperar al usuario{" "}
                    <strong>{usuario?.nombre}</strong> con cédula{" "}
                    <strong>{usuario?.cedula}</strong>?
                </p>
                <div className="modal-buttons-restore">
                    <button className="btn-cancelar-restore" onClick={handleClose}>
                        Cancelar
                    </button>
                    <button className="btn-eliminar" onClick={handleRestore}>
                        {isLoading ? (
                            <img src={wheelIcon} alt="Cargando..." className="confirm-restore-user-spinner" />
                        ) : (
                            <span>RECUPERAR</span>
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
