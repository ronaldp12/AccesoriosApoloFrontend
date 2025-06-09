import React, { useState, useEffect, useContext, useCallback } from "react";
import "./UpdateSubcategoryModal.css";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { context } from "../../../Context/Context";

export const UpdateSubcategoryModal = ({ isOpen, onClose, idSubcategoria, onUpdateSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [formData, setFormData] = useState({
        nombre_subcategoria: "",
        descripcion: "",
        descuento: "",
        FK_id_categoria: "",
        imagen: null
    });

    const clearStatusMessages = useCallback(() => {
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(false);
    }, [setIsLoading]);

    useEffect(() => {
        if (isOpen && idSubcategoria) {
            fetchSubcategoria();
        }
    }, [isOpen, idSubcategoria]);

    useEffect(() => {
        if (isOpen) {
            clearStatusMessages();
        }
    }, [isOpen, clearStatusMessages]);

    const fetchSubcategoria = async () => {
        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/obtener-subcategoria", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_subcategoria: idSubcategoria })
            });
            const data = await response.json();

            if (data.success) {
                setFormData({
                    nombre_subcategoria: data.subcategoria.nombre_subcategoria,
                    descripcion: data.subcategoria.descripcion || "",
                    descuento: data.subcategoria.descuento,
                    FK_id_categoria: data.subcategoria.FK_id_categoria,
                    imagen: null
                });
                setCategorias(data.categorias);
            } else {
                setErrorMessage(data.mensaje);
            }
        } catch (error) {
            console.error("Error consultando subcategoría:", error);
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
        }, 400);
    }, [onClose, clearStatusMessages]);

    const handleUpdate = useCallback(async () => {
        clearStatusMessages();
        setIsLoading(true);
        try {
            const updateData = new FormData();
            updateData.append("id_subcategoria", idSubcategoria);
            updateData.append("nombre_subcategoria", formData.nombre_subcategoria);
            updateData.append("descripcion", formData.descripcion);
            updateData.append("descuento", formData.descuento);
            updateData.append("FK_id_categoria", formData.FK_id_categoria);
            if (formData.imagen) {
                updateData.append("imagen", formData.imagen);
            }

            const response = await fetch("https://accesoriosapolobackend.onrender.com/actualizar-subcategoria", {
                method: "PUT",
                body: updateData
            });

            const data = await response.json();
            if (data.success) {
                setSuccessMessage("Subcategoría actualizada correctamente.");
                onUpdateSuccess();
                setTimeout(() => {
                    clearStatusMessages();
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al actualizar subcategoría."));
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error al actualizar subcategoría:", error);
            setErrorMessage("Error al actualizar subcategoría, intente nuevamente.");
            setIsLoading(false);
        }
    }, [idSubcategoria, formData, getErrorMessage, setIsLoading, onUpdateSuccess, clearStatusMessages, handleClose]);

    if (!isOpen && !isClosing) return null;

    return (
        <div className="modal-overlay-update-subcategorie">
            <div className={`modal-content-update-subcategorie ${isClosing ? "exit" : "entry"}`}>
                <h2>Editar Subcategoría</h2>
                <form className="form-update-subcategorie">
                    <div className="group-update-subcategorie">
                        <div className="form-group-update-subcategorie">
                            <label>Nombre de Subcategoría</label>
                            <input
                                type="text"
                                name="nombre_subcategoria"
                                value={formData.nombre_subcategoria}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group-update-subcategorie">
                            <label>Descripción</label>
                            <input
                                type="text"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="group-update-subcategorie">
                        <div className="form-group-update-subcategorie">
                            <label>Descuento (%)</label>
                            <input
                                type="number"
                                name="descuento"
                                value={formData.descuento}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group-update-subcategorie">
                            <label>Imagen</label>
                            <input
                                type="file"
                                name="imagen"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group-update-subcategorie">
                        <label>Categoría a la que pertenece</label>
                        <select
                            name="FK_id_categoria"
                            value={formData.FK_id_categoria}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona una categoría</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                    {categoria.nombre_categoria}
                                </option>
                            ))}
                        </select>
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