import '../CleaningSubmenu/CleaningSubmenu.css';
import img1 from '../../../assets/images/img1-cleaning.png';
import img2 from '../../../assets/images/img2-cleaning.png';
import img3 from '../../../assets/images/img3-cleaning.png';
import img4 from '../../../assets/images/img4-cleaning.png';

import logo1 from '../../../assets/images/img1-marca.png';
import logo2 from '../../../assets/images/img2-marca.png';
import logo3 from '../../../assets/images/img3-marca.png';
import logo4 from '../../../assets/images/img4-marca.png';
import logo5 from '../../../assets/images/img5-marca.png';
import { Link } from 'react-router-dom';

export const CleaningSubmenu = ({ onCloseSubmenu }) => {
    const cleaningItems = [
        { label: "Desengrasante", imgs: [img1] },
        { label: "Restaurador partes negras", imgs: [img2] },
        { label: "Silicona", imgs: [img3] },
        { label: "Shampoo", imgs: [img4] },
        { label: "Ambientador", imgs: [img4] }
    ];

    const cleaningBrandLogos = [logo1, logo2, logo3, logo4, logo5];

    return (
        <div className="cleaning-submenu">
            <Link to={`/products?category=${encodeURIComponent("Limpieza")}`} className='submenu-title-cleaning'
                onClick={onCloseSubmenu}>
                <h2>Limpieza</h2>
                <span>Ver más </span>
            </Link>

            <div className="container-cleaning2">
                {cleaningItems.map((item) => (
                    <Link to={`/products?category=${encodeURIComponent("Limpieza")}&subcategory=${encodeURIComponent(item.label)}`} key={item.label} className="submenu-item" onClick={onCloseSubmenu}>
                        {item.imgs.map((src, i) => (
                            <img key={i} src={src} alt={item.label} />
                        ))}
                        <p>{item.label}</p>
                    </Link>
                ))}
            </div>

            <div className="container-brands">
                <p>Marcas destacadas</p>
                <div className='brands-logos'>
                    {cleaningBrandLogos.map((logo, i) => (
                        <img key={i} className={`logo${i + 1}`} src={logo} alt={`brand logo ${i + 1}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};
