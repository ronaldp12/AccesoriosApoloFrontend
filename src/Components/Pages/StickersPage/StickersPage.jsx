import { useState, useContext } from "react";
import { ProductGrid } from "../../Ui/ProductGrid/ProductGrid";
import "./StickersPage.css";
import logo1 from '../../../assets/images/img1-marca.png';
import logo2 from '../../../assets/images/img2-marca.png';
import logo3 from '../../../assets/images/img3-marca.png';
import logo4 from '../../../assets/images/img42-marca.png';
import { UseStickers } from "../../Hook/UseStickers/UseStickers.jsx";
import { context } from "../../../Context/Context";
import { useNavigate } from "react-router-dom";
import { WelcomeNoLoginModal } from "../../Layouts/WelcomeNoLoginModal/WelcomeNoLoginModal";
import imgHelmet from "../../../assets/images/img1-helmet-product.png";
import { ProductCardSkeleton } from "../../Ui/ProductCardSkeleton/ProductCardSkeleton.jsx";

export const StickersPage = ({ onOpenRegister, onOpenLogin }) => {
    const [sortOrder, setSortOrder] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { userLogin, nameRol, loadCartFromBackend } = useContext(context);
    const navigate = useNavigate();

    const {
        stickers,
        loading: stickersLoading,
        error: stickersError,
        refetchStickers,
        // Estados del carrito
        isAddingToCart,
        cartSuccessMessage,
        cartErrorMessage,
        // Funciones del carrito
        addStickerToCart,
        getSizeDimensions,
        calculateStickerPrice,
        checkStock
    } = UseStickers();

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleUploadSticker = () => {
        if (userLogin && nameRol === 'cliente') {
            navigate("/stickers/upload");
        } else {
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleRegisterFromModal = () => {
        closeModal();
        if (onOpenRegister) {
            onOpenRegister();
        }
    };

    const handleLoginFromModal = () => {
        closeModal();
        if (onOpenLogin) {
            onOpenLogin();
        }
    };

    const getSortedStickers = () => {
        if (!stickers.length) return [];

        let sortedStickers = [...stickers];

        if (sortOrder) {
            sortedStickers.sort((a, b) => {
                switch (sortOrder) {
                    case "price-high-low":
                        return b.price - a.price;
                    case "price-low-high":
                        return a.price - b.price;
                    case "name-a-z":
                        return a.title.localeCompare(b.title);
                    case "name-z-a":
                        return b.title.localeCompare(a.title);
                    default:
                        return 0;
                }
            });
        }

        return sortedStickers;
    };

    const sortedStickers = getSortedStickers();

    return (
        <>
            <div className="stickers-container">
                <div className="stickers-content">
                    <div className="stickers-header">
                        <div className="results-info">
                            {stickersLoading ? (
                                "Cargando calcomanías..."
                            ) : stickersError ? (
                                `Error: ${stickersError}`
                            ) : (
                                `${sortedStickers.length} calcomanías encontradas`
                            )}
                        </div>
                    </div>

                    {cartSuccessMessage && (
                        <div className="cart-message success">
                            <i className="fa-solid fa-check-circle"></i>
                            {cartSuccessMessage}
                        </div>
                    )}

                    {cartErrorMessage && (
                        <div className="cart-message error">
                            <i className="fa-solid fa-exclamation-triangle"></i>
                            {cartErrorMessage}
                        </div>
                    )}

                    <div className="img-category-container">
                        <h1>Calcomanías</h1>
                        <img
                            className="img-category"
                            src={imgHelmet}
                            alt="Imagen de calcomanías"
                        />

                        <div className="logo-brand-container">
                            <img className="logo-category-1" src={logo1} alt="logo 1" />
                            <img className="logo-category-1" src={logo2} alt="logo 2" />
                            <img className="logo-category-1" src={logo3} alt="logo 3" />
                            <img className="logo-category-4" src={logo4} alt="logo 4" />
                        </div>
                    </div>

                    <div className="stickers-actions">
                        <button
                            className="upload-sticker-btn"
                            onClick={handleUploadSticker}
                        >
                            <i className="fa-solid fa-upload"></i>
                            Sube tu Calcomanía
                        </button>

                        <div className="order-by-select">
                            <select value={sortOrder} onChange={handleSortChange}>
                                <option value="">Ordenar por</option>
                                <option value="price-high-low">Precio: alto a bajo</option>
                                <option value="price-low-high">Precio: bajo a alto</option>
                                <option value="name-a-z">Nombre: A-Z</option>
                                <option value="name-z-a">Nombre: Z-A</option>
                            </select>
                        </div>

                        {!stickersLoading && !stickersError && (
                            <button
                                className="refresh-btn"
                                onClick={refetchStickers}
                                title="Actualizar calcomanías"
                                disabled={isAddingToCart}
                            >
                                <i className={`fa-solid fa-refresh ${isAddingToCart ? 'fa-spin' : ''}`}></i>
                            </button>
                        )}
                    </div>

                    {stickersLoading ? (
                        <div className="product-grid-product-page">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <ProductCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : stickersError ? (
                        <div className="error-container">
                            <div className="error-message">
                                <i className="fa-solid fa-exclamation-triangle"></i>
                                <h3>Error al cargar calcomanías</h3>
                                <p>{stickersError}</p>
                                <button onClick={refetchStickers} className="retry-btn">
                                    Intentar de nuevo
                                </button>
                            </div>
                        </div>
                    ) : sortedStickers.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-message">
                                <i className="fa-solid fa-images"></i>
                                <h3>No hay calcomanías disponibles</h3>
                                <p>¡Sé el primero en subir una calcomanía!</p>
                                <button onClick={handleUploadSticker} className="upload-first-btn">
                                    Subir Calcomanía
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="stickers-grid-section">
                            <div className="section-header">
                                <h2>
                                    <i className="fa-solid fa-star"></i>
                                    Calcomanías Destacadas
                                </h2>
                                <p>Creadas por nuestro equipo de diseño</p>
                            </div>
                            <ProductGrid
                                products={sortedStickers}

                                stickerCartFunctions={{
                                    addStickerToCart,
                                    getSizeDimensions,
                                    calculateStickerPrice,
                                    checkStock,
                                    isAddingToCart,
                                    cartSuccessMessage,
                                    cartErrorMessage,
                                    loadCartFromBackend
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <WelcomeNoLoginModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onOpenRegister={handleRegisterFromModal}
                onOpenLogin={handleLoginFromModal}
            />
        </>
    );
};