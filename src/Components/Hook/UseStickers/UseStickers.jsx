import { useState, useEffect, useContext } from 'react';
import { context } from '../../../Context/Context.jsx';

export const UseStickers = () => {
    const [stickers, setStickers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartSuccessMessage, setCartSuccessMessage] = useState('');
    const [cartErrorMessage, setCartErrorMessage] = useState('');

    const { userLogin, token } = useContext(context);

    const clearMessages = () => {
        setTimeout(() => {
            setCartSuccessMessage('');
            setCartErrorMessage('');
        }, 3000);
    };

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

    const addStickerToCart = async (sticker, sizeConfig) => {
        try {
            setIsAddingToCart(true);
            setCartErrorMessage('');
            setCartSuccessMessage('');

            if (!userLogin || !token) {
                setCartErrorMessage('Debes iniciar sesión para agregar productos al carrito');
                clearMessages();
                return false;
            }

            if (!sizeConfig || !sizeConfig.size) {
                setCartErrorMessage('Debes seleccionar un tamaño');
                clearMessages();
                return false;
            }

            const tamanoMap = {
                'small': 'pequeño',
                'medium': 'mediano',
                'large': 'grande'
            };

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
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            if (data.success) {
                setCartSuccessMessage(data.mensaje || 'Calcomanía agregada al carrito exitosamente');
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
        calculateStickerPrice
    };
};
