import React, { useContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../StickerSubmenu/StickerSubmenu.css';
import img1 from '../../../assets/images/img1-sticker.png';
import img2 from '../../../assets/images/img2-sticker.png';

import { context } from '../../../Context/Context.jsx';
import { WelcomeNoLoginModal } from '../../Layouts/WelcomeNoLoginModal/WelcomeNoLoginModal.jsx';
import { useNavigate } from 'react-router-dom';

export const StickerSubmenu = ({ onOpenRegister, onOpenLogin, onCloseSubmenu }) => {
  const { userLogin, nameRol } = useContext(context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  // Agregar/remover clase al body cuando el modal está abierto
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup al desmontar
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isModalOpen]);

  const handleCloseSubmenu = () => {
    setIsExiting(true);
    setTimeout(() => {
      onCloseSubmenu();
    }, 300);
  };

  const handleUploadSticker = () => {
    if (userLogin && nameRol === 'cliente') {
      onCloseSubmenu();
      navigate("/stickers/upload");
      console.log('Navegando a subir calcomanía');
    } else {
      setIsModalOpen(true);
    }
  };

  const handleViewStickers = () => {
    onCloseSubmenu();
    navigate("/stickers/all");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleRegisterFromModal = () => {
    closeModal();
    onCloseSubmenu();
    if (onOpenRegister) {
      onOpenRegister();
    }
  };

  const handleLoginFromModal = () => {
    closeModal();
    onCloseSubmenu();
    if (onOpenLogin) {
      onOpenLogin();
    }
  };

  return (
    <>
      <div className="sticker-submenu">
        <div className='submenu-title' onClick={handleViewStickers} style={{ cursor: 'pointer' }}>
          <h2>Calcomanías</h2>
          <span>Ver más </span>
        </div>

        <div className="container-stickers2">
          <div className="submenu-item" onClick={handleViewStickers} style={{ cursor: 'pointer', '--item-index': 0 }}>
            <img src={img1} alt="Ver Calcomanías" />
            <p>Ver Calcomanías</p>
          </div>

          <div className="submenu-item" onClick={handleUploadSticker} style={{ cursor: 'pointer', '--item-index': 2 }}>
            <img src={img2} alt="Subir Calcomanía" />
            <p>Sube tu Calcomanía</p>
          </div>
        </div>
      </div>

      {/* Renderizar el modal usando portal para sacarlo del DOM del submenú */}
      {isModalOpen && createPortal(
        <WelcomeNoLoginModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onOpenRegister={handleRegisterFromModal}
          onOpenLogin={handleLoginFromModal}
        />,
        document.body // Renderizar directamente en el body
      )}
    </>
  );
};