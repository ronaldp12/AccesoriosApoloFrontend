import '../EquipmentRideSubmenu/EquipmentRideSubmenu.css';
import img1 from '../../../assets/images/img1-equipment.png';
import img2 from '../../../assets/images/img2-equipment.png';
import img3 from '../../../assets/images/img3-equipment.png';
import img4 from '../../../assets/images/img4-equipment.png';
import img5 from '../../../assets/images/img5-equipment.png';
import img6 from '../../../assets/images/img6-equipment.png';
import img7 from '../../../assets/images/img7-equipment.png';

import logo1 from '../../../assets/images/img1-marca.png';
import logo2 from '../../../assets/images/img2-marca.png';
import logo3 from '../../../assets/images/img3-marca.png';
import logo4 from '../../../assets/images/img4-marca.png';
import logo5 from '../../../assets/images/img5-marca.png';

export const EquipmentRideSubmenu = () => {
  return (
    <>

      <div className="equipment-submenu">

        <div className='submenu-title-equipment'>
          <h2>Equipación Carretera</h2>
          <span>Ver más </span>
        </div>

        <div className="container-equipment2">

          <div className="submenu-item">
            <img src={img1} alt="equipment1" />
            <p>Chaquetas</p>
          </div>

          <div className="submenu-item">
            <img src={img2} alt="equipment1" />
            <p>Impermeables</p>
          </div>

          <div className="submenu-item">
            <img src={img3} alt="equipment1" />
            <p>Cuello y Rostro</p>
          </div>

          <div className="submenu-item">
            <img src={img4} alt="equipment1" />
            <p>Chaleco</p>
          </div>

          <div className="submenu-item">
            <img src={img5} alt="equipment1" />
            <p>Guantes</p>
          </div>

          <div className="submenu-item">
            <img src={img6} alt="equipment1" />
            <p>Mangas</p>
          </div>

          <div className="submenu-item">
            <img src={img7} alt="equipment1" />
            <p>Botas</p>
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
