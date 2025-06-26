import { createContext } from "react";
import { useState, useEffect } from "react";

export const context = createContext();

export const Provider = ({ children }) => {

    const [cartProducts, setCartProducts] = useState([]);
    const [name, setName] = useState(localStorage.getItem("usuarioLogueado") || "");
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [userLogin, setUserLogin] = useState(localStorage.getItem("usuarioLogueado") || null);
    const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isIntermediateLoading, setIsIntermediateLoading] = useState(false);
    const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || null);
    const [nameRol, setNameRol] = useState(localStorage.getItem("nameRol") || "");
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const [savedStickers, setSavedStickers] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [originalFile, setOriginalFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSaveSuccess, setIsSaveSuccess] = useState(false);

    // 📦 Estados de modales de auth
    const [registerOpen, setRegisterOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);

    const openRegister = () => setRegisterOpen(true);
    const closeRegister = () => setRegisterOpen(false);

    const openLogin = () => setLoginOpen(true);
    const closeLogin = () => setLoginOpen(false);

    const [welcomeNoLoginOpen, setWelcomeNoLoginOpen] = useState(false);

    const openWelcomeNoLogin = () => setWelcomeNoLoginOpen(true);
    const closeWelcomeNoLogin = () => setWelcomeNoLoginOpen(false);

    const loadCartFromBackend = async () => {
        if (!token || !userLogin) return;

        setIsLoading(true);
        try {
            const response = await fetch('https://accesoriosapolobackend.onrender.com/consultar-carrito-usuario', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const formattedCartItems = data.carrito.map(item => {
                    if (item.tipo === 'producto') {
                        return {
                            id: item.referencia,
                            cartItemId: item.id_carrito_item,
                            image: item.url_archivo,
                            brand: item.marca,
                            title: item.nombre,
                            price: item.precio_actual,
                            originalPrice: item.precio_unidad_original,
                            quantity: item.cantidad,
                            type: 'product'
                        };
                    } else if (item.tipo === 'calcomania') {
                        return {
                            id: `sticker-${item.id_calcomania}-${item.tamano_x}x${item.tamano_y}`,
                            originalId: item.id_calcomania,
                            cartItemId: item.id_carrito_item,
                            image: item.url_archivo,
                            title: item.nombre,
                            price: item.precio_unidad,
                            size: `${item.tamano_x}×${item.tamano_y} cm`,
                            width: item.tamano_x,
                            height: item.tamano_y,
                            quantity: item.cantidad,
                            type: 'sticker'
                        };
                    }
                    return null;
                }).filter(item => item !== null);

                setCartProducts(formattedCartItems);
            } else {
                console.error('Error cargando carrito:', data.mensaje);
                setErrorMessage(getErrorMessage(data, 'Error al cargar el carrito'));
            }
        } catch (error) {
            console.error('Error de conexión cargando carrito:', error);
            setErrorMessage('Error de conexión al cargar el carrito');
        } finally {
            setIsLoading(false);
        }
    };

    // 🛒 NUEVA: Función para actualizar cantidad en el backend
    const updateCartItemQuantity = async (cartItemId, newQuantity, token) => {
        if (!token) return false;

        try {
            const response = await fetch(`https://accesoriosapolobackend.onrender.com/actualizar-cantidad-carrito`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_carrito_item: cartItemId,
                    nueva_cantidad: newQuantity
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Error en response:', data.mensaje);
                return false;
            }

            return data.success;
        } catch (error) {
            console.error('Error actualizando cantidad en carrito:', error);
            return false;
        }
    };


    // 🛒 NUEVA: Función para eliminar item del carrito en el backend
    const removeCartItemFromBackend = async (cartItemId) => {
        if (!token) return false;

        try {
            const response = await fetch(`https://accesoriosapolobackend.onrender.com/carrito/${cartItemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_carrito_item: cartItemId
                })
            });

            const data = await response.json();
            console.log('Respuesta del backend al eliminar:', data);
            return response.ok && data.success;
        } catch (error) {
            console.error('Error eliminando item del carrito:', error);
            return false;
        }
    };

    const loadUserStickers = async () => {
        if (!token) return;

        setIsLoading(true);
        try {
            const response = await fetch('https://accesoriosapolobackend.onrender.com/calcomanias-usuario', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const formattedStickers = data.calcomanias.map((calcomania, index) => ({
                    id: calcomania.id_calcomania,
                    name: calcomania.nombre,
                    image: calcomania.url_archivo,
                    formato: calcomania.formato
                }));

                setSavedStickers(formattedStickers);
            } else {
                console.error('Error cargando calcomanías:', data.mensaje);
                setErrorMessage(getErrorMessage(data, 'Error al cargar las calcomanías'));
            }
        } catch (error) {
            console.error('Error de conexión cargando calcomanías:', error);
            setErrorMessage('Error de conexión al cargar las calcomanías');
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect para cargar carrito y stickers cuando el usuario se autentica
    useEffect(() => {
        if (token && userLogin) {
            loadCartFromBackend();
            loadUserStickers();
        }
    }, [token, userLogin]);

    const handleAddToCart = (item) => {
        const existingItem = cartProducts.find(p =>
            p.id === item.id &&
            p.size === item.size
        );

        if (existingItem) {
            setCartProducts(cartProducts.map(p =>
                p.id === item.id && p.size === item.size
                    ? { ...p, quantity: p.quantity + 1 }
                    : p
            ));
        } else {
            setCartProducts([...cartProducts, { ...item, quantity: 1 }]);
        }
    };

    const handleRemoveProduct = async (id, size = null) => {
        console.log('=== DEBUG FRONTEND - handleRemoveProduct ===');
        console.log('Parámetros recibidos:', { id, size });

        const cartItem = cartProducts.find(product =>
            product.id === id && (size ? product.size === size : true)
        );

        console.log('Item del carrito encontrado:', cartItem);

        if (!cartItem) {
            console.error('No se encontró el item en el carrito');
            setErrorMessage('No se encontró el producto en el carrito');
            return;
        }

        if (!cartItem.cartItemId) {
            console.error('El item no tiene cartItemId');
            setErrorMessage('Error: el producto no tiene ID de carrito válido');
            return;
        }

        const originalCartState = [...cartProducts];

        const updatedCart = cartProducts.filter(product =>
            product.id !== id || (size && product.size !== size)
        );
        setCartProducts(updatedCart);

        console.log('Eliminando del backend con cartItemId:', cartItem.cartItemId);

        const success = await removeCartItemFromBackend(cartItem.cartItemId);

        if (!success) {
            console.error('Error eliminando del backend, revirtiendo cambios');
            setCartProducts(originalCartState);
            setErrorMessage('Error al eliminar el producto del servidor');
        } else {
            console.log('Producto eliminado exitosamente del backend');
            setSuccessMessage('Producto eliminado del carrito');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    const handleQuantityChange = async (id, quantity, size = null) => {
        console.log('handleQuantityChange en contexto:', { id, quantity, size });

        const cartItem = cartProducts.find(product =>
            product.id === id && (size ? product.size === size : true)
        );

        console.log('cartItem encontrado:', cartItem);

        if (!cartItem) {
            console.error('No se encontró el item en el carrito');
            setErrorMessage('No se encontró el producto en el carrito');
            return;
        }

        const willBeDeleted = cartItem.quantity === 1 && quantity === 0;

        if (willBeDeleted) {
            console.log('El item será eliminado por el backend (cantidad 1 -> 0)');

            const updatedCart = cartProducts.filter(product =>
                product.id !== id || (size && product.size !== size)
            );
            setCartProducts(updatedCart);
        } else {
            const updatedCart = cartProducts.map(product => {
                if (product.id === id && (size ? product.size === size : true)) {
                    return { ...product, quantity };
                }
                return product;
            });
            setCartProducts(updatedCart);
        }

        if (cartItem.cartItemId) {
            console.log('Actualizando en backend:', cartItem.cartItemId, quantity);
            const success = await updateCartItemQuantity(cartItem.cartItemId, quantity, token);

            if (!success) {
                console.error('Error actualizando en backend, revirtiendo cambios');
                setCartProducts(cartProducts);
                setErrorMessage('Error al actualizar la cantidad en el servidor');
            } else {
                console.log('Actualización exitosa en backend');

                if (willBeDeleted) {
                    console.log('Recargando carrito después de eliminación automática');
                    await loadCartFromBackend();
                }
            }
        } else {
            console.warn('cartItem no tiene cartItemId:', cartItem);
        }
    };

    const handleLogout = () => {
        setName("");
        setToken("");
        setUserLogin(null);
        setSavedStickers([]);
        setCartProducts([]);
        localStorage.removeItem("token");
        localStorage.removeItem("usuarioLogueado");
        localStorage.removeItem("nameRol");
        localStorage.removeItem("avatar");
    };

    const getErrorMessage = (data, defaultMsg) => {
        return data.mensaje || data.message || defaultMsg;
    };

    const validatePassword = (password) => {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
        };
    };

    const normalizeText = (text) =>
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const updateStickerName = async (id, newName) => {
        if (!token) {
            setErrorMessage('Debe estar autenticado para actualizar calcomanías');
            return false;
        }

        if (!newName || newName.trim() === '') {
            setErrorMessage('El nombre de la calcomanía no puede estar vacío');
            return false;
        }

        try {
            const response = await fetch(`https://accesoriosapolobackend.onrender.com/editar-nombre-calcomanias/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: newName.trim()
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSavedStickers((prevStickers) =>
                    prevStickers.map((sticker) =>
                        sticker.id === id ? { ...sticker, name: newName.trim() } : sticker
                    )
                );

                setSuccessMessage('Nombre actualizado exitosamente');

                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);

                return true;
            } else {
                setErrorMessage(getErrorMessage(data, 'Error al actualizar el nombre'));
                return false;
            }
        } catch (error) {
            console.error('Error actualizando nombre de calcomanía:', error);
            setErrorMessage('Error de conexión al actualizar el nombre');
            return false;
        }
    };

    const clearMessages = () => {
        setSuccessMessage('');
        setErrorMessage('');
        setIsSaveSuccess(false);
    };

    const dataURLtoBlob = (dataURL) => {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    const saveSticker = async () => {
        if (!token) {
            setErrorMessage('Debe estar autenticado para guardar calcomanías');
            return;
        }

        const imageToSave = croppedImage || selectedImage;
        if (!imageToSave) {
            setErrorMessage('No hay imagen para guardar');
            return;
        }

        setIsLoading(true);
        setIsSaveSuccess(false);
        clearMessages();

        try {
            const formData = new FormData();

            const nombre = `Calcomanía ${savedStickers.length + 1}`;
            formData.append('nombre', nombre);

            let imageFile;

            if (croppedImage) {
                const blob = dataURLtoBlob(croppedImage);
                imageFile = new File([blob], `${nombre}.png`, { type: 'image/png' });
            } else if (originalFile) {
                imageFile = originalFile;
            } else {
                const blob = dataURLtoBlob(selectedImage);
                imageFile = new File([blob], `${nombre}.png`, { type: 'image/png' });
            }

            formData.append('imagen', imageFile);

            const response = await fetch('https://accesoriosapolobackend.onrender.com/registrar-calcomania-usuario', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setIsLoading(false);
                setIsSaveSuccess(true);

                await loadUserStickers();

                setTimeout(() => {
                    setSelectedImage(null);
                    setCroppedImage(null);
                    setIsCropping(false);
                    setOriginalFile(null);
                }, 3000);

                setTimeout(() => {
                    setIsSaveSuccess(false);
                }, 3000);

            } else {
                setErrorMessage(getErrorMessage(data, 'Error al guardar la calcomanía'));
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error guardando calcomanía:', error);
            setErrorMessage('Error de conexión al guardar la calcomanía');
            setIsLoading(false);
        }
    };

    const deleteSticker = async (id) => {
        if (!token) {
            setErrorMessage('Debe estar autenticado para eliminar calcomanías');
            return;
        }

        try {
            const response = await fetch(`https://accesoriosapolobackend.onrender.com/eliminar-calcomanias/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSavedStickers(prev => prev.filter(sticker => sticker.id !== id));
                setSuccessMessage(data.mensaje || 'Calcomanía eliminada exitosamente');

                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            } else {
                setErrorMessage(getErrorMessage(data, 'Error al eliminar la calcomanía'));
            }
        } catch (error) {
            console.error('Error eliminando calcomanía:', error);
            setErrorMessage('Error de conexión al eliminar la calcomanía');
        }
    };

    const clearStickerState = () => {
        setSelectedImage(null);
        setCroppedImage(null);
        setIsCropping(false);
        setOriginalFile(null);
        if (!isSaveSuccess) {
            clearMessages();
        }
    };

    const handleFileSelect = (file) => {
        setOriginalFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setSelectedImage(e.target.result);
            setCroppedImage(null);
            setIsCropping(false);
        };
        reader.readAsDataURL(file);
    };

    const calculateStickerPrice = (width, height) => {
        const PRECIO_POR_CM = 500;
        return (width * PRECIO_POR_CM) + (height * PRECIO_POR_CM);
    };

    const getSizeDimensions = (size) => {
        const sizes = {
            small: { width: 5, height: 5 },
            medium: { width: 7, height: 5 },
            large: { width: 9, height: 5 }
        };
        return sizes[size] || null;
    };

    const handleAddStickerToCart = async (sticker, sizeConfig) => {
        if (!token) {
            setErrorMessage('Debe estar autenticado para agregar al carrito');
            return false;
        }

        try {
            setIsLoading(true);

            const response = await fetch('https://accesoriosapolobackend.onrender.com/calcomanias/actualizar-y-agregar-carrito', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_calcomania: sticker.id,
                    tamano_x_nuevo: sizeConfig.width,
                    tamano_y_nuevo: sizeConfig.height
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Recargar el carrito desde el backend para obtener la información actualizada
                await loadCartFromBackend();

                setSuccessMessage('Calcomanía agregada al carrito exitosamente');
                setTimeout(() => setSuccessMessage(''), 3000);
                return true;
            } else {
                setErrorMessage(getErrorMessage(data, 'Error al agregar al carrito'));
                return false;
            }
        } catch (error) {
            console.error('Error agregando calcomanía al carrito:', error);
            setErrorMessage('Error de conexión al agregar al carrito');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <context.Provider value={{
            // Estados y funciones existentes
            cartProducts, setCartProducts,
            handleAddToCart, handleRemoveProduct, handleQuantityChange,
            name, setName,
            token, setToken,
            userLogin, setUserLogin,
            isLoading, setIsLoading,
            handleLogout,
            isWelcomeOpen, setIsWelcomeOpen,
            isIntermediateLoading, setIsIntermediateLoading,
            getErrorMessage,
            avatar, setAvatar,
            nameRol, setNameRol,
            validatePassword,
            isLoggingOut, setIsLoggingOut,
            normalizeText, updateStickerName,

            // Estados y funciones para Stickers
            savedStickers, setSavedStickers,
            selectedImage, setSelectedImage,
            croppedImage, setCroppedImage,
            isCropping, setIsCropping,
            originalFile, setOriginalFile,
            successMessage, setSuccessMessage,
            errorMessage, setErrorMessage,
            saveSticker,
            deleteSticker,
            clearStickerState,
            handleFileSelect,
            clearMessages,
            loadUserStickers,
            isSaveSuccess, setIsSaveSuccess,

            registerOpen, openRegister, closeRegister,
            loginOpen, openLogin, closeLogin,

            welcomeNoLoginOpen, openWelcomeNoLogin, closeWelcomeNoLogin,
            calculateStickerPrice, getSizeDimensions, handleAddStickerToCart,

            loadCartFromBackend

        }}>
            {children}
        </context.Provider>
    );
};