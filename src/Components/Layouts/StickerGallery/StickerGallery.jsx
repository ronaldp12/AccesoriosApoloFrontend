import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { FaExpandArrowsAlt } from "react-icons/fa";
import './StickerGallery.css';
import { context } from "../../../Context/Context.jsx";
import { StickerZoomModal } from '../../Ui/StickerZoomModal/StickerZoomModal.jsx';
import { ConfigureStickerModal } from '../../Ui/ConfigureStickerModal/ConfigureStickerModal.jsx';
import { ConfirmModal } from '../../Ui/ConfirmModal/ConfirmModal.jsx';

export const StickerGallery = () => {
    const { savedStickers, deleteSticker, updateStickerName, successMessage, errorMessage } = useContext(context);
    const navigate = useNavigate();
    const [zoomModalOpen, setZoomModalOpen] = useState(false);
    const [zoomImageSrc, setZoomImageSrc] = useState("");
    const [configModalOpen, setConfigModalOpen] = useState(false);
    const [selectedSticker, setSelectedSticker] = useState(null);
    const [editingNameId, setEditingNameId] = useState(null);
    const [nameInputValue, setNameInputValue] = useState("");

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [stickerToDelete, setStickerToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmSuccessMessage, setConfirmSuccessMessage] = useState("");
    const [confirmErrorMessage, setConfirmErrorMessage] = useState("");

    const [floatingMessage, setFloatingMessage] = useState("");
    const [floatingMessageType, setFloatingMessageType] = useState("");

    const handleCreateFirstSticker = () => {
        navigate('/stickers/upload');
    };

    const handleNameClick = (sticker) => {
        setEditingNameId(sticker.id);
        setNameInputValue(sticker.name);
    };

    const handleNameBlur = async (sticker) => {
        if (nameInputValue.trim() !== "" && nameInputValue.trim() !== sticker.name) {
            const success = await updateStickerName(sticker.id, nameInputValue.trim());
            if (success) {
                showFloatingMessage("Nombre actualizado correctamente.", "success");
            } else {
                showFloatingMessage("Error al actualizar el nombre.", "error");
                setNameInputValue(sticker.name);
            }
        }
        setEditingNameId(null);
    };


    const handleNameKeyPress = async (e, sticker) => {
        if (e.key === 'Enter') {
            e.target.blur();
        } else if (e.key === 'Escape') {
            setNameInputValue(sticker.name);
            setEditingNameId(null);
        }
    };

    const handleDeleteSticker = (sticker) => {
        setStickerToDelete(sticker);
        setConfirmModalOpen(true);
    };

    const confirmDeleteSticker = async () => {
        if (stickerToDelete) {
            setIsDeleting(true);
            try {
                await deleteSticker(stickerToDelete.id);
                setConfirmSuccessMessage(`"${stickerToDelete.name}" se eliminó correctamente.`);
            } catch (error) {
                setConfirmErrorMessage("No se pudo eliminar la calcomanía.");
            } finally {
                setIsDeleting(false);
            }
        }
    };

    useEffect(() => {
        if (confirmSuccessMessage) {
            const timeout = setTimeout(() => {
                setConfirmModalOpen(false);
                setStickerToDelete(null);
                setConfirmSuccessMessage("");
                setConfirmErrorMessage("");
            }, 1500);

            return () => clearTimeout(timeout);
        }
    }, [confirmSuccessMessage]);

    const showFloatingMessage = (message, type) => {
        setFloatingMessage(message);
        setFloatingMessageType(type);

        setTimeout(() => {
            setFloatingMessage("");
            setFloatingMessageType("");
        }, 1500);
    };


    return (
        <div className="gallery-content">

            <div className="gallery-grid">
                {savedStickers.length > 0 ? (
                    savedStickers.map((sticker) => (
                        <div key={sticker.id} className="sticker-card">
                            <div className="sticker-info">
                                <div>
                                    {editingNameId === sticker.id ? (
                                        <input
                                            type="text"
                                            value={nameInputValue}
                                            onChange={(e) => setNameInputValue(e.target.value)}
                                            onBlur={() => handleNameBlur(sticker)}
                                            onKeyPress={(e) => handleNameKeyPress(e, sticker)}
                                            autoFocus
                                            className="editable-name-input"
                                            maxLength={100}
                                        />
                                    ) : (
                                        <p className="sticker-name" onClick={() => handleNameClick(sticker)}>
                                            {sticker.name}
                                        </p>
                                    )}
                                    <p className="sticker-format">{sticker.formato || 'PNG'}</p>
                                </div>

                                <div>
                                    <button
                                        className="btn-buy"
                                        onClick={() => {
                                            setSelectedSticker(sticker);
                                            setConfigModalOpen(true);
                                        }}
                                    >
                                        AGREGAR
                                    </button>
                                </div>
                            </div>

                            <div className="sticker-image-container">
                                <img src={sticker.image} alt={sticker.name} className="sticker-image" />
                                <button className="delete-button" onClick={() => handleDeleteSticker(sticker)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="zoom-container">
                                <button
                                    className="zoom-button"
                                    onClick={() => {
                                        setZoomImageSrc(sticker.image);
                                        setZoomModalOpen(true);
                                    }}
                                >
                                    <FaExpandArrowsAlt className="icon-zoom" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-gallery">
                        <p>No tienes calcomanías guardadas</p>
                        <button className="sticker-upload-btn-primary" onClick={handleCreateFirstSticker}>
                            Crear primera calcomanía
                        </button>
                    </div>
                )}
            </div>

            <StickerZoomModal
                isOpen={zoomModalOpen}
                imageSrc={zoomImageSrc}
                onClose={() => setZoomModalOpen(false)}
            />

            <ConfigureStickerModal
                isOpen={configModalOpen}
                onClose={() => setConfigModalOpen(false)}
                sticker={selectedSticker}
            />

            <ConfirmModal
                isOpen={confirmModalOpen}
                onClose={() => {
                    setConfirmModalOpen(false);
                    setStickerToDelete(null);
                    setConfirmSuccessMessage("");
                    setConfirmErrorMessage("");
                }}
                title="Eliminar calcomanía"
                message={`¿Estás seguro de que quieres eliminar "${stickerToDelete?.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                onConfirm={confirmDeleteSticker}
                isLoading={isDeleting}
                successMessage={confirmSuccessMessage}
                errorMessage={confirmErrorMessage}
            />

            {floatingMessage && (
                <div className={`floating-toast ${floatingMessageType}`}>
                    {floatingMessage}
                </div>
            )}

        </div>
    );
};
