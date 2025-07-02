import { useState, useEffect, useContext, useCallback } from 'react';
import { context } from '../../../Context/Context.jsx';

export const UseStickers = () => {
    const [stickers, setStickers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [stickerDetail, setStickerDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [errorDetail, setErrorDetail] = useState(null);

    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartSuccessMessage, setCartSuccessMessage] = useState('');
    const [cartErrorMessage, setCartErrorMessage] = useState('');

    const { userLogin, token, handleAddToCartLocal, loadCartFromBackend } = useContext(context);

    // Función para limpiar mensajes después de un tiempo (sin cambios)
    const clearMessages = () => {
        setTimeout(() => {
            setCartSuccessMessage('');
            setCartErrorMessage('');
        }, 3000);
    };

    // Función para obtener las calcomanías del staff (sin cambios)
    const fetchStickers = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = 'https://accesoriosapolobackend.onrender.com/calcomanias/staff';
            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                const mappedStickers = data.calcomanias.map(sticker => ({
                    id: sticker.id_calcomania,
                    slug: `sticker-${sticker.id_calcomania}`,
                    image: sticker.url_archivo,
                    brand: 'Calcomanía',
                    title: sticker.nombre,
                    price: sticker.precio_descuento || sticker.precio_unidad,
                    originalPrice: sticker.precio_descuento ? sticker.precio_unidad : null,
                    discount: sticker.descuento ? `${Math.round(sticker.descuento)}%` : null,
                    id_calcomania: sticker.id_calcomania,
                    type: 'sticker'
                }));
                setStickers(mappedStickers);
            } else {
                setError(data.mensaje);
                setStickers([]);
            }
        } catch (err) {
            setError('Error al cargar las calcomanías');
            setStickers([]);
        } finally {
            setLoading(false);
        }
    };

    // SOLUCIÓN: Memoizar fetchStickerById con useCallback
    const fetchStickerById = useCallback(async (id) => {
        setLoadingDetail(true);
        setErrorDetail(null);
        setStickerDetail(null);

        try {
            const url = `https://accesoriosapolobackend.onrender.com/consultar-calcomanias-por-id/${id}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);

            if (data.success) {
                const sticker = data.calcomania;
                const mappedSticker = {
                    id: sticker.id_calcomania,
                    slug: `sticker-${sticker.id_calcomania}`,
                    image: [sticker.url_archivo], // Array para compatibilidad con ProductDetailPage
                    brand: 'Calcomanía',
                    title: sticker.nombre,
                    price: sticker.precio_descuento || sticker.precio_unidad,
                    originalPrice: sticker.precio_descuento ? sticker.precio_unidad : null,
                    currentPrice: sticker.precio_descuento || sticker.precio_unidad,
                    discount: sticker.descuento || null,
                    ahorro: sticker.ahorro || null,
                    referencia: `CALC-${sticker.id_calcomania}`,
                    id_calcomania: sticker.id_calcomania,
                    type: 'sticker',
                    tamano_x: sticker.tamano_x,
                    tamano_y: sticker.tamano_y,
                    descripcion: `Calcomanía ${sticker.nombre}. Tamaño: ${sticker.tamano_x}cm x ${sticker.tamano_y}cm`
                };
                setStickerDetail(mappedSticker);
            } else {
                setErrorDetail(data.mensaje);
            }
        } catch (err) {
            setErrorDetail('Error al cargar el detalle de la calcomanía');
        } finally {
            setLoadingDetail(false);
        }
    }, []); // Dependencias vacías porque no depende de ningún valor externo

    const addStickerToCart = async (sticker, sizeConfig) => {
        // ---- CASO 1: Usuario NO está logueado ----
        if (!userLogin) {
            console.log("Usuario no logueado. Agregando calcomanía del staff al carrito LOCAL.");

            const itemParaCarritoLocal = {
                id: sticker.id,
                title: sticker.title,
                price: sticker.price,
                originalPrice: sticker.originalPrice,
                image: sticker.image,
                brand: sticker.brand,
                size: sizeConfig.size,
                quantity: sizeConfig.cantidad || 1,
                type: 'staff_sticker'
            };

            handleAddToCartLocal(itemParaCarritoLocal);

            setCartSuccessMessage('Agregado al carrito');
            clearMessages();
            return true;
        }

        // ---- CASO 2: Usuario SÍ está logueado
        console.log("Usuario logueado. Agregando calcomanía del staff al BACKEND.");
        try {
            setIsAddingToCart(true);
            setCartErrorMessage('');
            setCartSuccessMessage('');

            if (!sizeConfig || !sizeConfig.size) {
                setCartErrorMessage('Debes seleccionar un tamaño');
                clearMessages();
                return false;
            }

            const tamanoMap = { 'pequeño': 'pequeño', 'mediano': 'mediano', 'grande': 'grande' };
            const tamanoAPI = tamanoMap[sizeConfig.size];

            if (!tamanoAPI) {
                setCartErrorMessage('Tamaño no válido');
                clearMessages();
                return false;
            }

            const requestData = {
                id_calcomania: sticker.id_calcomania || sticker.id,
                tamano: tamanoAPI,
                cantidad: sizeConfig.cantidad || 1
            };

            const response = await fetch('https://accesoriosapolobackend.onrender.com/agregar-calcomanias-staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            if (data.success) {
                setCartSuccessMessage(data.mensaje || 'Calcomanía agregada al carrito exitosamente');
                await loadCartFromBackend();
                clearMessages();
                return true;
            } else {
                setCartErrorMessage(data.mensaje || 'Error al agregar la calcomanía al carrito');
                clearMessages();
                return false;
            }

        } catch (error) {
            setCartErrorMessage('Error de conexión. Intenta nuevamente.');
            clearMessages();
            return false;
        } finally {
            setIsAddingToCart(false);
        }
    };

    // Funciones de ayuda (sin cambios)
    const getSizeDimensions = (size) => {
        const dimensions = {
            'pequeño': { width: 5, height: 5, size: 'pequeño' },
            'mediano': { width: 7, height: 5, size: 'mediano' },
            'grande': { width: 9, height: 5, size: 'grande' }
        };
        return dimensions[size] || { width: 5, height: 5, size: 'pequeño' };
    };

    const calculateStickerPrice = (sticker, sizeConfig) => {
        return sticker.price || sticker.precio_unidad || 0;
    };

    const refetchStickers = () => {
        fetchStickers();
    };

    useEffect(() => {
        fetchStickers();
    }, []);

    return {
        stickers,
        loading,
        error,
        refetchStickers,
        isAddingToCart,
        cartSuccessMessage,
        cartErrorMessage,
        addStickerToCart,
        getSizeDimensions,
        calculateStickerPrice,
        stickerDetail,
        loadingDetail,
        errorDetail,
        fetchStickerById
    };
};