import React, { useState, useEffect, useContext } from "react";
import "./UpdateSubcategoryModal.css";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { context } from "../../../Context/Context";

export const UpdateSubcategoryModal = ({ isOpen, onClose, idCategoria, onUpdateSuccess }) => {
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

    useEffect(() => {
        if (isOpen && idCategoria) fetchCategoria();
    }, [isOpen, idCategoria]);

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
                    setSuccessMessage("");
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
    };

    if (!isOpen && !isClosing) return null;

    return (
        <div className="modal-overlay-update-subcategorie">
            <div className={`modal-content-update-subcategorie ${isClosing ? "exit" : "entry"}`}>
                <h2>Editar Subcategoría</h2>
                <form className="form-update-subcategorie">
                    <div className="group-update-subcategorie">
                        <div className="form-group-update-subcategorie">
                            <label>Nombre</label>
                            <input type="text" name="nombre_categoria" value={formData.nombre_categoria} onChange={handleChange} />
                        </div>
                        <div className="form-group-update-subcategorie">
                            <label>Descripción</label>
                            <input type="text" name="descripcion" value={formData.descripcion} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group-update-subcategorie">
                        <label>Descuento (%)</label>
                        <input type="number" name="descuento" value={formData.descuento} onChange={handleChange} />
                    </div>

                    <div className="modal-buttons-update-subcategorie">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>CANCELAR</button>
                        <button type="button" className="btn-agregar" onClick={handleUpdate}>
                            {isLoading ? <img src={wheelIcon} alt="Cargando..." className="update-subcategorie-spinner" /> : <span>EDITAR</span>}
                        </button>
                    </div>
                </form>

                {errorMessage && <div className="status-message-update error"><span>{errorMessage}</span></div>}
                {successMessage && <div className="status-message-update success"><span>{successMessage}</span></div>}
            </div>
        </div>
    );
};
