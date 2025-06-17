import React, { useState } from "react";
import "./ConfigureStickerModal.css";
import { X } from "lucide-react";
import ReactDOM from 'react-dom';

export const ConfigureStickerModal = ({ isOpen, onClose, imageSrc }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [customWidth, setCustomWidth] = useState("");
    const [customHeight, setCustomHeight] = useState("");

    const handleClose = () => {
        setIsClosing(true);
    };

    const handleAnimationEnd = () => {
        if (isClosing) {
            setIsClosing(false);
            onClose();
        }
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        setCustomWidth("");
        setCustomHeight("");
    };

    const handleCustomInput = (e, dimension) => {
        const value = e.target.value;
        if (dimension === "width") {
            setCustomWidth(value);
        } else {
            setCustomHeight(value);
        }
        if (value.trim() !== "") {
            setSelectedSize(null);
        }
    };

    if (!isOpen) return null;

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
                            placeholder="X"
                            value={customWidth}
                            onChange={(e) => handleCustomInput(e, "width")}
                        />{" "}
                        ×{" "}
                        <input
                            type="text"
                            placeholder="Y"
                            value={customHeight}
                            onChange={(e) => handleCustomInput(e, "height")}
                        />{" "}
                        cm
                    </div>
                </div>

                <div className="config-section">
                    <p className="config-label">Material</p>
                    <div className="material-options">
                        <label className="material-option">
                            <input checked type="checkbox" readOnly /> Papel Adhesivo
                        </label>

                        <div className="preview-image">
                            <img src={imageSrc} alt="Sticker Preview" />
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={handleClose}>Cancelar</button>
                    <button className="buy-btn">Ir a la compra</button>
                </div>
            </div>
        </div>,
        document.getElementById('root')
    );
};
