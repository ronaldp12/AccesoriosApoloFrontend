import React, { useContext, useState } from 'react';
import '../StickerSubmenu/StickerSubmenu.css';
import img1 from '../../../assets/images/img1-sticker.png';
import img2 from '../../../assets/images/img2-sticker.png';

import { context } from '../../../Context/Context.jsx';
import { WelcomeNoLoginModal } from '../../Layouts/WelcomeNoLoginModal/WelcomeNoLoginModal.jsx';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const StickerSubmenu = ({ onOpenRegister, onOpenLogin, onCloseSubmenu }) => {
  const { userLogin, nameRol } = useContext(context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleUploadSticker = () => {
    if (userLogin && nameRol === 'cliente') {
      onCloseSubmenu();
      navigate("/stickers");
      console.log('Navegando a subir calcomanía');
    } else {
      setIsModalOpen(true);
    }
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
        <Link to={`/products?category=${encodeURIComponent("Calcomanías")}`} className='submenu-title-sticker'>
          <h2>Calcomanías</h2>
          <span>Ver más </span>
        </Link>

        <div className="container-stickers2">
          <Link to={`/products?category=${encodeURIComponent("Calcomanías")}`} className="submenu-item">
            <img src={img1} alt="Sticker" />
            <p>Calcomanías</p>
          </Link>

          <div className="submenu-item" onClick={handleUploadSticker} style={{ cursor: 'pointer' }}>
            <img src={img2} alt="Sticker2" />
            <p>Sube tu Calcomanía</p>
          </div>
        </div>

      </div>

      <WelcomeNoLoginModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onOpenRegister={handleRegisterFromModal}
        onOpenLogin={handleLoginFromModal}
      />
    </>
  );
};