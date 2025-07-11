import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import "./UpdateProductModal.css";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { context } from "../../../Context/Context";
import { DescriptionProductModal } from "../DescriptionProductModal/DescriptionProductModal";
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
    const [imagenesEliminadas, setImagenesEliminadas] = useState([]);

    const [precioDescuentoFromBackend, setPrecioDescuentoFromBackend] = useState(0);
    const [shouldRecalculate, setShouldRecalculate] = useState(false);

    const modalRef = useRef(null);
    const titleRef = useRef(null);
    const formRef = useRef(null);
    const firstGroupRef = useRef(null);
    const secondGroupRef = useRef(null);
    const fullGroupRef = useRef(null);
    const thirdGroupRef = useRef(null);
    const fourthGroupRef = useRef(null);
    const fifthGroupRef = useRef(null);
    const buttonsRef = useRef(null);

    const [formData, setFormData] = useState({
        referencia: "",
        nombre: "",
        descripcion: "",
        talla: "",
        marca: "",
        stock: "",
        precio_unidad: "",
        descuento: "",
        precio_descuento: "",
        FK_id_categoria: "",
        FK_id_subcategoria: "",
        imagenes: []
    });

    const clearStatusMessages = useCallback(() => {
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(false);
    }, [setIsLoading]);

    const parseFormattedNumber = (formattedValue) => {
        if (!formattedValue) return 0;
        return Number(formattedValue.toString().replace(/\./g, ""));
    };

    const formatNumber = (value) => {
        if (!value && value !== 0) return "";
        return Number(value).toLocaleString("es-ES");
    };

    // Función para animar elementos
    const animateElements = () => {
        if (!isOpen || !modalRef.current) return;

        const elements = [
            modalRef.current.querySelector('h2'),
            modalRef.current.querySelector('.form-update-product'),
            modalRef.current.querySelector('.group-register-product:nth-of-type(1)'),
            modalRef.current.querySelector('.group-register-product:nth-of-type(2)'),
            modalRef.current.querySelector('.form-group-full'),
            modalRef.current.querySelector('.group-register-product:nth-of-type(4)'),
            modalRef.current.querySelector('.group-register-product:nth-of-type(5)'),
            modalRef.current.querySelector('.group-register-product:nth-of-type(6)'),
            modalRef.current.querySelector('.modal-buttons-update-product')
        ].filter(Boolean);

        elements.forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease';
            }
        });

        setTimeout(() => {
            const title = modalRef.current?.querySelector('h2');
            if (title) {
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            }
        }, 100);

        setTimeout(() => {
            const form = modalRef.current?.querySelector('.form-update-product');
            if (form) {
                form.style.opacity = '1';
                form.style.transform = 'translateY(0)';
            }
        }, 200);

        setTimeout(() => {
            const firstGroup = modalRef.current?.querySelector('.group-register-product:nth-of-type(1)');
            if (firstGroup) {
                firstGroup.style.opacity = '1';
                firstGroup.style.transform = 'translateY(0)';
            }
        }, 300);

        setTimeout(() => {
            const secondGroup = modalRef.current?.querySelector('.group-register-product:nth-of-type(2)');
            if (secondGroup) {
                secondGroup.style.opacity = '1';
                secondGroup.style.transform = 'translateY(0)';
            }
        }, 400);

        setTimeout(() => {
            const fullGroup = modalRef.current?.querySelector('.form-group-full');
            if (fullGroup) {
                fullGroup.style.opacity = '1';
                fullGroup.style.transform = 'translateY(0)';
            }
        }, 500);

        setTimeout(() => {
            const thirdGroup = modalRef.current?.querySelector('.group-register-product:nth-of-type(4)');
            if (thirdGroup) {
                thirdGroup.style.opacity = '1';
                thirdGroup.style.transform = 'translateY(0)';
            }
        }, 600);

        setTimeout(() => {
            const fourthGroup = modalRef.current?.querySelector('.group-register-product:nth-of-type(5)');
            if (fourthGroup) {
                fourthGroup.style.opacity = '1';
                fourthGroup.style.transform = 'translateY(0)';
            }
        }, 700);

        setTimeout(() => {
            const fifthGroup = modalRef.current?.querySelector('.group-register-product:nth-of-type(6)');
            if (fifthGroup) {
                fifthGroup.style.opacity = '1';
                fifthGroup.style.transform = 'translateY(0)';
            }
        }, 800);

        setTimeout(() => {
            const buttons = modalRef.current?.querySelector('.modal-buttons-update-product');
            if (buttons) {
                buttons.style.opacity = '1';
                buttons.style.transform = 'translateY(0)';
            }
        }, 900);
    };

    const fetchProducto = useCallback(async () => {
        if (!referencia) return;
        try {
            const response = await fetch(`https://accesoriosapolobackend.onrender.com/obtener-productos?referencia=${referencia}`);
            const data = await response.json();
            if (data.success) {
                const producto = data.producto;
                setOriginalReferencia(producto.referencia || "");
                setImagenesBackend(producto.imagenes || []);
                setImagenesEliminadas([]);
                const precioUnidadNum = parseFormattedNumber(producto.precio_unidad);
                const descuentoNum = parseFormattedNumber(producto.descuento);
                const precioDescuentoNum = parseFormattedNumber(producto.precio_descuento);

                setPrecioDescuentoFromBackend(precioDescuentoNum);
                setShouldRecalculate(false);

                setFormData({
                    referencia: producto.referencia || "",
                    nombre: producto.nombre || "",
                    descripcion: producto.descripcion || "",
                    talla: producto.talla || "",
                    marca: producto.marca || "",
                    stock: producto.stock || "",
                    precio_unidad: precioUnidadNum,
                    descuento: descuentoNum,
                    precio_descuento: precioDescuentoNum,
                    FK_id_categoria: producto.categoria.seleccionada?.id || "",
                    FK_id_subcategoria: producto.subcategoria.seleccionada?.id || "",
                    imagenes: []
                });

                if (producto.categoria.todas) {
                    setCategorias(producto.categoria.todas);
                }
                if (producto.subcategoria.todas) {
                    setSubcategorias(producto.subcategoria.todas);
                }

                setTimeout(() => {
                    animateElements();
                }, 100);
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

        clearStatusMessages();

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'precio_unidad' || name === 'descuento') {
            setShouldRecalculate(true);
        }
    }, [clearStatusMessages]);

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
                marca: "",
                stock: "",
                precio_unidad: "",
                descuento: "",
                precio_descuento: "",
                FK_id_categoria: "",
                FK_id_subcategoria: "",
                imagenes: []
            });

            clearStatusMessages();
            setOriginalReferencia("");
            setImagenesBackend([]);
            setImagenesEliminadas([]);
            setPrecioDescuentoFromBackend(0);
            setShouldRecalculate(false);
        }, 300);
    }, [onClose, clearStatusMessages]);

    const handleUpdate = useCallback(async () => {
        clearStatusMessages();
        setIsLoading(true);
        try {
            const updateData = new FormData();
            updateData.append("referencia", originalReferencia);
            updateData.append("nuevaReferencia", formData.referencia);
            updateData.append("nombre", formData.nombre);
            updateData.append("descripcion", formData.descripcion);
            updateData.append("talla", formData.talla);
            updateData.append("marca", formData.marca);
            updateData.append("precio_unidad", formData.precio_unidad);
            updateData.append("descuento", formData.descuento);
            updateData.append("FK_id_categoria", formData.FK_id_categoria);
            updateData.append("FK_id_subcategoria", formData.FK_id_subcategoria);

            if (formData.imagenes && formData.imagenes.length > 0) {
                formData.imagenes.forEach(img => updateData.append("imagenes", img));
            }

            if (imagenesEliminadas.length > 0) {
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
                    clearStatusMessages();
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
    }, [originalReferencia, formData, imagenesEliminadas, setIsLoading, onUpdateSuccess, handleClose, clearStatusMessages]);

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

    const handleRemoveBackendImage = useCallback((index) => {
        clearStatusMessages();

        const imagenEliminada = imagenesBackend[index];
        setImagenesEliminadas(prev => [...prev, imagenEliminada]);
        setImagenesBackend(prev => prev.filter((_, i) => i !== index));
    }, [imagenesBackend, clearStatusMessages]);

    const handleRemoveNewImage = useCallback((index) => {
        clearStatusMessages();

        setFormData(prev => ({
            ...prev,
            imagenes: prev.imagenes.filter((_, i) => i !== index)
        }));
    }, [clearStatusMessages]);

    const handleFileChange = useCallback((e) => {
        clearStatusMessages();

        setFormData((prev) => ({
            ...prev,
            imagenes: Array.from(e.target.files)
        }));
    }, [clearStatusMessages]);

    const handleDescriptionSave = useCallback((value) => {
        clearStatusMessages();

        setFormData((prev) => ({ ...prev, descripcion: value }));
    }, [clearStatusMessages]);

    const getPrecioDescuentoDisplay = () => {
        if (shouldRecalculate && formData.precio_unidad && formData.descuento) {

            const precioUnidad = Number(formData.precio_unidad);
            const descuento = Number(formData.descuento);
            const nuevoPrecioDescuento = precioUnidad - (precioUnidad * (descuento / 100));
            return formatNumber(nuevoPrecioDescuento);
        } else if (precioDescuentoFromBackend) {
            return formatNumber(precioDescuentoFromBackend);
        }
        return "Cálculo precio con descuento";
    };

    useEffect(() => {
        if (isOpen && referencia) {
            console.log("Referencia recibida:", referencia);
            clearStatusMessages();
            fetchProducto();
        }
    }, [isOpen, referencia, fetchProducto, clearStatusMessages]);

    useEffect(() => {
        if (formData.FK_id_categoria) {
            fetchSubcategorias(formData.FK_id_categoria);
        }
    }, [formData.FK_id_categoria, fetchSubcategorias]);

    useEffect(() => {
        if (shouldRecalculate && formData.precio_unidad && formData.descuento) {
            const precioUnidad = Number(formData.precio_unidad);
            const descuento = Number(formData.descuento);
            const nuevoPrecioDescuento = precioUnidad - (precioUnidad * (descuento / 100));

            setFormData(prev => ({
                ...prev,
                precio_descuento: nuevoPrecioDescuento
            }));
        }
    }, [formData.precio_unidad, formData.descuento, shouldRecalculate]);

    if (!isOpen && !isClosing) return null;

    return (
        <div className="modal-overlay-update-product">
            <div
                ref={modalRef}
                className={`modal-content-update-product ${isClosing ? "exit" : "entry"}`}
            >
                <h2 ref={titleRef}>Editar Producto</h2>
                <form ref={formRef} className="form-update-product">
                    <div ref={firstGroupRef} className="group-register-product">
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

                    <div ref={secondGroupRef} className="group-register-product">
                        <div className="form-group-register-product">
                            <label>Descripción *</label>
                            <button
                                type="button"
                                className="btn-description-modal"
                                onClick={() => setIsDescriptionModalOpen(true)}
                            >
                                EDITAR
                            </button>
                        </div>

                        <div className="form-group-register-product">
                            <label>Talla *</label>
                            <input
                                type="text"
                                name="talla"
                                placeholder="Descripción opcional"
                                value={formData.talla}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div ref={fullGroupRef} className="form-group-full">
                        <label>Marca *</label>
                        <input
                            type="text"
                            name="marca"
                            placeholder="Escriba la marca"
                            value={formData.marca}
                            onChange={handleChange}
                        />
                    </div>

                    <div ref={thirdGroupRef} className="group-register-product">
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
                                value={formatNumber(formData.precio_unidad)}
                                onChange={(e) => {
                                    clearStatusMessages();

                                    const rawValue = e.target.value.replace(/\./g, "").replace(/[^0-9]/g, "");
                                    setFormData(prev => ({
                                        ...prev,
                                        precio_unidad: Number(rawValue)
                                    }));
                                    setShouldRecalculate(true);
                                }}
                            />
                        </div>
                    </div>

                    <div ref={fourthGroupRef} className="group-register-product">
                        <div className="form-group-register-product">
                            <label>Descuento *</label>
                            <input
                                type="number"
                                name="descuento"
                                placeholder="Ej: 10"
                                value={formData.descuento}
                                onChange={(e) => {
                                    handleChange(e);
                                    setShouldRecalculate(true);
                                }}
                                min="0"
                            />
                        </div>
                        <p>%</p>

                        <div className="form-group-register-product">
                            <label>Precio descuento *</label>
                            <label className="discount-price">
                                {getPrecioDescuentoDisplay() !== "Cálculo precio con descuento"
                                    ? `$ ${getPrecioDescuentoDisplay()}`
                                    : "Cálculo precio con descuento"
                                }
                            </label>
                        </div>
                    </div>

                    <div ref={fifthGroupRef} className="group-register-product">
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

                    <div ref={buttonsRef} className="modal-buttons-update-product">
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