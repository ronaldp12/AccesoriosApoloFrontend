import { useState } from "react";
import { TopNav } from "../TopNav/TopNav.jsx";
import { HamburgerMenu } from "../HamburguerMenu/HamburguerMenu.jsx";
import '../Header/Header.css';
import { Logo } from "../../Ui/Logo/Logo.jsx";
import { SearchBar } from "../../Ui/SearchBar/SearchBar.jsx";
import { Item } from "../../Ui/Item/Item.jsx";
import { MainNav } from "../MainNav/MainNav.jsx";
import { UserActions } from "../UserActions/UserActions.jsx";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

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
          <Item styleLi='item-action' children={<i class="hgi hgi-stroke hgi-baseball-helmet"></i>} contenido='Cuenta' />
          <Item styleLi='item-action' children={<i class="hgi hgi-stroke hgi-sharp hgi-backpack-03"></i>} contenido='Maletero' />
          <button className="hamburger-btn" onClick={toggleMenu}>
            ☰
          </button>
        </div>

        <div className="container-icon2">
          <UserActions toggleMenu={toggleMenu} />
        </div>
      </div>

      <HamburgerMenu isOpen={menuOpen} onClose={closeMenu} />
    </header>
  );
};
