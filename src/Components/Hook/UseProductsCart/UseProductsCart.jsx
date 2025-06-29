import { useState, useCallback, useContext } from 'react';
import { context } from '../../../Context/Context.jsx';

export const UseProductsCart = () => {
    const { userLogin, token, handleAddToCartLocal } = useContext(context);

    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartSuccessMessage, setCartSuccessMessage] = useState('');
    const [cartErrorMessage, setCartErrorMessage] = useState('');
    const [addingProductId, setAddingProductId] = useState(null);

    const clearMessages = useCallback(() => {
        setTimeout(() => {
            setCartSuccessMessage('');
            setCartErrorMessage('');
        }, 2000);
    }, []);

    const resetCartState = useCallback(() => {
        setIsAddingToCart(false);
        setCartSuccessMessage('');
        setCartErrorMessage('');
        setAddingProductId(null);
    }, []);

    const addProductToCart = useCallback(async (productData, cantidad = 1, loadCartFromBackend = null) => {
        setIsAddingToCart(true);
        setAddingProductId(productData.referencia || productData.id);
        setCartErrorMessage('');
        setCartSuccessMessage('');

        // ---- CASO 1: Usuario NO está logueado ----
        if (!userLogin) {
            console.log("Usuario no logueado. Agregando producto al carrito LOCAL.");
            const itemParaCarritoLocal = {
                ...productData,
                id: productData.referencia || productData.id,
                quantity: cantidad,
                type: 'product'
            };
            handleAddToCartLocal(itemParaCarritoLocal);
            setCartSuccessMessage('Agregado al carrito');
            clearMessages();
            setIsAddingToCart(false);
            setAddingProductId(null);
            return { success: true, isLocal: true };
        }

        // ---- CASO 2: Usuario SÍ está logueado ----
        console.log("Usuario logueado. Agregando producto al BACKEND.");
        try {
            const payload = {
                referencia_producto: productData.referencia || productData.id,
                cantidad
            };
            const response = await fetch('https://accesoriosapolobackend.onrender.com/agregar-producto-carrito', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.mensaje || 'Error al agregar producto');
            setCartSuccessMessage(data.mensaje || 'Producto agregado al carrito');
            if (loadCartFromBackend) {
                await loadCartFromBackend();
            }
            clearMessages();
            return { success: true, data };
        } catch (err) {
            console.error('Error al agregar al carrito:', err);
            setCartErrorMessage(err.message);
            clearMessages();
            return { success: false, error: err.message };
        } finally {
            setIsAddingToCart(false);
            setAddingProductId(null);
        }
    }, [userLogin, token, handleAddToCartLocal, clearMessages]);

    const isProductAdding = useCallback((productId) => {
        return isAddingToCart && addingProductId === productId;
    }, [isAddingToCart, addingProductId]);

    return {
        isAddingToCart,
        cartSuccessMessage,
        cartErrorMessage,
        addProductToCart,
        isProductAdding,
        resetCartState
    };
};