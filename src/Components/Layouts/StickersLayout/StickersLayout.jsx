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
        saveSticker,
        isLoading,
        isSavingSticker,
        setIsTrunkOpen,
    } = useContext(context);

    const navigate = useNavigate();
    const location = useLocation();

    const isUploadRoute = location.pathname.endsWith('/upload') || location.pathname === '/stickers';
    const isGalleryRoute = location.pathname.includes('/gallery');

    const handleAddSticker = async () => {
        if (selectedImage) {
            await saveSticker();
        } else {
            navigate('/stickers/upload');
        }
    };

    const handleCropClick = () => {
        console.log('handleCropClick llamado - Estados:', {
            selectedImage: !!selectedImage,
            isUploadRoute,
            pathname: location.pathname,
            isCropping
        });

        if (selectedImage && isUploadRoute && !isCropping && !isSavingSticker) {
            console.log('Activando modo recorte');
            setIsCropping(true);
        } else {
            console.log('No se puede activar recorte - condiciones no cumplidas', {
                selectedImage: !!selectedImage,
                isUploadRoute,
                isCropping,
                isSavingSticker
            });
        }
    };

    const handleSaveClick = async () => {
        console.log('handleSaveClick llamado - Estados:', {
            selectedImage: !!selectedImage,
            isUploadRoute,
            pathname: location.pathname,
            isSavingSticker
        });

        if (isUploadRoute && selectedImage && !isSavingSticker) {
            console.log('Guardando calcomanía');
            await saveSticker();
        } else {
            console.log('No se puede guardar - condiciones no cumplidas', {
                selectedImage: !!selectedImage,
                isUploadRoute,
                isSavingSticker
            });
        }
    };

    const canCrop = selectedImage && isUploadRoute && !isCropping && !isSavingSticker;
    const canSave = selectedImage && isUploadRoute && !isSavingSticker;

    return (
        <div className="sticker-upload">
            <img src={img1} alt="img1-background-sticker" className='img1-background-sticker' />

            <div className="upload-view">
                <div className="sticker-upload-header">
                    <h1 className="sticker-upload-title">CALCOMANÍAS</h1>
                    <div className="sticker-upload-header-buttons">
                        {!isGalleryRoute && (
                            <button
                                className="sticker-upload-btn-secondary"
                                onClick={handleAddSticker}
                                disabled={!canSave}
                            >
                                {isSavingSticker ? 'GUARDANDO...' : 'GUARDAR'}
                            </button>
                        )}
                        <button
                            className="sticker-upload-btn-primary"
                            onClick={() => setIsTrunkOpen(true)}
                            disabled={isSavingSticker}
                        >
                            COMPRAR
                        </button>
                    </div>
                </div>

                <div className="sticker-upload-main-content">
                    <aside className="sticker-upload-sidebar">
                        <div
                            className={`sticker-upload-sidebar-item ${isUploadRoute ? 'active' : ''}`}
                            onClick={() => !isSavingSticker && navigate('/stickers/upload')}
                        >
                            <Upload size={20} />
                            <span>Subir archivo</span>
                        </div>

                        <div
                            className={`sticker-upload-sidebar-item ${!canCrop ? 'disabled' : ''}`}
                            onClick={() => {
                                if (canCrop) {
                                    console.log('Iniciando recorte desde sidebar');
                                    handleCropClick();
                                }
                            }}
                        >
                            <Scissors size={20} />
                            <span>Recortar</span>
                        </div>

                        <div
                            className={`sticker-upload-sidebar-item ${!canSave ? 'disabled' : ''}`}
                            onClick={() => {
                                if (canSave) {
                                    console.log('Guardando desde sidebar');
                                    handleSaveClick();
                                }
                            }}
                        >
                            <Save size={20} />
                            <span>Guardar Calcomanía</span>
                        </div>

                        <div
                            className={`sticker-upload-sidebar-item ${isGalleryRoute ? 'active' : ''}`}
                            onClick={() => !isSavingSticker && navigate('/stickers/gallery')}
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