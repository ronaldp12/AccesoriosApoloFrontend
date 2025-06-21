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

export const HelmetSubmenu = ({ onCloseSubmenu }) => {

  const helmetItems = [
    { label: "Novedades", img: img1 },
    { label: "Integral", img: img2 },
    { label: "Abatible", img: img3 },
    { label: "Abierto", img: img4 },
    { label: "Cross", img: img5 }
  ];

  const helmetBrandLogos = [logo1, logo2, logo3, logo4, logo5];

  return (
    <>

      <div className="helmets-submenu">

        <Link to={`/products?category=${encodeURIComponent("Cascos")}`} className='submenu-title'
          onClick={onCloseSubmenu}>
          <h2>Cascos</h2>
          <span>Ver más </span>
        </Link>

        <div className="container-helmets2">
          {helmetItems.map((item) => (
            <Link
              key={item.label}
              to={`/products?category=${encodeURIComponent("Cascos")}&subcategory=${encodeURIComponent(item.label)}`}
              className="submenu-item"
              onClick={onCloseSubmenu}
            >
              <img src={item.img} alt={`Helmet ${item.label}`} />
              <p>{item.label}</p>
            </Link>
          ))}
        </div>


        <div className="container-brands">
          <p>Marcas destacadas</p>
          <div className='brands-logos'>
            {helmetBrandLogos.map((logo, i) => (
              <img key={i} className={`logo${i + 1}`} src={logo} alt={`brand logo ${i + 1}`} />
            ))}
          </div>

        </div>
      </div>

    </>

  );
};
