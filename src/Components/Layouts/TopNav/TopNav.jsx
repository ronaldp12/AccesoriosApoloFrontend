import { Item } from "../../Ui/Item/Item.jsx";

export const TopNav = () => {
  return (
    <div className='topnav'>
      <Item styleLi='item-top' contenido="Contacto " />
      <span>|</span>
      <Item styleLi='item-top' contenido="Sobre Nosotros " />
      <span>|</span>
      <Item styleLi='item-top' contenido="Ayuda " />
    </div>
  );
};
