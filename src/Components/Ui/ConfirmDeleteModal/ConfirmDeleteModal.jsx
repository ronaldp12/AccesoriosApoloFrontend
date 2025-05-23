import React, { useState, useEffect } from "react";
import "./ConfirmDeleteModal.css";

export const ConfirmDeleteModal = ({ isOpen, onClose, usuario, onDeleteSuccess }) => {
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

    const handleDelete = async () => {
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
                onDeleteSuccess();  
                handleClose(); 
            } else {
                alert(data.mensaje);
            }
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert("Ocurrió un error al intentar eliminar el usuario.");
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
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};
