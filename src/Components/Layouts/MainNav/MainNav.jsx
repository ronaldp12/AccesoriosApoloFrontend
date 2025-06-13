import { useSubmenu } from '../../UseSubmenu/UseSubemenu.jsx';
import { Item } from '../../Ui/Item/Item.jsx';
import { NavLink } from 'react-router-dom';
import { HelmetSubmenu } from '../../Ui/HelmetSubmenu/HelmetSubmenu.jsx';
import { EquipmentRideSubmenu } from '../../Ui/EquipmentRideSubmenu/EquipmentRideSubmenu.jsx';
import { StickerSubmenu } from '../../Ui/StickerSubmenu/StickerSubmenu.jsx';
import { LightsSubmenu } from '../../Ui/LightsSubmenu/LightsSubmenu.jsx';
import { CleaningSubmenu } from '../../Ui/CleaningSubmenu/CleaningSubmenu.jsx';
import { BrandSubmenu } from '../../Ui/BrandSubmenu/BrandSubmenu.jsx';

export const MainNav = ({ styleContainer, onOpenRegister, onOpenLogin }) => {
  const helmetMenu = useSubmenu();
  const equipmentMenu = useSubmenu();
  const brandMenu = useSubmenu();
  const stickerMenu = useSubmenu();
  const lightMenu = useSubmenu();
  const cleaningMenu = useSubmenu();

  return (
    <div className={styleContainer}>
      <NavLink className="navlink" to="/">
        <Item contenido={"Inicio"} styleLi="item" />
      </NavLink>
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

      <div
        className="container-brand"
        ref={brandMenu.submenuRef}
        onMouseEnter={() => brandMenu.handleHover(true)}
        onMouseLeave={() => brandMenu.handleHover(false)}
        onClick={brandMenu.handleClick}
      >
        <Item styleLi="item">
          <span className="nav-cascos">Marcas</span>
        </Item>
        {brandMenu.isOpen && <BrandSubmenu />}
      </div>

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
        {stickerMenu.isOpen && (
          <StickerSubmenu
            onOpenRegister={onOpenRegister}
            onOpenLogin={onOpenLogin}
          />
        )}
      </div>

      <div
        className="container-light"
        ref={lightMenu.submenuRef}
        onMouseEnter={() => lightMenu.handleHover(true)}
        onMouseLeave={() => lightMenu.handleHover(false)}
        onClick={lightMenu.handleClick}
      >
        <Item styleLi="item">
          <span className="nav-cascos">Luces</span>
        </Item>
        {lightMenu.isOpen && <LightsSubmenu />}
      </div>

      <div
        className="container-cleaning"
        ref={cleaningMenu.submenuRef}
        onMouseEnter={() => cleaningMenu.handleHover(true)}
        onMouseLeave={() => cleaningMenu.handleHover(false)}
        onClick={cleaningMenu.handleClick}
      >
        <Item styleLi="item">
          <span className="nav-cascos">Limpieza</span>
        </Item>
        {cleaningMenu.isOpen && <CleaningSubmenu />}
      </div>
    </div>
  );
};