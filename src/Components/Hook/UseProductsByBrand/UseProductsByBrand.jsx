import { title } from 'framer-motion/client';
import { useState, useEffect } from 'react';

export const UseProductsByBrand = (marca) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!marca) {
            setProducts([]);
            return;
        }

        const fetchProductsByBrand = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`https://accesoriosapolobackend.onrender.com/productos-por-marca/${encodeURIComponent(marca)}`);

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                if (data.success) {
                    const transformedProducts = data.productos.map(producto => ({
                        id: producto.referencia,
                        slug: producto.referencia,
                        image: producto.url_imagen,
                        brand: producto.marca,
                        title: producto.nombre,
                        price: producto.precio_descuento || producto.precio_unidad, 
                        originalPrice: producto.precio_descuento ? producto.precio_unidad : null, 
                        rating: Math.round(producto.promedio_calificacion) || 0,
                        discount: producto.descuento || null, 
                        referencia: producto.referencia
                    }));

                    setProducts(transformedProducts);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error('Error fetching products by brand:', err);
                setError(err.message);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsByBrand();
    }, [marca]);

    return { products, loading, error };
};