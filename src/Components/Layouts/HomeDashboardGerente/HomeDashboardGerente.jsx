import React from "react";
import "./HomeDashboardGerente.css";
import { FaHome, FaUser, FaBox, FaBars, FaTruck, FaMoneyBill, FaClipboard, FaMagic } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const HomeDashboardGerente = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] =useState("");

    const modules = [
        { label: "USUARIOS", icon: <FaUser />, route: "/dashboard/manage-users" },
        { label: "PRODUCTO", icon: <FaBox /> },
        { label: "CATEGORÍA", icon: <FaBars /> },
        { label: "PROVEEDORES", icon: <FaTruck /> },
        { label: "VENTAS", icon: <FaMoneyBill /> },
        { label: "INVENTARIO", icon: <FaClipboard /> },
        { label: "CALCOMANÍAS", icon: <FaMagic /> },
    ];

    const filteredModules = modules.filter((module) =>
        module.label.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="home-container">
            <div className="header-section">
                <div>
                    <a href="#" className="home-link"><FaHome /> Inicio</a>
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
