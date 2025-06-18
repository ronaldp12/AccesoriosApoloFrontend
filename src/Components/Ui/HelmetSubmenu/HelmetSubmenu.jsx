import '../HelmetSubmenu/HelmetSubmenu.css';
import img1 from '../../../assets/images/img1-helmet.png';
import img2 from '../../../assets/images/img2-helmet.png';
import img3 from '../../../assets/images/img3-helmet.png';
import img4 from '../../../assets/images/img4-helmet.png';
import img5 from '../../../assets/images/img5-helmet.png';

import logo1 from '../../../assets/images/img1-marca.png';
import logo2 from '../../../assets/images/img2-marca.png';
import logo3 from '../../../assets/images/img3-marca.png';
import logo4 from '../../../assets/images/img4-marca.png';
import logo5 from '../../../assets/images/img5-marca.png';
import { Link } from "react-router-dom";

export const HelmetSubmenu = () => {
  return (
    <>

      <div className="helmets-submenu">

        <Link to="/products" className='submenu-title'>
          <h2>Cascos</h2>
          <span>Ver más </span>
        </Link>

        <div className="container-helmets2">

          <Link to="/products?category=Cascos&subcategory=novedades" className="submenu-item">
            <img src={img1} alt="Helmet 1" />
            <p>Novedades</p>
          </Link>

          <Link to="/products?category=Cascos&subcategory=integral" className="submenu-item">
            <img src={img2} alt="Helmet 1" />
            <p>Integral</p>
          </Link>

          <Link to="/products?category=Cascos&subcategory=abatible" className="submenu-item">
            <img src={img3} alt="Helmet 1" />
            <p>Abatible</p>
          </Link>

          <Link to="/products?category=Cascos&subcategory=abierto" className="submenu-item">
            <img src={img4} alt="Helmet 1" />
            <p>Abierto</p>
          </Link>

          <Link to="/products?category=Cascos&subcategory=cross" className="submenu-item" >
            <img src={img5} alt="Helmet 1" />
            <p>Cross</p>
          </Link>

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
