import React, { useState, useContext } from "react";
import "./DashboardGerente.css";
import { Outlet } from "react-router-dom";
import { Logo } from "../../Ui/Logo/Logo.jsx";
import { FaHome, FaUser, FaBox, FaBars, FaTruck, FaMoneyBill, FaClipboard, FaMagic, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { context } from "../../../Context/Context.jsx";

export const DashboardGerente = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { name } = useContext(context);

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
                    <Link to="/dashboard"><FaHome /><span>Inicio</span></Link>
                    <a href="#"><FaUser /><span>Usuario</span></a>
                    <a href="#"><FaBox /><span>Producto</span></a>
                    <a href="#"><FaBars /><span>Categoría</span></a>
                    <a href="#"><FaTruck /><span>Proveedores</span></a>
                    <a href="#"><FaMoneyBill /><span>Ventas</span></a>
                    <a href="#"><FaClipboard /><span>Inventario</span></a>
                    <a href="#"><FaMagic /><span>Calcomanías</span></a>
                    <a href="#"><FaSignOutAlt /><span>Salir</span></a>
                </div>

                <div className="bottom-profile">
                    <hr />
                    <div className="profile">
                        <div className="avatar">{getInitials(name)}</div>
                        <div className="profile-info">
                            <strong>{name}</strong>
                            <small>Gerente</small>
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
