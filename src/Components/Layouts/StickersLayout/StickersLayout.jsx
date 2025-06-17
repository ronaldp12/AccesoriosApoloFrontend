import React, { useContext, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Upload, Scissors, Save, Plus } from 'lucide-react';
import '../StickersUpload/StickersUpload.css';
import img1 from '../../../assets/images/img1-background-sticker.png';
import { context } from "../../../Context/Context.jsx";
import { ConfigureStickerModal } from '../../Ui/ConfigureStickerModal/ConfigureStickerModal.jsx';

export const StickersLayout = () => {
    const [configModalOpen, setConfigModalOpen] = useState(false);

    const {
        savedStickers,
        selectedImage,
        setSelectedImage,
        setCroppedImage,
        isCropping,
        setIsCropping,
        saveSticker
    } = useContext(context);

    const navigate = useNavigate();
    const location = useLocation();

    const isUploadRoute = location.pathname.includes('/upload');
    const isGalleryRoute = location.pathname.includes('/gallery');

    const handleAddSticker = () => {
        if (selectedImage) {
            saveSticker();
        } else {
            navigate('/stickers/upload');
        }
    };

    const handleCropClick = () => {
        if (selectedImage && isUploadRoute) {
            setIsCropping(true);
        }
    };

    const handleSaveClick = () => {
        if (isUploadRoute && selectedImage) {
            saveSticker();
        }
    };

    return (
        <div className="sticker-upload">
            <img src={img1} alt="img1-background-sticker" className='img1-background-sticker' />

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
                        <button
                            className="sticker-upload-btn-primary"
                            onClick={() => setConfigModalOpen(true)}
                        >
                            COMPRAR
                        </button>

                    </div>
                </div>

                <div className="sticker-upload-main-content">
                    <aside className="sticker-upload-sidebar">
                        <div
                            className={`sticker-upload-sidebar-item ${isUploadRoute ? 'active' : ''}`}
                            onClick={() => navigate('/stickers/upload')}
                        >
                            <Upload size={20} />
                            <span>Subir archivo</span>
                        </div>

                        <div
                            className={`sticker-upload-sidebar-item ${(isGalleryRoute || !selectedImage) ? 'disabled' : ''}`}
                            onClick={() => {
                                if (!isGalleryRoute && selectedImage) handleCropClick();
                            }}
                        >

                            <Scissors size={20} />
                            <span>Recortar</span>
                        </div>

                        <div
                            className={`sticker-upload-sidebar-item ${(isGalleryRoute || (isUploadRoute && !selectedImage)) ? 'disabled' : ''}`}
                            onClick={() => {
                                if (!isGalleryRoute && isUploadRoute && selectedImage) handleSaveClick();
                            }}
                        >

                            <Save size={20} />
                            <span>Guardar Calcomanía</span>
                        </div>

                        <div
                            className={`sticker-upload-sidebar-item ${isGalleryRoute ? 'active' : ''}`}
                            onClick={() => navigate('/stickers/gallery')}
                        >
                            <Plus size={20} />
                            <span>Mis Calcomanías</span>
                        </div>
                    </aside>

                    <Outlet />
                </div>
            </div>
            <ConfigureStickerModal
                isOpen={configModalOpen}
                onClose={() => setConfigModalOpen(false)}
                imageSrc={selectedImage}
            />

        </div>
    );
};