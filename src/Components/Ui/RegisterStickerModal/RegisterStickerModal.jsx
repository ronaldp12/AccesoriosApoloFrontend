import React, { useState, useContext, useEffect } from "react";
import "./RegisterStickerModal.css";
import { context } from "../../../Context/Context";
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const RegisterStickerModal = ({ isOpen, onClose, onRegisterSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");

    const initialFormData = {
        nombre: "",
        imagen: null,
    };

    const [formData, setFormData] = useState(initialFormData);

    const clearMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    const resetForm = () => {
        setFormData(initialFormData);
        clearMessages();
    };

    useEffect(() => {
        if (isOpen) {
            clearMessages();
        }
    }, [isOpen]);

    if (!isOpen && !isClosing) return null;

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "imagen") {
            setFormData((prev) => ({ ...prev, imagen: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        clearMessages();
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            resetForm();
            onClose();
        }, 400);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        clearMessages();

        // Validaciones del formulario
        if (!formData.nombre.trim()) {
            setErrorMessage("El nombre es requerido.");
            setIsLoading(false);
            return;
        }

        if (!formData.imagen) {
            setErrorMessage("Debe seleccionar una imagen.");
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const dataToSend = new FormData();
            dataToSend.append("nombre", formData.nombre.trim());
            dataToSend.append("imagen", formData.imagen);

            const response = await fetch("https://accesoriosapolobackend.onrender.com/registrar-calcomania", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: dataToSend,
            });

            const data = await response.json();
            console.log("Respuesta backend:", data);

            if (data.success && response.ok) {
                setSuccessMessage("Calcomanía registrada con éxito.");
                setErrorMessage("");
                onRegisterSuccess();

                setTimeout(() => {
                    setSuccessMessage("");
                    resetForm();
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al registrar calcomanía."));
            }

            setIsLoading(false);
        } catch (error) {
            console.error("Error al registrar calcomanía:", error);
            setErrorMessage("Hubo un error al registrar la calcomanía.");
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay-register-sticker">
            <div className={`modal-content-register-sticker ${isClosing ? "exit" : "entry"}`}>
                <h2>Registrar Calcomanía</h2>
                <form className="form-register-sticker" onSubmit={handleSubmit}>
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
                        <label>Imagen Calcomanía *</label>
                        <input
                            type="file"
                            name="imagen"
                            accept="image/*"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="modal-buttons-register-sticker">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>
                            CANCELAR
                        </button>
                        <button type="submit" className="btn-agregar" disabled={isLoading}>
                            {isLoading ? (
                                <img src={wheelIcon} alt="Cargando..." className="register-sticker-spinner" />
                            ) : (
                                <span>REGISTRAR</span>
                            )}
                        </button>
                    </div>
                </form>

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