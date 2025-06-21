import '../LightsSubmenu/LightsSubmenu.css';
import img1 from '../../../assets/images/img1-light.png';
import img2 from '../../../assets/images/img2-light.png';
import img3 from '../../../assets/images/img3-light.png';
import img32 from '../../../assets/images/img3.2-light.png';
import img4 from '../../../assets/images/img4-light.png';

import logo1 from '../../../assets/images/img1-marca.png';
import logo2 from '../../../assets/images/img2-marca.png';
import logo3 from '../../../assets/images/img3-marca.png';
import logo4 from '../../../assets/images/img4-marca.png';
import logo5 from '../../../assets/images/img5-marca.png';
import { Link } from 'react-router-dom';

export const LightsSubmenu = () => {

    const lightItems = [
        { label: "Bombillos", imgs: [img1] },
        { label: "Exploradoras", imgs: [img2] },
        { label: "Direccionales", imgs: [img3, img32] },
        { label: "Luces LED", imgs: [img4] }
    ];

    const lightBrandLogos = [logo1, logo2, logo3, logo4, logo5];

    return (
        <>

            <div className="light-submenu">

                <Link to={`/products?category=${encodeURIComponent("Luces")}`} className='submenu-title-light'>
                    <h2>Luces</h2>
                    <span>Ver más </span>
                </Link>

                <div className="container-lights2">
                    {lightItems.map((item) => (
                        <Link to={`/products?category=${encodeURIComponent("Luces")}&subcategory=${encodeURIComponent(item.label)}`} key={item.label} className="submenu-item">
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
                        {lightBrandLogos.map((logo, i) => (
                            <img key={i} className={`logo${i + 1}`} src={logo} alt={`brand logo ${i + 1}`} />
                        ))}
                    </div>
                </div>
            </div>

        </>

    );
};
