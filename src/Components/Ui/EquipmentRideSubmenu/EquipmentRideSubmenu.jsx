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
import { Link } from "react-router-dom";

export const EquipmentRideSubmenu = ({ onCloseSubmenu }) => {

  const equipmentItems = [
    { label: "Chaquetas", img: img1 },
    { label: "Impermeables", img: img2 },
    { label: "Cuello y Rostro", img: img3 },
    { label: "Chaleco", img: img4 },
    { label: "Guantes", img: img5 },
    { label: "Mangas", img: img6 },
    { label: "Botas", img: img7 }
  ];

  const equipmentRideBrandLogos = [logo1, logo2, logo3, logo4, logo5];

  return (
    <>

      <div className="equipment-submenu">

        <Link to={`/products?category=${encodeURIComponent("Equipacion Carretera")}`} className='submenu-title-equipment'
          onClick={onCloseSubmenu}>
          <h2>Equipación Carretera</h2>
          <span>Ver más </span>
        </Link>

        <div className="container-equipment2">
          {equipmentItems.map((item) => (
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
            {equipmentRideBrandLogos.map((logo, i) => (
              <img key={i} className={`logo${i + 1}`} src={logo} alt={`brand logo ${i + 1}`} />
            ))}
          </div>

        </div>
      </div>

    </>

  );
};
