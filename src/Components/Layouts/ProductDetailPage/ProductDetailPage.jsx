import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Heart } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { products } from '../../products.js';
import './ProductDetailPage.css'

export const ProductDetailPage = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const { slug } = useParams();

    const product = products.find(p => p.slug === slug);

    if (!product) {
        return <div className="not-found">Producto no encontrado.</div>;
    }

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === product.image.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? product.image.length - 1 : prev - 1
        );
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    return (
        <div className="product-container">
            <div className="product-layout">
                {/* Galería de imágenes */}
                <div className="image-gallery">
                    <button className="nav-btn nav-btn-left" onClick={prevImage}>
                        <ChevronLeft size={20} />
                    </button>
                    <div className="image-container">

                        <div className="main-image">
                            <img
                                src={product.image[currentImageIndex]}
                                alt={product.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    backgroundColor: '#f8f9fa'
                                }}
                            />
                        </div>

                    </div>
                    <button className="nav-btn nav-btn-right" onClick={nextImage}>
                        <ChevronRight size={20} />
                    </button>

                    {/* Indicadores de puntos */}
                    <div className="dots-container">
                        {product.image.map((_, index) => (
                            <button
                                key={index}
                                className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                                onClick={() => goToImage(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Información del producto */}
                <div className="product-info">
                    {/* Título y rating */}
                    <div className="product-header">
                        <h1 className="product-title">{product.title}</h1>
                        <div className="rating-container">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`star ${i < product.rating ? 'filled' : ''}`}>
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className="reviews-count">{product.reviews} valoraciones</span>
                        </div>
                    </div>

                    {/* Precios */}
                    <div className="price-section">
                        <div className="price-container">
                            <span className="original-price">${product.originalPrice.toLocaleString()} COP</span>
                            <span className="discount-badge">{product.discount}</span>
                        </div>
                        <div className="current-price">${product.currentPrice.toLocaleString()} COP</div>
                        <div className="installments">{product.installments}</div>
                    </div>

                    {/* Botones de acción */}
                    <div className="action-buttons">
                        <button className="btn-secondary">
                            <Heart size={20} />
                            AÑADIR AL MALETERO
                        </button>
                        <button className="btn-primary">
                            <ShoppingCart size={20} />
                            COMPRAR AHORA
                        </button>
                    </div>
                </div>
            </div>

            {/* Sección de descripción */}
            <div className="description-section">
                <h2 className="section-title-description">DESCRIPCIÓN</h2>
                <div className="description-table">
                    <div className="table-row">
                        <span className="table-label">Referencia</span>
                        <span className="table-value">K107</span>
                    </div>
                    <div className="table-row">
                        <span className="table-label">Identificador</span>
                        <span className="table-value">PRO-TAPER-K107-NEGRO-AZUL</span>
                    </div>
                </div>
            </div>
        </div>
    )
};