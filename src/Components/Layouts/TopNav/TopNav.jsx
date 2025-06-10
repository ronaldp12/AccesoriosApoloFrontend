import { Item } from "../../Ui/Item/Item.jsx";
import { useNavigate } from "react-router-dom";

export const TopNav = () => {
  const navigate = useNavigate();

  return (
    <div className='topnav'>
      <Item onClick={() => navigate("/contact-about-us-help")} styleLi='item-top' contenido="Contacto " />
      <span>|</span>
      <Item styleLi='item-top' contenido="Sobre Nosotros " />
      <span>|</span>
      <Item styleLi='item-top' contenido="Ayuda " />
    </div>
  );
};
