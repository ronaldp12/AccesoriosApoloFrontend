import React, { useState, useRef, useContext } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useParams } from 'react-router-dom';
import './ProductDetailPage.css';
import { context } from '../../../Context/Context.jsx';
import wheelIcon from '../../../assets/icons/img1-loader.png';
import { useProductsBySubcategory } from '../../Hook/UseProductsBySubcategory/UseProductsBySubcategory.jsx';
import { UseProductsCart } from '../../Hook/UseProductsCart/UseProductsCart.jsx';
import { ConfigureStickerModal } from '../../Ui/ConfigureStickerModal/ConfigureStickerModal.jsx';

export const ProductDetailPage = () => {
    const { loadCartFromBackend } = useContext(context);
    const { slug } = useParams();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showStickerModal, setShowStickerModal] = useState(false);
    const [showFloatingMessage, setShowFloatingMessage] = useState(false);

    const imageRefs = useRef([]);

    const { product, loading, error } = useProductsBySubcategory(null, slug);
    const {
        isAddingToCart,
        cartSuccessMessage,
        addProductToCart,
        isProductAdding
    } = UseProductsCart();

    const isSticker = () => {
        if (!product) return false;
        const normalizedBrand = product.brand?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return normalizedBrand === 'calcomania';
    };

    const formatPrice = (price) =>
        price.toLocaleString("es-CO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            useGrouping: true
        });

    const renderStars = () => {
        const stars = [];
        const rating = product.rating || 0;
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) stars.push(<i key={i} className="fa-solid fa-star filled"></i>);
            else if (i - 0.5 <= rating) stars.push(<i key={i} className="fa-solid fa-star-half-stroke filled"></i>);
            else stars.push(<i key={i} className="fa-regular fa-star"></i>);
        }
        return stars;
    };

    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleAddClick = async () => {
        if (isSticker()) {
            setShowStickerModal(true);
            return;
        }
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
            const result = await addProductToCart(productData, quantity, loadCartFromBackend);
            if (result.success) {
                setQuantity(1);
                setShowFloatingMessage(true);
                setTimeout(() => setShowFloatingMessage(false), 3000);
            }
        } catch (err) {
            console.error('Error en handleAddClick:', err);
        }
    };

    const animateCarousel = (direction, newIndex) => {
        if (isAnimating || !product.image || product.image.length <= 1) return;
        setIsAnimating(true);
        const currentImg = imageRefs.current[currentImageIndex];
        const newImg = imageRefs.current[newIndex];
        if (!currentImg || !newImg) return;
        imageRefs.current.forEach(img => img?.classList.remove('active', 'slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right'));
        if (direction === 'next') {
            currentImg.classList.add('active', 'slide-out-left');
            newImg.classList.add('slide-in-right');
        } else {
            currentImg.classList.add('active', 'slide-out-right');
            newImg.classList.add('slide-in-left');
        }
        setTimeout(() => {
            setCurrentImageIndex(newIndex);
            imageRefs.current.forEach(img => img?.classList.remove('active', 'slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right'));
            imageRefs.current[newIndex]?.classList.add('active');
            setIsAnimating(false);
        }, 500);
    };

    const nextImage = () => {
        if (product.image && product.image.length > 1 && !isAnimating) {
            animateCarousel('next', (currentImageIndex + 1) % product.image.length);
        }
    };

    const prevImage = () => {
        if (product.image && product.image.length > 1 && !isAnimating) {
            animateCarousel('prev', (currentImageIndex - 1 + product.image.length) % product.image.length);
        }
    };

    const goToImage = (index) => {
        if (index !== currentImageIndex && !isAnimating) {
            animateCarousel(index > currentImageIndex ? 'next' : 'prev', index);
        }
    };

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

    const isCurrentProductAdding = isProductAdding(product.referencia || product.id);
    const showSuccessMessage = cartSuccessMessage && !isAddingToCart;

    return (
        <>
            <div className="product-container">
                <div className="product-layout">
                    <div className="image-gallery">
                        {product.image?.length > 1 && (
                            <button className="nav-btn nav-btn-left" onClick={prevImage} disabled={isAnimating}>
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        <div className="image-container">
                            <div className="main-image">
                                {product.image?.map((img, index) => (
                                    <img
                                        key={index}
                                        ref={el => (imageRefs.current[index] = el)}
                                        src={img}
                                        alt={`${product.title} - ${index + 1}`}
                                        className={index === currentImageIndex ? 'active' : ''}
                                        onError={(e) => { e.target.src = "/path/to/default-image.png"; }}
                                    />
                                ))}
                            </div>
                        </div>
                        {product.image?.length > 1 && (
                            <button className="nav-btn nav-btn-right" onClick={nextImage} disabled={isAnimating}>
                                <ChevronRight size={20} />
                            </button>
                        )}
                        {product.image?.length > 1 && (
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

                    <div className="product-info">
                        <div className="product-header">
                            <h1 className="product-title">{product.title}</h1>
                            <div className="rating-container">
                                <div className="stars">{renderStars()}</div>
                                <span className="reviews-count">{product.reviews || 0} valoraciones</span>
                            </div>
                        </div>

                        <div className="product-details-product-detail">
                            <div className="detail-item"><span className="detail-label">Referencia:</span><span className="detail-value">{product.referencia}</span></div>
                            <div className="detail-item"><span className="detail-label">{isSticker() ? 'Tipo:' : 'Marca:'}</span><span className="detail-value">{product.brand}</span></div>
                            {!isSticker() && <div className="detail-item"><span className="detail-label">Talla:</span><span className="detail-value">{product.talla}</span></div>}
                        </div>

                        <div className="price-section">
                            {product.originalPrice && (
                                <div className="price-container-product-detail">
                                    {product.discount && <span className="discount-badge-product-detail">{product.discount}</span>}
                                    <span className="original-price-product-detail">${formatPrice(product.originalPrice)} COP</span>
                                </div>
                            )}
                            <div className="current-price">${formatPrice(product.currentPrice || product.price)} COP</div>
                            {product.ahorro &&
                                <div className="installments">Ahorras ${formatPrice(product.ahorro)} COP
                                </div>
                            }
                        </div>

                        <div className="action-buttons">
                            {!isSticker() && (
                                <div className="quantity-selector">
                                    <button className="quantity-btn" onClick={decreaseQuantity} disabled={quantity <= 1 || isCurrentProductAdding}>-</button>
                                    <span className="quantity-display">{quantity}</span>
                                    <button className="quantity-btn" onClick={increaseQuantity} disabled={isCurrentProductAdding}>+</button>
                                </div>
                            )}
                            <button className="btn-secondary" onClick={handleAddClick} disabled={isCurrentProductAdding}>
                                {isCurrentProductAdding ? (
                                    <img src={wheelIcon} alt="cargando" className="wheel-loader" />
                                ) : (
                                    <>
                                        <ShoppingCart size={20} />
                                        {isSticker() ? 'CONFIGURAR Y AÑADIR' : 'AÑADIR AL MALETERO'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="description-section">
                    <h2 className="section-title-description">DESCRIPCIÓN</h2>
                    <div className="description-table">
                        <div className="table-row"><span className="table-value">{product.descripcion}</span></div>
                    </div>
                </div>
            </div>

            {isSticker() && (
                <ConfigureStickerModal
                    isOpen={showStickerModal}
                    onClose={() => setShowStickerModal(false)}
                    sticker={{
                        id: product.id,
                        image: product.image?.[0],
                        brand: product.brand,
                        title: product.title,
                        price: product.originalPrice || product.price,
                        originalPrice: product.originalPrice,
                        discountedPrice: product.currentPrice,
                        type: 'sticker',
                        referencia: product.referencia || product.id,
                        discountPercent: product.discount ? parseInt(product.discount.replace('%', '')) : null
                    }}
                    isPersonalSticker={false}
                />
            )}

            {showFloatingMessage && (
                <div className="floating-message-detail">
                    <i className="fa-solid fa-check-circle"></i>
                    <span>Item agregado al maletero</span>
                </div>
            )}
        </>
    );
};
