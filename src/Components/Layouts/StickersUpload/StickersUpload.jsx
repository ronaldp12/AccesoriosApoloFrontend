import React, { useState, useRef, useCallback } from 'react';
import { Upload, Scissors, Save, Bookmark, Plus, X } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import "./StickersUpload.css"
import 'react-image-crop/dist/ReactCrop.css';

export const StickersUpload = () => {
    const [currentView, setCurrentView] = useState('upload'); // 'upload' o 'gallery'
    const [selectedImage, setSelectedImage] = useState(null);
    const [savedStickers, setSavedStickers] = useState([]);
    const [croppedImage, setCroppedImage] = useState(null);
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const imgRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const onImageLoad = useCallback((e) => {
        const { width, height } = e.currentTarget;
        const crop = {
            unit: '%',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
        };
        setCrop(crop);
        imgRef.current = e.currentTarget;
    }, []);

    const generateCroppedImage = useCallback(() => {
        if (!completedCrop || !canvasRef.current || !imgRef.current) return;

        const image = imgRef.current;
        const canvas = canvasRef.current;
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const pixelCrop = {
            x: crop.unit === '%' ? (crop.x / 100) * image.width : crop.x,
            y: crop.unit === '%' ? (crop.y / 100) * image.height : crop.y,
            width: crop.unit === '%' ? (crop.width / 100) * image.width : crop.width,
            height: crop.unit === '%' ? (crop.height / 100) * image.height : crop.height,
        };

        canvas.width = pixelCrop.width * scaleX;
        canvas.height = pixelCrop.height * scaleY;

        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            pixelCrop.x * scaleX,
            pixelCrop.y * scaleY,
            pixelCrop.width * scaleX,
            pixelCrop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const croppedDataURL = canvas.toDataURL();
        setCroppedImage(croppedDataURL);
    }, [completedCrop]);

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
        setCrop({
            unit: '%',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
        });
    };

    const saveSticker = () => {
        const imageToSave = croppedImage || selectedImage;
        if (imageToSave) {
            const newSticker = {
                id: Date.now(),
                image: imageToSave,
                name: `Calcomanía ${savedStickers.length + 1}`,
                createdAt: new Date().toLocaleDateString()
            };
            setSavedStickers(prev => [...prev, newSticker]);
            console.log('Calcomanía guardada exitosamente!');
            setSelectedImage(null);
            setCroppedImage(null);
            setIsCropping(false);
            setCompletedCrop(null);
            setCrop(undefined);
        }
    };

    const deleteSticker = (id) => {
        setSavedStickers(prev => prev.filter(sticker => sticker.id !== id));
    };

    return (
        <div className="sticker-upload">
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {currentView === 'upload' ? (
                <div className="upload-view">
                    <div className="sticker-upload-header">
                        <h1 className="sticker-upload-title">CALCOMANÍAS</h1>
                        <div className="sticker-upload-header-buttons">
                            <button className="sticker-upload-btn-secondary">AGREGAR</button>
                            <button className="sticker-upload-btn-primary">COMPRAR</button>
                        </div>
                    </div>

                    <div className="sticker-upload-main-content">
                        <aside className="sticker-upload-sidebar">
                            <div className="sticker-upload-sidebar-item active">
                                <Upload size={20} />
                                <span>Subir archivo</span>
                            </div>
                            <div
                                className={`sticker-upload-sidebar-item ${!selectedImage ? 'disabled' : ''}`}
                                onClick={() => selectedImage && startCrop()}
                            >
                                <Scissors size={20} />
                                <span>Recortar</span>
                            </div>

                            <div className="sticker-upload-sidebar-item" onClick={() => setCurrentView('gallery')}>
                                <Bookmark size={20} />
                                <span>Guardar Calcomanía</span>
                            </div>
                            <div className="sticker-upload-sidebar-item" onClick={() => setCurrentView('gallery')}>
                                <Plus size={20} />
                                <span>Mis Calcomanías</span>
                            </div>
                        </aside>

                        <main className="upload-area">
                            <div
                                className={`drop-zone ${selectedImage ? 'has-image' : ''} ${isDragging ? 'dragging' : ''}`}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => !selectedImage && fileInputRef.current?.click()}
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
                                        <ReactCrop
                                            crop={crop}
                                            onChange={(c) => setCrop(c)}
                                            onComplete={(c) => setCompletedCrop(c)}
                                            aspect={1}
                                            keepSelection
                                        >
                                            <img
                                                ref={imgRef}
                                                src={selectedImage}
                                                alt="Imagen para recortar"
                                                onLoad={onImageLoad}
                                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                                            />
                                        </ReactCrop>
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

                            {selectedImage && (
                                <div className="sticker-upload-action-buttons">
                                    {isCropping && completedCrop && (
                                        <button className="btn-crop" onClick={generateCroppedImage}>
                                            Aplicar Recorte
                                        </button>
                                    )}

                                    <button className="btn-save" onClick={saveSticker}>
                                        <Save size={16} />
                                        Guardar Calcomanía
                                    </button>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            ) : (
                <div className="gallery-view">
                    <header className="sticker-upload-header">
                        <button className="back-button" onClick={() => setCurrentView('upload')}>
                            ←
                        </button>
                        <h1 className="sticker-upload-title">CALCOMANIAS</h1>
                    </header>

                    <div className="gallery-grid">
                        {savedStickers.map((sticker) => (
                            <div key={sticker.id} className="sticker-card">
                                <div className="sticker-image-container">
                                    <img src={sticker.image} alt={sticker.name} className="sticker-image" />
                                    <button
                                        className="delete-button"
                                        onClick={() => deleteSticker(sticker.id)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="sticker-info">
                                    <p className="sticker-name">{sticker.name}</p>
                                    <p className="sticker-format">PNG</p>
                                    <button className="btn-buy">COMPRAR</button>
                                </div>
                            </div>
                        ))}
                        {savedStickers.length === 0 && (
                            <div className="empty-gallery">
                                <p>No tienes calcomanías guardadas</p>
                                <button
                                    className="sticker-upload-btn-primary"
                                    onClick={() => setCurrentView('upload')}
                                >
                                    Crear primera calcomanía
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};