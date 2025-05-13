import '../LightsSubmenu/LightsSubmenu.css';
import img1 from '../../../assets/images/img1-light.png';
import img2 from '../../../assets/images/img2-light.png';
import img3 from '../../../assets/images/img3-light.png';
import img32 from '../../../assets/images/img3.2-light.png';
import img4 from '../../../assets/images/img4-light.png';
import img5 from '../../../assets/images/logo1-brand.png';

export const LightsSubmenu = () => {
  return (
    <>

      <div className="light-submenu">

        <div className='submenu-title-light'>
          <h2>Luces</h2>
          <span>Ver más </span>
        </div>

        <div className="container-lights2">

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
            <img src={img5} alt="brand" />
          </div>

        </div>
      </div>

    </>

  );
};
