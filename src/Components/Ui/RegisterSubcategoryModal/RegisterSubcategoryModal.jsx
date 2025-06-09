import React, { useState, useContext, useEffect } from "react";
import "./RegisterSubcategoryModal.css";
import { context } from "../../../Context/Context";
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const RegisterSubcategoryModal = ({ isOpen, onClose, onRegisterSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");
    const [categorias, setCategorias] = useState([]);

    const initialFormData = {
        nombre_subcategoria: "",
        descripcion: "",
        descuento: "",
        FK_id_categoria: "",
        imagen: null,
    };

    const [formData, setFormData] = useState(initialFormData);

    const clearMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setCategorias([]);
        clearMessages();
    };

    useEffect(() => {
        if (isOpen) {
            fetchCategorias();
            clearMessages();
        }
    }, [isOpen]);

    const fetchCategorias = async () => {
        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/categorias");
            const data = await response.json();
            if (data.success) {
                setCategorias(data.categorias);
            }
        } catch (error) {
            console.error("Error al obtener categorías:", error);
        }
    };

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

        try {
            const token = localStorage.getItem("token");

            const dataToSend = new FormData();
            dataToSend.append("nombre_subcategoria", formData.nombre_subcategoria);
            dataToSend.append("descripcion", formData.descripcion);
            dataToSend.append("descuento", parseFloat(formData.descuento));
            dataToSend.append("imagen", formData.imagen);
            dataToSend.append("FK_id_categoria", formData.FK_id_categoria);

            const response = await fetch("https://accesoriosapolobackend.onrender.com/registrar-subcategoria", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: dataToSend,
            });

            const data = await response.json();
            console.log("Respuesta backend:", data);

            if (data.success && response.ok) {
                setSuccessMessage("Subcategoría registrada con éxito.");
                setErrorMessage("");
                onRegisterSuccess();

                setTimeout(() => {
                    setSuccessMessage("");
                    resetForm();
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al registrar subcategoría."));
            }

            setIsLoading(false);
        } catch (error) {
            console.error("Error al registrar subcategoría:", error);
            setErrorMessage("Hubo un error al registrar la subcategoría.");
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay-register-subcategory">
            <div className={`modal-content-register-subcategory ${isClosing ? "exit" : "entry"}`}>
                <h2>Registrar subcategoría</h2>
                <form className="form-register-subcategory" onSubmit={handleSubmit}>
                    <div className="group-register-subcategory">
                        <div className="form-group-register-subcategory">
                            <label>Nombre de subcategoría *</label>
                            <input
                                type="text"
                                name="nombre_subcategoria"
                                placeholder="Nombre de la subcategoría"
                                value={formData.nombre_subcategoria}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group-register-subcategory">
                            <label>Descripción</label>
                            <input
                                type="text"
                                name="descripcion"
                                placeholder="Descripción opcional"
                                value={formData.descripcion}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="group-register-subcategory">
                        <div className="form-group-register-subcategory">
                            <label>Descuento *</label>
                            <input
                                type="number"
                                name="descuento"
                                placeholder="Ej: 10"
                                value={formData.descuento}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>
                        <p>%</p>

                        <div className="form-group-register-subcategory">
                            <label>Imagen subcategoría *</label>
                            <input
                                type="file"
                                name="imagen"
                                accept="image/*"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="group-register-subcategory">
                        <div className="form-group-register-subcategory">
                            <label>Categoría que pertenece *</label>
                            <select
                                name="FK_id_categoria"
                                value={formData.FK_id_categoria}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona una categoría</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                        {categoria.nombre_categoria}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="modal-buttons-register-subcategory">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>
                            CANCELAR
                        </button>
                        <button type="submit" className="btn-agregar">
                            {isLoading ? (
                                <img src={wheelIcon} alt="Cargando..." className="register-subcategory-spinner" />
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