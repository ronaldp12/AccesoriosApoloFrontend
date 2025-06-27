import '../CleaningSubmenu/CleaningSubmenu.css';
import img1 from '../../../assets/images/img1-cleaning.png';
import img2 from '../../../assets/images/img2-cleaning.png';
import img3 from '../../../assets/images/img3-cleaning.png';
import img4 from '../../../assets/images/img4-cleaning.png';
import img5 from '../../../assets/images/img5-cleaning.png';

import logo1 from '../../../assets/images/img1-marca.png';
import logo2 from '../../../assets/images/img2-marca.png';
import logo3 from '../../../assets/images/img3-marca.png';
import logo4 from '../../../assets/images/img4-marca.png';
import logo5 from '../../../assets/images/img5-marca.png';
import { Link } from 'react-router-dom';
import { useSubcategories } from '../../Ui/UseSubcategories/UseSubcategories.jsx';

export const CleaningSubmenu = ({ onCloseSubmenu }) => {
    const { subcategories, loading, error } = useSubcategories("Limpieza");

    const fallbackItems = [
        { label: "Desengrasante", img: [img1] },
        { label: "Restaurador partes negras", img: [img2] },
        { label: "Silicona", img: [img3] },
        { label: "Shampoo", img: [img4] },
        { label: "Ambientador", img: [img5] }
    ];

    const cleaningBrandLogos = [logo1, logo2, logo3, logo4, logo5];

    const lightsItems = (!loading && !error && subcategories?.length > 0)
        ? subcategories.map(item => ({
            ...item,
            img: item.img || fallbackItems.find(fallback => fallback.label === item.label)?.img || img1
        }))
        : fallbackItems;

    return (
        <div className="cleaning-submenu">
            <Link to={`/products?category=${encodeURIComponent("Limpieza")}`} className='submenu-title-cleaning'
                onClick={onCloseSubmenu}>
                <h2>Limpieza</h2>
                <span>Ver más </span>
            </Link>

            <div className="container-accesories2">

                {lightsItems.map((item, index) => (
                    <Link
                        key={`${item.label}-${index}`}
                        to={`/products?category=${encodeURIComponent("Limpieza")}&subcategory=${encodeURIComponent(item.label)}`}
                        className={`submenu-item ${loading ? 'loading' : ''}`}
                        onClick={onCloseSubmenu}
                    >
                        <div className="item-image-container">
                            <img
                                src={item.img}
                                alt={`limpieza - ${item.label}`}
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
                    {cleaningBrandLogos.map((logo, i) => (
                        <img key={i} className={`logo${i + 1}`} src={logo} alt={`brand logo ${i + 1}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};
