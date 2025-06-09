import React, { useState, useEffect, useContext, useCallback } from "react";
import "./UpdateCategoryModal.css";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { context } from "../../../Context/Context";

export const UpdateCategoryModal = ({ isOpen, onClose, idCategoria, onUpdateSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");
    const [formData, setFormData] = useState({
        id_categoria_original: "",
        nombre_categoria: "",
        descripcion: "",
        descuento: ""
    });

    const clearStatusMessages = useCallback(() => {
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(false);
    }, [setIsLoading]);

    useEffect(() => {
        if (isOpen && idCategoria) fetchCategoria();
    }, [isOpen, idCategoria]);

    useEffect(() => {
        if (isOpen) {
            clearStatusMessages();
        }
    }, [isOpen, clearStatusMessages]);

    const fetchCategoria = async () => {
        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/obtener-categoria", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_categoria: idCategoria })
            });
            const data = await response.json();
            if (data.success) {
                setFormData({
                    id_categoria_original: data.categoria.id_categoria,
                    nombre_categoria: data.categoria.nombre_categoria,
                    descripcion: data.categoria.descripcion || "",
                    descuento: data.categoria.descuento
                });
            } else {
                setErrorMessage(data.mensaje);
            }
        } catch (error) {
            console.error("Error consultando categoría:", error);
        }
    };

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        clearStatusMessages();

        setFormData((prev) => ({ ...prev, [name]: value }));
    }, [clearStatusMessages]);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
            clearStatusMessages();
        }, 400);
    }, [onClose, clearStatusMessages]);

    const handleUpdate = useCallback(async () => {
        clearStatusMessages();
        setIsLoading(true);
        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/actualizar-categoria", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                setSuccessMessage("Categoría actualizada correctamente.");
                onUpdateSuccess();
                setTimeout(() => {
                    clearStatusMessages();
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al actualizar categoría."));
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error al actualizar categoría:", error);
            setErrorMessage("Error al actualizar categoría, intente nuevamente.");
            setIsLoading(false);
        }
    }, [formData, getErrorMessage, setIsLoading, onUpdateSuccess, handleClose, clearStatusMessages]);

    if (!isOpen && !isClosing) return null;

    return (
        <div className="modal-overlay-update-categorie">
            <div className={`modal-content-update-categorie ${isClosing ? "exit" : "entry"}`}>
                <h2>Editar Categoría</h2>
                <form className="form-update-categorie">
                    <div className="group-update-categorie">
                        <div className="form-group-update-categorie">
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="nombre_categoria"
                                value={formData.nombre_categoria}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group-update-categorie">
                            <label>Descripción</label>
                            <input
                                type="text"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group-update-categorie">
                        <label>Descuento (%)</label>
                        <input
                            type="number"
                            name="descuento"
                            value={formData.descuento}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="modal-buttons-update-categorie">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>CANCELAR</button>
                        <button type="button" className="btn-agregar" onClick={handleUpdate}>
                            {isLoading ? <img src={wheelIcon} alt="Cargando..." className="update-categorie-spinner" /> : <span>EDITAR</span>}
                        </button>
                    </div>
                </form>

                {errorMessage && <div className="status-message-update error"><span>{errorMessage}</span></div>}
                {successMessage && <div className="status-message-update success"><span>{successMessage}</span></div>}
            </div>
        </div>
    );
};