import { useEffect, useState, useContext } from "react";
import { ProductGrid } from "../../Ui/ProductGrid/ProductGrid";
import { useLocation } from "react-router-dom";
import "./ProductPage.css";

import logo1 from '../../../assets/images/img1-marca.png';
import logo2 from '../../../assets/images/img2-marca.png';
import logo3 from '../../../assets/images/img3-marca.png';
import logo4 from '../../../assets/images/img42-marca.png';

import img1 from '../../../assets/images/img-ich-category-brand.png';
import img2 from '../../../assets/images/img-shaft-category-brand.png';
import img3 from '../../../assets/images/img-hro-category-brand.png';
import img4 from '../../../assets/images/img-arai-category-brand.png';
import img5 from '../../../assets/images/img-shoei-category-brand.png';

import { ProductFilterSidebar } from "../../Ui/ProductFilterSidebar/ProductFilterSideBar";
import imgHelmet from "../../../assets/images/img1-helmet-product.png";
import imgEquipment from "../../../assets/images/img1-equipment-ride-product.png";
import imgCleaning from "../../../assets/images/img1-cleaning-product.png";
import imgLight from "../../../assets/images/img1-light-product.png";
import imgDefault from "../../../assets/images/img1-helmet-product.png";
import { useProductsBySubcategory } from "../../Hook/UseProductsBySubcategory/UseProductsBySubcategory.jsx";
import { useFilteredProducts } from "../../Hook/UseSubcategories/UseSubcategories.jsx";
import { UseProductsCart } from "../../Hook/UseProductsCart/UseProductsCart.jsx";
import { context } from "../../../Context/Context.jsx";
import { UseProductsByBrand } from "../../Hook/UseProductsByBrand/UseProductsByBrand.jsx";
import { UseCategories } from "../../Hook/UseCategories/UseCategories.jsx";

export const ProductPage = () => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [priceFilter, setPriceFilter] = useState(1000000);
  const [brandFromURL, setBrandFromURL] = useState("");
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
    products: brandProducts,
    loading: brandLoading,
    error: brandError
  } = UseProductsByBrand(selectedBrand && !selectedSubcategory ? selectedBrand : null);

  const {
    products: apiProducts,
    loading: apiLoading,
    error: apiError
  } = useProductsBySubcategory(selectedSubcategory);

  const {
    products: filteredProducts,
    loading: filteredLoading,
    error: filteredError
  } = useFilteredProducts(selectedSubcategory, selectedBrand);

  const {
    products: categoryProducts,
    loading: categoryLoading,
    error: categoryError
  } = UseCategories(selectedCategory && !selectedSubcategory && !selectedBrand ? selectedCategory : null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryFromURL = queryParams.get("category");
    const subcategoryFromURL = queryParams.get("subcategory");
    const brandFromURL = queryParams.get("brand");

    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedBrand("");
    setBrandFromURL("");

    if (categoryFromURL) setSelectedCategory(decodeURIComponent(categoryFromURL));
    if (subcategoryFromURL) setSelectedSubcategory(decodeURIComponent(subcategoryFromURL));
    if (brandFromURL) {
      const decodedBrand = decodeURIComponent(brandFromURL);
      setSelectedBrand(decodedBrand);
      setBrandFromURL(decodedBrand);
    }

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
      'Ich': img1,
      'Shaft': img2,
      'Hro': img3,
      'Arai': img4,
      'Shoei': img5,
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

    if (selectedBrand && selectedSubcategory) {
      productsToShow = filteredProducts;
    }
    // Si solo hay subcategoría, usar productos de subcategoría
    else if (selectedSubcategory) {
      productsToShow = apiProducts;
    }
    // Si solo hay marca, usar productos por marca
    else if (selectedBrand) {
      productsToShow = brandProducts;
    }
    // NUEVO: Si solo hay categoría, usar productos por categoría
    else if (selectedCategory) {
      productsToShow = categoryProducts;
    }
    // Si no hay selección, mostrar array vacío
    else {
      productsToShow = [];
    }

    if (priceFilter && productsToShow.length > 0) {
      productsToShow = productsToShow.filter(product => {

        const price = product.price || 0;
        return price <= priceFilter;
      });
    }

    if (sortOrder && productsToShow.length > 0) {
      productsToShow = [...productsToShow].sort((a, b) => {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        const nameA = a.title || '';
        const nameB = b.title || '';

        switch (sortOrder) {
          case "price-high-low":
            return priceB - priceA;
          case "price-low-high":
            return priceA - priceB;
          case "name-a-z":
            return nameA.localeCompare(nameB);
          case "name-z-a":
            return nameB.localeCompare(nameA);
          default:
            return 0;
        }
      });
    }

    return productsToShow;
  };

  const finalProducts = getFilteredProducts();

  const isLoading = selectedBrand && selectedSubcategory
    ? filteredLoading
    : selectedBrand && !selectedSubcategory
      ? brandLoading
      : selectedSubcategory
        ? apiLoading
        : selectedCategory
          ? categoryLoading
          : false;

  const currentError = selectedBrand && selectedSubcategory
    ? filteredError
    : selectedBrand && !selectedSubcategory
      ? brandError
      : selectedSubcategory
        ? apiError
        : selectedCategory
          ? categoryError
          : null;

  const getPageTitle = () => {
    if (brandFromURL) {
      return brandFromURL === 'Otros' ? 'Otras Marcas' : `Marca ${brandFromURL}`;
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
    // Solo cambiar imagen si estamos en modo marca (brandFromURL existe)
    if (brandFromURL) {
      // En modo marca, usar selectedBrand si existe, sino brandFromURL
      const currentBrand = selectedBrand || brandFromURL;
      if (currentBrand && currentBrand !== 'Otros') {
        return getBrandImage(currentBrand);
      }
    }
    // Si no estamos en modo marca, usar imagen de categoría
    return getCategoryImage(selectedCategory);
  };

  const handleSubcategorySelect = (subcategoryLabel) => {
    console.log("Manejando subcategoría en ProductPage:", subcategoryLabel);
    setSelectedSubcategory(subcategoryLabel);
    setSelectedBrand(""); // Limpiar marca cuando cambie subcategoría
  };

  const handleBrandSelect = (brandName) => {
    console.log("Manejando marca en ProductPage:", brandName);
    setSelectedBrand(brandName);
  };

  const handleCategorySelect = (categoryName) => {
    console.log("Manejando categoría en ProductPage:", categoryName);
    setSelectedCategory(categoryName);
    setSelectedSubcategory(""); // Limpiar subcategoría
    setSelectedBrand(""); // Limpiar marca
  };

  return (
    <>
      <div className="store-container">
        <ProductFilterSidebar
          isMobile={showMobileFilter}
          onClose={() => setShowMobileFilter(false)}
          onSelectSubcategory={handleSubcategorySelect}
          currentCategory={selectedCategory}
          onPriceFilterChange={setPriceFilter}
          onSelectBrand={handleBrandSelect}
          selectedSubcategory={selectedSubcategory}
          brandFromURL={brandFromURL}
          selectedBrand={selectedBrand}
          onSelectCategory={handleCategorySelect}
        />

        <div className="store-content">
          <div className="store-header">
            <div className="results-info">
              {isLoading ? (
                "Cargando productos..."
              ) : currentError ? (
                `Error: ${currentError}`
              ) : (
                `${finalProducts.length} productos encontrados`
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
            {!brandFromURL && <h2>{getPageTitle()}</h2>}

            {(!brandFromURL || brandFromURL !== 'Otros') && ( // Cambiar selectedBrand por brandFromURL
              <img
                className="img-category-product-page"
                src={getDisplayImage()}
                alt={`Imagen de ${brandFromURL ? (selectedBrand || brandFromURL) : selectedCategory || 'categoría'}`}
              />
            )}

            {!brandFromURL && ( // Cambiar selectedBrand por brandFromURL
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
          ) : finalProducts.length === 0 && (selectedSubcategory || selectedBrand || selectedCategory) ? (
            <div className="loading-container">
              <p>
                {selectedBrand && selectedSubcategory
                  ? `No se encontraron productos de la marca "${selectedBrand}" en la subcategoría "${selectedSubcategory}"`
                  : selectedCategory
                    ? `No se encontraron productos en la categoría "${selectedCategory}"`
                    : "Productos no encontrados para ese rango de precio"
                }
              </p>
            </div>
          ) : (
            <ProductGrid
              products={finalProducts}
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