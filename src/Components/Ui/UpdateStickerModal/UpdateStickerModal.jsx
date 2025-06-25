import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import "./UpdateStickerModal.css";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { context } from "../../../Context/Context";

export const UpdateStickerModal = ({ isOpen, onClose, idCalcomania, onUpdateSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");
    const [activeStockInput, setActiveStockInput] = useState("pequeño");
    const [stockMessages, setStockMessages] = useState({
        pequeño: "",
        mediano: "",
        grande: ""
    });

    const initialFormData = {
        nombre: "",
        imagen: null,
        precio_unidad: "",
        porcentaje_descuento: "",
        precio_descuento: "",
        stock_pequeño: "",
        stock_mediano: "",
        stock_grande: "",
        currentStockValue: ""
    };

    const [formData, setFormData] = useState(initialFormData);
    const [originalData, setOriginalData] = useState(null);
    const modalRef = useRef(null);

    const clearStatusMessages = useCallback(() => {
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(false);
        setStockMessages({ pequeño: "", mediano: "", grande: "" });
    }, [setIsLoading]);

    const animateElements = () => {
        if (!isOpen || !modalRef.current) return;

        const elements = [
            modalRef.current.querySelector('h2'),
            modalRef.current.querySelector('.form-update-sticker'),
            ...modalRef.current.querySelectorAll('.form-group-full-register-sticker'),
            ...modalRef.current.querySelectorAll('.form-group-half-register-sticker'),
            modalRef.current.querySelector('.stock-section-register-sticker'),
            modalRef.current.querySelector('.modal-buttons-update-sticker')
        ].filter(Boolean);

        elements.forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease';
            }
        });

        elements.forEach((el, index) => {
            setTimeout(() => {
                if (el) {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }
            }, 100 + (index * 100));
        });
    };

    useEffect(() => {
        if (isOpen && idCalcomania) {
            fetchCalcomania();
            setTimeout(() => {
                animateElements();
            }, 100);
        }
    }, [isOpen, idCalcomania]);

    useEffect(() => {
        if (isOpen) {
            clearStatusMessages();
        }
    }, [isOpen, clearStatusMessages]);

    const fetchCalcomania = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("https://accesoriosapolobackend.onrender.com/obtener-calcomania", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ id_calcomania: idCalcomania })
            });
            const data = await response.json();

            if (data.success) {
                const calcomania = data.calcomania;

                const precioUnidadRaw = calcomania.precio_unidad.replace(/\$|\./g, '').replace(/\,/g, '');
                const precioDescuentoRaw = calcomania.precio_descuento.replace(/\$|\./g, '').replace(/\,/g, '');

                console.log('Datos del backend:', {
                    precio_unidad_original: calcomania.precio_unidad,
                    precio_descuento_original: calcomania.precio_descuento,
                    porcentaje_descuento_original: calcomania.porcentaje_descuento,
                    precio_unidad_raw: precioUnidadRaw,
                    precio_descuento_raw: precioDescuentoRaw
                });

                const loadedData = {
                    nombre: calcomania.nombre || "",
                    imagen: null,
                    precio_unidad: precioUnidadRaw || "",
                    porcentaje_descuento: calcomania.porcentaje_descuento?.toString() || "0",
                    precio_descuento: calcomania.precio_descuento?.toString() || "",
                    stock_pequeño: calcomania.stock_pequeno?.toString() || "",
                    stock_mediano: calcomania.stock_mediano?.toString() || "",
                    stock_grande: calcomania.stock_grande?.toString() || "",
                    currentStockValue: calcomania.stock_pequeno?.toString() || ""
                };

                console.log('FormData cargado:', loadedData);

                setFormData(loadedData);
                setOriginalData(calcomania);
                setActiveStockInput("pequeño");
            } else {
                setErrorMessage(data.mensaje);
            }
        } catch (error) {
            console.error("Error consultando calcomanía:", error);
            setErrorMessage("Error al cargar los datos de la calcomanía.");
        } finally {
            setIsLoading(false);
        }
    };

    const calculateDiscountPrice = useCallback(() => {
        const precioBase = parseFloat(formData.precio_unidad) || 0;
        const porcentaje = parseFloat(formData.porcentaje_descuento) || 0;

        if (precioBase > 0 && porcentaje >= 0 && porcentaje <= 100) {
            const descuento = (precioBase * porcentaje) / 100;
            return Math.floor(precioBase - descuento);
        }

        return precioBase;
    }, [formData.precio_unidad, formData.porcentaje_descuento]);

    useEffect(() => {
        if (!originalData) return;

        const nuevoPrecioDescuento = calculateDiscountPrice();

        if (nuevoPrecioDescuento.toString() !== formData.precio_descuento) {
            setFormData(prev => ({
                ...prev,
                precio_descuento: nuevoPrecioDescuento.toString()
            }));
        }
    }, [formData.precio_unidad, formData.porcentaje_descuento, originalData, calculateDiscountPrice]);

    const handleChange = useCallback((e) => {
        const { name, value, files } = e.target;

        clearStatusMessages();

        if (name === "imagen") {
            setFormData((prev) => ({ ...prev, imagen: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    }, [clearStatusMessages]);

    const handleStockButtonClick = (size) => {
        setActiveStockInput(size);
        setFormData(prev => ({
            ...prev,
            currentStockValue: prev[`stock_${size}`] || ""
        }));

        setStockMessages(prev => ({ ...prev, [size]: "" }));
    };

    const handleStockInputChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, currentStockValue: value }));
    };

    const handleSaveStock = () => {
        const value = formData.currentStockValue;
        if (value === "" || isNaN(value) || Number(value) < 0) {
            setStockMessages(prev => ({
                ...prev,
                [activeStockInput]: "Por favor ingrese un número válido"
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [`stock_${activeStockInput}`]: value,
            currentStockValue: ""
        }));

        setStockMessages(prev => ({
            ...prev,
            [activeStockInput]: `✓ Stock ${activeStockInput} guardado: ${value}`
        }));

        setTimeout(() => {
            setStockMessages(prev => ({ ...prev, [activeStockInput]: "" }));
        }, 2000);
    };

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
            clearStatusMessages();
            setFormData(initialFormData);
            setOriginalData(null);
            setActiveStockInput("pequeño");
        }, 400);
    }, [onClose, clearStatusMessages]);

    const handleUpdate = useCallback(async () => {
        clearStatusMessages();
        setIsLoading(true);

        if (!formData.nombre.trim()) {
            setErrorMessage("El nombre de la calcomanía es requerido.");
            setIsLoading(false);
            return;
        }

        if (!formData.precio_unidad || isNaN(formData.precio_unidad) || Number(formData.precio_unidad) <= 0) {
            setErrorMessage("El precio por unidad debe ser un número válido mayor a 0.");
            setIsLoading(false);
            return;
        }

        if (!formData.porcentaje_descuento || isNaN(formData.porcentaje_descuento) || Number(formData.porcentaje_descuento) < 0 || Number(formData.porcentaje_descuento) > 100) {
            setErrorMessage("El porcentaje de descuento debe ser un número válido entre 0 y 100.");
            setIsLoading(false);
            return;
        }

        if (!formData.stock_pequeño || !formData.stock_mediano || !formData.stock_grande) {
            setErrorMessage("Debe configurar el stock para todos los tamaños (pequeño, mediano y grande).");
            setIsLoading(false);
            return;
        }

        try {
            const updateData = new FormData();
            updateData.append("id_calcomania", idCalcomania);
            updateData.append("nombre", formData.nombre.trim());
            updateData.append("precio_unidad", formData.precio_unidad);
            updateData.append("precio_descuento", formData.precio_descuento);
            updateData.append("stock_pequeno", formData.stock_pequeño);
            updateData.append("stock_mediano", formData.stock_mediano);
            updateData.append("stock_grande", formData.stock_grande);

            if (formData.imagen) {
                updateData.append("imagen", formData.imagen);
            }

            const response = await fetch("https://accesoriosapolobackend.onrender.com/actualizar-calcomania", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: updateData
            });

            const data = await response.json();

            if (data.success) {
                setSuccessMessage("Calcomanía actualizada correctamente.");
                onUpdateSuccess();
                setTimeout(() => {
                    clearStatusMessages();
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al actualizar calcomanía."));
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error al actualizar calcomanía:", error);
            setErrorMessage("Error al actualizar calcomanía, intente nuevamente.");
            setIsLoading(false);
        }
    }, [idCalcomania, formData, getErrorMessage, setIsLoading, onUpdateSuccess, clearStatusMessages, handleClose]);

    const getStockButtonClass = (size) => {
        const baseClass = "stock-btn-register-sticker";
        const activeClass = activeStockInput === size ? "active" : "";
        const savedClass = formData[`stock_${size}`] ? "saved" : "";
        return `${baseClass} ${activeClass} ${savedClass}`.trim();
    };

    const formatNumberWithThousands = (value) => {
        if (!value) return "";
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    if (!isOpen && !isClosing) return null;

    return (
        <div className="modal-overlay-update-sticker">
            <div ref={modalRef} className={`modal-content-update-sticker ${isClosing ? "exit" : "entry"}`}>
                <h2>Editar Calcomanía</h2>
                <form className="form-update-sticker">
                    <div className="form-group-full-register-sticker">
                        <label>Nombre *</label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Escriba el nombre de la calcomanía"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group-full-register-sticker">
                        <label>Imagen Calcomanía (opcional)</label>
                        <input
                            type="file"
                            name="imagen"
                            accept="image/*"
                            onChange={handleChange}
                        />
                        {originalData && originalData.url_archivo && (
                            <div className="current-image-info">
                                <small>Imagen actual: {originalData.nombre}</small>
                            </div>
                        )}
                    </div>

                    <div className="form-row-register-sticker">
                        <div className="form-group-half-register-sticker">
                            <label>Precio Unidad *</label>
                            <input
                                type="text"
                                name="precio_unidad"
                                placeholder="0.00"
                                value={formatNumberWithThousands(formData.precio_unidad)}
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\./g, "").replace(/[^0-9]/g, "");
                                    setFormData({
                                        ...formData,
                                        precio_unidad: rawValue
                                    });
                                    clearStatusMessages();
                                }}
                            />
                        </div>

                        <div className="form-group-half-register-sticker">
                            <label>Porcentaje Descuento *</label>
                            <input
                                type="number"
                                name="porcentaje_descuento"
                                placeholder="0"
                                step="0.01"
                                min="0"
                                max="100"
                                value={formData.porcentaje_descuento}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group-full-register-sticker">
                        <label>Precio descuento *</label>
                        <label className="discount-price">
                            ${formatNumberWithThousands(formData.precio_descuento)}
                        </label>
                    </div>

                    <div className="stock-section-register-sticker">
                        <label>Configurar Stock por Tamaño *</label>

                        <div className="stock-buttons-register-sticker">
                            <button
                                type="button"
                                className={getStockButtonClass("pequeño")}
                                onClick={() => handleStockButtonClick("pequeño")}
                            >
                                Pequeño {formData.stock_pequeño && `(${formData.stock_pequeño})`}
                            </button>
                            <button
                                type="button"
                                className={getStockButtonClass("mediano")}
                                onClick={() => handleStockButtonClick("mediano")}
                            >
                                Mediano {formData.stock_mediano && `(${formData.stock_mediano})`}
                            </button>
                            <button
                                type="button"
                                className={getStockButtonClass("grande")}
                                onClick={() => handleStockButtonClick("grande")}
                            >
                                Grande {formData.stock_grande && `(${formData.stock_grande})`}
                            </button>
                        </div>

                        <div className="stock-input-group-register-sticker">
                            <input
                                type="number"
                                placeholder={`Ingrese stock para tamaño ${activeStockInput}`}
                                min="0"
                                value={formData.currentStockValue}
                                onChange={handleStockInputChange}
                            />
                            <button
                                type="button"
                                className="save-stock-btn-register-sticker"
                                onClick={handleSaveStock}
                            >
                                Guardar
                            </button>
                        </div>

                        {stockMessages[activeStockInput] && (
                            <div className={`stock-message-register-sticker ${stockMessages[activeStockInput].includes('✓') ? 'success' : 'error'}`}>
                                {stockMessages[activeStockInput]}
                            </div>
                        )}
                    </div>

                    <div className="modal-buttons-update-sticker">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>
                            CANCELAR
                        </button>
                        <button type="button" className="btn-agregar" onClick={handleUpdate} disabled={isLoading}>
                            {isLoading ? (
                                <img src={wheelIcon} alt="Cargando..." className="update-sticker-spinner" />
                            ) : (
                                <span>ACTUALIZAR</span>
                            )}
                        </button>
                    </div>
                </form>

                {errorMessage && (
                    <div className="status-message-update error">
                        <span>{errorMessage}</span>
                        <i className="bi bi-x-circle"></i>
                    </div>
                )}
                {successMessage && (
                    <div className="status-message-update success">
                        <span>{successMessage}</span>
                        <i className="bi bi-check-circle"></i>
                    </div>
                )}
            </div>
        </div>
    );
};