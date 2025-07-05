import { PromoBanner } from "../../Ui/PromoBanner/PromoBanner.jsx";
import { ProductCard } from "../../Ui/ProductCard/ProductCard.jsx";
import "../BestSellerSection/BestSellerSection.css";
import { useTopDiscountProducts } from "../../Hook/useTopDiscountProducts/useTopDiscountProducts.jsx";
import { ProductCardSkeleton } from "../../Ui/ProductCardSkeleton/ProductCardSkeleton.jsx";
import { PromoBannerSkeleton } from "../PromoBannerSkeleton/PromoBannerSkeleton.jsx";

export const BestSellersSection = () => {
  const { topDiscountProducts, loadingTopDiscounts, errorTopDiscounts } = useTopDiscountProducts();

  return (
    <section className="best-sellers-section">
      <div className="section-header-best-sellers">
        <h2>MEJOR DESCUENTO</h2>
      </div>

      <div className="products-container">
        {loadingTopDiscounts ? (
          <>
            <PromoBannerSkeleton />
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </>
        ) : errorTopDiscounts ? (
          <p>{errorTopDiscounts}</p>
        ) : (
          <>
            {topDiscountProducts.length > 0 && (
              <PromoBanner
                discount={topDiscountProducts[0].descuento}
                text="OFF"
                subtext="ON ALL PRODUCTS"
              />
            )}

            {topDiscountProducts.map((product) => (
              <ProductCard
                key={product.referencia}
                id={product.referencia}
                image={product.url_imagen}
                brand={product.marca}
                title={product.nombre}
                price={product.precio_descuento || product.precio_unidad}
                originalPrice={product.precio_unidad}
                discount={`${product.descuento}%`}
                rating={product.calificacion}
                referencia={product.referencia}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};
