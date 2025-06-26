import React, { useState, useContext, useEffect } from "react";
import "./ConfigureStickerModal.css";
import { X, Loader2 } from "lucide-react";
import ReactDOM from 'react-dom';
import { context } from "../../../Context/Context.jsx";

export const ConfigureStickerModal = ({ isOpen, onClose, sticker }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [customWidth, setCustomWidth] = useState("");
    const [customHeight, setCustomHeight] = useState("");
    const [currentPrice, setCurrentPrice] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const {
        handleAddStickerToCart,
        calculateStickerPrice,
        getSizeDimensions,
        isLoading,
        successMessage,
        errorMessage
    } = useContext(context);

    // Calcular precio cuando cambie el tamaño
    useEffect(() => {
        let width, height;

        if (selectedSize) {
            const dimensions = getSizeDimensions(selectedSize);
            width = dimensions.width;
            height = dimensions.height;
        } else if (customWidth && customHeight) {
            width = parseInt(customWidth);
            height = parseInt(customHeight);
        }

        if (width && height && !isNaN(width) && !isNaN(height)) {
            setCurrentPrice(calculateStickerPrice(width, height));
        } else {
            setCurrentPrice(0);
        }
    }, [selectedSize, customWidth, customHeight, calculateStickerPrice, getSizeDimensions]);

    const handleClose = () => {
        setIsClosing(true);
    };

    const handleAnimationEnd = () => {
        if (isClosing) {
            setIsClosing(false);
            resetModal();
            onClose();
        }
    };

    const resetModal = () => {
        setSelectedSize(null);
        setCustomWidth("");
        setCustomHeight("");
        setCurrentPrice(0);
        setIsAddingToCart(false);
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        setCustomWidth("");
        setCustomHeight("");
    };

    const handleCustomInput = (e, dimension) => {
        const value = e.target.value;

        // Permitir campo vacío
        if (value === "") {
            if (dimension === "width") {
                setCustomWidth("");
            } else {
                setCustomHeight("");
            }
            return;
        }

        // Validar que solo sean números
        if (!/^\d+$/.test(value)) {
            return;
        }

        const numValue = parseInt(value);

        // Validar rangos según la dimensión
        if (dimension === "width" && (numValue < 5 || numValue > 20)) {
            return;
        }

        if (dimension === "height" && (numValue < 5 || numValue > 30)) {
            return;
        }

        // Actualizar el estado correspondiente
        if (dimension === "width") {
            setCustomWidth(value);
        } else {
            setCustomHeight(value);
        }

        // Limpiar selección de tamaño predefinido cuando se escriba algo
        setSelectedSize(null);
    };

    const getSizeConfig = () => {
        if (selectedSize) {
            return getSizeDimensions(selectedSize);
        } else if (customWidth && customHeight) {
            return {
                width: parseInt(customWidth),
                height: parseInt(customHeight)
            };
        }
        return null;
    };

    const isValidConfiguration = () => {
        const sizeConfig = getSizeConfig();
        return sizeConfig && sizeConfig.width >= 5 && sizeConfig.height >= 5;
    };

    const handleAddToCart = async () => {
        if (!isValidConfiguration()) return;

        setIsAddingToCart(true);
        const sizeConfig = getSizeConfig();

        const success = await handleAddStickerToCart(sticker, sizeConfig);

        if (success) {
            setTimeout(() => {
                handleClose();
            }, 1500);
        }

        setIsAddingToCart(false);
    };

    if (!isOpen || !sticker) return null;

    return ReactDOM.createPortal(
        <div
            className={`config-modal-overlay ${isClosing ? "closing" : ""}`}
            onAnimationEnd={handleAnimationEnd}
        >
            <div className="config-modal-content">
                <button className="close-config-button" onClick={handleClose}>
                    <X />
                </button>

                <h2>Configura tu Calcomanía</h2>

                <div className="config-section">
                    <p className="config-label">Tamaño de calcomanía</p>
                    <div className="size-options">
                        <button
                            onClick={() => handleSizeSelect("small")}
                            className={selectedSize === "small" ? "selected-size" : ""}
                        >
                            Pequeño (5×5 cm)
                        </button>
                        <button
                            onClick={() => handleSizeSelect("medium")}
                            className={selectedSize === "medium" ? "selected-size" : ""}
                        >
                            Mediano (7×5 cm)
                        </button>
                        <button
                            onClick={() => handleSizeSelect("large")}
                            className={selectedSize === "large" ? "selected-size" : ""}
                        >
                            Grande (9×5 cm)
                        </button>
                    </div>
                </div>

                <div className="config-section">
                    <p className="config-label">Personalizar</p>
                    <div className="dimension-inputs">
                        <input
                            type="text"
                            placeholder="X (5-20)"
                            value={customWidth}
                            onChange={(e) => handleCustomInput(e, "width")}
                            maxLength="2"
                        />{" "}
                        ×{" "}
                        <input
                            type="text"
                            placeholder="Y (5-30)"
                            value={customHeight}
                            onChange={(e) => handleCustomInput(e, "height")}
                            maxLength="2"
                        />{" "}
                        cm
                    </div>
                    <small className="size-hint">
                        Ancho: 5-20 cm, Alto: 5-30 cm
                    </small>
                </div>

                <div className="config-section">
                    <p className="config-label">Material</p>
                    <div className="material-options">
                        <label className="material-option">
                            <input checked type="checkbox" readOnly /> Papel Adhesivo
                        </label>

                        <div className="preview-image">
                            <img src={sticker.image} alt="Sticker Preview" />
                        </div>
                    </div>
                </div>

                {/* Mostrar precio actual */}
                {currentPrice > 0 && (
                    <div className="price-display">
                        <p className="current-price-sticker ">
                            Precio: <strong>${currentPrice.toLocaleString("es-ES", { maximumFractionDigits: 2 })}</strong>
                        </p>
                    </div>
                )}

                {/* Mostrar mensajes */}
                {successMessage && (
                    <div className="status-message-register success">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="status-message-register error">
                        {errorMessage}
                    </div>
                )}

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={handleClose}>
                        Cancelar
                    </button>
                    <button
                        className="buy-btn"
                        onClick={handleAddToCart}
                        disabled={!isValidConfiguration() || isAddingToCart || isLoading}
                    >
                        {isAddingToCart || isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                Agregando...
                            </>
                        ) : (
                            'Agregar'
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById('root')
    );
};