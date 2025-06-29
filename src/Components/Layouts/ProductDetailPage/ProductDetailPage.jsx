import React, { useState, useContext, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Heart } from 'lucide-react';
import { useParams } from 'react-router-dom';
import './ProductDetailPage.css'
import { context } from '../../../Context/Context.jsx';
import wheelIcon from '../../../assets/icons/img1-loader.png';
import { useProductsBySubcategory } from '../../Hook/UseProductsBySubcategory/UseProductsBySubcategory.jsx';
import { UseProductsCart } from '../../Hook/UseProductsCart/UseProductsCart.jsx';

export const ProductDetailPage = () => {
    const { handleAddToCart, loadCartFromBackend } = useContext(context);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const imageRefs = useRef([]);

    const { slug } = useParams();

    const { product, loading, error } = useProductsBySubcategory(null, slug);

    // Integración del hook UseProductsCart
    const {
        isAddingToCart,
        cartSuccessMessage,
        cartErrorMessage,
        addingProductId,
        addProductToCart,
        isProductAdding
    } = UseProductsCart();

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

    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const animateCarousel = (direction, newIndex) => {
        if (isAnimating || !product.image || product.image.length <= 1) return;

        setIsAnimating(true);

        const currentImg = imageRefs.current[currentImageIndex];
        const newImg = imageRefs.current[newIndex];

        if (!currentImg || !newImg) return;

        // Limpiar clases anteriores
        imageRefs.current.forEach(img => {
            if (img) {
                img.classList.remove('active', 'slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right');
            }
        });

        if (direction === 'next') {
            currentImg.classList.add('active', 'slide-out-left');
            newImg.classList.add('slide-in-right');
        } else {
            currentImg.classList.add('active', 'slide-out-right');
            newImg.classList.add('slide-in-left');
        }

        // Después de la animación, actualizar el estado
        setTimeout(() => {
            setCurrentImageIndex(newIndex);
            imageRefs.current.forEach(img => {
                if (img) {
                    img.classList.remove('active', 'slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right');
                }
            });
            if (imageRefs.current[newIndex]) {
                imageRefs.current[newIndex].classList.add('active');
            }
            setIsAnimating(false);
        }, 500);
    };

    const nextImage = () => {
        if (product.image && product.image.length > 1 && !isAnimating) {
            const newIndex = currentImageIndex === product.image.length - 1 ? 0 : currentImageIndex + 1;
            animateCarousel('next', newIndex);
        }
    };

    const prevImage = () => {
        if (product.image && product.image.length > 1 && !isAnimating) {
            const newIndex = currentImageIndex === 0 ? product.image.length - 1 : currentImageIndex - 1;
            animateCarousel('prev', newIndex);
        }
    };

    const formatPrice = (price) => {
        return price.toLocaleString("es-CO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            useGrouping: true
        });
    };

    const goToImage = (index) => {
        if (index !== currentImageIndex && !isAnimating) {
            const direction = index > currentImageIndex ? 'next' : 'prev';
            animateCarousel(direction, index);
        }
    };

    // Nueva función para agregar al carrito usando el hook
    const handleAddClick = async () => {
        try {
            const productData = {
                title: product.title,
                brand: product.brand,
                price: product.currentPrice || product.price,
                originalPrice: product.originalPrice,
                discount: product.discount,
                image: product.image?.[0] || '',
                referencia: product.referencia || product.id,
                id: product.id
            };

            // Pasar la función loadCartFromBackend del contexto al hook
            const result = await addProductToCart(
                product.referencia || product.id,
                quantity,
                product.title,
                productData,
                loadCartFromBackend  // Aquí pasamos la función del contexto
            );

            if (result.success) {
                setQuantity(1)
                console.log('Producto agregado exitosamente al carrito');
            } else {
                console.error('Error al agregar producto:', result.error);
            }
        } catch (error) {
            console.error('Error en handleAddClick:', error);
        }
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

    // Verificar si este producto específico se está agregando
    const isCurrentProductAdding = isProductAdding(product.referencia || product.id);

    return (
        <div className="product-container">

            <div className="product-layout">
                {/* Galería de imágenes */}
                <div className="image-gallery">
                    {product.image && product.image.length > 1 && (
                        <button
                            className="nav-btn nav-btn-left"
                            onClick={prevImage}
                            disabled={isAnimating}
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}

                    <div className="image-container">
                        <div className="main-image">
                            {product.image && product.image.map((img, index) => (
                                <img
                                    key={index}
                                    ref={el => imageRefs.current[index] = el}
                                    src={img}
                                    alt={`${product.title} - Imagen ${index + 1}`}
                                    className={index === currentImageIndex ? 'active' : ''}
                                    onError={(e) => {
                                        e.target.src = "/path/to/default-image.png";
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {product.image && product.image.length > 1 && (
                        <button
                            className="nav-btn nav-btn-right"
                            onClick={nextImage}
                            disabled={isAnimating}
                        >
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
                                    disabled={isAnimating}
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

                    <div className="product-details-product-detail">
                        <div className="detail-item">
                            <span className="detail-label">Referencia:</span>
                            <span className="detail-value">{product.referencia}</span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">
                                {product.brand?.toLowerCase() === 'calcomania' ? 'Calcomanía' : 'Marca:'}
                            </span>
                            <span className="detail-value">{product.brand}</span>
                        </div>

                        {product.brand?.toLowerCase() !== 'calcomania' && (
                            <div className="detail-item">
                                <span className="detail-label">Talla:</span>
                                <span className="detail-value">{product.talla}</span>
                            </div>
                        )}
                    </div>

                    {/* Precios */}
                    <div className="price-section">
                        {product.originalPrice && (
                            <div className="price-container-product-detail">
                                {product.discount && (
                                    <span className="discount-badge-product-detail">{product.discount}</span>
                                )}
                                <span className="original-price-product-detail">
                                    ${formatPrice(product.originalPrice)} COP
                                </span>
                            </div>
                        )}
                        <div className="current-price">
                            ${formatPrice(product.currentPrice || product.price)} COP
                        </div>
                        {product.ahorro && (
                            <div className="installments">
                                Ahorras ${formatPrice(product.ahorro)} COP
                            </div>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="action-buttons">
                        <div className="quantity-selector">
                            <button
                                className="quantity-btn"
                                onClick={decreaseQuantity}
                                disabled={quantity <= 1 || isCurrentProductAdding}
                            >
                                -
                            </button>
                            <span className="quantity-display">{quantity}</span>
                            <button
                                className="quantity-btn"
                                onClick={increaseQuantity}
                                disabled={isCurrentProductAdding}
                            >
                                +
                            </button>
                        </div>

                        <button
                            className="btn-secondary"
                            onClick={handleAddClick}
                            disabled={isCurrentProductAdding}
                        >
                            {isCurrentProductAdding ? (
                                <img src={wheelIcon} alt="cargando" className="wheel-loader" />
                            ) : cartSuccessMessage && !cartErrorMessage ? (
                                <span className="added-message">Agregado</span>
                            ) : (
                                <>
                                    <ShoppingCart size={20} />
                                    AÑADIR AL MALETERO
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Sección de descripción */}
            <div className="description-section">
                <h2 className="section-title-description">DESCRIPCIÓN</h2>
                <div className="description-table">
                    <div className="table-row">
                        <span className="table-value">{product.descripcion}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};