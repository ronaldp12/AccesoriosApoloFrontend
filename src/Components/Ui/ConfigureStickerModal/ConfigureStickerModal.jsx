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
    quantity = 1,
    isPersonalSticker = false
}) => {
    const stickerCartFunctions = UseStickers();

    const [showFloatingMessage, setShowFloatingMessage] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [customWidth, setCustomWidth] = useState("");
    const [customHeight, setCustomHeight] = useState("");
    const [currentPrice, setCurrentPrice] = useState(0);
    const [dimensionError, setDimensionError] = useState("");

    const [isAddingToCartLocal, setIsAddingToCartLocal] = useState(false);
    const [localSuccessMessage, setLocalSuccessMessage] = useState('');
    const [localErrorMessage, setLocalErrorMessage] = useState('');

    const {
        userLogin,
        handleAddStickerToCart,
        calculateStickerPrice: contextCalculatePrice,
        getSizeDimensions: contextGetSizeDimensions,
        loadCartFromBackend,
        handleAddToCartLocal
    } = useContext(context);

    const {
        addStickerToCart,
        getSizeDimensions: hookGetSizeDimensions,
        calculateStickerPrice: hookCalculatePrice,
        checkStock,
        isAddingToCart: hookIsAddingToCart,
        cartSuccessMessage: hookSuccessMessage,
        cartErrorMessage: hookErrorMessage
    } = stickerCartFunctions || {};

    const isSticker = () => {
        // Simplificamos la lógica
        const brandToCheck = brand || sticker?.brand;
        const typeToCheck = sticker?.type;

        console.log('Checking if is sticker:', {
            brand: brandToCheck,
            type: typeToCheck,
            sticker: sticker
        });

        // Si tiene type 'sticker', es sticker
        if (typeToCheck === 'sticker') return true;

        // Si el brand contiene 'calcomania' (sin importar acentos o case)
        if (brandToCheck) {
            const normalizedBrand = brandToCheck.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return normalizedBrand.includes("calcomania");
        }

        return true; // Por defecto asumimos que es sticker si llegamos hasta aquí
    };

    // Validar dimensiones personalizadas
    const validateCustomDimensions = (width, height) => {
        const w = parseInt(width);
        const h = parseInt(height);

        if (!width || !height) {
            return "Debes ingresar ambas dimensiones";
        }

        if (isNaN(w) || isNaN(h)) {
            return "Las dimensiones deben ser números válidos";
        }

        if (w < 5 || h < 5) {
            return "Las dimensiones mínimas son 5cm x 5cm";
        }

        if (w > 20 || h > 30) {
            return "Las dimensiones máximas son 20cm x 30cm";
        }

        return "";
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

    // Efecto para validar dimensiones personalizadas
    useEffect(() => {
        if (isPersonalSticker && customWidth && customHeight) {
            const error = validateCustomDimensions(customWidth, customHeight);
            setDimensionError(error);
        } else {
            setDimensionError("");
        }
    }, [customWidth, customHeight, isPersonalSticker]);

    // Efecto para calcular precio
    useEffect(() => {
        if (!sticker) return;

        let width, height;
        const getSizeDimensions = isPersonalSticker ? contextGetSizeDimensions : hookGetSizeDimensions;
        const calculatePrice = isPersonalSticker ? contextCalculatePrice : hookCalculatePrice;

        // Para calcomanías personalizadas con dimensiones custom
        if (isPersonalSticker && customWidth && customHeight && !dimensionError) {
            width = parseInt(customWidth);
            height = parseInt(customHeight);
        }
        // Para tamaños predefinidos
        else if (selectedSize && getSizeDimensions) {
            const dimensions = getSizeDimensions(selectedSize);
            width = dimensions?.width;
            height = dimensions?.height;
        }

        if (width && height && !isNaN(width) && !isNaN(height)) {
            if (isSticker() && sticker?.price && !isPersonalSticker) {
                // Lógica para calcomanías del staff
                let basePrice = sticker.price;
                let finalPrice = basePrice;
                if (selectedSize === "mediano") finalPrice = basePrice * 2.25;
                else if (selectedSize === "grande") finalPrice = basePrice * 4;
                if (sticker.discountPercent && sticker.discountPercent > 0) {
                    const discountAmount = (finalPrice * sticker.discountPercent) / 100;
                    finalPrice = finalPrice - discountAmount;
                }
                setCurrentPrice(finalPrice);
            } else if (calculatePrice) {
                // Lógica para calcomanías personalizadas
                setCurrentPrice(calculatePrice(width, height));
            }
        } else {
            const initialPrice = sticker?.discountedPrice || sticker?.price || 0;
            setCurrentPrice(initialPrice);
        }
    }, [selectedSize, customWidth, customHeight, sticker, isPersonalSticker, dimensionError, contextGetSizeDimensions, hookGetSizeDimensions, contextCalculatePrice, hookCalculatePrice]);

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
        setDimensionError('');
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        // Limpiar dimensiones personalizadas cuando se selecciona un tamaño predefinido
        if (isPersonalSticker) {
            setCustomWidth("");
            setCustomHeight("");
            setDimensionError("");
        }
    };

    const handleCustomDimensionChange = (type, value) => {
        if (type === 'width') {
            setCustomWidth(value);
        } else {
            setCustomHeight(value);
        }

        // Limpiar selección de tamaño cuando se usan dimensiones personalizadas
        if (value && selectedSize) {
            setSelectedSize(null);
        }
    };

    const getSizeConfig = () => {
        const getSizeDimensions = isPersonalSticker ? contextGetSizeDimensions : hookGetSizeDimensions;

        if (selectedSize && getSizeDimensions) {
            return getSizeDimensions(selectedSize);
        }
        return null;
    };

    const isValidConfiguration = () => {
        console.log('Validando configuración:', {
            isSticker: isSticker(),
            isPersonalSticker,
            selectedSize,
            customWidth,
            customHeight,
            dimensionError,
            brand: brand || sticker?.brand,
            stickerType: sticker?.type
        });

        if (isSticker()) {
            if (isPersonalSticker) {
                // Para calcomanías personalizadas: debe tener tamaño fijo O dimensiones custom válidas
                const hasValidSize = selectedSize !== null;
                const hasValidCustom = customWidth && customHeight &&
                    !dimensionError &&
                    parseInt(customWidth) > 0 && parseInt(customHeight) > 0;

                console.log('Personal sticker validation:', { hasValidSize, hasValidCustom });
                return hasValidSize || hasValidCustom;
            } else {
                // Para calcomanías del staff: solo tamaño seleccionado
                const isValid = selectedSize !== null;
                console.log('Staff sticker validation:', { isValid, selectedSize });
                return isValid;
            }
        }
        console.log('No es sticker');
        return false;
    };

    const getAvailableStock = () => {
        if (isPersonalSticker || !selectedSize || !checkStock || !sticker) return null;
        return checkStock(sticker, selectedSize);
    };

    const handleAddToCart = async () => {
        if (!isValidConfiguration()) {
            return;
        }

        // CASO: Usuario NO logueado.
        if (!userLogin) {
            setIsAddingToCartLocal(true);
            setLocalSuccessMessage('');
            setLocalErrorMessage('');

            let priceBeforeDiscount = sticker.price; // Empezamos con el precio base del sticker
            if (selectedSize === "mediano") {
                priceBeforeDiscount = sticker.price * 2.25;
            } else if (selectedSize === "grande") {
                priceBeforeDiscount = sticker.price * 4;
            }

            // Construimos el objeto para el carrito local.
             const itemParaCarritoLocal = {
                id: sticker.id,
                title: sticker.title,
                price: currentPrice, // Precio final con descuento (ej: 25.600)
                originalPrice: sticker.price, // Precio base unitario (ej: 8.000)
                priceBeforeDiscount: priceBeforeDiscount, // Precio con incremento, sin descuento (ej: 32.000)
                discountPercent: sticker.discountPercent || 0, // ¡¡NUEVO Y CRUCIAL!!
                image: sticker.image,
                brand: sticker.brand,
                size: selectedSize || 'custom',
                type: 'staff_sticker' // O la lógica que determine el tipo
            };

            handleAddToCartLocal(itemParaCarritoLocal);

            setShowFloatingMessage(true);
            setTimeout(() => {
                setShowFloatingMessage(false);
                handleClose();
            }, 2000);

            setIsAddingToCartLocal(false);
            return;
        }

        // CASO: Usuario SÍ logueado.
        setIsAddingToCartLocal(true);
        setLocalSuccessMessage('');
        setLocalErrorMessage('');

        try {
            let success = false;
            const sizeConfig = getSizeConfig();

            if (isPersonalSticker) {
                // Para calcomanías personalizadas
                let configToUse;
                if (customWidth && customHeight) {
                    configToUse = {
                        width: parseInt(customWidth),
                        height: parseInt(customHeight),
                        size: 'custom'
                    };
                } else {
                    configToUse = sizeConfig;
                }
                success = await handleAddStickerToCart(sticker, configToUse);
            } else {
                // Para calcomanías del staff
                const config = { ...sizeConfig, size: selectedSize, cantidad: quantity };
                success = await addStickerToCart(sticker, config);
            }

            if (success) {
                await loadCartFromBackend();
                setShowFloatingMessage(true);
                setTimeout(() => {
                    setShowFloatingMessage(false);
                    handleClose();
                }, 2000);
            }
        } catch (error) {
            console.error("Error al agregar al carrito en backend:", error);
        } finally {
            setIsAddingToCartLocal(false);
        }
    };

    useEffect(() => {
        if (isOpen && sticker && isSticker() && !isPersonalSticker && !selectedSize) {
            setSelectedSize('pequeño');
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
    const isCurrentlyAdding = isAddingToCartLocal || hookIsAddingToCart;
    const currentSuccessMessage = hookSuccessMessage || localSuccessMessage;
    const currentErrorMessage = hookErrorMessage || localErrorMessage;

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

                    {/* Botones de tamaño fijo - siempre se muestran */}
                    <div className="size-options">
                        <button
                            onClick={() => handleSizeSelect("pequeño")}
                            className={selectedSize === "pequeño" ? "selected-size" : ""}
                        >
                            Pequeño (5×5 cm)
                        </button>
                        <button
                            onClick={() => handleSizeSelect("mediano")}
                            className={selectedSize === "mediano" ? "selected-size" : ""}
                        >
                            Mediano (7×5 cm)
                        </button>
                        <button
                            onClick={() => handleSizeSelect("grande")}
                            className={selectedSize === "grande" ? "selected-size" : ""}
                        >
                            Grande (9×5 cm)
                        </button>
                    </div>

                    {/* Solo mostrar inputs personalizados si es calcomanía personal */}
                    {isPersonalSticker && (
                        <div className="dimensions-inputs">
                            <p className="config-label">Personaliza las dimensiones:</p>

                            <div className="dimension-input-group">
                                <div className="dimension-label">
                                    <label>Ancho (cm)</label>
                                    <small>(Min: 5, Max: 20)</small>
                                </div>
                                
                                <input
                                    type="number"
                                    value={customWidth}
                                    onChange={(e) => handleCustomDimensionChange('width', e.target.value)}
                                    min="5"
                                    max="20"
                                    placeholder="5-20"
                                />
                            </div>

                            <div className="dimension-input-group">
                                <div className="dimension-label">
                                    <label>Alto (cm)</label>
                                    <small>(Min: 5, Max: 30)</small>
                                </div>
                                <input
                                    type="number"
                                    value={customHeight}
                                    onChange={(e) => handleCustomDimensionChange('height', e.target.value)}
                                    min="5"
                                    max="30"
                                    placeholder="5-30"
                                />
                            </div>

                            {dimensionError && (
                                <div className="dimension-error">
                                    {dimensionError}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <p className="config-label">Cantidad: <span>{quantity}</span></p>

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
                            (() => {
                                const validConfig = !isValidConfiguration();
                                const adding = isCurrentlyAdding;
                                const dimError = isPersonalSticker && dimensionError;
                                const stockIssue = !isPersonalSticker && availableStock !== null && availableStock <= 0 && userLogin;

                                console.log('Button disabled conditions:', {
                                    validConfig,
                                    adding,
                                    dimError,
                                    stockIssue,
                                    isPersonalSticker,
                                    dimensionError,
                                    availableStock,
                                    userLogin
                                });

                                return validConfig || adding || dimError || stockIssue;
                            })()
                        }
                    >
                        {isCurrentlyAdding ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                Agregando...
                            </>
                        ) : 'Agregar al carrito'}
                    </button>
                </div>
            </div>
            {showFloatingMessage && (
                <div className="floating-message-sticker">
                    <i className="fa-solid fa-check-circle"></i>
                    <span>Item agregado al maletero</span>
                </div>
            )}
        </div>,
        document.getElementById('root')
    );
};