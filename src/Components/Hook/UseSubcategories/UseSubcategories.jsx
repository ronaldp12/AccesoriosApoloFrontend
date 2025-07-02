import { useState, useEffect } from 'react';

export const useSubcategories = (categoryName) => {
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setSubcategories([]);
        setError(null);

        if (!categoryName) {
            setLoading(false);
            return;
        }

        const fetchSubcategories = async () => {
            setLoading(true);

            try {
                const url = `https://accesoriosapolobackend.onrender.com/subcategorias-por-categoria-por-nombre/${encodeURIComponent(categoryName)}`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success && data.subcategorias) {
                    const mappedSubcategories = data.subcategorias.map(sub => ({
                        label: sub.nombre_subcategoria,
                        img: sub.url_imagen
                    }));
                    setSubcategories(mappedSubcategories);
                } else {
                    console.log('API Error:', data.mensaje || 'No subcategories found');
                    setError(data.mensaje || 'No se encontraron subcategorías');
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Error al cargar las subcategorías');
            } finally {
                setLoading(false);
            }
        };

        fetchSubcategories();
    }, [categoryName]);

    return { subcategories, loading, error };
};

// Hook para obtener marcas por subcategoría
export const useBrandsBySubcategory = (subcategoryName) => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setBrands([]);
        setError(null);
        console.log("useBrandsBySubcategory recibió:", subcategoryName);
        console.log("Tipo de dato:", typeof subcategoryName);
        console.log("Longitud:", subcategoryName?.length);

        if (!subcategoryName) {
            setLoading(false);
            return;
        }

        const fetchBrands = async () => {
            setLoading(true);

            try {
                const url = `https://accesoriosapolobackend.onrender.com/obtener-marca/${encodeURIComponent(subcategoryName)}`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success && data.data) {
                    setBrands(data.data);
                } else {
                    console.log('API Error:', data.mensaje || 'No brands found');
                    setError(data.mensaje || 'No se encontraron marcas');
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Error al cargar las marcas');
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, [subcategoryName]);

    return { brands, loading, error };
};

// Función auxiliar para mapear datos del backend al formato esperado por ProductCard
const mapProductData = (backendProduct) => {
    // Función para convertir string a número de forma segura
    const safeParseNumber = (value) => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const cleaned = value.replace(/[^\d.-]/g, ''); // Eliminar todo excepto dígitos, puntos y guiones
            const parsed = parseFloat(cleaned);
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    };

    // Calcular descuento si existe diferencia entre precio original y precio con descuento
    const originalPrice = safeParseNumber(backendProduct.precio_unidad);
    const discountedPrice = safeParseNumber(backendProduct.precio_descuento);

    let discount = null;
    let finalPrice = originalPrice;
    let finalOriginalPrice = null;

    // Si hay diferencia entre precios, calcular descuento
    if (originalPrice > 0 && discountedPrice > 0 && discountedPrice < originalPrice) {
        const discountPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
        discount = `${discountPercent}%`;
        finalPrice = discountedPrice;
        finalOriginalPrice = originalPrice;
    }

    return {
        id: backendProduct.referencia || backendProduct.id,
        referencia: backendProduct.referencia,
        slug: backendProduct.slug || backendProduct.referencia,
        image: backendProduct.url_imagen || backendProduct.image,
        brand: backendProduct.marca || backendProduct.brand || 'Sin marca',
        title: backendProduct.nombre || backendProduct.title || 'Sin título',
        price: finalPrice,
        originalPrice: finalOriginalPrice,
        discount: discount,
        rating: safeParseNumber(backendProduct.promedio_calificacion),
        type: backendProduct.type || 'product',
        descripcion: backendProduct.descripcion || backendProduct.description,
        // Mantener datos originales por si se necesitan
        _originalData: backendProduct
    };
};

// Hook para obtener productos filtrados por subcategoría y marca - CON MAPEO
export const useFilteredProducts = (subcategoryName, brandName) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setProducts([]);
        setError(null);

        if (!subcategoryName || !brandName) {
            setLoading(false);
            return;
        }

        const fetchProducts = async () => {
            setLoading(true);

            try {
                const url = `https://accesoriosapolobackend.onrender.com/productos-por-subcategoria-y-marca?nombre_subcategoria=${encodeURIComponent(subcategoryName)}&marca=${encodeURIComponent(brandName)}`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success && data.data) {
                    // MAPEAR los datos aquí
                    const mappedProducts = data.data.map(mapProductData);
                    setProducts(mappedProducts);
                    console.log('Productos mapeados (useFilteredProducts):', mappedProducts);
                } else {
                    console.log('API Error:', data.mensaje || 'No products found');
                    setError(data.mensaje || 'No se encontraron productos');
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Error al cargar los productos');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [subcategoryName, brandName]);

    return { products, loading, error };
};

// Hook combinado que maneja todo el flujo de filtrado
export const useProductFiltering = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');

    // Obtener subcategorías basadas en la categoría seleccionada
    const {
        subcategories,
        loading: subcategoriesLoading,
        error: subcategoriesError
    } = useSubcategories(selectedCategory);

    // Obtener marcas basadas en la subcategoría seleccionada
    const {
        brands,
        loading: brandsLoading,
        error: brandsError
    } = useBrandsBySubcategory(selectedSubcategory);

    // Obtener productos filtrados
    const {
        products,
        loading: productsLoading,
        error: productsError
    } = useFilteredProducts(selectedSubcategory, selectedBrand);

    // Reset de dependencias cuando cambian las selecciones superiores
    useEffect(() => {
        if (selectedCategory) {
            setSelectedSubcategory('');
            setSelectedBrand('');
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (selectedSubcategory) {
            setSelectedBrand('');
        }
    }, [selectedSubcategory]);

    return {
        // Estados de selección
        selectedCategory,
        selectedSubcategory,
        selectedBrand,
        setSelectedCategory,
        setSelectedSubcategory,
        setSelectedBrand,

        // Datos
        subcategories,
        brands,
        products,

        // Estados de carga
        subcategoriesLoading,
        brandsLoading,
        productsLoading,

        // Errores
        subcategoriesError,
        brandsError,
        productsError,

        // Estados combinados para UX
        isLoading: subcategoriesLoading || brandsLoading || productsLoading,
        hasError: subcategoriesError || brandsError || productsError,

        // Funciones de utilidad
        resetFilters: () => {
            setSelectedCategory('');
            setSelectedSubcategory('');
            setSelectedBrand('');
        },

        canSelectSubcategory: selectedCategory && subcategories.length > 0,
        canSelectBrand: selectedSubcategory && brands.length > 0,
        hasProducts: selectedSubcategory && selectedBrand && products.length > 0
    };
};