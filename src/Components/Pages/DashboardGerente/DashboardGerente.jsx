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

    const sidebarLinks = [
        { label: "Inicio", icon: <FaHome />, route: "/dashboard" },
        { label: "Usuario", icon: <FaUser />, route: "/dashboard/manage-users" },
        { label: "Producto", icon: <FaBox />, route: "/dashboard/manage-products" },
        { label: "Categorías", icon: <FaBars />, route: "/dashboard/manage-categories" },
        { label: "Subcategorías", icon: <FaList />, route: "/dashboard/manage-subcategories" },
        { label: "Proveedores", icon: <FaTruck />, route: "/dashboard/manage-supliers", roles: ["gerente"] },
        { label: "Ventas", icon: <FaMoneyBill />, route: "/dashboard/manage-sales" },
        { label: "Factura Proveedor", icon: <FaFileInvoice />, route: "/dashboard/manage-invoice" },
        { label: "Inventario", icon: <FaClipboard />, route: "/dashboard/manage-inventory" },
        { label: "Calcomanías", icon: <FaMagic />, route: "/dashboard/manage-stickers" },
    ];

    const allowedSidebarLinks = sidebarLinks.filter(
        (item) => !item.roles || item.roles.includes(nameRol)
    );

    const isActive = (route) => {
        if (route === "/dashboard") {
            return location.pathname === "/dashboard";
        }
        return location.pathname.startsWith(route);
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
                    {allowedSidebarLinks.map((item, idx) => (
                        <Link
                            key={idx}
                            to={item.route}
                            className={isActive(item.route) ? "active" : ""}
                        >
                            {item.icon}<span>{item.label}</span>
                        </Link>

                    ))}

                    <a href="#" onClick={openConfirmLogout}>
                        <FaSignOutAlt /><span>Salir</span>
                    </a>
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
