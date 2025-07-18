import { useState, useEffect } from 'react';

export const UseCategories = (categoryName) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!categoryName) {
            setProducts([]);
            return;
        }

        const fetchProductsByCategory = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`https://accesoriosapolobackend.onrender.com/obtener-productos-por-categoria/${encodeURIComponent(categoryName)}`);
                const data = await response.json();
                console.log("datos categoria", data);

                if (!response.ok) {
                    throw new Error(data.mensaje || 'Error al obtener productos por categoría');
                }

                if (data.success) {
                    // Transformar los datos de la API al formato esperado por el frontend
                    const transformedProducts = data.data.map(product => ({
                        id: product.referencia,
                        referencia: product.referencia,
                        title: product.nombre,
                        brand: product.marca,
                        price: Number(product.precio_descuento || product.precio_unidad),
                        originalPrice: product.precio_descuento ? Number(product.precio_unidad) : null,
                        discount: product.descuento ? `${product.descuento}` : null,
                        rating: product.calificacion || 0,
                        image: product.url_imagen,
                        slug: product.referencia, // Usando referencia como slug
                        type: 'product' // Tipo por defecto
                    }));

                    setProducts(transformedProducts);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error('Error fetching products by category:', err);
                setError(err.message);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsByCategory();
    }, [categoryName]);

    return { products, loading, error };
};

export const UseBrandsByCategory = (categoryName) => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!categoryName) {
            setBrands([]);
            return;
        }

        const fetchBrandsByCategory = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`https://accesoriosapolobackend.onrender.com/obtener-productos-por-categoria/${encodeURIComponent(categoryName)}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.mensaje || 'Error al obtener marcas');
                }

                if (data.success) {
                    const brands = [...new Set(data.data.map(product => product.marca))];
                    setBrands(brands);
                } else {
                    setBrands([]);
                }
            } catch (err) {
                console.error('Error fetching brands by category:', err);
                setError(err.message);
                setBrands([]);
            } finally {
                setLoading(false);
            }
        };


        fetchBrandsByCategory();
    }, [categoryName]);

    return { brands, loading, error };
};