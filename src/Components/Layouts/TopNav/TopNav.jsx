import { Item } from "../../Ui/Item/Item.jsx";
import { useNavigate } from "react-router-dom";

export const TopNav = () => {
  const navigate = useNavigate();

  return (
    <div className='topnav'>
      <Item onClick={() => navigate("/contact-about-us-help#contact-section")} styleLi='item-top' contenido="Contacto " />
      <span>|</span>
      <Item onClick={() => navigate("/contact-about-us-help#about-us-section")} styleLi='item-top' contenido="Sobre Nosotros " />
      <span>|</span>
      <Item onClick={() => navigate("/contact-about-us-help#help-section")} styleLi='item-top' contenido="Ayuda " />
    </div>
  );
};
