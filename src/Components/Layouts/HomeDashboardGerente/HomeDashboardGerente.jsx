import React from "react";
import "./HomeDashboardGerente.css";
import { FaHome, FaUser, FaBox, FaBars, FaTruck, FaMoneyBill, FaClipboard, FaMagic } from "react-icons/fa";

export const HomeDashboardGerente = () => {
    return (
        <div className="home-container">
            <div className="header-section">
                <div>
                    <a href="#" className="home-link"><FaHome /> Inicio</a>
                </div>
                <div className="header-options">
                    <h1>Accesorios Apolo</h1>
                    <div className="search-box">
                        <input type="text" placeholder="Consultar por Módulo" />
                        <button><i className="bi bi-search"></i></button>
                    </div>

                </div>

            </div>

            <div className="card-grid">
                <div className="card">
                    <div className="card-content">
                        <FaUser className="card-icon" />
                    </div>
                    <span>USUARIOS</span>
                </div>
                <div className="card">
                    <div className="card-content">
                        <FaBox className="card-icon" />
                    </div>
                    <span>PRODUCTO</span>

                </div>
                <div className="card">
                    <div className="card-content">
                        <FaBars className="card-icon" />
                    </div>
                    <span>CATEGORÍA</span>

                </div>
                <div className="card">
                    <div className="card-content">
                        <FaTruck className="card-icon" />

                    </div>
                    <span>PROVEEDORES</span>

                </div>
                <div className="card">
                    <div className="card-content">
                        <FaMoneyBill className="card-icon" />

                    </div>
                    <span>VENTAS</span>
                </div>
                <div className="card">
                    <div className="card-content">
                        <FaClipboard className="card-icon" />

                    </div>
                    <span>INVENTARIO</span>

                </div>
                <div className="card">
                    <div className="card-content">
                        <FaMagic className="card-icon" />

                    </div>
                    <span>CALCOMANÍAS</span>

                </div>
            </div>
        </div>
    );
};
