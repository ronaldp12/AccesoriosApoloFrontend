import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { FaExpandArrowsAlt } from "react-icons/fa";
import './StickerGallery.css';
import { context } from "../../../Context/Context.jsx";
import { StickerZoomModal } from '../../Ui/StickerZoomModal/StickerZoomModal.jsx';
import { ConfigureStickerModal } from '../../Ui/ConfigureStickerModal/ConfigureStickerModal.jsx';

export const StickerGallery = () => {
    const { savedStickers, deleteSticker, updateStickerName } = useContext(context);
    const navigate = useNavigate();
    const [zoomModalOpen, setZoomModalOpen] = useState(false);
    const [zoomImageSrc, setZoomImageSrc] = useState("");
    const [configModalOpen, setConfigModalOpen] = useState(false);
    const [selectedSticker, setSelectedSticker] = useState(null);
    const [editingNameId, setEditingNameId] = useState(null);
    const [nameInputValue, setNameInputValue] = useState("");

    const handleCreateFirstSticker = () => {
        navigate('/stickers/upload');
    };

    const handleNameClick = (sticker) => {
        setEditingNameId(sticker.id);
        setNameInputValue(sticker.name);
    };

    const handleNameBlur = (sticker) => {
        if (nameInputValue.trim() !== "") {
            updateStickerName(sticker.id, nameInputValue);
        }
        setEditingNameId(null);
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
                                            autoFocus
                                            className="editable-name-input"
                                        />
                                    ) : (
                                        <p
                                            className="sticker-name"
                                            onClick={() => handleNameClick(sticker)}
                                        >
                                            {sticker.name}
                                        </p>
                                    )}
                                    <p className="sticker-format">PNG</p>
                                </div>

                                <div>
                                    <button
                                        className="btn-buy"
                                        onClick={() => {
                                            setSelectedSticker(sticker);
                                            setConfigModalOpen(true);
                                        }}
                                    >
                                        COMPRAR
                                    </button>
                                </div>
                            </div>
                            <div className="sticker-image-container">
                                <img src={sticker.image} alt={sticker.name} className="sticker-image" />
                                <button
                                    className="delete-button"
                                    onClick={() => deleteSticker(sticker.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className='zoom-container'>
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
                        <button
                            className="sticker-upload-btn-primary"
                            onClick={handleCreateFirstSticker}
                        >
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
                imageSrc={selectedSticker?.image}
            />
        </div>
    );
};
