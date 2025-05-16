import { TrunkProductCard } from "../TrunkProductCard/TrunkProductCard.jsx";
import "../Trunk/Trunk.css";

export const Trunk = ({ isOpen, onClose, products, onRemove, onQuantityChange }) => {

    const totalPrice = products.reduce(
        (acc, product) => acc + product.price * product.quantity, 0
    );

    return (
        <div className={`drawer-trunk ${isOpen ? "open" : ""}`}>
            <div className="drawer-header">
                <h2>MI MALETERO</h2>
                <button className="close-button" onClick={onClose}>×</button>
            </div>
            <hr />

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
    );
};
