import '../EquipmentRideSubmenu/EquipmentRideSubmenu.css';
import { useSubcategories } from '../../Hook/UseSubcategories/UseSubcategories.jsx';
import logo1 from '../../../assets/images/img1-marca.png';
import logo2 from '../../../assets/images/img2-marca.png';
import logo3 from '../../../assets/images/img3-marca.png';
import logo4 from '../../../assets/images/img4-marca.png';
import logo5 from '../../../assets/images/img5-marca.png';

import img1Equipment from '../../../assets/images/img1-equipment.png';
import img2Equipment from '../../../assets/images/img2-equipment.png';
import img3Equipment from '../../../assets/images/img3-equipment.png';
import img4Equipment from '../../../assets/images/img4-equipment.png';
import img5Equipment from '../../../assets/images/img5-equipment.png';
import img6Equipment from '../../../assets/images/img6-equipment.png';
import img7Equipment from '../../../assets/images/img7-equipment.png';

import { Link } from "react-router-dom";

export const EquipmentRideSubmenu = ({ onCloseSubmenu }) => {
  const { subcategories, loading, error } = useSubcategories("Equipación Carretera");

  const fallbackItems = [
    { label: "Chaquetas", img: img1Equipment },
    { label: "Impermeables", img: img2Equipment },
    { label: "Cuello y Rostro", img: img3Equipment },
    { label: "Chaleco", img: img4Equipment },
    { label: "Guantes", img: img5Equipment },
    { label: "Mangas", img: img6Equipment },
    { label: "Botas", img: img7Equipment }
  ];

  const equipmentItems = (!loading && !error && subcategories?.length > 0)
    ? subcategories.map(item => ({
      ...item,
      img: item.img || fallbackItems.find(fallback => fallback.label === item.label)?.img || img1Equipment
    }))
    : fallbackItems;

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

          {/* Mostrar items (fallback durante carga, API data cuando esté listo) */}
          {equipmentItems.map((item, index) => (
            <Link
              key={`${item.label}-${index}`}
              to={`/products?category=${encodeURIComponent("Equipacion Carretera")}&subcategory=${encodeURIComponent(item.label)}`}
              className={`submenu-item ${loading ? 'loading' : ''}`}
              onClick={onCloseSubmenu}
            >
              <div className="item-image-container">
                <img
                  src={item.img}
                  alt={`equipment - ${item.label}`}
                  onError={(e) => {
                    e.target.src = fallbackItems[index % fallbackItems.length]?.img || img1Equipment;
                  }}
                />
              </div>
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