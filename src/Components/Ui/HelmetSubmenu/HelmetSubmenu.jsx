import '../HelmetSubmenu/HelmetSubmenu.css';
import { useSubcategories } from '../../Hook/UseSubcategories/UseSubcategories.jsx';
import { useState, useEffect } from 'react';
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
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Efecto para manejar la animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  // Función mejorada para cerrar el submenú con animación
  const handleCloseSubmenu = () => {
    setIsExiting(true);
    setTimeout(() => {
      onCloseSubmenu();
    }, 300); // Tiempo de la animación de salida
  };

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
      <div className={`helmets-submenu ${isVisible ? 'visible' : ''} ${isExiting ? 'submenu-exit' : ''}`}>
        <Link
          to={`/products?category=${encodeURIComponent("Cascos")}`}
          className='submenu-title'
          onClick={handleCloseSubmenu}
        >
          <h2>Cascos</h2>
          <span>Ver más </span>
        </Link>

        <div className="container-helmets2">
          {/* Mostrar items con animación progresiva */}
          {helmetItems.map((item, index) => (
            <Link
              key={`${item.label}-${index}`}
              to={`/products?category=${encodeURIComponent("Cascos")}&subcategory=${encodeURIComponent(item.label)}`}
              className={`submenu-item ${loading ? 'loading' : ''}`}
              style={{ '--item-index': index }}
              onClick={handleCloseSubmenu}
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
              <img
                key={i}
                className={`logo${i + 1}`}
                src={logo}
                alt={`brand logo ${i + 1}`}
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};