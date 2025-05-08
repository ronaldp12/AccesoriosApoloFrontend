import { MainNav } from "../MainNav/MainNav";

export const HamburgerMenu = ({ isOpen, onClose, onOpenRegister, onOpenLogin }) => {
    if (!isOpen) return null;
  
    return (
      <div className="hamburger-menu">
        <button onClick={onClose} className="hamburger-close">✕</button>
        <div className="hamburger-actions">
          <MainNav styleContainer={"container-list-burguer"} />
          <div className="container-buttons">
            <button className="register" onClick={onOpenRegister}>registrarse</button>
            <button className="login" onClick={onOpenLogin}>iniciar sesión</button>
          </div>
        </div>
      </div>
    );
  };
  
