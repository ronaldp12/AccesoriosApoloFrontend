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