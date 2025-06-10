import logoA from "../../../assets/images/logoAccesoriosApolo.png";
import { NavLink } from "react-router-dom";

export const Logo = ({ styleContainer="logo-container", styleLogo="logo", route="/" }) => {
  return (
    <div className={styleContainer}>
      <img src={logoA} alt="Accesorios Apolo" className={styleLogo} />
      <NavLink className="navlink" to={route}></NavLink>
    </div>
  );
};
