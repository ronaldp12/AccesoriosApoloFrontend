import React, { useState, useEffect, useContext } from "react";
import "./ConfirmDeleteModal.css";
import { context } from "../../../Context/Context.jsx";
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const ConfirmDeleteModal = ({ isOpen, onClose, usuario, onDeleteSuccess }) => {
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

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://accesoriosapolobackend.onrender.com/eliminar-usuario", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ correo: usuario.correo }),
            });

            const data = await response.json();
            if (data.success) {
                setSuccessMessage("Usuario eliminado con éxito.");
                if (onDeleteSuccess) onDeleteSuccess();

                setTimeout(() => {
                    setSuccessMessage("");
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al eliminar usuario."));
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            setErrorMessage("Hubo un error al eliminar usuario.");
            setIsLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <div className={`modal-overlay-delete ${animateOut ? "animate-fadeOut" : ""}`}>
            <div className={`modal-content-delete ${animateOut ? "animate-dropOut" : ""}`}>
                <h3>¿Eliminar usuario?</h3>
                <p>
                    ¿Estás seguro que deseas eliminar al usuario{" "}
                    <strong>{usuario?.nombre}</strong> con cédula{" "}
                    <strong>{usuario?.cedula}</strong>?
                </p>
                <div className="modal-buttons-delete">
                    <button className="btn-cancelar-delete" onClick={handleClose}>
                        Cancelar
                    </button>
                    <button className="btn-eliminar" onClick={handleDelete}>
                        {isLoading ? (
                            <img src={wheelIcon} alt="Cargando..." className="delete-user-spinner" />
                        ) : (
                            <span>ELIMINAR</span>
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
