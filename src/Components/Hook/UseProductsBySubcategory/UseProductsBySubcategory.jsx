import { useState, useEffect } from 'react';

export const useProductsBySubcategory = (subcategoryName, productReferencia = null) => {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState(null); // Para producto individual
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Si se proporciona una referencia específica, buscar ese producto
        if (productReferencia) {
            fetchProductByReferencia(productReferencia);
            return;
        }

        // Si no hay subcategoría, limpiar productos
        if (!subcategoryName) {
            setProducts([]);
            setProduct(null);
            return;
        }

        // Buscar productos por subcategoría
        fetchProductsBySubcategory(subcategoryName);
    }, [subcategoryName, productReferencia]);

    const fetchProductsBySubcategory = async (subcategory) => {
        setLoading(true);
        setError(null);
        setProduct(null);

        try {
            console.log('Fetching products for subcategory:', subcategory);
            const url = `https://accesoriosapolobackend.onrender.com/productos-por-subcategoria/${encodeURIComponent(subcategory)}`;

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
                    rating: product.promedio_calificacion,
                    discount: product.descuento ? `${product.descuento}` : null,
                    referencia: product.referencia,
                    promedio_calificacion: product.promedio_calificacion,
                    descripcion: product.descripcion,
                    talla: product.talla,
                    numero_calificaciones: product.numero_calificaciones
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

    const fetchProductByReferencia = async (referencia) => {
        setLoading(true);
        setError(null);
        setProducts([]); // Limpiar lista de productos

        try {
            console.log('Fetching product by referencia:', referencia);
            const url = `https://accesoriosapolobackend.onrender.com/consultar-producto-por-referencia/${encodeURIComponent(referencia)}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                const productData = data.producto;
                console.log('Product data:', productData);

                const mappedProduct = {
                    id: productData.referencia,
                    slug: productData.referencia,
                    image: productData.urls_imagenes, // Array para compatibilidad con galería
                    brand: productData.marca,
                    title: productData.nombre,
                    price: productData.precio_descuento || productData.precio_unidad,
                    originalPrice: productData.precio_descuento ? productData.precio_unidad : null,
                    currentPrice: productData.precio_descuento || productData.precio_unidad, // Para ProductDetailPage
                    rating: productData.promedio_calificacion,
                    reviews: productData.numero_calificaciones,
                    discount: productData.descuento,
                    referencia: productData.referencia,
                    descripcion: productData.descripcion,
                    talla: productData.talla,
                    ahorro: productData.ahorro || null,
                    // Campos adicionales para ProductDetailPage
                    installments: productData.ahorro ? `Ahorras $${productData.ahorro.toLocaleString()} COP` : null
                };

                setProduct(mappedProduct);
            } else {
                console.log('API Error:', data.mensaje);
                setError(data.mensaje);
                setProduct(null);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Error al cargar el producto');
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        product, // Producto individual cuando se busca por referencia
        loading,
        error,
        // Funciones para usar desde componentes
        fetchProductByReferencia,
        fetchProductsBySubcategory
    };
};