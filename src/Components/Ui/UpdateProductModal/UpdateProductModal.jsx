import React, { useState, useEffect, useContext, useCallback } from "react";
import "./UpdateProductModal.css";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { context } from "../../../Context/Context";
import { DescriptionProductModal } from "../DescriptionProductModal/DescriptionProductModal";
import { PreviewImagesModal } from "../PreviewImagesModal/PreviewImagesModal";
import { UnifiedImagesModal } from "../UnifiedImagesModal/UnifiedImagesModal";

export const UpdateProductModal = ({ isOpen, onClose, referencia, onUpdateSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const [subcategorias, setSubcategorias] = useState([]);
    const [originalReferencia, setOriginalReferencia] = useState("");
    const [imagenesBackend, setImagenesBackend] = useState([]);
    // NUEVO: Array para trackear las imágenes eliminadas
    const [imagenesEliminadas, setImagenesEliminadas] = useState([]);
    const [formData, setFormData] = useState({
        referencia: "",
        nombre: "",
        descripcion: "",
        talla: "",
        stock: "",
        precio_unidad: "",
        descuento: "",
        precio_descuento: "",
        FK_id_categoria: "",
        FK_id_subcategoria: "",
        imagenes: []
    });

    const fetchProducto = useCallback(async () => {
        if (!referencia) return;
        try {
            const response = await fetch(`https://accesoriosapolobackend.onrender.com/obtener-productos?referencia=${referencia}`);
            const data = await response.json();
            if (data.success) {
                const producto = data.producto;
                setOriginalReferencia(producto.referencia || "");
                setImagenesBackend(producto.imagenes || []);
                // NUEVO: Resetear imágenes eliminadas cuando se carga un producto
                setImagenesEliminadas([]);
                setFormData({
                    referencia: producto.referencia || "",
                    nombre: producto.nombre || "",
                    descripcion: producto.descripcion || "",
                    talla: producto.talla || "",
                    stock: producto.stock || "",
                    precio_unidad: producto.precio_unidad || "",
                    descuento: producto.descuento || "",
                    precio_descuento: producto.precio_descuento || "",
                    FK_id_categoria: producto.categoria.seleccionada?.id || "",
                    FK_id_subcategoria: producto.subcategoria.seleccionada?.id || "",
                    imagenes: []
                });

                // Establecer las categorías disponibles
                if (producto.categoria.todas) {
                    setCategorias(producto.categoria.todas);
                }
                // Establecer las subcategorías disponibles
                if (producto.subcategoria.todas) {
                    setSubcategorias(producto.subcategoria.todas);
                }
            } else {
                setErrorMessage(data.mensaje);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Error al cargar el producto");
        }
    }, [referencia]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
            setFormData({
                referencia: "",
                nombre: "",
                descripcion: "",
                talla: "",
                stock: "",
                precio_unidad: "",
                descuento: "",
                precio_descuento: "",
                FK_id_categoria: "",
                FK_id_subcategoria: "",
                imagenes: []
            });
            setErrorMessage("");
            setSuccessMessage("");
            setOriginalReferencia("");
            setImagenesBackend([]);
            // NUEVO: Resetear imágenes eliminadas
            setImagenesEliminadas([]);
        }, 300);
    }, [onClose]);

    const handleUpdate = useCallback(async () => {
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(true);
        try {
            const updateData = new FormData();
            updateData.append("referencia", originalReferencia);
            updateData.append("nuevaReferencia", formData.referencia);
            updateData.append("nombre", formData.nombre);
            updateData.append("descripcion", formData.descripcion);
            updateData.append("talla", formData.talla);
            updateData.append("precio_unidad", formData.precio_unidad);
            updateData.append("descuento", formData.descuento);
            updateData.append("FK_id_categoria", formData.FK_id_categoria);
            updateData.append("FK_id_subcategoria", formData.FK_id_subcategoria);

            // Agregar imágenes solo si se seleccionaron nuevas
            if (formData.imagenes && formData.imagenes.length > 0) {
                formData.imagenes.forEach(img => updateData.append("imagenes", img));
            }

            // NUEVO: Enviar las imágenes eliminadas al backend
            if (imagenesEliminadas.length > 0) {
                // Puedes enviar como JSON string o como array separado
                updateData.append("imagenesEliminadas", JSON.stringify(imagenesEliminadas));
            }

            const response = await fetch("https://accesoriosapolobackend.onrender.com/actualizar-producto", {
                method: "PUT",
                body: updateData,
            });
            const data = await response.json();
            if (data.success) {
                setSuccessMessage("Producto actualizado correctamente.");
                onUpdateSuccess();
                setTimeout(() => {
                    setSuccessMessage("");
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(data.mensaje || "Error al actualizar producto.");
                setIsLoading(false);
            }
        } catch (error) {
            setErrorMessage("Error al actualizar producto, intente nuevamente.");
            setIsLoading(false);
        }
    }, [originalReferencia, formData, imagenesEliminadas, setIsLoading, onUpdateSuccess, handleClose]);

    const fetchSubcategorias = useCallback(async (idCategoria) => {
        try {
            const response = await fetch(`https://accesoriosapolobackend.onrender.com/subcategorias-productos/${idCategoria}`);
            const data = await response.json();
            if (data.success) {
                setSubcategorias(data.subcategorias);
            }
        } catch (error) {
            console.error("Error consultando subcategorías:", error);
        }
    }, []);

    // MODIFICADO: Función para manejar eliminación de imágenes del backend
    const handleRemoveBackendImage = useCallback((index) => {
        const imagenEliminada = imagenesBackend[index];

        // Agregar la imagen eliminada al array de eliminadas
        setImagenesEliminadas(prev => [...prev, imagenEliminada]);

        // Remover de las imágenes del backend
        setImagenesBackend(prev => prev.filter((_, i) => i !== index));
    }, [imagenesBackend]);

    const handleRemoveNewImage = useCallback((index) => {
        setFormData(prev => ({
            ...prev,
            imagenes: prev.imagenes.filter((_, i) => i !== index)
        }));
    }, []);

    const handleFileChange = useCallback((e) => {
        setFormData((prev) => ({
            ...prev,
            imagenes: Array.from(e.target.files)
        }));
    }, []);

    const handleDescriptionSave = useCallback((value) => {
        setFormData((prev) => ({ ...prev, descripcion: value }));
    }, []);

    useEffect(() => {
        if (isOpen && referencia) {
            console.log("Referencia recibida:", referencia);
            fetchProducto();
        }
    }, [isOpen, referencia, fetchProducto]);

    useEffect(() => {
        if (formData.FK_id_categoria) {
            fetchSubcategorias(formData.FK_id_categoria);
        }
    }, [formData.FK_id_categoria, fetchSubcategorias]);

    if (!isOpen && !isClosing) return null;

    return (
        <div className="modal-overlay-update-product">
            <div className={`modal-content-update-product ${isClosing ? "exit" : "entry"}`}>
                <h2>Editar Producto</h2>
                <form className="form-update-product">
                    <div className="group-register-product">
                        <div className="form-group-register-product">
                            <label>Referencia *</label>
                            <input
                                type="text"
                                name="referencia"
                                placeholder="Referencia"
                                value={formData.referencia}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group-register-product">
                            <label>Nombre del producto *</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Nombre del producto"
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
                                placeholder="Descripción opcional"
                                value={formData.talla}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="group-register-product">
                        <div className="form-group-register-product">
                            <div className="label-with-icon">
                                <label>Imagenes Producto *</label>
                                <UnifiedImagesModal
                                    currentImages={imagenesBackend}
                                    newImages={formData.imagenes}
                                    onRemoveCurrentImage={handleRemoveBackendImage}
                                    onRemoveNewImage={handleRemoveNewImage}
                                />
                            </div>

                            <input
                                type="file"
                                name="imagenes"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                            />

                        </div>

                        <div className="form-group-register-product">
                            <label>Precio *</label>
                            <input
                                type="text"
                                name="precio_unidad"
                                placeholder="Precio unidad"
                                value={formData.precio_unidad}
                                onChange={handleChange}
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
                                {formData.precio_descuento ? `$${formData.precio_descuento}` : "Cálculo precio con descuento"}
                            </label>
                        </div>
                    </div>

                    <div className="group-register-product">
                        <div className="form-group-register-product">
                            <label>Categoría que pertenece *</label>
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

                        <div className="form-group-register-product">
                            <label>Subcategoría que pertenece *</label>
                            <select
                                name="FK_id_subcategoria"
                                value={formData.FK_id_subcategoria}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona una subcategoría</option>
                                {subcategorias.map((sub) => (
                                    <option key={sub.id_subcategoria} value={sub.id_subcategoria}>
                                        {sub.nombre_subcategoria}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="modal-buttons-update-product">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>CANCELAR</button>
                        <button type="button" className="btn-agregar" onClick={handleUpdate}>
                            {isLoading ? <img src={wheelIcon} alt="Cargando..." className="update-product-spinner" /> : <span>EDITAR</span>}
                        </button>
                    </div>
                </form>

                {errorMessage && <div className="status-message-update error"><span>{errorMessage}</span></div>}
                {successMessage && <div className="status-message-update success"><span>{successMessage}</span></div>}
            </div>
            <DescriptionProductModal
                isOpen={isDescriptionModalOpen}
                onClose={() => setIsDescriptionModalOpen(false)}
                initialValue={formData.descripcion}
                onSave={handleDescriptionSave}
            />
        </div>
    );
};