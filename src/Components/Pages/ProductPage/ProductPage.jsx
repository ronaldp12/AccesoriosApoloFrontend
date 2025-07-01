import { useEffect, useState, useContext } from "react";
import { ProductGrid } from "../../Ui/ProductGrid/ProductGrid";
import { useLocation } from "react-router-dom";
import "./ProductPage.css";
import logo1 from '../../../assets/images/img1-marca.png';
import logo2 from '../../../assets/images/img2-marca.png';
import logo3 from '../../../assets/images/img3-marca.png';
import logo4 from '../../../assets/images/img42-marca.png';
import { ProductFilterSidebar } from "../../Ui/ProductFilterSidebar/ProductFilterSideBar";
import imgHelmet from "../../../assets/images/img1-helmet-product.png";
import imgEquipment from "../../../assets/images/img1-equipment-ride-product.png";
import imgCleaning from "../../../assets/images/img1-cleaning-product.png";
import imgLight from "../../../assets/images/img1-light-product.png";
import imgDefault from "../../../assets/images/img1-helmet-product.png";
import { useProductsBySubcategory } from "../../Hook/UseProductsBySubcategory/UseProductsBySubcategory.jsx";
import { UseProductsByBrand } from "../../Hook/UseProductsByBrand/UseProductsByBrand.jsx";
import { UseProductsCart } from "../../Hook/UseProductsCart/UseProductsCart.jsx";
import { context } from "../../../Context/Context.jsx";

export const ProductPage = () => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const location = useLocation();
  const { loadCartFromBackend } = useContext(context);

  const {
    isAddingToCart,
    cartSuccessMessage,
    cartErrorMessage,
    addProductToCart,
    isProductAdding,
    resetCartState
  } = UseProductsCart();

  const {
    products: apiProducts,
    loading: apiLoading,
    error: apiError
  } = useProductsBySubcategory(selectedSubcategory);

  const {
    products: brandProducts,
    loading: brandLoading,
    error: brandError
  } = UseProductsByBrand(selectedBrand);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryFromURL = queryParams.get("category");
    const subcategoryFromURL = queryParams.get("subcategory");
    const brandFromURL = queryParams.get("brand");

    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedBrand("");

    if (categoryFromURL) setSelectedCategory(decodeURIComponent(categoryFromURL));
    if (subcategoryFromURL) setSelectedSubcategory(decodeURIComponent(subcategoryFromURL));
    if (brandFromURL) setSelectedBrand(decodeURIComponent(brandFromURL));

    resetCartState();
  }, [location.search, resetCartState]);

  const getCategoryImage = (category) => {
    switch (category) {
      case "Cascos":
        return imgHelmet;
      case "Equipacion Carretera":
        return imgEquipment;
      case "Limpieza":
        return imgCleaning;
      case "Luces":
        return imgLight;
      default:
        return imgDefault;
    }
  };

  const getBrandImage = (brand) => {
    const brandImages = {
      'Ich': logo1,
      'Shaft': logo2,
      'Hro': logo3,
      'Arai': logo4,
      'Shoei': logo4,
    };
    return brandImages[brand] || imgDefault;
  };

  const handleOverlayClick = () => {
    setShowMobileFilter(false);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const getFilteredProducts = () => {
    let productsToShow = [];

    if (selectedBrand) {
      productsToShow = brandProducts;
    } else if (selectedSubcategory) {
      productsToShow = apiProducts;
    } else {
      productsToShow = [];
    }

    if (sortOrder && productsToShow.length > 0) {
      productsToShow = [...productsToShow].sort((a, b) => {
        switch (sortOrder) {
          case "price-high-low":
            return b.price - a.price;
          case "price-low-high":
            return a.price - b.price;
          case "name-a-z":
            return a.title.localeCompare(b.title);
          case "name-z-a":
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
    }

    return productsToShow;
  };

  const filteredProducts = getFilteredProducts();
  const isLoading = selectedBrand ? brandLoading : apiLoading;
  const currentError = selectedBrand ? brandError : apiError;

  const getPageTitle = () => {
    if (selectedBrand) {
      return selectedBrand === 'Otros' ? 'Otras Marcas' : `Marca ${selectedBrand}`;
    }
    if (selectedSubcategory) {
      return selectedSubcategory.charAt(0).toUpperCase() + selectedSubcategory.slice(1).toLowerCase();
    }
    if (selectedCategory) {
      return selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).toLowerCase();
    }
    return "Productos";
  };

  const getDisplayImage = () => {
    if (selectedBrand && selectedBrand !== 'Otros') {
      return getBrandImage(selectedBrand);
    }
    return getCategoryImage(selectedCategory);
  };

  return (
    <>
      <div className="store-container">
        <ProductFilterSidebar
          isMobile={showMobileFilter}
          onClose={() => setShowMobileFilter(false)}
          onSelectSubcategory={setSelectedSubcategory}
        />

        <div className="store-content">
          <div className="store-header">
            <div className="results-info">
              {isLoading ? (
                "Cargando productos..."
              ) : currentError ? (
                `Error: ${currentError}`
              ) : (
                `${filteredProducts.length} productos encontrados`
              )}
            </div>
          </div>

          {/* Mensajes del carrito */}
          {cartSuccessMessage && (
            <div className="cart-message success">
              <i className="fa-solid fa-check-circle"></i>
              {cartSuccessMessage}
            </div>
          )}

          {cartErrorMessage && (
            <div className="cart-message error">
              <i className="fa-solid fa-exclamation-triangle"></i>
              {cartErrorMessage}
            </div>
          )}

          <div className="img-category-container-product-page">
            <h2>{getPageTitle()}</h2>

            {(!selectedBrand || selectedBrand !== 'Otros') && (
              <img
                className="img-category-product-page"
                src={getDisplayImage()}
                alt={`Imagen de ${selectedBrand || selectedCategory || 'categoría'}`}
              />
            )}

            {!selectedBrand && (
              <div className="logo-brand-container">
                <img className="logo-category-1" src={logo1} alt="logo 1" />
                <img className="logo-category-1" src={logo2} alt="logo 2" />
                <img className="logo-category-1" src={logo3} alt="logo 3" />
                <img className="logo-category-4" src={logo4} alt="logo 4" />
              </div>
            )}
          </div>

          <div className="order-by-container">
            <button
              className="filter-btn"
              onClick={() => setShowMobileFilter(true)}
            >
              FILTRAR
            </button>
            <div className="order-by-select">
              <select value={sortOrder} onChange={handleSortChange}>
                <option value="">Ordenar por</option>
                <option value="price-high-low">Ordenar por precio: alto a bajo</option>
                <option value="price-low-high">Ordenar por precio: bajo a alto</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <p>Cargando productos...</p>
            </div>
          ) : (
            <ProductGrid
              products={filteredProducts}
              productCartFunctions={{
                addProductToCart,
                isProductAdding,
                isAddingToCart,
                cartSuccessMessage,
                cartErrorMessage, 
                loadCartFromBackend
              }}
            />
          )}
        </div>
      </div>

      {/* Overlay para mobile */}
      {showMobileFilter && (
        <div
          className={`mobile-overlay ${showMobileFilter ? 'active' : ''}`}
          onClick={handleOverlayClick}
        />
      )}
    </>
  );
};