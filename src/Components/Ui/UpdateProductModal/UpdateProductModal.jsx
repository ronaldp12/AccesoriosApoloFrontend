import React, { useState, useEffect, useContext } from "react";
import "./UpdateProductModal.css";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { context } from "../../../Context/Context";
import { DescriptionProductModal } from "../DescriptionProductModal/DescriptionProductModal";

export const UpdateProductModal = ({ isOpen, onClose, idSubcategoria, onUpdateSuccess }) => {
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
        imagen: null
    });

    useEffect(() => {
        if (isOpen && idSubcategoria) {
            fetchSubcategoria();
        }
    }, [isOpen, idSubcategoria]);

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

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "imagen") {
            setFormData((prev) => ({ ...prev, imagen: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
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
                    setSuccessMessage("");
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
    };

    if (!isOpen && !isClosing) return null;

    return (
        <div className="modal-overlay-update-product">
            <div className={`modal-content-update-product ${isClosing ? "exit" : "entry"}`}>
                <h2>Editar Subcategoría</h2>
                <form className="form-update-product">
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
                onSave={(value) => setFormData((prev) => ({ ...prev, descripcion: value }))}
            />
        </div>
    );
};
