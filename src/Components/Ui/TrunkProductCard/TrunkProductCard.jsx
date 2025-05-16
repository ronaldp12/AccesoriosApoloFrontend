import React from 'react';
import '../TrunkProductCard/TrunkProductCard.css'; 

export const TrunkProductCard = ({ product, onRemove, onQuantityChange }) => {
  const { id, image, brand, title, price, quantity } = product;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      onQuantityChange(id, newQuantity);
    }
    if (newQuantity === 0) {
      onRemove(id);
    }
  };

  return (
    <div className="trunk-product-card">
      <img src={image} alt={title} className="product-image" />

      <div className="product-details">
        <p className="product-brand">{brand}</p>
        <h4 className="product-name">{title}</h4>
        <p className="product-price">
          ${(price * quantity).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>

        <div className="quantity-section">
          <label>Cantidad:</label>
          <button 
            className="quantity-button" 
            onClick={() => handleQuantityChange(quantity - 1)}
          >-</button>

          <input
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
          />

          <button 
            className="quantity-button" 
            onClick={() => handleQuantityChange(quantity + 1)}
          >+</button>
        </div>

      </div>

      <button className="remove-button" onClick={() => onRemove(id)}>
        <i className="fa-solid fa-trash"></i>
      </button>
    </div>
  );
};
