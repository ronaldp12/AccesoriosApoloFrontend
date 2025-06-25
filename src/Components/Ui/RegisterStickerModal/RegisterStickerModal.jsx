import React, { useState, useContext, useEffect, useRef } from "react";
import "./RegisterStickerModal.css";
import { context } from "../../../Context/Context";
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const RegisterStickerModal = ({ isOpen, onClose, onRegisterSuccess }) => {
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
        stock_pequeño: "",
        stock_mediano: "",
        stock_grande: "",
        currentStockValue: ""
    };

    const modalRef = useRef(null);

    const animateElements = () => {
        if (!isOpen || !modalRef.current) return;

        const elements = [
            modalRef.current.querySelector('h2'),
            modalRef.current.querySelector('.form-register-sticker'),
            ...modalRef.current.querySelectorAll('.form-group-full-register-sticker'),
            ...modalRef.current.querySelectorAll('.form-group-half-register-sticker'),
            modalRef.current.querySelector('.stock-section-register-sticker'),
            modalRef.current.querySelector('.modal-buttons-register-sticker')
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
        if (isOpen) {
            resetForm();

            setTimeout(() => {
                animateElements();
            }, 100);
        }
    }, [isOpen]);

    const [formData, setFormData] = useState(initialFormData);

    const clearMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
        setStockMessages({ pequeño: "", mediano: "", grande: "" });
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setActiveStockInput("pequeño");
        clearMessages();
    };

    useEffect(() => {
        if (isOpen) {
            clearMessages();
        }
    }, [isOpen]);

    if (!isOpen && !isClosing) return null;

    const calculateDiscountPrice = () => {
        const precioBase = parseFloat(formData.precio_unidad) || 0;
        const porcentaje = parseFloat(formData.porcentaje_descuento) || 0;

        if (precioBase > 0 && porcentaje >= 0 && porcentaje <= 100) {
            const descuento = (precioBase * porcentaje) / 100;
            return Math.floor(precioBase - descuento);
        }
        return 0;
    };


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "imagen") {
            setFormData((prev) => ({ ...prev, imagen: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        clearMessages();
    };

    const handleStockButtonClick = (size) => {
        setActiveStockInput(size);
        setFormData(prev => ({
            ...prev,
            currentStockValue: prev[`stock_${size}`] || ""
        }));

        // Limpiar mensaje anterior
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

        // Validaciones del formulario
        if (!formData.nombre.trim()) {
            setErrorMessage("El nombre es requerido.");
            setIsLoading(false);
            return;
        }

        if (!formData.imagen) {
            setErrorMessage("Debe seleccionar una imagen.");
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
            const token = localStorage.getItem("token");

            const dataToSend = new FormData();
            dataToSend.append("nombre", formData.nombre.trim());
            dataToSend.append("imagen", formData.imagen);
            dataToSend.append("precio_unidad", formData.precio_unidad);
            dataToSend.append("precio_descuento", calculateDiscountPrice());
            dataToSend.append("stock_pequeno", formData.stock_pequeño);
            dataToSend.append("stock_mediano", formData.stock_mediano);
            dataToSend.append("stock_grande", formData.stock_grande);

            const response = await fetch("https://accesoriosapolobackend.onrender.com/registrar-calcomania", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: dataToSend,
            });

            const data = await response.json();
            console.log("Respuesta backend:", data);

            if (data.success && response.ok) {
                setSuccessMessage("Calcomanía registrada con éxito.");
                setErrorMessage("");
                onRegisterSuccess();

                setTimeout(() => {
                    setSuccessMessage("");
                    resetForm();
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al registrar calcomanía."));
            }

            setIsLoading(false);
        } catch (error) {
            console.error("Error al registrar calcomanía:", error);
            setErrorMessage("Hubo un error al registrar la calcomanía.");
            setIsLoading(false);
        }
    };

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

    return (
        <div className="modal-overlay-register-sticker">
            <div ref={modalRef} className={`modal-content-register-sticker ${isClosing ? "exit" : "entry"}`}>
                <h2>Registrar Calcomanía</h2>
                <form className="form-register-sticker" onSubmit={handleSubmit}>
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
                        <label>Imagen Calcomanía *</label>
                        <input
                            type="file"
                            name="imagen"
                            accept="image/*"
                            onChange={handleChange}
                            required
                        />
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
                                required
                            />
                        </div>


                    </div>

                    <div className="form-group-full-register-sticker">
                        <label>Precio descuento *</label>
                        <label className="discount-price">
                            ${formatNumberWithThousands(calculateDiscountPrice())}
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

                    <div className="modal-buttons-register-sticker">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>
                            CANCELAR
                        </button>
                        <button type="submit" className="btn-agregar" disabled={isLoading}>
                            {isLoading ? (
                                <img src={wheelIcon} alt="Cargando..." className="register-sticker-spinner" />
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