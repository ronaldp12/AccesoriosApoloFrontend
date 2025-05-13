import '../StickerSubmenu/StickerSubmenu.css';
import img1 from '../../../assets/images/img1-sticker.png';
import img2 from '../../../assets/images/img2-sticker.png';
import img3 from '../../../assets/images/logo1-brand.png';

export const StickerSubmenu = () => {
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

            <div className="submenu-item">
              <img src={img2} alt="Sticker2" />
              <p>Sube tu Calcomanía</p>
            </div>

        </div>

        <div className="container-brands">
          <p>Marcas destacadas</p>
          <div className='brands-logos'>
            <img src={img3} alt="brand" />
          </div>

        </div>
      </div>

    </>

  );
};
