import React, { useState } from "react";
import "./ProductFilterSideBar.css";

export const ProductFilterSidebar = ({ isMobile, onClose, onSelectSubcategory }) => {
    const [priceLimit, setPriceLimit] = useState(300000);

    const handlePriceChange = (e) => {
        setPriceLimit(Number(e.target.value));
    };

    return (
        <div className={`filter-sidebar ${isMobile ? "mobile" : ""}`}>
            {isMobile && (
                <button className="close-btn" onClick={onClose}>✕</button>
            )}
            <div className="filter-title">
                <h2>FILTROS</h2>
                <div className="filter-sort">
                    <select>
                        <option value="">cascos</option>
                        <option value="">equipación carretera</option>
                    </select>
                </div>
            </div>

            <ul>
                <li onClick={() => onSelectSubcategory("Novedades")}>NOVEDADES</li>
                <li onClick={() => onSelectSubcategory("Integral")}>CERRADOS O INTEGRALES</li>
                <li onClick={() => onSelectSubcategory("Abatible")}>ABATIBLES</li>
                <li onClick={() => onSelectSubcategory("Abierto")}>ABIERTOS</li>
                <li onClick={() => onSelectSubcategory("Cross")}>CROSS</li>
            </ul>

            <div className="filter-brand">
                <h2>MOSTRAR POR MARCA</h2>
                <div className="filter-sort-brand">
                    <select>
                        <option value="">Selecciona la marca</option>
                        <option value="">cascos</option>
                    </select>
                </div>
            </div>

            <div className="filter-brand">
                <h2>FILTRAR POR PRECIOS</h2>
                <div className="price-slider-container">
                    <input
                        type="range"
                        min="0"
                        max="1000000"
                        step="50000"
                        value={priceLimit}
                        onChange={handlePriceChange}
                        className="price-slider"
                    />
                    <p className="price-value">Hasta: ${priceLimit.toLocaleString('es-CO')}</p>
                </div>
            </div>
        </div>
    );
};
