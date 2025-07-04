import React, { useEffect, useRef, useState } from "react";
import "./SearchResults.css";
import { useNavigate } from "react-router-dom";

export const SearchResults = ({ results, onClose, isLoading, error }) => {
    const navigate = useNavigate();
    const resultsRef = useRef();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true);
        }, 10);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (resultsRef.current && !resultsRef.current.contains(event.target)) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 250);
    };

    const formatPrice = (price) => {
        return Number(price).toLocaleString("es-CO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            useGrouping: true
        });
    };

    const handleProductClick = (product) => {
        // Navegar según el tipo de producto
        const route = product.tipo === 'calcomania'
            ? `/calcomania/${product.slug}`
            : `/product/${product.slug}`;

        navigate(route);
        handleClose();
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="search-loading">
                    <div className="loading-spinner"></div>
                    Buscando productos...
                </div>
            );
        }

        if (error) {
            return (
                <div className="search-error">
                    {error}
                </div>
            );
        }

        return results.map((product) => (
            <div
                className="search-result-item"
                key={`${product.tipo}-${product.id}`}
                onClick={() => handleProductClick(product)}
            >
                <img
                    src={product.image[0]}
                    alt={product.title}
                    className="result-image"
                    onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                    }}
                />
                <div className="result-info">
                    <h4>{product.title}</h4>

                    <div className="result-prices">
                        {product.discount ? (
                            <>
                                <span className="discount-price">
                                    ${formatPrice(product.currentPrice)}
                                </span>
                                <span className="original-price">
                                    ${formatPrice(product.originalPrice)}
                                </span>
                            </>
                        ) : (
                            <span className="discount-price">
                                ${formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div
            ref={resultsRef}
            className={`search-results ${isVisible ? "show" : ""}`}
        >
            {renderContent()}
        </div>
    );
};