import { useSubmenu } from '../../UseSubmenu/UseSubemenu.jsx';
import { Item } from '../../Ui/Item/Item.jsx';
import { NavLink } from 'react-router-dom';
import { HelmetSubmenu } from '../../Ui/HelmetSubmenu/HelmetSubmenu.jsx';
import { EquipmentRideSubmenu } from '../../Ui/EquipmentRideSubmenu/EquipmentRideSubmenu.jsx';
import { StickerSubmenu } from '../../Ui/StickerSubmenu/StickerSubmenu.jsx';

export const MainNav = ({ styleContainer }) => {
  const helmetMenu = useSubmenu();
  const equipmentMenu = useSubmenu();
  const stickerMenu = useSubmenu();

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

      <div
        className="container-sticker"
        ref={stickerMenu.submenuRef}
        onMouseEnter={() => stickerMenu.handleHover(true)}
        onMouseLeave={() => stickerMenu.handleHover(false)}
        onClick={stickerMenu.handleClick}
      >
        <Item styleLi="item">
          <span className="nav-cascos">Calcomanías</span>
        </Item>
        {stickerMenu.isOpen && <StickerSubmenu />}
      </div>

      <Item styleLi="item" contenido="Luces" />
      <Item styleLi="item" contenido="Limpieza" />
    </div>
  );
};
