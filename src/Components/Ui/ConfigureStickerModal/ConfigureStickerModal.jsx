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
    isPersonalSticker = false
}) => {
    const stickerCartFunctions = UseStickers();
    console.log(sticker)

    const [isClosing, setIsClosing] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [customWidth, setCustomWidth] = useState("");
    const [customHeight, setCustomHeight] = useState("");
    const [currentPrice, setCurrentPrice] = useState(0);

    const [isAddingToCartLocal, setIsAddingToCartLocal] = useState(false);
    const [localSuccessMessage, setLocalSuccessMessage] = useState('');
    const [localErrorMessage, setLocalErrorMessage] = useState('');

    const {
        userLogin,
        handleAddStickerToCart, // Función del contexto para calcomanías personalizadas
        calculateStickerPrice: contextCalculatePrice,
        getSizeDimensions: contextGetSizeDimensions
    } = useContext(context);

    const {
        addStickerToCart, // Función del hook para calcomanías generales
        getSizeDimensions: hookGetSizeDimensions,
        calculateStickerPrice: hookCalculatePrice,
        checkStock,
        isAddingToCart: hookIsAddingToCart,
        cartSuccessMessage: hookSuccessMessage,
        cartErrorMessage: hookErrorMessage
    } = stickerCartFunctions || {};

    console.log('Modal - Tipo de calcomanía:', {
        isPersonalSticker,
        stickerType: sticker?.type,
        brand: brand || sticker?.brand
    });

    // Determinar si es una calcomanía (general o personalizada)
    const isSticker = () => {
        const brandToCheck = brand || sticker?.brand;
        const normalizedBrand = brandToCheck?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return normalizedBrand === "calcomania" || sticker?.type === 'sticker';
    };

    useEffect(() => {
        if (localSuccessMessage || localErrorMessage) {
            const timer = setTimeout(() => {
                setLocalSuccessMessage('');
                setLocalErrorMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [localSuccessMessage, localErrorMessage]);

    useEffect(() => {
        if (!sticker) return;

        let width, height;

        const getSizeDimensions = isPersonalSticker ? contextGetSizeDimensions : hookGetSizeDimensions;
        const calculatePrice = isPersonalSticker ? contextCalculatePrice : hookCalculatePrice;

        if (selectedSize && getSizeDimensions) {
            const dimensions = getSizeDimensions(selectedSize);
            width = dimensions?.width;
            height = dimensions?.height;
        } else if (customWidth && customHeight) {
            width = parseInt(customWidth);
            height = parseInt(customHeight);
        }

        if (width && height && !isNaN(width) && !isNaN(height)) {
            if (isSticker() && sticker?.price && !isPersonalSticker) {

                let basePrice = sticker.price;
                let finalPrice = basePrice;


                if (selectedSize === "medium") {
                    finalPrice = basePrice * 2.25; // +125%
                } else if (selectedSize === "large") {
                    finalPrice = basePrice * 4; // +300%
                }

                if (sticker.discountPercent && sticker.discountPercent > 0) {
                    const discountAmount = (finalPrice * sticker.discountPercent) / 100;
                    finalPrice = finalPrice - discountAmount;
                }

                setCurrentPrice(finalPrice);
            } else if (calculatePrice) {
                setCurrentPrice(calculatePrice(width, height));
            }
        } else {
            const initialPrice = sticker?.discountedPrice || sticker?.price || 0;
            setCurrentPrice(initialPrice);
        }
    }, [selectedSize, customWidth, customHeight, sticker, isPersonalSticker, contextGetSizeDimensions, hookGetSizeDimensions, contextCalculatePrice, hookCalculatePrice]);

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
        setLocalSuccessMessage('');
        setLocalErrorMessage('');
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
        const getSizeDimensions = isPersonalSticker ? contextGetSizeDimensions : hookGetSizeDimensions;

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
        // Solo verificar stock para calcomanías generales, no para personalizadas
        if (isPersonalSticker || !selectedSize || !checkStock || !sticker) return null;
        return checkStock(sticker, selectedSize);
    };

    const handleAddToCart = async () => {
        console.log('handleAddToCart llamado para:', {
            isPersonalSticker,
            stickerType: sticker?.type,
            selectedSize
        });

        if (!isValidConfiguration()) {
            console.log('Configuración no válida');
            return;
        }

        if (!userLogin) {
            console.log('Usuario no logueado');
            setLocalErrorMessage('Debes iniciar sesión para agregar productos al carrito');
            return;
        }

        setIsAddingToCartLocal(true);
        setLocalSuccessMessage('');
        setLocalErrorMessage('');

        try {
            let success = false;

            if (isPersonalSticker) {
                // Usar la función del contexto para calcomanías personalizadas
                console.log('Usando handleAddStickerToCart del contexto');

                if (!handleAddStickerToCart) {
                    setLocalErrorMessage('Error: función de carrito no disponible');
                    return;
                }

                const sizeConfig = getSizeConfig();
                success = await handleAddStickerToCart(sticker, sizeConfig);

                if (success) {
                    setLocalSuccessMessage('Calcomanía agregada al carrito exitosamente');
                }
            } else {
                console.log('Usando addStickerToCart del hook');

                if (!addStickerToCart) {
                    setLocalErrorMessage('Error: función de carrito no disponible');
                    return;
                }

                const sizeConfig = {
                    ...getSizeConfig(),
                    size: selectedSize,
                    cantidad: 1
                };

                success = await addStickerToCart(sticker, sizeConfig);

                // Para el hook, los mensajes se manejan internamente
                if (success) {
                    setLocalSuccessMessage('Calcomanía agregada al carrito exitosamente');
                }
            }

            if (success) {
                setTimeout(() => {
                    handleClose();
                }, 1500);
            }

        } catch (error) {
            console.error('Error en handleAddToCart:', error);
            setLocalErrorMessage('Error inesperado al agregar al carrito');
        } finally {
            setIsAddingToCartLocal(false);
        }
    };

    useEffect(() => {
        if (isOpen && sticker && isSticker() && !isPersonalSticker && !selectedSize) {
            console.log('Seleccionando tamaño pequeño por defecto');
            setSelectedSize('small');
        }
    }, [isOpen, sticker?.id, selectedSize]);

    const formatPrice = (price) => {
        return price.toLocaleString("es-CO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            useGrouping: true
        });
    };

    if (!isOpen || !sticker) return null;

    const availableStock = getAvailableStock();

    const isCurrentlyAdding = isPersonalSticker ? isAddingToCartLocal : (hookIsAddingToCart || isAddingToCartLocal);
    const currentSuccessMessage = isPersonalSticker ? localSuccessMessage : (hookSuccessMessage || localSuccessMessage);
    const currentErrorMessage = isPersonalSticker ? localErrorMessage : (hookErrorMessage || localErrorMessage);

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
                            {!isPersonalSticker && checkStock && (
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
                            {!isPersonalSticker && checkStock && (
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
                            {!isPersonalSticker && checkStock && (
                                <span className="stock-info">
                                    Stock: {checkStock(sticker, 'large')}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mostrar stock solo para calcomanías generales */}
                    {!isPersonalSticker && selectedSize && availableStock !== null && (
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
                            Precio: <strong>${formatPrice(currentPrice)}</strong>
                        </p>
                    </div>
                )}

                {/* Mostrar mensajes */}
                {currentSuccessMessage && (
                    <div className="status-message-register success">
                        {currentSuccessMessage}
                    </div>
                )}

                {currentErrorMessage && (
                    <div className="status-message-register error">
                        {currentErrorMessage}
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
                            isCurrentlyAdding ||
                            !userLogin ||
                            // Solo verificar stock para calcomanías generales
                            (!isPersonalSticker && availableStock !== null && availableStock <= 0)
                        }
                    >
                        {isCurrentlyAdding ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                Agregando...
                            </>
                        ) : !userLogin ? (
                            'Inicia sesión'
                        ) : (!isPersonalSticker && availableStock !== null && availableStock <= 0) ? (
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