import React from 'react';
import '../TrunkProductCard/TrunkProductCard.css';

export const TrunkProductCard = ({ product, onRemove, onQuantityChange }) => {
  const { id, image, brand, title, price, quantity, size, type } = product;

  const handleQuantityChange = (newQuantity) => {
    console.log('handleQuantityChange llamado:', { id, newQuantity, size, type });

    // Permitir cualquier cantidad >= 0
    // Si newQuantity es 0, el backend eliminará el item automáticamente
    if (newQuantity >= 0) {
      if (type === 'sticker') {
        console.log('Llamando onQuantityChange para sticker:', id, newQuantity, size);
        onQuantityChange(id, newQuantity, size);
      } else {
        console.log('Llamando onQuantityChange para producto normal:', id, newQuantity);
        onQuantityChange(id, newQuantity);
      }
    }
  };

  const handleRemove = () => {
    console.log('handleRemove llamado para:', { id, size, type });
    if (type === 'sticker') {
      onRemove(id, size);
    } else {
      onRemove(id);
    }
  };

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    console.log('Input change:', { oldQuantity: quantity, newValue, isValid: !isNaN(newValue) });

    if (!isNaN(newValue) && newValue >= 1) {
      handleQuantityChange(newValue);
    }
  };

  const handleButtonClick = (increment) => {
    const newQuantity = quantity + increment;
    console.log('Button click:', { increment, oldQuantity: quantity, newQuantity });

    // Permitir cualquier cantidad >= 0
    // Si newQuantity es 0, el backend eliminará el item
    if (newQuantity >= 0) {
      handleQuantityChange(newQuantity);
    }
  };

  return (
    <div className="trunk-product-card">
      <img src={image} alt={title} className="product-image" />

      <div className="product-details">
        {type === 'sticker' && (
          <p className="product-type">Calcomanía personalizada</p>
        )}

        {size && (
          <p className="product-size">Tamaño: {size}</p>
        )}

        {/* Mostrar marca solo si no es sticker */}
        {brand && type !== 'sticker' && (
          <p className="product-brand">{brand}</p>
        )}

        <h4 className="product-name">{title}</h4>
        <p className="product-price">
          ${(price * quantity).toLocaleString("es-ES", { maximumFractionDigits: 2 })}
        </p>

        <div className="quantity-section">
          <label>Cantidad:</label>
          <button
            className="quantity-button"
            onClick={() => handleButtonClick(-1)}
            disabled={quantity <= 0}
          >-</button>

          <input
            type="number"
            value={quantity}
            min="1"
            onChange={handleInputChange}
          />

          <button
            className="quantity-button"
            onClick={() => handleButtonClick(1)}
          >+</button>
        </div>
      </div>

      <button className="remove-button" onClick={handleRemove}>
        <i className="fa-solid fa-trash"></i>
      </button>
    </div>
  );
};