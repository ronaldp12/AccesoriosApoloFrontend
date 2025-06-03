import React, { useState } from "react";
import { createPortal } from "react-dom";
import "./PreviewImagesModal.css";
import { FaTimes, FaTrash, FaEye } from "react-icons/fa";

export const PreviewImagesModal = ({ images, onRemoveImage, showEyeIcon = true }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const openModal = (img = null) => {
        setSelectedImage(img || images[0]);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedImage(null);
    };

    if (!images.length) return null;

    return (
        <>
            {showEyeIcon && (
                <FaEye
                    className="eye-icon-preview"
                    onClick={() => openModal()}
                    title={`Ver ${images.length} imagen${images.length > 1 ? 's' : ''}`}
                />
            )}

            {isOpen && selectedImage && createPortal(
                <div className="modal-overlay-preview-image" onClick={closeModal}>
                    <div className="modal-content-preview-image" onClick={(e) => e.stopPropagation()}>
                        <FaTimes className="close-icon-preview-image" onClick={closeModal} />
                        <div className="main-image-preview-image">
                            <img src={URL.createObjectURL(selectedImage)} alt="Vista previa" />
                        </div>
                        <div className="thumbnails-modal-preview-image">
                            {images.map((img, index) => (
                                <div key={index} className="thumbnail-wrapper-modal">
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt={`mini-${index}`}
                                        className={`thumbnail-modal ${img === selectedImage ? "active" : ""}`}
                                        onClick={() => setSelectedImage(img)}
                                    />
                                    <button
                                        type="button"
                                        className="btn-remove-image-modal"
                                        onClick={() => onRemoveImage(index)}
                                        title="Eliminar imagen"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};