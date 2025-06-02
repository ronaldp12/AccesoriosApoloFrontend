import React, { useState, useEffect } from "react";
import "./ProductImagesModal.css";
import { FaTimes } from "react-icons/fa";

export const ProductImagesModal = ({ isOpen, onClose, images = [] }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (isOpen && images.length > 0) {
            setSelectedImage(images[0]);
        }
    }, [isOpen, images]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay-product-images">
            <div className="modal-content-product-images">
                <FaTimes className="close-icon" onClick={onClose} />

                <div className="main-image-container">
                    {selectedImage && <img src={selectedImage} alt="Producto" className="main-image" />}
                </div>

                <div className="thumbnails-container">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Thumbnail ${index}`}
                            className={`thumbnail ${img === selectedImage ? "active" : ""}`}
                            onClick={() => setSelectedImage(img)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
