import React, { useState } from "react";
import "./StickerZoomModal.css";
import { X } from "lucide-react";

export const StickerZoomModal = ({ isOpen, imageSrc, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
    };

    const handleAnimationEnd = () => {
        if (isClosing) {
            setIsClosing(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className={`zoom-modal-overlay ${isClosing ? "closing" : ""}`}
            onAnimationEnd={handleAnimationEnd}
        >
            <div className="zoom-modal-content">
                <button className="close-zoom-button" onClick={handleClose}>
                    <X />
                </button>
                <img src={imageSrc} alt="Sticker Zoom" className="zoom-modal-image" />
            </div>
        </div>
    );
};
