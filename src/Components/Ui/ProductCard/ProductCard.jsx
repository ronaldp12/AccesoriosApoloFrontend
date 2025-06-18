import { useContext, useState } from "react";
import iconBack from "../../../assets/icons/backpack.png";
import { context } from "../../../Context/Context.jsx";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { Link } from "react-router-dom";

export const ProductCard = ({ id, slug, image, brand, title, price, rating, discount }) => {
  const { handleAddToCart } = useContext(context);
  const [isAdding, setIsAdding] = useState(false);
  const [addedMessage, setAddedMessage] = useState(false);

  const handleAddClick = () => {
    setIsAdding(true);
    setTimeout(() => {
      handleAddToCart({ id, image, brand, title, price });
      setIsAdding(false);
      setAddedMessage(true);
      setTimeout(() => {
        setAddedMessage(false);
      }, 1200);
    }, 800);
  };

  return (
    <Link to={`/product/${slug}`} className="product-card">
      <div className="image-container">
        <img src={image} alt={title} />
        {discount && <span className="discount-badge">{discount}</span>}
      </div>

      <div className="rating">
        {Array.from({ length: rating }).map((_, index) => (
          <span key={index} className="star">
            <i className="fa-solid fa-star"></i>
          </span>
        ))}
      </div>

      <p className="brand">{brand}</p>
      <p className="title-product-card">{title}</p>

      <p className="price">
        ${price.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}


        <span className="icon-backpack-container">
          {isAdding ? (
            <img src={wheelIcon} alt="cargando" className="wheel-loader" />
          ) : addedMessage ? (
            <span className="added-message">Agregado</span>
          ) : (
            <img
              src={iconBack}
              alt="icon Backpack"
              onClick={handleAddClick}
            />
          )}
        </span>
      </p>
    </Link>
  );
};
