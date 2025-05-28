import React from "react";
import "./HomeDashboardGerente.css";
import { FaHome, FaUser, FaBox, FaBars, FaList, FaTruck, FaMoneyBill, FaClipboard, FaMagic } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { context } from "../../../Context/Context.jsx"

export const HomeDashboardGerente = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const { nameRol } = useContext(context);

    const modules = [
        { label: "USUARIOS", icon: <FaUser />, route: "/dashboard/manage-users" },
        { label: "PRODUCTO", icon: <FaBox /> },
        { label: "CATEGORÍA", icon: <FaBars />, route: "/dashboard/manage-categories" },
        { label: "SUBCATEGORÍA", icon: <FaList />, route: "/dashboard/manage-subcategories" },
        { label: "PROVEEDORES", icon: <FaTruck />, route: "/dashboard/manage-supliers", roles: ["gerente"] },
        { label: "VENTAS", icon: <FaMoneyBill /> },
        { label: "INVENTARIO", icon: <FaClipboard /> },
        { label: "CALCOMANÍAS", icon: <FaMagic /> },
    ];

    const filteredModules = modules
        .filter((module) =>
            !module.roles || module.roles.includes(nameRol)
        )
        .filter((module) =>
            module.label.toLowerCase().includes(searchTerm.toLowerCase())
        );


    return (
        <div className="home-container">
            <div className="header-section">
                <div>
                    <p className="home-link"><FaHome /> Inicio</p>
                </div>
                <div className="header-options">
                    <h1>Accesorios Apolo</h1>
                    <div className="search-box">
                        <input type="text" placeholder="Consultar por Módulo"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} />
                        <button><i className="bi bi-search"></i></button>
                    </div>

                </div>

            </div>

            <div className="card-grid">
                {filteredModules.map((module, index) => (
                    <div
                        className="card"
                        key={index}
                        onClick={() => module.route && navigate(module.route)}
                    >
                        <div className="card-content">{module.icon}</div>
                        <span>{module.label}</span>
                    </div>
                ))}
            </div>

        </div>
    );
};
