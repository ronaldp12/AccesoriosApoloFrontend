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
  referencia,
  stickerCartFunctions,
  productCartFunctions,
  ...otherProps
}) => {
  const { userLogin } = useContext(context);
  const [showStickerModal, setShowStickerModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addedMessage, setAddedMessage] = useState(false);

  const isSticker = () => {
    const normalizedBrand = brand?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return type === 'sticker' ||
      normalizedBrand === 'calcomania' ||
      normalizedBrand === 'calcomanía';
  };

  const handleAddClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userLogin) {
      console.log('Usuario debe iniciar sesión');
      // Aquí puedes redirigir al login o mostrar un modal
      return;
    }

    if (isSticker()) {
      setShowStickerModal(true);
      return;
    }

    setIsAdding(true);

    try {
      await productCartFunctions.addProductToCart(
        referencia || id,
        1,
        title,
        {
          id: id,
          title: title,
          price: price,
          originalPrice: originalPrice,
          image: image,
          brand: brand,
          discount: discount,
          referencia: referencia || id,
          type: type
        }
      );

      await new Promise(resolve => setTimeout(resolve, 800));

      setIsAdding(false);
      setAddedMessage(true);

      setTimeout(() => {
        setAddedMessage(false);
      }, 1200);

    } catch (error) {
      console.error('Error al agregar producto:', error);
      setIsAdding(false);
    }
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
    if (isSticker()) {
      const isAddingSticker = stickerCartFunctions?.isAddingToCart;
      const stickerSuccessMessage = stickerCartFunctions?.cartSuccessMessage;

      if (isAddingSticker) {
        return <img src={wheelIcon} alt="cargando" className="wheel-loader" />;
      }

      if (stickerSuccessMessage) {
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
    }

    const isAddingProduct = isAdding || productCartFunctions?.isProductAdding?.(referencia || id);

    if (isAddingProduct) {
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

  const productLink = `/product/${referencia || slug || id}`;

  return (
    <>
      <Link to={productLink} className="product-card-link">
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
      </Link>

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
            referencia: referencia || id,
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