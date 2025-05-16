import { useContext } from "react";
import { context } from "../../../Context/Context";
import { Item } from "../../Ui/Item/Item";

export const UserActions = ({ toggleMenu, onOpenRegister, onOpenLogin, handleTrunk }) => {
  const { userLogin } = useContext(context);

  const scrollToMap = () => {
    const mapSection = document.getElementById("location-map");
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: "smooth" });
    }
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
        />

        <Item
          styleLi="item-action"
          children={<i className="hgi hgi-stroke hgi-sharp hgi-backpack-03"></i>}
          contenido="Maletero"
          onClick={handleTrunk}
        />

        <button className="hamburger-btn-actions" onClick={toggleMenu}>☰</button>
      </div>

      <div className="container-icon-actions">
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
    </>
  );
};
