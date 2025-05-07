import { CompanyInfo } from "../../Ui/CompanyInfo/CompanyInfo.jsx";
import { FooterLinks } from "../../Ui/FooterLinks/FooterLinks.jsx";
import { LocationMap } from "../../Ui/LocationMap/LocationMap.jsx";
import { FooterBottom } from "../../Ui/FooterBottom/FooterBottom.jsx";
import './Footer.css';

export const Footer = () => (
    <footer>
        <div className="footer-content">
            <div className="footer-company-info">
                <CompanyInfo />
                <FooterLinks style={"footer-links"} title="NUESTRA COMPAÑÍA" links={["QUIENES SOMOS", "VALORES", "VISIÓN", "MISIÓN"]} />
            </div>
            <div className="footer-company-info2">
                <FooterLinks style={"footer-links"} title="SERVICIOS" links={["CONTACTANOS", "MI CUENTA", "AYUDA"]} />
                <FooterLinks style={"footer-links-explorer"} title="MÁS PARA EXPLORAR" links={["OFERTAS", "MI CUENTA"]} />
            </div>
            <div className="footer-company-info3">
                <LocationMap />
            </div>
        </div>

        <div className="footer-content2">
            <div className="footer-company-info4">
                <CompanyInfo />
            </div>

            <FooterLinks style={"footer-links"} title="NUESTRA COMPAÑÍA" links={["QUIENES SOMOS", "VALORES", "VISIÓN", "MISIÓN"]} />
            <FooterLinks style={"footer-links"} title="SERVICIOS" links={["CONTACTANOS", "MI CUENTA", "AYUDA"]} />
            <FooterLinks style={"footer-links"} title="MÁS PARA EXPLORAR" links={["OFERTAS", "MI CUENTA"]} />
            <div>
                <LocationMap />
            </div>

        </div>
        <FooterBottom />
    </footer>
);
