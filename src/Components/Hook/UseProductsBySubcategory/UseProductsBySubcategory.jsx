import { useState, useEffect } from 'react';

export const useProductsBySubcategory = (subcategoryName) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!subcategoryName) {
            setProducts([]);
            return;
        }

        const fetchProductsBySubcategory = async () => {
            setLoading(true);
            setError(null);

            try {
                console.log('Fetching products for subcategory:', subcategoryName);
                const url = `https://accesoriosapolobackend.onrender.com/productos-por-subcategoria/${encodeURIComponent(subcategoryName)}`;

                const response = await fetch(url);

                const data = await response.json();

                if (data.success) {
                    const mappedProducts = data.productos.map(product => ({
                        id: product.referencia,
                        slug: product.referencia,
                        image: product.url_imagen,
                        brand: product.marca,
                        title: product.nombre,
                        price: product.precio_descuento || product.precio_unidad,
                        originalPrice: product.precio_descuento ? product.precio_unidad : null,
                        rating: (product.promedio_calificacion),
                        discount: product.descuento ? `${product.descuento}%` : null,
                        referencia: product.referencia,
                        promedio_calificacion: product.promedio_calificacion
                    }));

                    setProducts(mappedProducts);
                } else {
                    console.log('API Error:', data.mensaje);
                    setError(data.mensaje);
                    setProducts([]);
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Error al cargar los productos');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsBySubcategory();
    }, [subcategoryName]);

    return { products, loading, error };
};