import React, { useState, useEffect, useContext } from "react";
import "./UpdateCategoryModal.css";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { context } from "../../../Context/Context.jsx"

export const UpdateCategoryModal = ({ isOpen, onClose, nitProveedor, onUpdateSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");
    const [formData, setFormData] = useState({
        nit: "",
        representante: "",
        nombreEmpresa: "",
        correo: "",
        telefono: "",
        direccion: "",
    });

    useEffect(() => {
        if (isOpen && nitProveedor) {
            fetchProveedor();
        }
    }, [isOpen, nitProveedor]);

    const fetchProveedor = async () => {
        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/obtener-proveedor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nit: nitProveedor }),
            });
            const data = await response.json();
            if (data.success) {
                setFormData(data.proveedor);
            } else {
                alert(data.mensaje);
            }
        } catch (error) {
            console.error("Error consultando proveedor:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 400);
    };

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/actualizar-proveedor", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nitOriginal: nitProveedor, ...formData }),
            });
            const data = await response.json();
            if (data.success) {
                setSuccessMessage("Proveedor actualizado correctamente");
                onUpdateSuccess();
                setTimeout(() => {
                    setSuccessMessage("");
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al registrar usuario."));
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error al actualizar proveedor:', error);
            setErrorMessage("Error al actualizar proveedor, intente nuevamente.");
            setIsLoading(false);
        }

    };

    if (!isOpen && !isClosing) return null;

    return (
        <div className="modal-overlay-update-categorie">
            <div className={`modal-content-update-categorie ${isClosing ? "exit" : "entry"}`}>
                <h2>Editar Proveedor</h2>
                <form className="form-update-categorie">
                    <div className="group-update-categorie">
                        <div className="form-group-update-categorie">
                            <label>Nombre</label>
                            <input type="text" name="nit" value={formData.nit} onChange={handleChange} />
                        </div>

                        <div className="form-group-update-categorie">
                            <label>Descripción</label>
                            <input type="text" name="representante" value={formData.representante} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="group-update-categorie">
                        <div className="form-group-update-categorie">
                            <label>Promciones</label>
                            <input type="text" name="nombreEmpresa" value={formData.nombreEmpresa} onChange={handleChange} />
                        </div>

                        <div className="form-group-update-categorie">
                            <label>Subcategorías</label>
                            <input type="email" name="correo" value={formData.correo} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="modal-buttons-update-categorie">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>
                            CANCELAR
                        </button>
                        <button type="button" className="btn-agregar" onClick={handleUpdate}>
                            {isLoading ? (
                                <img src={wheelIcon} alt="Cargando..." className="update-categorie-spinner" />
                            ) : (
                                <span>EDITAR</span>
                            )}
                        </button>
                    </div>
                </form>
                {errorMessage && (
                    <div className="status-message-update error">
                        <span>{errorMessage}</span>
                        <i className="bi bi-x-circle"></i>
                    </div>
                )}

                {successMessage && (
                    <div className="status-message-update success">
                        <span>{successMessage}</span>
                        <i className="bi bi-check-circle"></i>
                    </div>
                )}
            </div>
        </div>
    );
};
