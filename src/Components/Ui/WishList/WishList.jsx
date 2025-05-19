import "./WishList.css";
import helmet from '../../../assets/images/img1-sale.jpg';

export const WishList = () => {
    return (
        <div className="wishlist-container">
            <h2>Lista de deseos</h2>

            <div className="wishlist-card">
                <div className="wishlist-info">
                    <img
                        src={helmet}
                        alt="Producto"
                        className="wishlist-product-img"
                    />

                    <div className="wishlist-details">
                        <p className="wishlist-title">PUÑOS PRO TAPER K107 CERRADO NEGRO AZUL</p>
                        <p className="wishlist-price">$20.000 COP</p>
                        <div className="wishlist-stars">
                            {[...Array(5)].map((_, index) => (
                                <i
                                    key={index}
                                    className={`fa-star ${index < 5 ? 'fa-solid' : 'fa-regular'}`}
                                ></i>
                            ))}

                        </div>
                        <p className="wishlist-description">
                            Atribución más o menos normal de las letras, al contrario de usar textos como por ejemplo "Contenido aquí, contenido a".
                        </p>
                    </div>
                </div>

                <div className="wishlist-actions">
                    <button className="wishlist-buy-button">COMPRAR AHORA</button>
                </div>
            </div>

            {/* Segunda tarjeta quemada */}
            <div className="wishlist-card">
                <div className="wishlist-info">
                    <img
                        src={helmet}
                        alt="Producto"
                        className="wishlist-product-img"
                    />

                    <div className="wishlist-details">
                        <p className="wishlist-title">PUÑOS PRO TAPER K107 CERRADO NEGRO AZUL</p>
                        <p className="wishlist-price">$20.000 COP</p>
                        <div className="wishlist-stars">
                            {[...Array(5)].map((_, index) => (
                                <i
                                    key={index}
                                    className={`fa-star ${index < 5 ? 'fa-solid' : 'fa-regular'}`}
                                ></i>
                            ))}
                        </div>
                        <p className="wishlist-description">
                            Atribución más o menos normal de las letras, al contrario de usar textos como por ejemplo "Contenido aquí, contenido a".
                        </p>
                    </div>
                </div>

                <div className="wishlist-actions">
                    <button className="wishlist-buy-button">COMPRAR AHORA</button>
                </div>
            </div>
        </div>
    );
};
