import { useState, useEffect } from "react";
import { TopNav } from "../TopNav/TopNav.jsx";
import { HamburgerMenu } from "../HamburguerMenu/HamburguerMenu.jsx";
import "../Header/Header.css";
import { Logo } from "../../Ui/Logo/Logo.jsx";
import { SearchBar } from "../../Ui/SearchBar/SearchBar.jsx";
import { Item } from "../../Ui/Item/Item.jsx";
import { MainNav } from "../MainNav/MainNav.jsx";
import { UserActions } from "../UserActions/UserActions.jsx";
import { RegisterModal } from "../../Layouts/RegisterModal/RegisterModal.jsx";
import { LoginModal } from "../LoginModal/LoginModal.jsx";
import { WelcomeModal } from "../WelcomeModal/WelcomeModal.jsx";
import { Trunk } from "../../Ui/Trunk/Trunk.jsx";
import { context } from "../../../Context/Context.jsx";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false)

  const {
    cartProducts, handleRemoveProduct, handleQuantityChange, userLogin,
    registerOpen, openRegister, closeRegister,
    loginOpen, openLogin, closeLogin, localCartProducts, isLocalCart, handleRemoveProductLocal, handleQuantityChangeLocal,
    isTrunkOpen, setIsTrunkOpen
  } = useContext(context);


  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleTrunk = () => {
    setIsTrunkOpen(!isTrunkOpen);
  }

  const closeTrunk = () => setIsTrunkOpen(false);

  const showWelcome = () => setIsWelcomeModalOpen(true);
  const closeWelcome = () => setIsWelcomeModalOpen(false);


  const handleProfile = () => {
    if (userLogin) {
      navigate("/profile");
    }
  };

  const totalItemsInCart = isLocalCart
    ? localCartProducts.reduce((total, product) => total + product.quantity, 0)
    : cartProducts.reduce((total, product) => total + product.quantity, 0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > 30) {
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className={`top-nav-wrapper ${isScrolled ? 'top-nav-hidden' : ''}`}>
        <TopNav />
      </div>

      <div className="container-header">
        <Logo route="/" styleContainer="container-logo-header" styleLogo="logo-header" />

        <div className="container-main">
          <SearchBar />
          <MainNav
            styleContainer={"container-list"}
            onOpenRegister={openRegister}
            onOpenLogin={openLogin}
          />
        </div>

        <div className="container-icon">
          <Item
            styleLi="item-action"
            children={<i className="hgi hgi-stroke hgi-baseball-helmet"></i>}
            contenido="Cuenta"
            onClick={handleProfile}
          />

          <div className="trunk-item-wrapper">
            <Item
              styleLi="item-action"
              children={<i className="hgi hgi-stroke hgi-sharp hgi-backpack-03"></i>}
              contenido="Maletero"
              onClick={handleTrunk}
            />
            {totalItemsInCart > 0 && (
              <span className="trunk-notification-badge">
                {totalItemsInCart > 99 ? '99+' : totalItemsInCart}
              </span>
            )}
          </div>

          <button className="hamburger-btn" onClick={toggleMenu}>
            ☰
          </button>
        </div>

        <div className="container-icon2">
          <UserActions
            toggleMenu={toggleMenu}
            onOpenRegister={openRegister}
            onOpenLogin={openLogin}
            handleTrunk={handleTrunk}
            totalItemsInCart={totalItemsInCart}
          />
        </div>
      </div>

      <HamburgerMenu isOpen={menuOpen} onClose={closeMenu} onOpenRegister={openRegister} onOpenLogin={openLogin} />
      <RegisterModal isOpen={registerOpen} onClose={closeRegister} />
      <LoginModal isOpen={loginOpen} onClose={closeLogin} onLoginSuccess={showWelcome} />
      <WelcomeModal isOpen={isWelcomeModalOpen} onClose={closeWelcome} />

      <Trunk
        onClose={closeTrunk}
        products={isLocalCart ? localCartProducts : cartProducts}
        onRemove={isLocalCart ? handleRemoveProductLocal : handleRemoveProduct}
        onQuantityChange={isLocalCart ? handleQuantityChangeLocal : handleQuantityChange}
        isLocal={isLocalCart}
      />
    </header>
  );
};