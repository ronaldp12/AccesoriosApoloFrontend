import React, { useState, useContext, use } from "react";
import "./DashboardGerente.css";
import { Outlet } from "react-router-dom";
import { Logo } from "../../Ui/Logo/Logo.jsx";
import { FaHome, FaUser, FaBox, FaBars, FaList, FaTruck, FaMoneyBill, FaClipboard, FaMagic, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { context } from "../../../Context/Context.jsx";
import { useNavigate, useLocation } from "react-router-dom";

export const DashboardGerente = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { name, nameRol, handleLogout } = useContext(context);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const getInitials = (fullName) => {
        if (!fullName) return "";
        const words = fullName.trim().split(" ");
        if (words.length === 1) {
            return words[0][0].toUpperCase();
        } else {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
    };


    return (
        <div className="dashboard-layout">

            <button className="mobile-toggle-btn" onClick={toggleSidebar}>
                &#9776;
            </button>

            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <Logo styleContainer="logo-section" styleLogo="logo-dashboard" />
                <hr />

                <div className="menu-items">
                    <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
                        <FaHome /><span>Inicio</span>
                    </Link>

                    <Link to="/dashboard/manage-users" className={location.pathname.startsWith("/dashboard/manage-users") ? "active" : ""}>
                        <FaUser /><span>Usuario</span>
                    </Link>

                    <a href="#"><FaBox /><span>Producto</span></a>

                    <Link to="/dashboard/manage-categories" className={location.pathname.startsWith("/dashboard/manage-categories") ? "active" : ""}>
                        <FaBars /><span>Categorías</span>
                    </Link>

                    <Link to="/dashboard/manage-subcategories" className={location.pathname.startsWith("/dashboard/manage-subcategories") ? "active" : ""}>
                        <FaList /><span>Subcategorías</span>
                    </Link>
                    
                    <Link to="/dashboard/manage-supliers" className={location.pathname.startsWith("/dashboard/manage-supliers") ? "active" : ""}>
                        <FaTruck /><span>Proveedores</span>
                    </Link>

                    <a href="#"><FaMoneyBill /><span>Ventas</span></a>
                    <a href="#"><FaClipboard /><span>Inventario</span></a>
                    <a href="#"><FaMagic /><span>Calcomanías</span></a>
                    <a href="#" onClick={() => {
                        handleLogout();
                        navigate("/")
                    }}><FaSignOutAlt /><span>Salir</span></a>
                </div>

                <div className="bottom-profile">
                    <hr />
                    <div className="profile">
                        <div className="avatar">{getInitials(name)}</div>
                        <div className="profile-info">
                            <strong>{name}</strong>
                            <small>{nameRol}</small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <Outlet />
            </div>

            <button className={`toggle-btn ${isOpen ? "open" : ""}`} onClick={toggleSidebar}>
                <span><iconify-icon icon="fluent:ios-arrow-24-filled" /></span>
            </button>

        </div>
    );
};
