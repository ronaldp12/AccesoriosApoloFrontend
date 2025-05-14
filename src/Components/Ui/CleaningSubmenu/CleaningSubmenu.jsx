import '../CleaningSubmenu/CleaningSubmenu.css';
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

export const CleaningSubmenu = () => {
    return (
        <>

            <div className="cleaning-submenu">

                <div className='submenu-title-cleaning'>
                    <h2>Limpieza</h2>
                    <span>Ver más </span>
                </div>

                <div className="container-cleaning2">

                    <div className="submenu-item">
                        <img src={img1} alt="Bombillos" />
                        <p>Bombillos</p>
                    </div>

                    <div className="submenu-item">
                        <img src={img2} alt="Exploradoras" />
                        <p>Exploradoras</p>
                    </div>

                    <div className="submenu-item">
                        <img src={img3} alt="Direccionales" />
                        <img src={img32} alt="Direccionales" />
                        <p>Direccionales</p>
                    </div>

                    <div className="submenu-item">
                        <img src={img4} alt="Luces LED" />
                        <p>Luces LED</p>
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
