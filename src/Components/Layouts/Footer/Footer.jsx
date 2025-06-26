import { CompanyInfo } from "../../Ui/CompanyInfo/CompanyInfo.jsx";
import { FooterLinks } from "../../Ui/FooterLinks/FooterLinks.jsx";
import { LocationMap } from "../../Ui/LocationMap/LocationMap.jsx";
import { FooterBottom } from "../../Ui/FooterBottom/FooterBottom.jsx";
import './Footer.css';
import { useNavigate, useLocation } from "react-router-dom";
import { use, useContext } from "react";
import { context } from "../../../Context/Context";
import { WelcomeNoLoginModal } from "../WelcomeNoLoginModal/WelcomeNoLoginModal.jsx";

export const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        openWelcomeNoLogin, welcomeNoLoginOpen, closeWelcomeNoLogin,
        openRegister, openLogin, userLogin, nameRol
    } = useContext(context);


    const handleFooterNavigation = (link) => {
        switch (link) {
            case "CONTACTANOS":
                navigate("/contact-about-us-help#contact-section");
                break;
            case "QUIENES SOMOS":
                navigate("/contact-about-us-help#about-us-section");
                break;
            case "AYUDA":
                navigate("/contact-about-us-help#help-section");
                break;
            case "VALORES":
                navigate("/contact-about-us-help#values");
                break;
            case "VISIÓN":
            case "MISIÓN":
                navigate("/contact-about-us-help#mision-vision");
                break;
            case "MI CUENTA":
                if (userLogin && nameRol === "cliente") {
                    navigate("/profile");
                } else {
                    openWelcomeNoLogin();
                }
                break;
            case "OFERTAS":
                if (location.pathname !== "/") {
                    navigate("/#offers");
                } else {
                    document.getElementById("offers")?.scrollIntoView({ behavior: "smooth" });
                }
                break;

            default:
                break;
        }
    };

    return (
        <footer>
            <div className="footer-content">
                <div className="footer-company-info">
                    <CompanyInfo />
                    <FooterLinks
                        style={"footer-links"}
                        title="NUESTRA COMPAÑÍA"
                        links={["QUIENES SOMOS", "VALORES", "VISIÓN", "MISIÓN"]}
                        onLinkClick={handleFooterNavigation}
                    />
                </div>
                <div className="footer-company-info2">
                    <FooterLinks
                        style={"footer-links2"}
                        styleH4={"footer-h4"}
                        title="SERVICIOS"
                        links={["CONTACTANOS", "MI CUENTA", "AYUDA"]}
                        onLinkClick={handleFooterNavigation}
                    />
                    <FooterLinks
                        style={"footer-links-explorer"}
                        title="MÁS PARA EXPLORAR"
                        links={["OFERTAS", "MI CUENTA"]}
                        onLinkClick={handleFooterNavigation}
                    />
                </div>
                <div className="footer-company-info3">
                    <LocationMap />
                </div>
            </div>

            <div className="footer-content2">
                <div className="footer-company-info4">
                    <CompanyInfo />
                </div>

                <FooterLinks
                    style={"footer-links"}
                    title="NUESTRA COMPAÑÍA"
                    links={["QUIENES SOMOS", "VALORES", "VISIÓN", "MISIÓN"]}
                    onLinkClick={handleFooterNavigation}
                />
                <FooterLinks
                    style={"footer-links"}
                    title="SERVICIOS"
                    links={["CONTACTANOS", "MI CUENTA", "AYUDA"]}
                    onLinkClick={handleFooterNavigation}
                />
                <FooterLinks
                    style={"footer-links"}
                    title="MÁS PARA EXPLORAR"
                    links={["OFERTAS", "MI CUENTA"]}
                    onLinkClick={handleFooterNavigation}
                />
                <div>
                    <LocationMap />
                </div>
            </div>

            <FooterBottom />

            <WelcomeNoLoginModal
                isOpen={welcomeNoLoginOpen}
                onClose={closeWelcomeNoLogin}
                onOpenRegister={openRegister}
                onOpenLogin={openLogin}
            />

        </footer>
    );
};
