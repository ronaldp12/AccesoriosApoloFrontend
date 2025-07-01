import { useEffect, useRef, useContext } from "react";
import { TrunkProductCard } from "../TrunkProductCard/TrunkProductCard.jsx";
import "../Trunk/Trunk.css";
import { useNavigate } from "react-router-dom";
import { context } from "../../../Context/Context.jsx";

export const Trunk = ({ onClose, products, onRemove, onQuantityChange, isLocal = false }) => {
    const trunkRef = useRef(null);
    const navigate = useNavigate();
    const { isTrunkOpen, setIsTrunkOpen } = useContext(context);

    const totalPrice = products.reduce(
        (acc, product) => acc + product.price * product.quantity, 0
    );

    const formatPrice = (price) => {
        return price.toLocaleString("es-CO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            useGrouping: true
        });
    };

    const handleToCheckout = () => {
        navigate('/checkout');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (trunkRef.current && !trunkRef.current.contains(event.target) && isTrunkOpen) {
                onClose();
            }
        };

        if (isTrunkOpen) {
            const timer = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
                document.addEventListener('touchstart', handleClickOutside);
            }, 100);

            return () => {
                clearTimeout(timer);
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('touchstart', handleClickOutside);
            };
        }
    }, [isTrunkOpen, onClose]);

    useEffect(() => {
        if (isTrunkOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isTrunkOpen]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Función para generar una clave única para cada producto
    const generateUniqueKey = (product, index) => {
        if (product.type === 'sticker') {
            return `${product.id}-${product.size || 'default'}-${index}`;
        }
        return `${product.id}-${index}`;
    };

    return (
        <>
            <div
                className={`trunk-overlay ${isTrunkOpen ? "open" : ""}`}
                onClick={handleOverlayClick}
            >
                <div
                    ref={trunkRef}
                    className={`drawer-trunk ${isTrunkOpen ? "open" : ""}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="drawer-header">
                        <h2>MI MALETERO</h2>
                        <button className="close-button" onClick={() => setIsTrunkOpen(false)}>×</button>
                    </div>
                    <hr className="drawer-divider-trunk" />

                    <div className="product-count">
                        <p>
                            {products.length === 0
                                ? ""
                                : `Agregado al maletero: ${products.length} producto${products.length > 1 ? "s" : ""}`}
                        </p>
                    </div>

                    <div className="drawer-content">
                        {products.length === 0 ? (
                            <p>NO HAY PRODUCTOS REGISTRADOS</p>
                        ) : (
                            products.map((product, index) => (
                                <TrunkProductCard
                                    key={generateUniqueKey(product, index)}
                                    product={product}
                                    onRemove={onRemove}
                                    onQuantityChange={onQuantityChange}
                                />
                            ))
                        )}
                    </div>

                    {products.length > 0 && (
                        <>
                            <div className="drawer-total">
                                <p>Total:
                                    <strong>${formatPrice(totalPrice)}</strong>
                                </p>
                            </div>

                            <div className="drawer-actions">
                                <button onClick={handleToCheckout} className="buy-button">Comprar</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};