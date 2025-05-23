import React, { useState, useEffect } from "react";
import "./ConfirmRestoreModal.css";

export const ConfirmRestoreModal = ({ isOpen, onClose, usuario, onRestoreSuccess }) => {
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

    const handleRestore = async () => {
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
                if (onRestoreSuccess) onRestoreSuccess();
                handleClose();
            } else {
                alert(data.mensaje || "No se pudo reactivar el usuario.");
            }
        } catch (error) {
            console.error("Error al reactivar usuario:", error);
            alert("Error al intentar reactivar el usuario.");
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
                        Recuperar
                    </button>
                </div>
            </div>
        </div>
    );
};
