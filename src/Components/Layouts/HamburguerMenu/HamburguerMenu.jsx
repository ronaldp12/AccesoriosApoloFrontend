import { MainNav } from "../MainNav/MainNav";
import { useContext } from "react";
import { context } from "../../../Context/Context.jsx";

export const HamburgerMenu = ({ isOpen, onClose, onOpenRegister, onOpenLogin }) => {
  if (!isOpen) return null;
  const { userLogin } = useContext(context);

  return (
    <div className="hamburger-menu">
      <button onClick={onClose} className="hamburger-close">✕</button>
      <div className="hamburger-actions">
        <MainNav styleContainer={"container-list-burguer"} />
        <div className="container-buttons">
          {
            userLogin ? (
              <span className="user-name">{userLogin}</span>
            ) : (
              <>
                <button className="register" onClick={onOpenRegister}>registrarse</button>
                <button className="login" onClick={onOpenLogin}>iniciar sesión</button>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
};

