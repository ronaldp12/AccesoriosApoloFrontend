import React from "react";
import { ProductCard } from "../ProductCard/ProductCard.jsx";
import "./ProductGrid.css";

export const ProductGrid = ({ products }) => {
    return (
        <div className="product-grid">
            {products.map((p) => (
                <ProductCard
                    key={p.id}
                    id={p.id}
                    slug={p.slug}
                    image={p.image}
                    brand={p.brand}
                    title={p.title}
                    price={p.price}
                    rating={p.rating}
                    discount={p.discount}
                />
            ))}
        </div>
    );
};
