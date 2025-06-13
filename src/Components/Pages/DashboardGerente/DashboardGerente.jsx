import React, { useState, useContext, use } from "react";
import "./DashboardGerente.css";
import { Outlet } from "react-router-dom";
import { Logo } from "../../Ui/Logo/Logo.jsx";
import { FaHome, FaUser, FaBox, FaBars, FaList, FaTruck, FaMoneyBill, FaFileInvoice, FaClipboard, FaMagic, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { context } from "../../../Context/Context.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { ConfirmModal } from "../../Ui/ConfirmModal/ConfirmModal.jsx";

export const DashboardGerente = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { name, nameRol, handleLogout } = useContext(context);
    const navigate = useNavigate();
    const location = useLocation();

    const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);

    const openConfirmLogout = () => setIsConfirmLogoutOpen(true);
    const closeConfirmLogout = () => setIsConfirmLogoutOpen(false);


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
                    <Logo route="/dashboard" styleContainer="logo-section" styleLogo="logo-dashboard" />
                <hr />

                <div className="menu-items">
                    <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
                        <FaHome /><span>Inicio</span>
                    </Link>

                    <Link to="/dashboard/manage-users" className={location.pathname.startsWith("/dashboard/manage-users") ? "active" : ""}>
                        <FaUser /><span>Usuario</span>
                    </Link>

                    <Link to="/dashboard/manage-products" className={location.pathname.startsWith("/dashboard/manage-products") ? "active" : ""}>
                        <FaBox /><span>Producto</span>
                    </Link>

                    <Link to="/dashboard/manage-categories" className={location.pathname.startsWith("/dashboard/manage-categories") ? "active" : ""}>
                        <FaBars /><span>Categorías</span>
                    </Link>

                    <Link to="/dashboard/manage-subcategories" className={location.pathname.startsWith("/dashboard/manage-subcategories") ? "active" : ""}>
                        <FaList /><span>Subcategorías</span>
                    </Link>

                    <Link to="/dashboard/manage-supliers" className={location.pathname.startsWith("/dashboard/manage-supliers") ? "active" : ""}>
                        <FaTruck /><span>Proveedores</span>
                    </Link>

                    <Link to="/dashboard/manage-sales" className={location.pathname.startsWith("/dashboard/manage-sales") ? "active" : ""}>
                        <FaMoneyBill /><span>Ventas</span>
                    </Link>

                    <Link to="/dashboard/manage-invoice" className={location.pathname.startsWith("/dashboard/manage-invoice") ? "active" : ""}>
                        <FaFileInvoice /><span>Factura Proveedor</span>
                    </Link>

                    <Link to="/dashboard/manage-inventory" className={location.pathname.startsWith("/dashboard/manage-inventory") ? "active" : ""}>
                        <FaClipboard /><span>Inventario</span>
                    </Link>

                    <Link to="/dashboard/manage-stickers" className={location.pathname.startsWith("/dashboard/manage-stickers") ? "active" : ""}>
                        <FaMagic /><span>Calcomanías</span>
                    </Link>

                    <a href="#" onClick={openConfirmLogout}
                    ><FaSignOutAlt /><span>Salir</span></a>
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

            <ConfirmModal
                isOpen={isConfirmLogoutOpen}
                onClose={closeConfirmLogout}
                title="¿Cerrar sesión?"
                message="¿Estás seguro de que deseas cerrar tu sesión y salir del sistema?"
                confirmText="Salir"
                onConfirm={() => {
                    handleLogout();
                    navigate("/");
                }}
            />


        </div>
    );
};
