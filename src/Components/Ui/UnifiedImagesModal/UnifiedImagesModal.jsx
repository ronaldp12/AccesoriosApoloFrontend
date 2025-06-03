import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import "./UnifiedImagesModal.css";
import { FaTimes, FaTrash, FaImage } from "react-icons/fa";

export const UnifiedImagesModal = ({
    currentImages = [],
    newImages = [],
    onRemoveCurrentImage,
    onRemoveNewImage
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('current');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [currentImageURLs, setCurrentImageURLs] = useState([]);
    const [newImageURLs, setNewImageURLs] = useState([]);
    const urlsRef = useRef([]);

    useEffect(() => {
        return () => {
            urlsRef.current.forEach((url) => {
                if (url && url.startsWith("blob:")) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, []);

    useEffect(() => {
        if (!currentImages || currentImages.length === 0) {
            setCurrentImageURLs([]);
            return;
        }

        const urls = currentImages.map((img) => {
            if (typeof img === "string") {
                return img;
            } else if (img instanceof File || img instanceof Blob) {
                return URL.createObjectURL(img);
            }
            return null;
        }).filter(Boolean);

        setCurrentImageURLs(urls);
    }, [currentImages]);

    // Generar URLs para imágenes nuevas
    useEffect(() => {
        if (!newImages || newImages.length === 0) {
            setNewImageURLs([]);
            return;
        }

        // Limpiar URLs anteriores de imágenes nuevas
        urlsRef.current.forEach((url) => {
            if (url && url.startsWith("blob:")) {
                URL.revokeObjectURL(url);
            }
        });

        const urls = newImages.map((img) => {
            if (typeof img === "string") {
                return img;
            } else if (img instanceof File || img instanceof Blob) {
                return URL.createObjectURL(img);
            }
            return null;
        }).filter(Boolean);

        urlsRef.current = urls;
        setNewImageURLs(urls);
    }, [newImages]);

    const totalImages = currentImages.length + newImages.length;

    // Obtener las imágenes de la pestaña activa
    const getActiveImages = useCallback(() => {
        return activeTab === 'current' ? currentImageURLs : newImageURLs;
    }, [activeTab, currentImageURLs, newImageURLs]);

    // Obtener el array de datos originales de la pestaña activa
    const getActiveImageData = useCallback(() => {
        return activeTab === 'current' ? currentImages : newImages;
    }, [activeTab, currentImages, newImages]);

    const openModal = useCallback(() => {
        if (totalImages > 0) {
            const defaultTab = currentImages.length > 0 ? 'current' : 'new';
            setActiveTab(defaultTab);
            setSelectedImageIndex(0);
            setIsOpen(true);
        }
    }, [totalImages, currentImages.length]);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setSelectedImageIndex(0);
    }, []);

    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
        setSelectedImageIndex(0);
    }, []);

    const handleImageSelect = useCallback((index) => {
        setSelectedImageIndex(index);
    }, []);

    const handleRemoveImage = useCallback((index) => {
        if (activeTab === 'current') {
            if (onRemoveCurrentImage) {
                onRemoveCurrentImage(index);
            }
        } else {
            if (onRemoveNewImage) {
                onRemoveNewImage(index);
            }
        }

        const activeImages = getActiveImages();

        
        if (index === selectedImageIndex) {
            const newSelectedIndex = index === 0 ? 0 : index - 1;
            setSelectedImageIndex(newSelectedIndex);
        } else if (index < selectedImageIndex) {
            setSelectedImageIndex(prev => Math.max(0, prev - 1));
        }

        if (activeImages.length <= 1) {
            const otherTab = activeTab === 'current' ? 'new' : 'current';
            const otherImages = otherTab === 'current' ? currentImageURLs : newImageURLs;

            if (otherImages.length > 0) {
                setActiveTab(otherTab);
                setSelectedImageIndex(0);
            } else {
                closeModal();
            }
        }
    }, [activeTab, onRemoveCurrentImage, onRemoveNewImage, selectedImageIndex, getActiveImages, currentImageURLs, newImageURLs, closeModal]);

    useEffect(() => {
        if (isOpen && totalImages === 0) {
            closeModal();
        }
    }, [totalImages, isOpen, closeModal]);

    if (totalImages === 0) return null;

    const activeImages = getActiveImages();
    const selectedImageUrl = activeImages[selectedImageIndex];

    return (
        <>
            <FaImage
                className="open-preview-button unified-images-button"
                onClick={openModal} /> ({totalImages})

            {isOpen &&
                createPortal(
                    <div className="modal-overlay-preview-image" onClick={closeModal}>
                        <div className="modal-content-preview-image unified-modal" onClick={(e) => e.stopPropagation()}>
                                <button className="close-icon-preview-image" onClick={closeModal}>
                                    <FaTimes />
                                </button>

                            <div className="tabs-container">
                                <button
                                    className={`tab-button ${activeTab === 'current' ? 'active' : ''} ${currentImages.length === 0 ? 'disabled' : ''}`}
                                    onClick={() => handleTabChange('current')}
                                    disabled={currentImages.length === 0}
                                >
                                    Imágenes Actuales ({currentImages.length})
                                </button>
                                <button
                                    className={`tab-button ${activeTab === 'new' ? 'active' : ''} ${newImages.length === 0 ? 'disabled' : ''}`}
                                    onClick={() => handleTabChange('new')}
                                    disabled={newImages.length === 0}
                                >
                                    Nuevas Imágenes ({newImages.length})
                                </button>
                            </div>

                            <div className="tab-content">
                                {activeImages.length > 0 && (
                                    <>
                                        <div className="main-image-container">
                                            <img
                                                src={selectedImageUrl}
                                                alt="Imagen seleccionada"
                                                className="main-image-display"
                                                onError={(e) => {
                                                    console.log('Error loading image:', e.target.src);
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className={`remove-main-image-btn ${activeTab}`}
                                                onClick={() => handleRemoveImage(selectedImageIndex)}
                                                title={`Eliminar imagen ${activeTab === 'current' ? 'actual' : 'nueva'}`}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>

                                        <div className="thumbnails-bar">
                                            {activeImages.map((url, index) => (
                                                <div
                                                    key={`${activeTab}-${index}-${url}`}
                                                    className={`thumbnail-item ${selectedImageIndex === index ? 'selected' : ''}`}
                                                    onClick={() => handleImageSelect(index)}
                                                >
                                                    <img
                                                        src={url}
                                                        alt={`Miniatura ${index + 1}`}
                                                        className="thumbnail-image"
                                                        onError={(e) => {
                                                            console.log('Error loading thumbnail:', e.target.src);
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className={`thumbnail-remove-btn ${activeTab}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveImage(index);
                                                        }}
                                                        title={`Eliminar imagen ${activeTab === 'current' ? 'actual' : 'nueva'}`}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {activeImages.length === 0 && (
                                    <div className="no-images-message">
                                        <p>No hay imágenes en esta sección</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};