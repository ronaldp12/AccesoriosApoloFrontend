import React from "react";
import { ProductCard } from "../ProductCard/ProductCard.jsx";
import "./ProductGrid.css";

export const ProductGrid = ({ products, stickerCartFunctions, productCartFunctions }) => {
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
                    type={product.type}
                    referencia={product.referencia || product.id}
                    
                    {...(product.type === 'sticker' && stickerCartFunctions && { stickerCartFunctions })}
                    {...(product.type !== 'sticker' && productCartFunctions && { productCartFunctions })}
                />
            ))}
        </div>
    );
};