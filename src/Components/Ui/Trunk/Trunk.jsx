import { useEffect, useRef } from "react";
import { TrunkProductCard } from "../TrunkProductCard/TrunkProductCard.jsx";
import "../Trunk/Trunk.css";

export const Trunk = ({ isOpen, onClose, products, onRemove, onQuantityChange }) => {
    const trunkRef = useRef(null);

    const totalPrice = products.reduce(
        (acc, product) => acc + product.price * product.quantity, 0
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (trunkRef.current && !trunkRef.current.contains(event.target) && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            const timer = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
                document.addEventListener('touchstart', handleClickOutside); // Para móviles
            }, 100);

            return () => {
                clearTimeout(timer);
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('touchstart', handleClickOutside);
            };
        }
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            <div
                className={`trunk-overlay ${isOpen ? "open" : ""}`}
                onClick={handleOverlayClick}
            >
                <div
                    ref={trunkRef}
                    className={`drawer-trunk ${isOpen ? "open" : ""}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="drawer-header">
                        <h2>MI MALETERO</h2>
                        <button className="close-button" onClick={onClose}>×</button>
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
                            products.map((product) => (
                                <TrunkProductCard
                                    key={product.id}
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
                                    <strong>${totalPrice.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                </p>
                            </div>

                            <div className="drawer-actions">
                                <button className="buy-button">Comprar</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};