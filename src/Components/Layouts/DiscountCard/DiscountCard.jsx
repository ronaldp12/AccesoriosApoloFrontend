import React from 'react';
import { Link } from 'react-router-dom';

export const DiscountCard = ({ imagen, titulo }) => {
    // Normalizar el título para crear la URL
    const createUrlPath = (title) => {
        return title.toLowerCase().replace(/\s+/g, '-');
    };

    return (
        <Link to={`/products?category=${encodeURIComponent(titulo)}&discounts=true`} className="card-discount">
            <img src={imagen} alt={titulo} />
            <div className="card-text">
                <h3>{titulo}</h3>
                <span>DESCUENTOS</span>
            </div>
        </Link>
    );
};