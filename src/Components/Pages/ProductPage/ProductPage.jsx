import { useEffect, useState } from "react";
import { products as allProducts } from "../../products";
import { ProductGrid } from "../../Ui/ProductGrid/ProductGrid";
import { useLocation } from "react-router-dom";
import "./ProductPage.css";
import img1 from "../../../assets/images/img1-helmet-product.png"
import logo1 from '../../../assets/images/img1-marca.png';
import logo2 from '../../../assets/images/img2-marca.png';
import logo3 from '../../../assets/images/img3-marca.png';
import logo4 from '../../../assets/images/img42-marca.png';
import { ProductFilterSidebar } from "../../Ui/ProductFilterSidebar/ProductFilterSideBar";

export const ProductPage = () => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryFromURL = queryParams.get("category");
    const subcategoryFromURL = queryParams.get("subcategory");

    if (categoryFromURL) setSelectedCategory(decodeURIComponent(categoryFromURL));
    if (subcategoryFromURL) setSelectedSubcategory(decodeURIComponent(subcategoryFromURL));
  }, [location.search]);

  const handleOverlayClick = () => {
    setShowMobileFilter(false);
  };

  const filteredProducts = allProducts.filter((p) => {
    if (selectedCategory && selectedSubcategory) {
      return (
        p.category === selectedCategory &&
        p.subcategory.toLowerCase() === selectedSubcategory.toLowerCase()
      );
    }
    if (selectedCategory) {
      return p.category === selectedCategory;
    }
    return true;
  });

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
              {filteredProducts.length} productos encontrados
            </div>
          </div>

          <div className="img-category-container">
            <h2>{selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).toLowerCase() : "Productos"}</h2>
            <img className="img-category" src={img1} alt="img categoria" />
            <div className="logo-brand-container">
              <img className="logo-category-1" src={logo1} alt="logo 1" />
              <img className="logo-category-1" src={logo2} alt="logo 2" />
              <img className="logo-category-1" src={logo3} alt="logo 3" />
              <img className="logo-category-4" src={logo4} alt="logo 4" />
            </div>

          </div>

          <div className="order-by-container">
            <button
              className="filter-btn"
              onClick={() => setShowMobileFilter(true)}
            >
              FILTRAR
            </button>
            <div className="order-by-select">
              <select name="" id="">
                <option value="">Ordenar por</option>
                <option value="">Ordenar por precio: alto a bajo</option>
                <option value="">Ordenar por precio: bajo a alto</option>
              </select>
            </div>


          </div>

          <ProductGrid products={filteredProducts} />
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