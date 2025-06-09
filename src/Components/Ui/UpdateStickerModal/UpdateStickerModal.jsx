import React, { useState, useEffect, useContext, useCallback } from "react";
import "./UpdateStickerModal.css";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { context } from "../../../Context/Context";

export const UpdateStickerModal = ({ isOpen, onClose, idCalcomania, onUpdateSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");
    const [formData, setFormData] = useState({
        nombre: "",
        imagen: null
    });

    const clearStatusMessages = useCallback(() => {
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(false);
    }, [setIsLoading]);

    useEffect(() => {
        if (isOpen && idCalcomania) {
            fetchCalcomania();
        }
    }, [isOpen, idCalcomania]);

    useEffect(() => {
        if (isOpen) {
            clearStatusMessages();
        }
    }, [isOpen, clearStatusMessages]);

    const fetchCalcomania = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("https://accesoriosapolobackend.onrender.com/obtener-calcomania", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ id_calcomania: idCalcomania })
            });
            const data = await response.json();

            if (data.success) {
                setFormData({
                    nombre: data.calcomania.nombre,
                    imagen: null
                });
            } else {
                setErrorMessage(data.mensaje);
            }
        } catch (error) {
            console.error("Error consultando calcomanía:", error);
            setErrorMessage("Error al cargar los datos de la calcomanía.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = useCallback((e) => {
        const { name, value, files } = e.target;

        clearStatusMessages();

        if (name === "imagen") {
            setFormData((prev) => ({ ...prev, imagen: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    }, [clearStatusMessages]);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
            clearStatusMessages();
            // Limpiar el formulario
            setFormData({
                nombre: "",
                imagen: null
            });
        }, 400);
    }, [onClose, clearStatusMessages]);

    const handleUpdate = useCallback(async () => {
        // Validaciones básicas
        if (!formData.nombre.trim()) {
            setErrorMessage("El nombre de la calcomanía es requerido.");
            return;
        }

        clearStatusMessages();
        setIsLoading(true);

        try {
            const updateData = new FormData();
            updateData.append("id_calcomania", idCalcomania);
            updateData.append("nombre", formData.nombre);

            if (formData.imagen) {
                updateData.append("imagen", formData.imagen);
            }

            const response = await fetch("https://accesoriosapolobackend.onrender.com/actualizar-calcomania", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: updateData
            });

            const data = await response.json();

            if (data.success) {
                setSuccessMessage("Calcomanía actualizada correctamente.");
                onUpdateSuccess();
                setTimeout(() => {
                    clearStatusMessages();
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al actualizar calcomanía."));
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error al actualizar calcomanía:", error);
            setErrorMessage("Error al actualizar calcomanía, intente nuevamente.");
            setIsLoading(false);
        }
    }, [idCalcomania, formData, getErrorMessage, setIsLoading, onUpdateSuccess, clearStatusMessages, handleClose]);

    if (!isOpen && !isClosing) return null;

    return (
        <div className="modal-overlay-update-sticker">
            <div className={`modal-content-update-sticker ${isClosing ? "exit" : "entry"}`}>
                <h2>Editar Calcomanía</h2>
                <form className="form-update-sticker">
                    <div className="form-group-full-register-sticker">
                        <label>Nombre *</label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Escriba el nombre de la calcomanía"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group-full-register-sticker">
                        <label>Imagen Calcomanía (opcional)</label>
                        <input
                            type="file"
                            name="imagen"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="modal-buttons-update-sticker">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>
                            CANCELAR
                        </button>
                        <button type="button" className="btn-agregar" onClick={handleUpdate} disabled={isLoading}>
                            {isLoading ? (
                                <img src={wheelIcon} alt="Cargando..." className="update-sticker-spinner" />
                            ) : (
                                <span>EDITAR</span>
                            )}
                        </button>
                    </div>
                </form>

                {errorMessage && (
                    <div className="status-message-update error">
                        <span>{errorMessage}</span>
                    </div>
                )}
                {successMessage && (
                    <div className="status-message-update success">
                        <span>{successMessage}</span>
                    </div>
                )}
            </div>
        </div>
    );
};