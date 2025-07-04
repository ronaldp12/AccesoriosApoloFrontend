// Hook: useProductsWithDiscount.jsx
import { useState, useEffect } from 'react';

export const UseProductsWithDiscount = (category) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!category) return;

        const fetchDiscountProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                // Normalizar categoría para la URL
                const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
                const response = await fetch(`https://accesoriosapolobackend.onrender.com/productos-con-descuento/${normalizedCategory}`);

                if (!response.ok) {
                    throw new Error('Error al obtener productos con descuento');
                }

                const data = await response.json();

                // Transformar datos para que coincidan con la estructura esperada
                const transformedProducts = data.productos.map(product => ({
                    id: product.referencia,
                    referencia: product.referencia,
                    title: product.nombre,
                    brand: product.marca,
                    image: product.url_imagen,
                    price: product.precio_descuento || product.precio_unidad,
                    originalPrice: product.precio_descuento ? product.precio_unidad : null,
                    discount: product.descuento,
                    rating: product.calificacion,
                    type: 'product'
                }));

                setProducts(transformedProducts);
            } catch (err) {
                setError(err.message);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDiscountProducts();
    }, [category]);

    return { products, loading, error };
};