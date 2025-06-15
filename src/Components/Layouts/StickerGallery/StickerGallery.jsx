import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { FaExpandArrowsAlt } from "react-icons/fa";
import './StickerGallery.css';
import { context } from "../../../Context/Context.jsx"; // Ajusta la ruta según tu estructura

export const StickerGallery = () => {
    const { savedStickers, deleteSticker } = useContext(context);
    const navigate = useNavigate();

    const handleCreateFirstSticker = () => {
        navigate('/stickers/upload');
    };

    return (
        <div className="gallery-content">
            <div className="gallery-grid">
                {savedStickers.length > 0 ? (
                    savedStickers.map((sticker) => (
                        <div key={sticker.id} className="sticker-card">
                            <div className="sticker-info">
                                <div>
                                    <p className="sticker-name">{sticker.name}</p>
                                    <p className="sticker-format">PNG</p>
                                </div>

                                <div>
                                    <button className="btn-buy">COMPRAR</button>
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
                                <button className="zoom-button">
                                    <FaExpandArrowsAlt className='icon-zoom' />
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
        </div>
    );
};