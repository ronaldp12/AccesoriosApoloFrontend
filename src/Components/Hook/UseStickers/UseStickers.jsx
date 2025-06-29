import { useState, useEffect, useContext } from 'react';
import { context } from '../../../Context/Context.jsx';

export const UseStickers = () => {
    // 1. Estados propios del hook (sin cambios)
    const [stickers, setStickers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartSuccessMessage, setCartSuccessMessage] = useState('');
    const [cartErrorMessage, setCartErrorMessage] = useState('');

    // 2. Integración con el Contexto Global
    //    Obtenemos las herramientas necesarias:
    //    - userLogin y token: para saber si hay sesión.
    //    - handleAddToCartLocal: para agregar al carrito local si NO hay sesión.
    //    - loadCartFromBackend: para refrescar el carrito si SÍ hay sesión.
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
                    type: 'sticker' // Este tipo es genérico aquí, lo sobreescribiremos al agregar al carrito
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

    // 3. Lógica "Inteligente" para Agregar al Carrito (AQUÍ ESTÁ EL CAMBIO CLAVE)
    const addStickerToCart = async (sticker, sizeConfig) => {

        // ---- CASO 1: Usuario NO está logueado ----
        if (!userLogin) {
            console.log("Usuario no logueado. Agregando calcomanía del staff al carrito LOCAL.");

            // Creamos el objeto exacto que el carrito local necesita.
            // Es CRÍTICO que tenga 'type: "staff_sticker"' para la futura sincronización.
            const itemParaCarritoLocal = {
                id: sticker.id,
                title: sticker.title,
                price: sticker.price, // Asumimos que el modal ya calculó el precio correcto
                originalPrice: sticker.originalPrice,
                image: sticker.image,
                brand: sticker.brand,
                size: sizeConfig.size, // 'small', 'medium', o 'large'
                quantity: sizeConfig.cantidad || 1,
                type: 'staff_sticker' // ✨ ¡La clave para la sincronización!
            };

            // Usamos la función del Context para añadirlo al carrito local
            handleAddToCartLocal(itemParaCarritoLocal);

            // Damos feedback visual inmediato al usuario
            setCartSuccessMessage('Agregado al carrito');
            clearMessages();
            return true; // Indicamos que la operación fue exitosa
        }

        // ---- CASO 2: Usuario SÍ está logueado ----
        // Aquí va la lógica que ya tenías, que habla con el backend.
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

            const tamanoMap = { 'small': 'pequeño', 'medium': 'mediano', 'large': 'grande' };
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
                await loadCartFromBackend(); // ✨ Refrescamos el carrito desde el backend para ver el item nuevo
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
            'small': { width: 5, height: 5, size: 'small' },
            'medium': { width: 7, height: 5, size: 'medium' },
            'large': { width: 9, height: 5, size: 'large' }
        };
        return dimensions[size] || { width: 5, height: 5, size: 'small' };
    };

    const calculateStickerPrice = (sticker, sizeConfig) => {
        return sticker.price || sticker.precio_unidad || 0;
    };

    const refetchStickers = () => {
        fetchStickers();
    };

    // Cargar las calcomanías al montar (sin cambios)
    useEffect(() => {
        fetchStickers();
    }, []);

    // 4. Retornamos todas las herramientas necesarias
    return {
        stickers,
        loading,
        error,
        refetchStickers,
        isAddingToCart,
        cartSuccessMessage,
        cartErrorMessage,
        addStickerToCart, // La función ahora es "inteligente"
        getSizeDimensions,
        calculateStickerPrice
    };
};