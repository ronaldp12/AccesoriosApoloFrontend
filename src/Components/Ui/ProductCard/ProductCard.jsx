import { useContext, useState } from "react";
import iconBack from "../../../assets/icons/backpack.png";
import { context } from "../../../Context/Context.jsx";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { Link } from "react-router-dom";
import { ConfigureStickerModal } from "../ConfigureStickerModal/ConfigureStickerModal.jsx";
import './ProductCard.css';

export const ProductCard = ({
  id,
  slug,
  image,
  brand,
  title,
  price,           
  originalPrice,   
  rating,          
  discount,
  type,
  stickerCartFunctions,
  ...otherProps
}) => {
  const { handleAddToCart, userLogin } = useContext(context);
  const [isAdding, setIsAdding] = useState(false);
  const [addedMessage, setAddedMessage] = useState(false);
  const [showStickerModal, setShowStickerModal] = useState(false);

  const isSticker = () => {
    const normalizedBrand = brand?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return type === 'sticker' ||
      normalizedBrand === 'calcomania' ||
      normalizedBrand === 'calcomanía';
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSticker()) {
      if (!userLogin) {
        console.log('Usuario debe iniciar sesión para configurar calcomanías');
        return;
      }
      setShowStickerModal(true);
      return;
    }

    setIsAdding(true);
    setTimeout(() => {
      handleAddToCart({
        id,
        image,
        brand,
        title,
        price,
        ...otherProps
      });
      setIsAdding(false);
      setAddedMessage(true);
      setTimeout(() => {
        setAddedMessage(false);
      }, 1200);
    }, 800);
  };

  const renderStars = () => {
    const stars = [];
    const currentRating = rating || 0;
    const fullStars = Math.floor(currentRating);
    const hasHalfStar = currentRating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="star">
          <i className="fa-solid fa-star"></i>
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star">
          <i className="fa-solid fa-star-half-stroke"></i>
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">
          <i className="fa-regular fa-star"></i>
        </span>
      );
    }

    return stars;
  };

  const getAddButtonContent = () => {
    const isAddingSticker = isSticker() && stickerCartFunctions?.isAddingToCart;
    const isGeneralAdding = !isSticker() && isAdding;

    if (isAddingSticker || isGeneralAdding) {
      return <img src={wheelIcon} alt="cargando" className="wheel-loader" />;
    }

    if (addedMessage) {
      return <span className="added-message">Agregado</span>;
    }

    return (
      <img
        src={iconBack}
        alt="icon Backpack"
        onClick={handleAddClick}
        style={{ cursor: 'pointer' }}
      />
    );
  };

  return (
    <>
      <div className="product-card">
        <div className="image-container">
          <img
            src={image}
            alt={title}
            onError={(e) => {
              e.target.src = "/path/to/default-image.png";
            }}
          />
          {discount && <span className="discount-badge">{discount}</span>}
          {isSticker() && (
            <span className="sticker-badge">
              <i className="fa-solid fa-tags"></i>
              Calcomanía
            </span>
          )}
        </div>

        {typeof rating === 'number' ? (
          <div className="rating">
            {rating > 0 ? renderStars() : (
              Array.from({ length: 5 }).map((_, index) => (
                <span key={index} className="star empty">
                  <i className="fa-regular fa-star"></i>
                </span>
              ))
            )}
          </div>
        ) : null}

        <p className="brand">{brand}</p>
        <p className="title-product-card">{title}</p>

        <div className="price-container">
          {originalPrice ? (
            <div className="prices-group">
              <span className="original-price">
                ${originalPrice.toLocaleString("es-ES", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2
                })}
              </span>
              <p className="price discounted">
                ${price.toLocaleString("es-ES", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
          ) : (
            <p className="price">
              ${price.toLocaleString("es-ES", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
              })}
            </p>
          )}
          <span className="icon-backpack-container">
            {getAddButtonContent()}
          </span>
        </div>
      </div>

      {showStickerModal && isSticker() && (
        <ConfigureStickerModal
          isOpen={showStickerModal}
          onClose={() => setShowStickerModal(false)}
          sticker={{
            id,
            image,
            brand,
            title,
            price,
            type,
            ...otherProps
          }}
          brand={brand}
          stickerCartFunctions={stickerCartFunctions}
          isPersonalSticker={false}
        />
      )}
    </>
  );
};