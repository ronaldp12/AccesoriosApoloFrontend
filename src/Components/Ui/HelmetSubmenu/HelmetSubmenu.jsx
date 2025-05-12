import '../HelmetSubmenu/HelmetSubmenu.css';
import img1 from '../../../assets/images/img1-helmet.png';
import img2 from '../../../assets/images/logo1-brand.png';

export const HelmetSubmenu = () => {
  return (
    <>

      <div className="helmets-submenu">

        <div className='submenu-title'>
          <h2>Cascos</h2>
          <span>Ver más </span>
        </div>

        <div className="container-helmets2">
          {[1, 2, 3, 4, 5].map((_, i) => (
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
