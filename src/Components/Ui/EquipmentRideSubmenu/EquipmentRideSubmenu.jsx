import '../EquipmentRideSubmenu/EquipmentRideSubmenu.css';
import img1 from '../../../assets/images/img1-ride.png';

import logo1 from '../../../assets/images/logo1-brand.png';
import logo2 from '../../../assets/images/logo2-brand.png';
import logo3 from '../../../assets/images/logo3-brand.png';
import logo4 from '../../../assets/images/logo4-brand.png';
import logo5 from '../../../assets/images/logo5-brand.png';

export const EquipmentRideSubmenu = () => {
  return (
    <>

      <div className="equipment-submenu">

        <div className='submenu-title-equipment'>
          <h2>Equipacion Carretera</h2>
          <span>Ver más </span>
        </div>

        <div className="container-equipment2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
            <div className="submenu-item" key={i}>
              <img src={img1} alt={`Casco${i + 1}`} />
              <p>Novedades</p>
            </div>
          ))}
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
