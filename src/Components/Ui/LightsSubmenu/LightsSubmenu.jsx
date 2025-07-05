import '../LightsSubmenu/LightsSubmenu.css';
import img1 from '../../../assets/images/img1-light.png';
import img2 from '../../../assets/images/img2-light.png';
import img3 from '../../../assets/images/img6-light.png';
import img4 from '../../../assets/images/img4-light.png';
import { useState, useEffect } from 'react';

import logo1 from '../../../assets/images/img1-marca.png';
import logo2 from '../../../assets/images/img2-marca.png';
import logo3 from '../../../assets/images/img3-marca.png';
import logo4 from '../../../assets/images/img4-marca.png';
import logo5 from '../../../assets/images/img5-marca.png';
import { Link } from 'react-router-dom';
import { useSubcategories } from '../../Hook/UseSubcategories/UseSubcategories.jsx';

export const LightsSubmenu = ({ onCloseSubmenu }) => {
    const { subcategories, loading, error } = useSubcategories("Luces");

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
        { label: "Bombillos", img: img1 },
        { label: "Exploradoras", img: img2 },
        { label: "Direccionales", img: [img3] }
    ];

    const lightBrandLogos = [logo1, logo2, logo3, logo4, logo5];

    const accesoriesItems = (!loading && !error && subcategories?.length > 0)
        ? subcategories.map(item => ({
            ...item,
            img: item.img || fallbackItems.find(fallback => fallback.label === item.label)?.img || img1
        }))
        : fallbackItems;

    const getMainImage = (imgData) => {
        if (Array.isArray(imgData)) {
            return imgData[0];
        }
        return imgData;
    };

    return (
        <>

            <div className="light-submenu">

                <Link to={`/products?category=${encodeURIComponent("Luces")}`} className='submenu-title'
                    onClick={handleCloseSubmenu} >
                    <h2>Luces</h2>
                    <span>Ver más </span>
                </Link>

                <div className="container-accesories2">

                    {accesoriesItems.map((item, index) => (
                        <Link
                            key={`${item.label}-${index}`}
                            to={`/products?category=${encodeURIComponent("Luces")}&subcategory=${encodeURIComponent(item.label)}`}
                            style={{ '--item-index': index }}
                            className={`submenu-item ${loading ? 'loading' : ''}`}
                            onClick={handleCloseSubmenu}
                        >
                            <div className="item-image-container">
                                {Array.isArray(item.img) ? (
                                    <div className="multiple-images">
                                        {item.img.map((imgSrc, imgIndex) => (
                                            <img
                                                key={imgIndex}
                                                src={imgSrc}
                                                alt={`luces - ${item.label} ${imgIndex + 1}`}
                                                className={`multi-img-${imgIndex}`}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <img
                                        src={item.img}
                                        alt={`luces - ${item.label}`}
                                        onError={(e) => {
                                            const fallbackItem = fallbackItems[index % fallbackItems.length];
                                            e.target.src = getMainImage(fallbackItem?.img) || img1;
                                        }}
                                    />
                                )}
                            </div>
                            <p>{item.label}</p>
                        </Link>
                    ))}
                </div>

                <div className="container-brands">
                    <p>Marcas destacadas</p>
                    <div className='brands-logos'>
                        {lightBrandLogos.map((logo, i) => (
                            <img key={i} className={`logo${i + 1}`} src={logo} alt={`brand logo ${i + 1}`} />
                        ))}
                    </div>
                </div>
            </div>

        </>

    );
};
