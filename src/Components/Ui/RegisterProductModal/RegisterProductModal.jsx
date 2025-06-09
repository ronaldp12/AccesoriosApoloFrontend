import React, { useState, useContext, useEffect } from "react";
import "./RegisterProductModal.css";
import { context } from "../../../Context/Context";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { DescriptionProductModal } from "../DescriptionProductModal/DescriptionProductModal";
import { PreviewImagesModal } from "../PreviewImagesModal/PreviewImagesModal";

export const RegisterProductModal = ({ isOpen, onClose, onRegisterSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

    const initialFormData = {
        referencia: "",
        nombre: "",
        descripcion: "",
        talla: "",
        marca: "",
        precio_unidad: "",
        descuento: "",
        FK_id_categoria: "",
        FK_id_subcategoria: "",
        imagenes: []
    };

    const [formData, setFormData] = useState(initialFormData);

    const clearMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setSubcategorias([]);
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

    const fetchSubcategorias = async (idCategoria) => {
        try {
            const response = await fetch(`https://accesoriosapolobackend.onrender.com/subcategorias-productos/${idCategoria}`);
            const data = await response.json();
            if (data.success) {
                setSubcategorias(data.subcategorias);
            }
        } catch (error) {
            console.error("Error al obtener subcategorías:", error);
        }
    };

    if (!isOpen && !isClosing) return null;

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "imagenes") {
            setFormData((prev) => ({ ...prev, imagenes: files }));
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

    const handleSaveDescription = (newDescription) => {
        setFormData((prev) => ({ ...prev, descripcion: newDescription }));
        clearMessages();
    };

    const handleImageChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            imagenes: [...prev.imagenes, ...Array.from(e.target.files)]
        }));
        clearMessages();
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...formData.imagenes];
        updatedImages.splice(index, 1);
        setFormData((prev) => ({ ...prev, imagenes: updatedImages }));
        clearMessages();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        clearMessages();

        try {
            const token = localStorage.getItem("token");

            const dataToSend = new FormData();
            dataToSend.append("referencia", formData.referencia);
            dataToSend.append("nombre", formData.nombre);
            dataToSend.append("descripcion", formData.descripcion);
            dataToSend.append("talla", formData.talla);
            dataToSend.append("marca", formData.marca);
            dataToSend.append("precio_unidad", parseFloat(formData.precio_unidad));
            dataToSend.append("descuento", parseFloat(formData.descuento));
            dataToSend.append("FK_id_categoria", formData.FK_id_categoria);
            dataToSend.append("FK_id_subcategoria", formData.FK_id_subcategoria);
            for (let i = 0; i < formData.imagenes.length; i++) {
                dataToSend.append("imagenes", formData.imagenes[i]);
            }

            const response = await fetch("https://accesoriosapolobackend.onrender.com/registrar-producto", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: dataToSend,
            });

            const data = await response.json();
            console.log("Respuesta backend:", data);

            if (data.success && response.ok) {
                setSuccessMessage("Producto registrado con éxito.");
                setErrorMessage("");
                onRegisterSuccess();

                setTimeout(() => {
                    setSuccessMessage("");
                    resetForm();
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al registrar producto."));
            }

            setIsLoading(false);
        } catch (error) {
            console.error("Error al registrar producto:", error);
            setErrorMessage("Hubo un error al registrar el producto.");
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
                                name="referencia"
                                placeholder="Referencia del producto"
                                value={formData.referencia}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group-register-product">
                            <label>Nombre del producto *</label>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre del producto"
                                value={formData.nombre}
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
                        </div>

                        <div className="form-group-register-product">
                            <label>Talla</label>
                            <input
                                type="text"
                                name="talla"
                                placeholder="Ej: M, L, XL"
                                value={formData.talla}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group-full">
                        <label>Marca</label>
                        <input
                            type="text"
                            name="marca"
                            placeholder="Escriba la marca"
                            value={formData.marca}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="group-register-product">
                        <div className="form-group-register-product">
                            <div className="label-with-icon">
                                <label>Imagenes Producto *</label>
                                <PreviewImagesModal
                                    images={formData.imagenes}
                                    onRemoveImage={handleRemoveImage}
                                    showEyeIcon={true}
                                />
                            </div>
                            <input
                                type="file"
                                name="imagenes"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                            />
                        </div>

                        <div className="form-group-register-product">
                            <label>Precio *</label>
                            <input
                                type="text"
                                name="precio_unidad"
                                placeholder="Precio unidad"
                                value={`${formData.precio_unidad.toLocaleString("es-ES")}`}
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\./g, "").replace(/[^0-9]/g, "");
                                    setFormData({
                                        ...formData,
                                        precio_unidad: Number(rawValue)
                                    });
                                    clearMessages();
                                }}
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
                            />
                        </div>
                        <p>%</p>
                        <div className="form-group-register-product">
                            <label>Precio descuento *</label>
                            <label className="discount-price">
                                {formData.precio_unidad && formData.descuento
                                    ? `$ ${(formData.precio_unidad - (formData.precio_unidad * (formData.descuento / 100))).toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
                                    : "Cálculo precio con descuento"}
                            </label>
                        </div>
                    </div>

                    <div className="group-register-product">
                        <div className="form-group-register-product">
                            <label>Categoría que pertenece *</label>
                            <select
                                name="FK_id_categoria"
                                value={formData.FK_id_categoria}
                                onChange={(e) => {
                                    handleChange(e);
                                    fetchSubcategorias(e.target.value);
                                }}
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
                                name="FK_id_subcategoria"
                                value={formData.FK_id_subcategoria}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona una subcategoría</option>
                                {subcategorias.map((subcategoria) => (
                                    <option key={subcategoria.id_subcategoria} value={subcategoria.id_subcategoria}>
                                        {subcategoria.nombre_subcategoria}
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
                onSave={handleSaveDescription}
                initialValue={formData.descripcion}
            />

        </div>
    );
};