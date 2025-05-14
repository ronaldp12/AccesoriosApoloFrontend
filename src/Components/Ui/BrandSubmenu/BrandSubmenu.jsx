import '../BrandSubmenu/BrandSubmenu.css';
import img1 from '../../../assets/images/img1-marca.png';
import img2 from '../../../assets/images/img2-marca.png';
import img3 from '../../../assets/images/img3-marca.png';
import img4 from '../../../assets/images/img4-marca.png';
import img5 from '../../../assets/images/img5-marca.png';

export const BrandSubmenu = () => {
    return (
        <>

            <div className="brand-submenu">

                <div className='submenu-title-brand'>
                    <h2>Marcas</h2>
                    <span>Ver más </span>
                </div>

                <div className="container-brand2">

                    <div className="submenu-item">
                        <img src={img1} alt="Ich" />
                        <p>Ich</p>
                    </div>

                    <div className="submenu-item">
                        <img src={img2} alt="Shaft" />
                        <p>Shaft</p>
                    </div>

                    <div className="submenu-item">
                        <img src={img3} alt="Hro" />
                        <p>Hro</p>
                    </div>

                    <div className="submenu-item">
                        <img src={img4} alt="Arai" />
                        <p>Arai</p>
                    </div>

                    <div className="submenu-item">
                        <img src={img5} alt="Shoei" />
                        <p>Shoei</p>
                    </div>

                </div>

            </div>

        </>

    );
};
