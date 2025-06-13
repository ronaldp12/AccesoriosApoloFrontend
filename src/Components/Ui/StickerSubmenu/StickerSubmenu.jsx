import React, { useContext, useState } from 'react';
import '../StickerSubmenu/StickerSubmenu.css';
import img1 from '../../../assets/images/img1-sticker.png';
import img2 from '../../../assets/images/img2-sticker.png';

import logo1 from '../../../assets/images/img1-marca.png';
import logo2 from '../../../assets/images/img2-marca.png';
import logo3 from '../../../assets/images/img3-marca.png';
import logo4 from '../../../assets/images/img4-marca.png';
import logo5 from '../../../assets/images/img5-marca.png';

import { context } from '../../../Context/Context.jsx';
import { WelcomeNoLoginModal } from '../../Layouts/WelcomeNoLoginModal/WelcomeNoLoginModal.jsx';

export const StickerSubmenu = ({ onOpenRegister, onOpenLogin }) => {
  const { userLogin, nameRol } = useContext(context);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUploadSticker = () => {
    if (userLogin && nameRol === 'cliente') {
      // Usuario logueado, redirigir a la página de subir calcomanía
      // Aquí puedes agregar la lógica de navegación
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
    if (onOpenRegister) {
      onOpenRegister();
    }
  };

  const handleLoginFromModal = () => {
    closeModal();
    if (onOpenLogin) {
      onOpenLogin();
    }
  };

  return (
    <>
      <div className="sticker-submenu">
        <div className='submenu-title-sticker'>
          <h2>Calcomanías</h2>
          <span>Ver más </span>
        </div>

        <div className="container-stickers2">
          <div className="submenu-item">
            <img src={img1} alt="Sticker" />
            <p>Calcomanías</p>
          </div>

          <div className="submenu-item" onClick={handleUploadSticker} style={{ cursor: 'pointer' }}>
            <img src={img2} alt="Sticker2" />
            <p>Sube tu Calcomanía</p>
          </div>
        </div>

        <div className="container-brands">
          <p>Marcas destacadas</p>
          <div className='brands-logos'>
            <img className='logo1' src={logo1} alt="brand" />
            <img className='logo2' src={logo2} alt="brand" />
            <img className='logo3' src={logo3} alt="brand" />
            <img className='logo4' src={logo4} alt="brand" />
            <img className='logo5' src={logo5} alt="brand" />
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