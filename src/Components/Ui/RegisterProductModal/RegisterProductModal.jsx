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
    const [subcategorias, setSubcategorias] = useState([]);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        referencia: "",
        nombre: "",
        descripcion: "",
        talla: "",
        precio_unidad: "",
        descuento: "",
        FK_id_categoria: "",
        FK_id_subcategoria: "",
        imagenes: []
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
            dataToSend.append("referencia", formData.referencia);
            dataToSend.append("nombre", formData.nombre);
            dataToSend.append("descripcion", formData.descripcion);
            dataToSend.append("talla", formData.talla);
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
                            {formData.descripcion && (
                                <p className="preview-descripcion">{formData.descripcion.slice(0, 50)}...</p>
                            )}
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

                    <div className="group-register-product">
                        <div className="form-group-register-product">
                            <label>Imagenes Producto *</label>
                            <input
                                type="file"
                                name="imagenes"
                                accept="image/*"
                                multiple
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group-register-product">
                            <label>Precio *</label>
                            <input
                                type="number"
                                name="precio_unidad"
                                placeholder="Precio unidad"
                                value={formData.precio_unidad}
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
                            <label className="discount-price">
                                {formData.precio_unidad && formData.descuento
                                    ? `$ ${(formData.precio_unidad - (formData.precio_unidad * (formData.descuento / 100))).toFixed(2)}`
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
                                name="FK_id_subcategoria"
                                value={formData.FK_id_subcategoria}
                                onChange={handleChange}
                                required
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
                initialValue={formData.descripcion}
                onSave={(value) => setFormData((prev) => ({ ...prev, descripcion: value }))}
            />
        </div>
    );
};
