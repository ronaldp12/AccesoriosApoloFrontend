import React, { useState, useContext, useEffect } from "react";
import "./RegisterProductModal.css";
import { context } from "../../../Context/Context";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { DescriptionProductModal } from "../DescriptionProductModal/DescriptionProductModal";

export const RegisterProductModal = ({ isOpen, onClose, onRegisterSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        nombre_subcategoria: "",
        descripcion: "",
        descuento: "",
        FK_id_categoria: "",
        imagen: null,
    });

    useEffect(() => {
        if (isOpen) {
            fetchCategorias();
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
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 400);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

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
        <div className="modal-overlay-register-product">
            <div className={`modal-content-register-product ${isClosing ? "exit" : "entry"}`}>
                <h2>Registrar producto</h2>
                <form className="form-register-product" onSubmit={handleSubmit}>
                    <div className="group-register-product">
                        <div className="form-group-register-product">
                            <label>Referencia *</label>
                            <input
                                type="text"
                                name="nombre_subcategoria"
                                placeholder="Nombre de la subcategoría"
                                value={formData.nombre_subcategoria}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group-register-product">
                            <label>Nombre del producto *</label>
                            <input
                                type="text"
                                name="nombre_subcategoria"
                                placeholder="Nombre de la subcategoría"
                                value={formData.nombre_subcategoria}
                                onChange={handleChange}
                                required
                            />
                        </div>


                    </div>

                    <div className="group-register-product">

                        <div className="form-group-register-product">
                            <label>Descripción</label>
                            <button
                                type="button"
                                className="btn-description-modal"
                                onClick={() => setIsDescriptionModalOpen(true)}
                            >
                                Escribe la descripción
                            </button>
                            {formData.descripcion && (
                                <p className="preview-descripcion">{formData.descripcion.slice(0, 50)}...</p>
                            )}
                        </div>


                        <div className="form-group-register-product">
                            <label>Talla</label>
                            <input
                                type="text"
                                name="descripcion"
                                placeholder="Descripción opcional"
                                value={formData.descripcion}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="group-register-product">
                        <div className="form-group-register-product">
                            <label>Imagenes Producto *</label>
                            <input
                                type="file"
                                name="imagen"
                                accept="image/*"
                                multiple
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group-register-product">
                            <label>Precio *</label>
                            <input
                                type="file"
                                name="imagen"
                                accept="image/*"
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    <div className="group-register-product">
                        <div className="form-group-register-product">
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

                        <div className="form-group-register-product">
                            <label>Precio descuento *</label>
                            <label className="discount-price"> Cálculo precio con descuento</label>
                        </div>

                    </div>

                    <div className="group-register-product">
                        <div className="form-group-register-product">
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



                        <div className="form-group-register-product">
                            <label>Subcategoría que pertenece *</label>
                            <select
                                name="FK_id_categoria"
                                value={formData.FK_id_categoria}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona una subcategoría</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                        {categoria.nombre_categoria}
                                    </option>
                                ))}
                            </select>

                        </div>

                    </div>


                    <div className="modal-buttons-register-product">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>
                            CANCELAR
                        </button>
                        <button type="submit" className="btn-agregar">
                            {isLoading ? (
                                <img src={wheelIcon} alt="Cargando..." className="register-product-spinner" />
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
            <DescriptionProductModal
                isOpen={isDescriptionModalOpen}
                onClose={() => setIsDescriptionModalOpen(false)}
                initialValue={formData.descripcion}
                onSave={(value) => setFormData((prev) => ({ ...prev, descripcion: value }))}
            />

        </div>
    );
};
