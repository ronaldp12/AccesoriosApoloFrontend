import { useState, useEffect } from "react";

export const useTopDiscountProducts = () => {
    const [topDiscountProducts, setTopDiscountProducts] = useState([]);
    const [loadingTopDiscounts, setLoadingTopDiscounts] = useState(true);
    const [errorTopDiscounts, setErrorTopDiscounts] = useState(null);

    useEffect(() => {
        const fetchTopDiscounts = async () => {
            try {
                const response = await fetch("https://accesoriosapolobackend.onrender.com/productos-top-descuento");
                if (!response.ok) {
                    throw new Error("No se pudieron cargar los productos con descuento.");
                }
                const data = await response.json();
                setTopDiscountProducts(data.productos);
            } catch (error) {
                setErrorTopDiscounts(error.message);
            } finally {
                setLoadingTopDiscounts(false);
            }
        };

        fetchTopDiscounts();
    }, []);

    return { topDiscountProducts, loadingTopDiscounts, errorTopDiscounts };
};
