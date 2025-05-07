import React, { useState } from "react";
import { Item } from "../../Ui/Item/Item";
import { RegisterModal } from "../../Layouts/RegisterModal/RegisterModal.jsx";

export const UserActions = ({ toggleMenu }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openRegisterModal = () => setIsModalOpen(true);
  const closeRegisterModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="container-icon-actions">
        <Item styleLi="item-action" children={<i class="hgi hgi-stroke hgi-location-01"></i>} contenido="Lugar" />
        <Item styleLi="item-action" children={<i class="hgi hgi-stroke hgi-baseball-helmet"></i>} contenido="Cuenta" />
        <Item styleLi="item-action" children={<i class="hgi hgi-stroke hgi-sharp hgi-backpack-03"></i>} contenido="Maletero" />
        <button className="hamburger-btn-actions" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      <div className="container-icon-actions">
        <button className="register" onClick={openRegisterModal}>registrarse</button>
        <button className="login">iniciar sesion</button>
      </div>

      <RegisterModal isOpen={isModalOpen} onClose={closeRegisterModal} />
    </>
  );
};
