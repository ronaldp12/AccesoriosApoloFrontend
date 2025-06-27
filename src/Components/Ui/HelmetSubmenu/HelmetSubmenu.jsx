import '../HelmetSubmenu/HelmetSubmenu.css';
import { useSubcategories } from '../../Hook/UseSubcategories/UseSubcategories.jsx';
import logo1 from '../../../assets/images/img1-marca.png';
import logo2 from '../../../assets/images/img2-marca.png';
import logo3 from '../../../assets/images/img3-marca.png';
import logo4 from '../../../assets/images/img4-marca.png';
import logo5 from '../../../assets/images/img5-marca.png';

import img1 from '../../../assets/images/img1-helmet.png';
import img2 from '../../../assets/images/img2-helmet.png';
import img3 from '../../../assets/images/img3-helmet.png';
import img4 from '../../../assets/images/img4-helmet.png';
import img5 from '../../../assets/images/img5-helmet.png';

import { Link } from "react-router-dom";

export const HelmetSubmenu = ({ onCloseSubmenu }) => {
  const { subcategories, loading, error } = useSubcategories("Cascos");

  const fallbackItems = [
    { label: "Novedades", img: img1 },
    { label: "Integral", img: img2 },
    { label: "Abatible", img: img3 },
    { label: "Abierto", img: img4 },
    { label: "Cross", img: img5 }
  ];

  const helmetItems = (!loading && !error && subcategories?.length > 0)
    ? subcategories.map(item => ({
      ...item,
      img: item.img || fallbackItems.find(fallback => fallback.label === item.label)?.img || img1
    }))
    : fallbackItems;

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

          {/* Mostrar items (fallback durante carga, API data cuando esté listo) */}
          {helmetItems.map((item, index) => (
            <Link
              key={`${item.label}-${index}`}
              to={`/products?category=${encodeURIComponent("Cascos")}&subcategory=${encodeURIComponent(item.label)}`}
              className={`submenu-item ${loading ? 'loading' : ''}`}
              onClick={onCloseSubmenu}
            >
              <div className="item-image-container">
                <img
                  src={item.img}
                  alt={`Helmet ${item.label}`}
                  onError={(e) => {
                    e.target.src = fallbackItems[index % fallbackItems.length]?.img || img1;
                  }}
                />
              </div>
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