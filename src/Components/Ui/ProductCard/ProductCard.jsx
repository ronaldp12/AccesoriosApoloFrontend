import { useContext } from "react";
import iconBack from "../../../assets/icons/backpack.png";
import { context } from "../../../Context/Context.jsx";

export const ProductCard = ({ id, image, brand, title, price, rating, discount }) => {
  const { handleAddToCart } = useContext(context);

  return (
    <div className="product-card">
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
      <p className="title">{title}</p>
      <p className="price">
        ${price.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        <img
          src={iconBack}
          alt="icon Backpack"
          onClick={() => handleAddToCart({ id, image, brand, title, price })}
        />
      </p>
    </div>
  );
};
