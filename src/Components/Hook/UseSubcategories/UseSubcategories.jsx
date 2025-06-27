// hooks/useSubcategories.js
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
            console.log('Fetching subcategories for category:', categoryName);
            const url = `https://accesoriosapolobackend.onrender.com/subcategorias-por-categoria-por-nombre/${encodeURIComponent(categoryName)}`;
            console.log('Request URL:', url);
            
            const response = await fetch(url);
            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('Response data:', data);

            if (data.success) {
                const mappedSubcategories = data.subcategorias.map(sub => ({
                    label: sub.nombre_subcategoria,
                    img: sub.url_imagen
                }));
                console.log('Mapped subcategories:', mappedSubcategories);
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