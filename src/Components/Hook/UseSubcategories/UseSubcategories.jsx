import { useState, useEffect } from 'react';

export const useSubcategories = (categoryName) => {
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
    if (!categoryName) return;

    const fetchSubcategories = async () => {
        setLoading(true);
        setError(null);

        try {
            const url = `https://accesoriosapolobackend.onrender.com/subcategorias-por-categoria-por-nombre/${encodeURIComponent(categoryName)}`;
            
            const response = await fetch(url);
            
            const data = await response.json();

            if (data.success) {
                const mappedSubcategories = data.subcategorias.map(sub => ({
                    label: sub.nombre_subcategoria,
                    img: sub.url_imagen
                }));
                setSubcategories(mappedSubcategories);
            } else {
                console.log('API Error:', data.mensaje);
                setError(data.mensaje);
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