import { PromoBanner } from "../../Ui/PromoBanner/PromoBanner.jsx";
import { ProductCard } from "../../Ui/ProductCard/ProductCard.jsx";
import img1 from "../../../assets/images/img1-sale.jpg";
import "../BestSellerSection/BestSellerSection.css";

export const BestSellersSection = () => {
  return (
    <section className="best-sellers-section">
      <div className="section-header-best-sellers">
        <h2>LO MAS VENDIDO</h2>
        <button>VER MAS</button>
      </div>

      <div className="products-container">
        <PromoBanner discount="30" text="OFF" subtext="ON ALL PRODUCTS" />
        <ProductCard 
          id={1}
          image={img1}
          brand="PROTAPER"
          title="Puños Pro Taper K107 Cerrado Negro Azul"
          price={18000}
          rating={5}
        />
        <ProductCard 
          id={2}
          image={img1}
          brand="PROTAPER"
          title="Casco Integral XYZ"
          price={18000}
          rating={5}
          discount="-10%"
        />
        <ProductCard 
          id={3}
          image={img1}
          brand="PROTAPER"
          title="Protector Tanque"
          price={18000}
          rating={5}
        />
      </div>
    </section>
  );
};
