import { Logo } from "../Logo/Logo";

export const FooterBottom = () => (
    <div className="footer-bottom">
        <div className="footer-bottom-content">
            <Logo />
            <span>ACCESORIOS APOLO - 2025</span>
        </div>

        <div className="social-icons-footer-bottom">
            <a href="https://www.facebook.com/profile.php?id=61574186018322&locale=es_LA" target="_blank" rel="noopener noreferrer">
                <i className="hgi hgi-stroke hgi-facebook-02"></i>
            </a>
            <a href="https://www.instagram.com/accesoriosapolom/" target="_blank" rel="noopener noreferrer">
                <i className="hgi hgi-stroke hgi-instagram"></i>
            </a>
        </div>
    </div>
);
