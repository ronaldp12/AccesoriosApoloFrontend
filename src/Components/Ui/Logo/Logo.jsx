import logoA from "../../../assets/images/logoAccesoriosApolo.png";
import { NavLink } from "react-router-dom";

export const Logo = () => {
  return (
    <div className="logo-container">
      <img src={logoA} alt="Accesorios Apolo" className="logo" />
      <NavLink className="navlink" to="/"></NavLink>
    </div>
  );
};
