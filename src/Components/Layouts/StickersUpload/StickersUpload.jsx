import React, { useRef, useCallback, useState, useEffect, useContext } from 'react';
import { Trash2, CheckCircle, AlertCircle, Check, X } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { context } from "../../../Context/Context.jsx";
import wheelIcon from '../../../assets/icons/img1-loader.png';

export const StickersUpload = () => {
    const {
        selectedImage,
        setSelectedImage,
        croppedImage,
        setCroppedImage,
        isCropping,
        setIsCropping,
        clearStickerState,
        handleFileSelect,
        successMessage,
        errorMessage,
        isLoading,
        isSaveSuccess
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

    const handleFileSelectLocal = (file) => {
        if (file && file.type.startsWith('image/')) {
            handleFileSelect(file);
            setCrop(undefined);
            setCompletedCrop(null);
            // Limpiar imagen recortada previa
            setCroppedImage(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelectLocal(files[0]);
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
            handleFileSelectLocal(file);
        }
    };

    const startCrop = () => {
        setIsCropping(true);
        const initialCrop = {
            unit: '%',
            x: 10,
            y: 10,
            width: 80,
            height: 80,
        };
        setCrop(initialCrop);
        setCompletedCrop(initialCrop);
    };

    const deleteImage = () => {
        clearStickerState();
        setCompletedCrop(null);
        setCrop(undefined);
    };

    const confirmCrop = useCallback(() => {
        if (completedCrop && imgRef.current && canvasRef.current) {
            const image = imgRef.current;
            const canvas = canvasRef.current;
            const crop = completedCrop;

            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            const ctx = canvas.getContext('2d');

            const cropWidth = crop.width * scaleX;
            const cropHeight = crop.height * scaleY;

            canvas.width = cropWidth;
            canvas.height = cropHeight;

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                cropWidth,
                cropHeight,
                0,
                0,
                cropWidth,
                cropHeight
            );

            canvas.toBlob((blob) => {
                if (blob) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setCroppedImage(e.target.result);
                        setIsCropping(false);
                        console.log('Imagen recortada guardada');
                    };
                    reader.readAsDataURL(blob);
                }
            }, 'image/png');
        }
    }, [completedCrop, setCroppedImage, setIsCropping]);

    const cancelCrop = () => {
        setIsCropping(false);
        setCrop(undefined);
        setCompletedCrop(null);
    };

    useEffect(() => {
        if (isCropping && selectedImage) {
            startCrop();
        }
    }, [isCropping, selectedImage]);

    const shouldShowLoadingOverlay = (isLoading || isSaveSuccess) && selectedImage;

    return (
        <>
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {successMessage && (
                <div className="message-container success-message">
                    <CheckCircle size={20} />
                    <span>{successMessage}</span>
                </div>
            )}

            {errorMessage && (
                <div className="message-container error-message">
                    <AlertCircle size={20} />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Botón de eliminar imagen */}
            {selectedImage && (
                <div className="delete-image-container">
                    <button
                        className="delete-image-btn"
                        onClick={deleteImage}
                        title="Eliminar imagen"
                        disabled={isLoading}
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            )}

            <main className="upload-area">
                <div
                    className={`drop-zone ${selectedImage ? 'has-image' : ''} ${isDragging ? 'dragging' : ''} ${isCropping ? 'cropping' : ''} ${shouldShowLoadingOverlay ? 'loading' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => !selectedImage && !isCropping && !shouldShowLoadingOverlay && fileInputRef.current?.click()}
                >
                    {shouldShowLoadingOverlay && (
                        <div className="loading-overlay">
                            {isSaveSuccess ? (
                                <>
                                    <CheckCircle size={40} className="success-icon" />
                                    <span>Guardado con éxito</span>
                                </>
                            ) : (
                                <>
                                    <img src={wheelIcon} alt="cargando" className="loading-spinner" />
                                    <span>Guardando calcomanía...</span>
                                </>
                            )}
                        </div>
                    )}

                    {(selectedImage || isSaveSuccess) ? (
                        !isCropping ? (
                            <div className="sticker-upload-image-container">
                                <img
                                    src={croppedImage || selectedImage}
                                    alt="Calcomanía"
                                    className="uploaded-image"
                                    style={{ opacity: isSaveSuccess ? 0.7 : 1 }}
                                />
                                {croppedImage && (
                                    <div className="crop-indicator">
                                        <span>Imagen recortada</span>
                                    </div>
                                )}
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

                                {/* Botones para confirmar o cancelar el recorte */}
                                <div className="crop-controls">
                                    <button
                                        className="crop-btn confirm"
                                        onClick={confirmCrop}
                                        title="Confirmar recorte"
                                    >
                                        <Check size={20} />
                                        Confirmar
                                    </button>
                                    <button
                                        className="crop-btn cancel"
                                        onClick={cancelCrop}
                                        title="Cancelar recorte"
                                    >
                                        <X size={20} />
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="drop-zone-content">
                            <p>Arrastra tu imagen aquí o haz clic para seleccionar</p>
                            <small>Formatos soportados: JPG, PNG, GIF</small>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        style={{ display: 'none' }}
                        disabled={shouldShowLoadingOverlay}
                    />
                </div>
            </main>
        </>
    );
};