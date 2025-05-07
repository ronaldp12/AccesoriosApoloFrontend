export const ProductCard = ({ image, brand, title, price, rating, discount }) => {
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
      <p className="price">${price}</p>
    </div>
  );
};
