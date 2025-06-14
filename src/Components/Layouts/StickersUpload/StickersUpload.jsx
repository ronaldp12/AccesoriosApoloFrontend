import React, { useState, useRef, useCallback } from 'react';
import { Upload, Scissors, Save, Bookmark, Plus, X, Trash2 } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import "./StickersUpload.css"
import 'react-image-crop/dist/ReactCrop.css';
import img1 from '../../../assets/images/img1-background-sticker.png'

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

    const deleteImage = () => {
        setSelectedImage(null);
        setCroppedImage(null);
        setIsCropping(false);
        setCompletedCrop(null);
        setCrop(undefined);
    };

    const handleAddSticker = () => {
        if (selectedImage) {
            saveSticker();
        } else {
            fileInputRef.current?.click();
        }
    };

    const deleteSticker = (id) => {
        setSavedStickers(prev => prev.filter(sticker => sticker.id !== id));
    };

    return (
        <div className="sticker-upload">
            <img src={img1} alt="img1-backghround-sticker" className='img1-background-sticker' />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {currentView === 'upload' ? (
                <div className="upload-view">
                    <div className="sticker-upload-header">
                        <h1 className="sticker-upload-title">CALCOMANÍAS</h1>
                        <div className="sticker-upload-header-buttons">
                            <button
                                className="sticker-upload-btn-secondary"
                                onClick={handleAddSticker}
                            >
                                AGREGAR
                            </button>
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

                            <div className="sticker-upload-sidebar-item" onClick={saveSticker}>
                                <Save size={20} />
                                <span>Guardar Calcomanía</span>
                            </div>
                            <div className="sticker-upload-sidebar-item" onClick={() => setCurrentView('gallery')}>
                                <Plus size={20} />
                                <span>Mis Calcomanías</span>
                            </div>
                        </aside>

                        {/* Botón de eliminar imagen - aparece entre sidebar y upload area */}
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
                    </div>
                </div>
            ) : (
                <div className="gallery-view">
                    <div className="gallery-stickers-header">
                        <button className="back-button" onClick={() => setCurrentView('upload')}>
                            <iconify-icon icon="fluent:ios-arrow-24-filled" className="arrow-back-gallery" />
                        </button>
                        <h1 className="gallery-stickers-title">CALCOMANIAS</h1>
                    </div>

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