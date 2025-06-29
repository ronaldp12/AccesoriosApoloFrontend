import { useState, useCallback } from 'react';

export const UseProductsCart = () => {
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartSuccessMessage, setCartSuccessMessage] = useState('');
    const [cartErrorMessage, setCartErrorMessage] = useState('');
    const [addingProductId, setAddingProductId] = useState(null);

    const clearMessages = useCallback(() => {
        setTimeout(() => {
            setCartSuccessMessage('');
            setCartErrorMessage('');
        }, 3000);
    }, []);

    const addProductToCart = useCallback(async (referencia_producto, cantidad = 1, productName = '', productData = null, loadCartFromBackend = null) => {
        setIsAddingToCart(true);
        setAddingProductId(referencia_producto);
        setCartErrorMessage('');
        setCartSuccessMessage('');

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No se encontró token de autenticación');
            }

            const payload = {
                referencia_producto,
                cantidad
            };

            if (productData) {
                payload.producto_info = {
                    nombre: productData.title,
                    marca: productData.brand,
                    precio_actual: productData.price,
                    precio_original: productData.originalPrice,
                    descuento: productData.discount,
                    url_imagen: productData.image,
                    referencia: productData.referencia || productData.id,
                    tipo: 'producto'
                };
            }

            console.log('Payload enviado al backend:', payload);

            const response = await fetch('https://accesoriosapolobackend.onrender.com/agregar-producto-carrito', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log('Respuesta del backend al agregar producto:', data);

            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al agregar producto al carrito');
            }

            setCartSuccessMessage(
                productName
                    ? `${productName} agregado al carrito exitosamente`
                    : data.mensaje || 'Producto agregado al carrito'
            );
            clearMessages();

            // Recargar el carrito usando la función del contexto
            if (loadCartFromBackend && typeof loadCartFromBackend === 'function') {
                try {
                    await loadCartFromBackend();
                    console.log('Carrito recargado automáticamente');
                } catch (reloadError) {
                    console.error('Error recargando carrito:', reloadError);
                    // No mostrar error al usuario, el producto se agregó correctamente
                }
            }

            return {
                success: true,
                data: data,
                mensaje: data.mensaje
            };

        } catch (err) {
            console.error('Error al agregar al carrito:', err);
            setCartErrorMessage(err.message);
            clearMessages();

            return {
                success: false,
                error: err.message
            };
        } finally {
            setIsAddingToCart(false);
            setAddingProductId(null);
        }
    }, [clearMessages]);

    const isProductAdding = useCallback((productId) => {
        return isAddingToCart && addingProductId === productId;
    }, [isAddingToCart, addingProductId]);

    const resetCartState = useCallback(() => {
        setIsAddingToCart(false);
        setCartSuccessMessage('');
        setCartErrorMessage('');
        setAddingProductId(null);
    }, []);

    return {
        // Estados
        isAddingToCart,
        cartSuccessMessage,
        cartErrorMessage,
        addingProductId,

        // Funciones
        addProductToCart,
        isProductAdding,
        resetCartState
    };
};