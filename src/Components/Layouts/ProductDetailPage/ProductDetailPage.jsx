import React, { useState, useRef, useContext, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useParams, useLocation } from 'react-router-dom';
import './ProductDetailPage.css';
import { context } from '../../../Context/Context.jsx';
import wheelIcon from '../../../assets/icons/img1-loader.png';
import { useProductsBySubcategory } from '../../Hook/UseProductsBySubcategory/UseProductsBySubcategory.jsx';
import { UseProductsCart } from '../../Hook/UseProductsCart/UseProductsCart.jsx';
import { ConfigureStickerModal } from '../../Ui/ConfigureStickerModal/ConfigureStickerModal.jsx';
import { UseStickers } from '../../Hook/UseStickers/UseStickers.jsx';

export const ProductDetailPage = () => {
    const { loadCartFromBackend } = useContext(context);
    const { slug, id } = useParams();
    const location = useLocation();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showStickerModal, setShowStickerModal] = useState(false);
    const [showFloatingMessage, setShowFloatingMessage] = useState(false);

    const imageRefs = useRef([]);

    // Detectar si es una calcomanía basándose en la URL
    const isSticker = location.pathname.startsWith('/sticker/');

    // Hook para productos regulares
    const { product, loading, error } = useProductsBySubcategory(null, slug);

    // Hook para calcomanías
    const {
        fetchStickerById,
        stickerDetail,
        loadingDetail: stickerLoading,
        errorDetail: stickerError
    } = UseStickers();

    const {
        isAddingToCart,
        cartSuccessMessage,
        addProductToCart,
        isProductAdding
    } = UseProductsCart();

    useEffect(() => {
        if (isSticker && id) {
            // Es una calcomanía, usar el endpoint de calcomanías
            console.log('Fetching sticker by ID:', id);
            fetchStickerById(id);
        }
        // Si no es sticker, el hook useProductsBySubcategory manejará productos normales automáticamente
    }, [slug, id, isSticker, fetchStickerById]);

    // Funciones para obtener los datos correctos según el tipo
    const getCurrentItem = () => {
        if (isSticker) {
            return stickerDetail;
        } else {
            return product;
        }
    };

    const isLoadingData = () => {
        if (isSticker) {
            return stickerLoading;
        } else {
            return loading;
        }
    };

    const getError = () => {
        if (isSticker) {
            return stickerError;
        } else {
            return error;
        }
    };

    const productData = getCurrentItem();
    const isLoading = isLoadingData();
    const errorData = getError();

    const formatPrice = (price) =>
        price.toLocaleString("es-CO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            useGrouping: true
        });

    const renderStars = () => {
        const stars = [];
        const rating = productData?.rating || 0;
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) stars.push(<i key={i} className="fa-solid fa-star filled"></i>);
            else if (i - 0.5 <= rating) stars.push(<i key={i} className="fa-solid fa-star-half-stroke filled"></i>);
            else stars.push(<i key={i} className="fa-regular fa-star"></i>);
        }
        return stars;
    };

    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const isStickerType = () => {
        return isSticker || productData?.type === 'sticker';
    };

    const handleAddClick = async () => {
        if (isStickerType()) {
            setShowStickerModal(true);
            return;
        }
        try {
            const productDataForCart = {
                title: productData.title,
                brand: productData.brand,
                price: productData.currentPrice || productData.price,
                originalPrice: productData.originalPrice,
                discount: productData.discount,
                image: productData.image?.[0] || '',
                referencia: productData.referencia || productData.id,
                id: productData.id
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
        if (isAnimating || !productData?.image || productData.image.length <= 1) return;
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
        if (productData?.image && productData.image.length > 1 && !isAnimating) {
            animateCarousel('next', (currentImageIndex + 1) % productData.image.length);
        }
    };

    const prevImage = () => {
        if (productData?.image && productData.image.length > 1 && !isAnimating) {
            animateCarousel('prev', (currentImageIndex - 1 + productData.image.length) % productData.image.length);
        }
    };

    const goToImage = (index) => {
        if (index !== currentImageIndex && !isAnimating) {
            animateCarousel(index > currentImageIndex ? 'next' : 'prev', index);
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <img src={wheelIcon} alt="cargando" className="wheel-loader" />
                <p>Cargando {isSticker ? 'calcomanía' : 'producto'}...</p>
            </div>
        );
    }

    if (errorData) {
        return (
            <div className="error-container">
                <p>Error: {errorData}</p>
            </div>
        );
    }

    if (!productData) {
        return <div className="not-found">{isSticker ? 'Calcomanía' : 'Producto'} no encontrado.</div>;
    }

    const isCurrentProductAdding = isProductAdding(productData.referencia || productData.id);
    const showSuccessMessage = cartSuccessMessage && !isAddingToCart;

    return (
        <>
            <div className="product-container">
                <div className="product-layout">
                    <div className="image-gallery">
                        {productData.image?.length > 1 && (
                            <button className="nav-btn nav-btn-left" onClick={prevImage} disabled={isAnimating}>
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        <div className="image-container">
                            <div className="main-image">
                                {productData.image?.map((img, index) => (
                                    <img
                                        key={index}
                                        ref={el => (imageRefs.current[index] = el)}
                                        src={img}
                                        alt={`${productData.title} - ${index + 1}`}
                                        className={index === currentImageIndex ? 'active' : ''}
                                        onError={(e) => { e.target.src = "/path/to/default-image.png"; }}
                                    />
                                ))}
                            </div>
                        </div>
                        {productData.image?.length > 1 && (
                            <button className="nav-btn nav-btn-right" onClick={nextImage} disabled={isAnimating}>
                                <ChevronRight size={20} />
                            </button>
                        )}
                        {productData.image?.length > 1 && (
                            <div className="dots-container-product-detail">
                                {productData.image.map((_, index) => (
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
                            <h1 className="product-title">{productData.title}</h1>
                            {!isStickerType() && (
                                <div className="rating-container">
                                    <div className="stars">{renderStars()}</div>
                                    <span className="reviews-count">{productData.reviews || 0} valoraciones</span>
                                </div>
                            )}
                        </div>

                        <div className="product-details-product-detail">
                            <div className="detail-item">
                                <span className="detail-label">Referencia:</span>
                                <span className="detail-value">{productData.referencia}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">{isStickerType() ? 'Tipo:' : 'Marca:'}</span>
                                <span className="detail-value">{productData.brand}</span>
                            </div>
                            {!isStickerType() && productData.talla && (
                                <div className="detail-item">
                                    <span className="detail-label">Talla:</span>
                                    <span className="detail-value">{productData.talla}</span>
                                </div>
                            )}
                            {isStickerType() && productData.tamano_x && productData.tamano_y && (
                                <div className="detail-item">
                                    <span className="detail-label">Tamaño base:</span>
                                    <span className="detail-value">{productData.tamano_x}cm x {productData.tamano_y}cm</span>
                                </div>
                            )}
                        </div>

                        <div className="price-section">
                            {productData.originalPrice && (
                                <div className="price-container-product-detail">
                                    {productData.discount && <span className="discount-badge-product-detail">{productData.discount}</span>}
                                    <span className="original-price-product-detail">${formatPrice(productData.originalPrice)} COP</span>
                                </div>
                            )}
                            <div className="current-price">${formatPrice(productData.currentPrice || productData.price)} COP</div>
                            {productData.ahorro && (
                                <div className="installments">Ahorras ${formatPrice(productData.ahorro)} COP</div>
                            )}
                        </div>

                        <div className="action-buttons">
                                <div className="quantity-selector">
                                    <button className="quantity-btn" onClick={decreaseQuantity} disabled={quantity <= 1 || isCurrentProductAdding}>-</button>
                                    <span className="quantity-display">{quantity}</span>
                                    <button className="quantity-btn" onClick={increaseQuantity} disabled={isCurrentProductAdding}>+</button>
                                </div>
                            
                            <button className="btn-secondary" onClick={handleAddClick} disabled={isCurrentProductAdding}>
                                {isCurrentProductAdding ? (
                                    <img src={wheelIcon} alt="cargando" className="wheel-loader" />
                                ) : (
                                    <>
                                        <ShoppingCart size={20} />
                                        {isStickerType() ? 'CONFIGURAR Y AÑADIR' : 'AÑADIR AL MALETERO'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="description-section">
                    <h2 className="section-title-description">DESCRIPCIÓN</h2>
                    <div className="description-table">
                        <div className="table-row">
                            <span className="table-value">{productData.descripcion}</span>
                        </div>
                    </div>
                </div>
            </div>

            {isStickerType() && (
                <ConfigureStickerModal
                    isOpen={showStickerModal}
                    onClose={() => setShowStickerModal(false)}
                    sticker={{
                        id: productData.id_calcomania || productData.id,
                        image: productData.image?.[0],
                        brand: productData.brand,
                        title: productData.title,
                        price: productData.originalPrice || productData.price,
                        originalPrice: productData.originalPrice,
                        discountedPrice: productData.currentPrice || productData.price,
                        type: 'sticker',
                        referencia: productData.referencia || productData.id,
                        discountPercent: productData.discount ? (typeof productData.discount === 'string' ? parseInt(productData.discount.replace('%', '')) : productData.discount) : null,
                        id_calcomania: productData.id_calcomania || productData.id,
                    }}
                    isPersonalSticker={false}
                    quantity={quantity}
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