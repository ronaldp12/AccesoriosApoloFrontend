import { useSubmenu } from '../../Hook/UseSubmenu/UseSubemenu.jsx';
import { Item } from '../../Ui/Item/Item.jsx';
import { NavLink } from 'react-router-dom';
import { HelmetSubmenu } from '../../Ui/HelmetSubmenu/HelmetSubmenu.jsx';
import { EquipmentRideSubmenu } from '../../Ui/EquipmentRideSubmenu/EquipmentRideSubmenu.jsx';
import { StickerSubmenu } from '../../Ui/StickerSubmenu/StickerSubmenu.jsx';
import { LightsSubmenu } from '../../Ui/LightsSubmenu/LightsSubmenu.jsx';
import { CleaningSubmenu } from '../../Ui/CleaningSubmenu/CleaningSubmenu.jsx';
import { BrandSubmenu } from '../../Ui/BrandSubmenu/BrandSubmenu.jsx';
import { AccesoriesSubmenu } from '../../Ui/AccesoriesSubmenu/AccesoriesSubmenu.jsx';
import { useState } from 'react';

export const MainNav = ({ styleContainer, onOpenRegister, onOpenLogin }) => {
  const helmetMenu = useSubmenu();
  const equipmentMenu = useSubmenu();
  const brandMenu = useSubmenu();
  const stickerMenu = useSubmenu();
  const lightMenu = useSubmenu();
  const cleaningMenu = useSubmenu();
  const accesoriesMenu = useSubmenu();

  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  const handleSubmenuHover = (submenuName, isHovering, submenuHook) => {
    if (isHovering) {
      if (activeSubmenu && activeSubmenu !== submenuName) {
        setTransitioning(true);
        setTimeout(() => {
          setActiveSubmenu(submenuName);
          submenuHook.handleHover(true);
          setTransitioning(false);
        }, 150);
      } else {
        setActiveSubmenu(submenuName);
        submenuHook.handleHover(true);
      }
    } else {
      submenuHook.handleHover(false);
      setTimeout(() => {
        setActiveSubmenu(null);
      }, 300);
    }
  };

  return (
    <div className={styleContainer}>
      <NavLink className="navlink" to="/">
        <Item contenido={"Inicio"} styleLi="item" />
      </NavLink>

      <div
        className={`container-helmets ${transitioning ? 'submenu-transition' : ''}`}
        ref={helmetMenu.submenuRef}
        onMouseEnter={() => handleSubmenuHover('helmet', true, helmetMenu)}
        onMouseLeave={() => handleSubmenuHover('helmet', false, helmetMenu)}
        onClick={helmetMenu.handleClick}
      >
        <Item styleLi="item">
          <span className="nav-cascos">Cascos</span>
        </Item>
        {helmetMenu.isOpen && (
          <HelmetSubmenu
            onCloseSubmenu={() => handleSubmenuHover('helmet', false, helmetMenu)}
          />
        )}
      </div>

      <div
        className={`container-equipment ${transitioning ? 'submenu-transition' : ''}`}
        ref={equipmentMenu.submenuRef}
        onMouseEnter={() => handleSubmenuHover('equipment', true, equipmentMenu)}
        onMouseLeave={() => handleSubmenuHover('equipment', false, equipmentMenu)}
        onClick={equipmentMenu.handleClick}
      >
        <Item styleLi="item-extend">
          <span className="nav-cascos">Equipación Carretera</span>
        </Item>
        {equipmentMenu.isOpen && (
          <EquipmentRideSubmenu
            onCloseSubmenu={() => handleSubmenuHover('equipment', false, equipmentMenu)}
          />
        )}
      </div>

      <div
        className={`container-helmets ${transitioning ? 'submenu-transition' : ''}`}
        ref={accesoriesMenu.submenuRef}
        onMouseEnter={() => handleSubmenuHover('accesories', true, accesoriesMenu)}
        onMouseLeave={() => handleSubmenuHover('accesories', false, accesoriesMenu)}
        onClick={accesoriesMenu.handleClick}
      >
        <Item styleLi="item">
          <span className="nav-cascos">Accesorios</span>
        </Item>
        {accesoriesMenu.isOpen && (
          <AccesoriesSubmenu
            onCloseSubmenu={() => handleSubmenuHover('accesories', false, accesoriesMenu)}
          />
        )}
      </div>

      <div
        className={`container-brand ${transitioning ? 'submenu-transition' : ''}`}
        ref={brandMenu.submenuRef}
        onMouseEnter={() => handleSubmenuHover('brand', true, brandMenu)}
        onMouseLeave={() => handleSubmenuHover('brand', false, brandMenu)}
        onClick={brandMenu.handleClick}
      >
        <Item styleLi="item">
          <span className="nav-cascos">Marcas</span>
        </Item>
        {brandMenu.isOpen && (
          <BrandSubmenu
            onCloseSubmenu={() => handleSubmenuHover('brand', false, brandMenu)}
          />
        )}
      </div>

      <div
        className={`container-sticker ${transitioning ? 'submenu-transition' : ''}`}
        ref={stickerMenu.submenuRef}
        onMouseEnter={() => handleSubmenuHover('sticker', true, stickerMenu)}
        onMouseLeave={() => handleSubmenuHover('sticker', false, stickerMenu)}
        onClick={stickerMenu.handleClick}
      >
        <Item styleLi="item">
          <span className="nav-cascos">Calcomanías</span>
        </Item>
        {stickerMenu.isOpen && (
          <StickerSubmenu
            onOpenRegister={onOpenRegister}
            onOpenLogin={onOpenLogin}
            onCloseSubmenu={() => handleSubmenuHover('sticker', false, stickerMenu)}
          />
        )}
      </div>

      <div
        className={`container-light ${transitioning ? 'submenu-transition' : ''}`}
        ref={lightMenu.submenuRef}
        onMouseEnter={() => handleSubmenuHover('light', true, lightMenu)}
        onMouseLeave={() => handleSubmenuHover('light', false, lightMenu)}
        onClick={lightMenu.handleClick}
      >
        <Item styleLi="item">
          <span className="nav-cascos">Luces</span>
        </Item>
        {lightMenu.isOpen && (
          <LightsSubmenu
            onCloseSubmenu={() => handleSubmenuHover('light', false, lightMenu)}
          />
        )}
      </div>

      <div
        className={`container-cleaning ${transitioning ? 'submenu-transition' : ''}`}
        ref={cleaningMenu.submenuRef}
        onMouseEnter={() => handleSubmenuHover('cleaning', true, cleaningMenu)}
        onMouseLeave={() => handleSubmenuHover('cleaning', false, cleaningMenu)}
        onClick={cleaningMenu.handleClick}
      >
        <Item styleLi="item">
          <span className="nav-cascos">Limpieza</span>
        </Item>
        {cleaningMenu.isOpen && (
          <CleaningSubmenu
            onCloseSubmenu={() => handleSubmenuHover('cleaning', false, cleaningMenu)}
          />
        )}
      </div>
    </div>
  );
};