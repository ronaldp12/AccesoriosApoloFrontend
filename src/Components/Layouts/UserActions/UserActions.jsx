import { useContext, useState } from "react";
import { context } from "../../../Context/Context";
import { Item } from "../../Ui/Item/Item";
import { useNavigate } from "react-router-dom";
import { WelcomeNoLoginModal } from "../WelcomeNoLoginModal/WelcomeNoLoginModal";

export const UserActions = ({ toggleMenu, onOpenRegister, onOpenLogin, handleTrunk, totalItemsInCart }) => {
  const { userLogin, nameRol } = useContext(context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToMap = () => {
    const mapSection = document.getElementById("location-map");
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleProfile = () => {
    if (userLogin && nameRol === 'cliente') {
      navigate("/profile");
    } else {
      setIsModalOpen(true);
    }
  }

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleRegisterFromModal = () => {
    closeModal();
    onOpenRegister();
  };

  const handleLoginFromModal = () => {
    closeModal();
    onOpenLogin();
  };

  return (
    <>
      <div className="container-icon-actions">
        <Item
          styleLi="item-action"
          children={<i className="hgi hgi-stroke hgi-location-01"></i>}
          onClick={scrollToMap}
          contenido="Lugar"
        />

        <Item
          styleLi="item-action"
          children={<i className="hgi hgi-stroke hgi-baseball-helmet"></i>}
          contenido="Cuenta"
          onClick={handleProfile}
        />

        <div className="user-actions-trunk-wrapper">
          <Item
            styleLi="item-action"
            children={<i className="hgi hgi-stroke hgi-sharp hgi-backpack-03"></i>}
            onClick={handleTrunk}
            contenido="Maletero"
          />
          {totalItemsInCart > 0 && (
            <span className="trunk-notification-badge">
              {totalItemsInCart > 99 ? '99+' : totalItemsInCart}
            </span>
          )}
        </div>

        <button className="hamburger-btn-actions" onClick={toggleMenu}>☰</button>
      </div>

      <div className="container-icon-actions">
        {
          userLogin && nameRol === 'cliente' ? (
            <span className="user-name">{userLogin}</span>
          ) : (
            <>
              <button className="user-actions-register" onClick={onOpenRegister}>registrarse</button>
              <button className="user-actions-login" onClick={onOpenLogin}>iniciar sesión</button>
            </>
          )
        }
      </div>

      <WelcomeNoLoginModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onOpenRegister={handleRegisterFromModal}
        onOpenLogin={handleLoginFromModal}
      />
    </>
  );
};