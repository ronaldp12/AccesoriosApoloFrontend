import { useSubmenu } from '../../UseSubmenu/UseSubemenu.jsx';
import { Item } from '../../Ui/Item/Item.jsx';
import { NavLink } from 'react-router-dom';
import { HelmetSubmenu } from '../../Ui/HelmetSubmenu/HelmetSubmenu.jsx';
import { EquipmentRideSubmenu } from '../../Ui/EquipmentRideSubmenu/EquipmentRideSubmenu.jsx';

export const MainNav = ({ styleContainer }) => {
  const helmetMenu = useSubmenu();
  const equipmentMenu = useSubmenu();

  return (
    <div className={styleContainer}>
      <Item styleLi="item">
        <NavLink className="navlink" to="/">Inicio</NavLink>
      </Item>

      <div
        className="container-helmets"
        ref={helmetMenu.submenuRef}
        onMouseEnter={() => helmetMenu.handleHover(true)}
        onMouseLeave={() => helmetMenu.handleHover(false)}
        onClick={helmetMenu.handleClick}
      >
        <Item styleLi="item">
          <span className="nav-cascos">Cascos</span>
        </Item>
        {helmetMenu.isOpen && <HelmetSubmenu />}
      </div>

      <div
        className="container-equipment"
        ref={equipmentMenu.submenuRef}
        onMouseEnter={() => equipmentMenu.handleHover(true)}
        onMouseLeave={() => equipmentMenu.handleHover(false)}
        onClick={equipmentMenu.handleClick}
      >
        <Item styleLi="item-extend">
          <span className="nav-cascos">Equipacion Carretera</span>
        </Item>
        {equipmentMenu.isOpen && <EquipmentRideSubmenu />}
      </div>

      <Item styleLi="item" contenido="Accesorios" />
      <Item styleLi="item" contenido="Marcas" />
      <Item styleLi="item" contenido="Calcomanias" />
      <Item styleLi="item" contenido="Luces" />
      <Item styleLi="item" contenido="Limpieza" />
    </div>
  );
};
