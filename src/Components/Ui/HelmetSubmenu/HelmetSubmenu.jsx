import '../HelmetSubmenu/HelmetSubmenu.css';
import img1 from '../../../assets/images/img1-helmet.png';
import img2 from '../../../assets/images/img2-helmet.png';
import img3 from '../../../assets/images/img3-helmet.png';
import img4 from '../../../assets/images/img4-helmet.png';
import img5 from '../../../assets/images/img5-helmet.png';

import logo1 from '../../../assets/images/logo1-brand.png';
import logo2 from '../../../assets/images/logo2-brand.png';
import logo3 from '../../../assets/images/logo3-brand.png';
import logo4 from '../../../assets/images/logo4-brand.png';
import logo5 from '../../../assets/images/logo5-brand.png';

export const HelmetSubmenu = () => {
  return (
    <>

      <div className="helmets-submenu">

        <div className='submenu-title'>
          <h2>Cascos</h2>
          <span>Ver más </span>
        </div>

        <div className="container-helmets2">

          <div className="submenu-item">
            <img src={img1} alt="Helmet 1" />
            <p>Novedades</p>
          </div>

          <div className="submenu-item">
            <img src={img2} alt="Helmet 1" />
            <p>Novedades</p>
          </div>

          <div className="submenu-item">
            <img src={img3} alt="Helmet 1" />
            <p>Novedades</p>
          </div>

          <div className="submenu-item">
            <img src={img4} alt="Helmet 1" />
            <p>Novedades</p>
          </div>

          <div className="submenu-item" >
            <img src={img5} alt="Helmet 1" />
            <p>Novedades</p>
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

    </>

  );
};
