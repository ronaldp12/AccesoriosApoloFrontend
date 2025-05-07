import { Item } from "../../Ui/Item/Item";

export const UserActions = ({ toggleMenu }) => {
  return (
    <>
      <div className="container-icon-actions">
        <Item styleLi='item-action' children={<i class="hgi hgi-stroke hgi-location-01"></i>} contenido='Lugar' />
        <Item styleLi='item-action' children={<i class="hgi hgi-stroke hgi-baseball-helmet"></i>} contenido='Cuenta' />
        <Item styleLi='item-action' children={<i class="hgi hgi-stroke hgi-sharp hgi-backpack-03"></i>} contenido='Maletero' />
        <button className="hamburger-btn-actions" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      <div className="container-icon-actions">
        <button className="register">registrarse</button>
        <button className="login">iniciar sesion</button>
      </div>
    </>
  );
};
