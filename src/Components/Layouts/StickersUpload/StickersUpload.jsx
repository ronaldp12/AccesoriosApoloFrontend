import React, { useRef, useCallback, useState, useEffect, useContext } from 'react';
import { Trash2 } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { context } from "../../../Context/Context.jsx";

export const StickersUpload = () => {
    const {
        selectedImage,
        setSelectedImage,
        croppedImage,
        setCroppedImage,
        isCropping,
        setIsCropping,
        clearStickerState
    } = useContext(context);

    const [isDragging, setIsDragging] = useState(false);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);

    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const imgRef = useRef(null);

    const onImageLoad = useCallback((e) => {
        const { width, height } = e.currentTarget;

        // Crop inicial que cubra TODA la imagen
        const crop = {
            unit: '%',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
        };

        setCrop(crop);
        setCompletedCrop(crop);
        imgRef.current = e.currentTarget;
    }, []);

    const handleFileSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
                setCroppedImage(null);
                setIsCropping(false);
                setCrop(undefined);
                setCompletedCrop(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const startCrop = () => {
        setIsCropping(true);
        const initialCrop = {
            unit: '%',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
        };
        setCrop(initialCrop);
        setCompletedCrop(initialCrop);
    };

    const deleteImage = () => {
        clearStickerState();
        setCompletedCrop(null);
        setCrop(undefined);
    };

    // Efecto para manejar el modo de recorte desde el contexto
    useEffect(() => {
        if (isCropping && selectedImage) {
            startCrop();
        }
    }, [isCropping, selectedImage]);

    return (
        <>
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Botón de eliminar imagen */}
            {selectedImage && (
                <div className="delete-image-container">
                    <button
                        className="delete-image-btn"
                        onClick={deleteImage}
                        title="Eliminar imagen"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            )}

            <main className="upload-area">
                <div
                    className={`drop-zone ${selectedImage ? 'has-image' : ''} ${isDragging ? 'dragging' : ''} ${isCropping ? 'cropping' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => !selectedImage && !isCropping && fileInputRef.current?.click()}
                >
                    {selectedImage ? (
                        !isCropping ? (
                            <div className="sticker-upload-image-container">
                                <img
                                    src={croppedImage || selectedImage}
                                    alt="Calcomanía"
                                    className="uploaded-image"
                                />
                            </div>
                        ) : (
                            <div className="crop-container">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    keepSelection={true}
                                    minWidth={50}
                                    minHeight={50}
                                >
                                    <img
                                        ref={imgRef}
                                        src={selectedImage}
                                        alt="Imagen para recortar"
                                        onLoad={onImageLoad}
                                    />
                                </ReactCrop>
                            </div>
                        )
                    ) : (
                        <div className="drop-zone-content">
                            <p>Arrastra tu imagen aquí o haz clic para seleccionar</p>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        style={{ display: 'none' }}
                    />
                </div>
            </main>
        </>
    );
};