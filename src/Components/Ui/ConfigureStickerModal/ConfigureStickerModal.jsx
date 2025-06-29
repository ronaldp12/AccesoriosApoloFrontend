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

    const [showFloatingMessage, setShowFloatingMessage] = useState(false);

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
        getSizeDimensions: contextGetSizeDimensions,
        loadCartFromBackend,
        handleAddToCartLocal
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
        }

        if (width && height && !isNaN(width) && !isNaN(height)) {
            if (isSticker() && sticker?.price && !isPersonalSticker) {
                let basePrice = sticker.price;
                let finalPrice = basePrice;
                if (selectedSize === "medium") finalPrice = basePrice * 2.25;
                else if (selectedSize === "large") finalPrice = basePrice * 4;
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
    };

    const getSizeConfig = () => {
        const getSizeDimensions = isPersonalSticker ? contextGetSizeDimensions : hookGetSizeDimensions;

        if (selectedSize && getSizeDimensions) {
            return getSizeDimensions(selectedSize);
        }
        return null;
    };

    const isValidConfiguration = () => {
        if (isSticker()) {
            return selectedSize !== null;
        }
        return false; // Se simplifica, ya que la personalización de medidas es para calcos personales
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

            // Construimos el objeto para el carrito local.
            const itemParaCarritoLocal = {
                id: sticker.id, // ID de la calcomanía del staff
                title: sticker.title,
                price: currentPrice,
                originalPrice: sticker.originalPrice,
                image: sticker.image,
                brand: sticker.brand,
                size: selectedSize, // 'small', 'medium', 'large'
                type: 'staff_sticker'
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
                // Llama a la función del contexto para calcomanías personalizadas.
                const customSizeConfig = { width: parseInt(customWidth) || 5, height: parseInt(customHeight) || 5, size: 'custom' };
                success = await handleAddStickerToCart(sticker, customSizeConfig);
            } else {
                // Llama a la función del hook UseStickers para calcomanías del staff.
                const config = { ...sizeConfig, size: selectedSize, cantidad: 1 };
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
                            !isValidConfiguration() ||
                            isCurrentlyAdding ||
                            (!isPersonalSticker && availableStock !== null && availableStock <= 0 && userLogin)
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