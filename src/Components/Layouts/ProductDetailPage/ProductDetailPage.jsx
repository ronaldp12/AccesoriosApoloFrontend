import React, { useState, useContext } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Heart } from 'lucide-react';
import { useParams } from 'react-router-dom';
import './ProductDetailPage.css'
import { context } from '../../../Context/Context.jsx';
import wheelIcon from '../../../assets/icons/img1-loader.png';
import { useProductsBySubcategory } from '../../Hook/UseProductsBySubcategory/UseProductsBySubcategory.jsx';

export const ProductDetailPage = () => {
    const { handleAddToCart } = useContext(context);
    const [isAdding, setIsAdding] = useState(false);
    const [addedMessage, setAddedMessage] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const { slug } = useParams(); // Este será la referencia del producto

    // Usar el hook modificado para obtener el producto por referencia
    const { product, loading, error } = useProductsBySubcategory(null, slug);

    // Mostrar estados de carga y error
    if (loading) {
        return (
            <div className="loading-container">
                <img src={wheelIcon} alt="cargando" className="wheel-loader" />
                <p>Cargando producto...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
            </div>
        );
    }

    if (!product) {
        return <div className="not-found">Producto no encontrado.</div>;
    }

    const nextImage = () => {
        if (product.image && product.image.length > 1) {
            setCurrentImageIndex((prev) =>
                prev === product.image.length - 1 ? 0 : prev + 1
            );
        }
    };
    console.log (product)

    const prevImage = () => {
        if (product.image && product.image.length > 1) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? product.image.length - 1 : prev - 1
            );
        }
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    const handleAddClick = () => {
        setIsAdding(true);
        setTimeout(() => {
            handleAddToCart({
                id: product.id,
                image: product.image[0],
                brand: product.brand,
                title: product.title,
                price: product.currentPrice || product.price,
                referencia: product.referencia
            });
            setIsAdding(false);
            setAddedMessage(true);
            setTimeout(() => {
                setAddedMessage(false);
            }, 1200);
        }, 800);
    };

    // Renderizar estrellas de rating
    const renderStars = () => {
        const stars = [];
        const currentRating = product.rating || 0;
        const fullStars = Math.floor(currentRating);
        const hasHalfStar = currentRating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <i key={`full-${i}`} className="fa-solid fa-star filled"></i>
            );
        }

        if (hasHalfStar) {
            stars.push(
                <i key="half" className="fa-solid fa-star-half-stroke filled"></i>
            );
        }

        const emptyStars = 5 - Math.ceil(currentRating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <i key={`empty-${i}`} className="fa-regular fa-star"></i>
            );
        }

        return stars;
    };

    return (
        <div className="product-container">
            <div className="product-layout">
                {/* Galería de imágenes */}
                <div className="image-gallery">
                    {product.image && product.image.length > 1 && (
                        <button className="nav-btn nav-btn-left" onClick={prevImage}>
                            <ChevronLeft size={20} />
                        </button>
                    )}

                    <div className="image-container">
                        <div className="main-image">
                            <img
                                src={product.image?.[currentImageIndex] || product.image?.[0]}
                                alt={product.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    backgroundColor: '#f8f9fa'
                                }}
                                onError={(e) => {
                                    e.target.src = "/path/to/default-image.png";
                                }}
                            />
                        </div>
                    </div>

                    {product.image && product.image.length > 1 && (
                        <button className="nav-btn nav-btn-right" onClick={nextImage}>
                            <ChevronRight size={20} />
                        </button>
                    )}

                    {/* Indicadores de puntos - solo si hay múltiples imágenes */}
                    {product.image && product.image.length > 1 && (
                        <div className="dots-container-product-detail">
                            {product.image.map((_, index) => (
                                <button
                                    key={index}
                                    className={`dot-product-detail ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => goToImage(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Información del producto */}
                <div className="product-info">
                    {/* Título y rating */}
                    <div className="product-header">
                        <h1 className="product-title">{product.title}</h1>
                        <div className="rating-container">
                            <div className="stars">
                                {renderStars()}
                            </div>
                            <span className="reviews-count">
                                {product.reviews || 0} valoraciones
                            </span>
                        </div>
                    </div>

                    {/* Precios */}
                    <div className="price-section">
                        {product.originalPrice && (
                            <div className="price-container-product-detail">
                                <span className="original-price-product-detail">
                                    ${product.originalPrice.toLocaleString()} COP
                                </span>
                                {product.discount && (
                                    <span className="discount-badge-product-detail">{product.discount}</span>
                                )}
                            </div>
                        )}
                        <div className="current-price">
                            ${(product.currentPrice || product.price).toLocaleString()} COP
                        </div>
                        {product.ahorro && (
                            <div className="installments">
                                Ahorras ${product.ahorro.toLocaleString()} COP
                            </div>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="action-buttons">
                        <button className="btn-secondary" onClick={handleAddClick} disabled={isAdding}>
                            {isAdding ? (
                                <img src={wheelIcon} alt="cargando" className="wheel-loader" />
                            ) : addedMessage ? (
                                <span className="added-message">Agregado</span>
                            ) : (
                                <>
                                    <Heart size={20} />
                                    AÑADIR AL MALETERO
                                </>
                            )}
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
                        <span className="table-value">{product.referencia}</span>
                    </div>
                    <div className="table-row">
                        <span className="table-label">Marca</span>
                        <span className="table-value">{product.brand}</span>
                    </div>
                    {product.talla && (
                        <div className="table-row">
                            <span className="table-label">Talla</span>
                            <span className="table-value">{product.talla}</span>
                        </div>
                    )}
                    {product.descripcion && (
                        <div className="table-row">
                            <span className="table-label">Descripción</span>
                            <span className="table-value">{product.descripcion}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};