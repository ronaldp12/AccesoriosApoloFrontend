import '../EquipmentRideSubmenu/EquipmentRideSubmenu.css';
import img1 from '../../../assets/images/img1-ride.png';
import img2 from '../../../assets/images/logo1-brand.png';

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
            <img src={img2} alt="brand" />
          </div>

        </div>
      </div>

    </>

  );
};
