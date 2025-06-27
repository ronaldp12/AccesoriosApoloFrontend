import React from "react";
import { ProductCard } from "../ProductCard/ProductCard.jsx";
import "./ProductGrid.css";

export const ProductGrid = ({ products, stickerCartFunctions }) => {
    console.log('ProductGrid recibió:', products);
    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    image={product.image}
                    brand={product.brand}
                    title={product.title}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    discount={product.discount}
                    rating={product.rating}
                    
                    {...(product.type === 'sticker' && stickerCartFunctions && {
                        stickerCartFunctions
                    })}
                />
            ))}
        </div>
    );
};
