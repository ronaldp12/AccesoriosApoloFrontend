import React, { useState, useEffect } from "react";
import { useSubcategories } from "../../Hook/UseSubcategories/UseSubcategories.jsx";
import "./ProductFilterSidebar.css";
import { useBrandsBySubcategory } from "../../Hook/UseSubcategories/UseSubcategories.jsx";

export const ProductFilterSidebar = ({ isMobile, onClose, onSelectSubcategory, currentCategory, onPriceFilterChange, onSelectBrand, selectedSubcategory, brandFromURL, selectedBrand, onSelectCategory }) => {
    const [priceLimit, setPriceLimit] = useState(1000000);
    const [selectedCategory, setSelectedCategory] = useState(currentCategory || "");

    const { subcategories, loading, error } = useSubcategories(currentCategory);
    const { brands, loading: brandsLoading, error: brandsError } = useBrandsBySubcategory(selectedSubcategory);

    const handlePriceChange = (e) => {
        const newPrice = Number(e.target.value);
        setPriceLimit(newPrice);
        onPriceFilterChange(newPrice);
    };

    const handleSubcategorySelect = (subcategoryLabel) => {
        onSelectSubcategory(subcategoryLabel);
    };

    return (
        <div className={`filter-sidebar ${isMobile ? "mobile" : ""}`}>
            {isMobile && (
                <button className="close-btn" onClick={onClose}>✕</button>
            )}
            <div className="filter-title">
                <h2>FILTROS</h2>
                <div className="filter-sort">
                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            const newCategory = e.target.value;
                            setSelectedCategory(newCategory);
                            onSelectCategory(newCategory);
                        }}
                    >
                        <option value="">Selecciona categoría</option>
                        <option value="Cascos">Cascos</option>
                        <option value="Equipacion Carretera">Equipación carretera</option>
                        <option value="Accesorios">Accesorios</option>
                        <option value="Luces">Luces</option>
                        <option value="Limpieza">Limpieza</option>
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
                                onClick={() => handleSubcategorySelect(subcategory.label)}
                                className={selectedSubcategory === subcategory.label ? 'active' : ''}
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
                    <select
                        value={selectedBrand || brandFromURL || ""}
                        onChange={(e) => {
                            onSelectBrand(e.target.value)
                        }}
                    >
                        <option value="">Selecciona la marca</option>
                        {brandFromURL ? (
                            // Cuando está en modo marca, mostrar marcas fijas
                            <>
                                <option value="Ich">Ich</option>
                                <option value="Shaft">Shaft</option>
                                <option value="Hro">Hro</option>
                                <option value="Arai">Arai</option>
                                <option value="Shoei">Shoei</option>
                                <option value="Otros">Otros</option>
                            </>
                        ) : (
                            // Cuando NO está en modo marca, mantener lógica original
                            brandsLoading ? (
                                <option disabled>Cargando marcas...</option>
                            ) : brandsError ? (
                                <option disabled>Error al cargar marcas</option>
                            ) : (
                                brands.map((brand, index) => (
                                    <option key={index} value={brand}>
                                        {brand}
                                    </option>
                                ))
                            )
                        )}
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