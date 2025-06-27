import React, { useState, useContext, useEffect } from "react";
import "./ConfigureStickerModal.css";
import { X, Loader2 } from "lucide-react";
import ReactDOM from 'react-dom';
import { context } from "../../../Context/Context.jsx";
import { UseStickers } from "../../Hook/UseStickers/UseStickers.jsx"; 

export const ConfigureStickerModal = ({
    isOpen,
    onClose,
    sticker,
    brand,
}) => {
    const stickerCartFunctions = UseStickers();

    const [isClosing, setIsClosing] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [customWidth, setCustomWidth] = useState("");
    const [customHeight, setCustomHeight] = useState("");
    const [currentPrice, setCurrentPrice] = useState(0);

    const { userLogin } = useContext(context);


    const {
        addStickerToCart,
        getSizeDimensions,
        calculateStickerPrice,
        checkStock,
        isAddingToCart,
        cartSuccessMessage,
        cartErrorMessage
    } = stickerCartFunctions || {};

    console.log('Modal - Funciones del hook cargadas:', {
        addStickerToCart: !!addStickerToCart,
        getSizeDimensions: !!getSizeDimensions,
        calculateStickerPrice: !!calculateStickerPrice,
        checkStock: !!checkStock,
        isAddingToCart,
        cartSuccessMessage,
        cartErrorMessage
    });

    const isSticker = () => {
        const brandToCheck = brand || sticker?.brand;
        const normalizedBrand = brandToCheck?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return normalizedBrand === "calcomania" || sticker?.type === 'sticker';
    };

    useEffect(() => {
        if (!sticker) return;

        let width, height;

        if (selectedSize && getSizeDimensions) {
            const dimensions = getSizeDimensions(selectedSize);
            width = dimensions.width;
            height = dimensions.height;
        } else if (customWidth && customHeight) {
            width = parseInt(customWidth);
            height = parseInt(customHeight);
        }

        if (width && height && !isNaN(width) && !isNaN(height)) {
            if (isSticker() && sticker?.price) {
                setCurrentPrice(sticker.price);
            } else if (calculateStickerPrice) {
                setCurrentPrice(calculateStickerPrice(sticker, { width, height }));
            }
        } else {
            setCurrentPrice(sticker?.price || 0);
        }
    }, [selectedSize, customWidth, customHeight, sticker, getSizeDimensions, calculateStickerPrice]);

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
        setCurrentPrice(sticker?.price || 0);
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        setCustomWidth("");
        setCustomHeight("");
    };

    const handleCustomInput = (e, dimension) => {
        const value = e.target.value;

        if (value === "") {
            if (dimension === "width") {
                setCustomWidth("");
            } else {
                setCustomHeight("");
            }
            return;
        }

        if (!/^\d{1,2}$/.test(value)) {
            return;
        }

        if (dimension === "width") {
            setCustomWidth(value);
        } else {
            setCustomHeight(value);
        }

        setSelectedSize(null);
    };

    const getSizeConfig = () => {
        if (selectedSize && getSizeDimensions) {
            return getSizeDimensions(selectedSize);
        } else if (customWidth && customHeight) {
            return {
                width: parseInt(customWidth),
                height: parseInt(customHeight),
                size: 'custom'
            };
        }
        return null;
    };

    const isValidConfiguration = () => {
        if (isSticker()) {
            return selectedSize !== null;
        }

        const sizeConfig = getSizeConfig();
        return sizeConfig && sizeConfig.width >= 5 && sizeConfig.height >= 5;
    };

    const getAvailableStock = () => {
        if (!selectedSize || !checkStock || !sticker) return null;
        return checkStock(sticker, selectedSize);
    };

    const handleAddToCart = async () => {
        console.log('handleAddToCart llamado');
        console.log('isValidConfiguration():', isValidConfiguration());
        console.log('userLogin:', userLogin);
        console.log('addStickerToCart disponible:', !!addStickerToCart);

        if (!isValidConfiguration()) {
            console.log('Configuración no válida');
            return;
        }

        if (!userLogin) {
            console.log('Usuario no logueado');
            return;
        }

        if (!addStickerToCart) {
            console.log('Función addStickerToCart no disponible - esto no debería pasar ahora');
            return;
        }

        const sizeConfig = {
            ...getSizeConfig(),
            size: selectedSize,
            cantidad: 1
        };

        console.log('Agregando al carrito:', {
            sticker,
            sizeConfig
        });

        const success = await addStickerToCart(sticker, sizeConfig);

        if (success) {
            setTimeout(() => {
                handleClose();
            }, 1500);
        }
    };

    if (!isOpen || !sticker) return null;

    const availableStock = getAvailableStock();

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
                            {checkStock && (
                                <span className="stock-info">
                                    Stock: {checkStock(sticker, 'small')}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => handleSizeSelect("medium")}
                            className={selectedSize === "medium" ? "selected-size" : ""}
                        >
                            Mediano (7×5 cm)
                            {checkStock && (
                                <span className="stock-info">
                                    Stock: {checkStock(sticker, 'medium')}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => handleSizeSelect("large")}
                            className={selectedSize === "large" ? "selected-size" : ""}
                        >
                            Grande (9×5 cm)
                            {checkStock && (
                                <span className="stock-info">
                                    Stock: {checkStock(sticker, 'large')}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mostrar stock disponible para el tamaño seleccionado */}
                    {selectedSize && availableStock !== null && (
                        <div className="selected-stock-info">
                            {availableStock > 0 ? (
                                <span className="stock-available">
                                    ✅ Stock disponible: {availableStock} unidades
                                </span>
                            ) : (
                                <span className="stock-unavailable">
                                    ❌ Sin stock disponible
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {!isSticker() && (
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
                )}

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

                {currentPrice > 0 && (
                    <div className="price-display">
                        <p className="current-price-sticker">
                            Precio: <strong>${currentPrice.toLocaleString("es-ES", { maximumFractionDigits: 2 })}</strong>
                        </p>
                    </div>
                )}

                {/* Mostrar mensajes */}
                {cartSuccessMessage && (
                    <div className="status-message-register success">
                        {cartSuccessMessage}
                    </div>
                )}

                {cartErrorMessage && (
                    <div className="status-message-register error">
                        {cartErrorMessage}
                    </div>
                )}

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={handleClose}>
                        Cancelar
                    </button>
                    <button
                        className="buy-btn"
                        onClick={handleAddToCart}
                        disabled={
                            !isValidConfiguration() ||
                            isAddingToCart ||
                            !userLogin ||
                            (availableStock !== null && availableStock <= 0)
                        }
                    >
                        {isAddingToCart ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                Agregando...
                            </>
                        ) : !userLogin ? (
                            'Inicia sesión'
                        ) : (availableStock !== null && availableStock <= 0) ? (
                            'Sin stock'
                        ) : (
                            'Agregar al carrito'
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById('root')
    );
};