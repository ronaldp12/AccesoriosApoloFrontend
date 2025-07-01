import React, { useState } from "react";
import { useSubcategories } from "../../Hook/UseSubcategories/UseSubcategories.jsx"; 
import "./ProductFilterSidebar.css";

export const ProductFilterSidebar = ({ isMobile, onClose, onSelectSubcategory, currentCategory, onPriceFilterChange }) => {
    const [priceLimit, setPriceLimit] = useState(1000000);

    const { subcategories, loading, error } = useSubcategories(currentCategory);

    const handlePriceChange = (e) => {
        const newPrice = Number(e.target.value);
        setPriceLimit(newPrice);
        onPriceFilterChange(newPrice);
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

            {/* Lista dinámica de subcategorías */}
            <div className="subcategories-section">

                {loading ? (
                    <p>Cargando subcategorías...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <ul>

                        {/* Mostrar subcategorías dinámicas */}
                        {subcategories.map((subcategory, index) => (
                            <li
                                key={index}
                                onClick={() => onSelectSubcategory(subcategory.label)}
                            >
                                {subcategory.label.toUpperCase()}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

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