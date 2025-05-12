import { useState, useRef, useEffect } from 'react';
import { Item } from '../../Ui/Item/Item.jsx';
import { NavLink } from 'react-router-dom';
import { HelmetSubmenu } from '../../Ui/HelmetSubmenu/HelmetSubmenu.jsx';

export const MainNav = ({ styleContainer }) => {
  const [showHelmetSubmenu, setShowHelmetSubmenu] = useState(false);
  const submenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target)) {
        setShowHelmetSubmenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styleContainer}>
      <Item styleLi="item">
        <NavLink className="navlink" to="/">Inicio</NavLink>
      </Item>

      <div className="container-cascos"
        ref={submenuRef}
      >
        <Item styleLi="item"
          onClick={() => setShowHelmetSubmenu(prev => !prev)}>
          <span
            className="nav-cascos"
          >
            Cascos
          </span>
        </Item>

        {showHelmetSubmenu && <HelmetSubmenu />}
      </div>

      <Item styleLi="item-extend" contenido="Equipacion Carretera" />
      <Item styleLi="item" contenido="Accesorios" />
      <Item styleLi="item" contenido="Marcas" />
      <Item styleLi="item" contenido="Calcomanias" />
      <Item styleLi="item" contenido="Luces" />
      <Item styleLi="item" contenido="Limpieza" />
    </div>
  );
};
