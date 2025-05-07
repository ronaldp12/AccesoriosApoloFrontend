import { useState } from "react";
import { TopNav } from "../TopNav/TopNav.jsx";
import { HamburgerMenu } from "../HamburguerMenu/HamburguerMenu.jsx";
import "../Header/Header.css";
import { Logo } from "../../Ui/Logo/Logo.jsx";
import { SearchBar } from "../../Ui/SearchBar/SearchBar.jsx";
import { Item } from "../../Ui/Item/Item.jsx";
import { MainNav } from "../MainNav/MainNav.jsx";
import { UserActions } from "../UserActions/UserActions.jsx";
import { RegisterModal } from "../../Layouts/RegisterModal/RegisterModal.jsx";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const openRegister = () => {
    setRegisterOpen(true);
    setMenuOpen(false);
  };

  const closeRegister = () => setRegisterOpen(false);

  return (
    <header>
      <TopNav />

      <div className="container-header">
        <Logo />

        <div className="container-main">
          <SearchBar />
          <MainNav styleContainer={"container-list"} />
        </div>

        <div className="container-icon">
          <Item
            styleLi="item-action"
            children={<i className="hgi hgi-stroke hgi-baseball-helmet"></i>}
            contenido="Cuenta"
          />
          <Item
            styleLi="item-action"
            children={<i className="hgi hgi-stroke hgi-sharp hgi-backpack-03"></i>}
            contenido="Maletero"
          />
          <button className="hamburger-btn" onClick={toggleMenu}>
            ☰
          </button>
        </div>

        <div className="container-icon2">
          <UserActions toggleMenu={toggleMenu} />
        </div>
      </div>

      <HamburgerMenu isOpen={menuOpen} onClose={closeMenu} onOpenRegister={openRegister} />
      <RegisterModal isOpen={registerOpen} onClose={closeRegister} />
    </header>
  );
};
