import React, { useEffect, useRef, useState } from "react";
import "./SearchResults.css";
import { useNavigate } from "react-router-dom";

export const SearchResults = ({ results, onClose }) => {
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

    const handleProductClick = (slug) => {
        navigate(`/product/${slug}`);
        handleClose();
    };

    return (
        <div
            ref={resultsRef}
            className={`search-results ${isVisible ? "show" : ""}`}
        >
            {results.length === 0 ? (
                <div className="no-results">No se encontraron resultados.</div>
            ) : (
                results.map((product) => (
                    <div
                        className="search-result-item"
                        key={product.id}
                        onClick={() => handleProductClick(product.slug)}
                    >
                        <img
                            src={product.image[0]}
                            alt={product.title}
                            className="result-image"
                        />
                        <div className="result-info">
                            <h4>{product.title}</h4>
                            <div className="result-prices">
                                {product.discount ? (
                                    <>
                                        <span className="discount-price">
                                            ${product.currentPrice.toLocaleString()}
                                        </span>
                                        <span className="original-price">
                                            ${product.originalPrice.toLocaleString()}
                                        </span>
                                    </>
                                ) : (
                                    <span className="discount-price">
                                        ${product.price.toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};
