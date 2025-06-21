import './AccesoriesSubmenu.css';
import img1 from '../../../assets/images/img1-accesories.png';
import img2 from '../../../assets/images/img2-accesories.png';
import img3 from '../../../assets/images/img3-accesories.png';
import img4 from '../../../assets/images/img4-accesories.png';
import img5 from '../../../assets/images/img5-accesories.png';
import img6 from '../../../assets/images/img6-accesories.png';
import img7 from '../../../assets/images/img7-accesories.png';

import logo1 from '../../../assets/images/img1-marca.png';
import logo2 from '../../../assets/images/img2-marca.png';
import logo3 from '../../../assets/images/img3-marca.png';
import logo4 from '../../../assets/images/img4-marca.png';
import logo5 from '../../../assets/images/img5-marca.png';
import { Link } from "react-router-dom";

export const AccesoriesSubmenu = ({ onCloseSubmenu }) => {

    const accesoriesItems = [
        { label: "Llaveros", img: img1 },
        { label: "Retrovisores", img: img2 },
        { label: "Pulpos", img: img3 },
        { label: "Toallas microfibra", img: img4 },
        { label: "Aerosoles", img: img5 },
        { label: "Porta Placas", img: img6 },
        { label: "Calapiés", img: img7 }
    ];

    const accesoriesBrandLogos = [logo1, logo2, logo3, logo4, logo5];

    return (
        <>

            <div className="accesories-submenu">

                <Link to={`/products?category=${encodeURIComponent("Equipacion Carretera")}`} className='submenu-title-accesories'
                    onClick={onCloseSubmenu}>
                    <h2>Accesorios</h2>
                    <span>Ver más </span>
                </Link>

                <div className="container-accesories2">
                    {accesoriesItems.map((item) => (
                        <Link
                            key={item.label}
                            to={`/products?category=${encodeURIComponent("Equipacion Carretera")}&subcategory=${encodeURIComponent(item.label)}`}
                            className="submenu-item"
                            onClick={onCloseSubmenu}
                        >
                            <img src={item.img} alt={`equipment - ${item.label}`} />
                            <p>{item.label}</p>
                        </Link>
                    ))}
                </div>

                <div className="container-brands">
                    <p>Marcas destacadas</p>
                    <div className='brands-logos'>
                        {accesoriesBrandLogos.map((logo, i) => (
                            <img key={i} className={`logo${i + 1}`} src={logo} alt={`brand logo ${i + 1}`} />
                        ))}
                    </div>

                </div>
            </div>

        </>

    );
};
