import { createContext } from "react";
import { useState } from "react";

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

    // Estados para Stickers
    const [savedStickers, setSavedStickers] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [isCropping, setIsCropping] = useState(false);

    const handleAddToCart = (product) => {
        const existingProduct = cartProducts.find(p => p.id === product.id);
        if (existingProduct) {
            setCartProducts(cartProducts.map(p =>
                p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
            ));
        } else {
            setCartProducts([...cartProducts, { ...product, quantity: 1 }]);
        }
    };

    const handleRemoveProduct = (id) => {
        setCartProducts(cartProducts.filter(product => product.id !== id));
    };

    const handleQuantityChange = (id, quantity) => {
        setCartProducts(cartProducts.map(product =>
            product.id === id ? { ...product, quantity } : product
        ));
    };

    const handleLogout = () => {
        setName("");
        setToken("");
        setUserLogin(null);
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

    // Funciones para Stickers
    const saveSticker = () => {
        const imageToSave = croppedImage || selectedImage;
        if (imageToSave) {
            const newSticker = {
                id: Date.now(),
                image: imageToSave,
                name: `Calcomanía ${savedStickers.length + 1}`,
                createdAt: new Date().toLocaleDateString()
            };
            setSavedStickers(prev => [...prev, newSticker]);
            console.log('Calcomanía guardada exitosamente!');

            // Limpiar estado después de guardar
            setSelectedImage(null);
            setCroppedImage(null);
            setIsCropping(false);
        }
    };

    const deleteSticker = (id) => {
        setSavedStickers(prev => prev.filter(sticker => sticker.id !== id));
    };

    const clearStickerState = () => {
        setSelectedImage(null);
        setCroppedImage(null);
        setIsCropping(false);
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

            // Estados y funciones para Stickers
            savedStickers, setSavedStickers,
            selectedImage, setSelectedImage,
            croppedImage, setCroppedImage,
            isCropping, setIsCropping,
            saveSticker,
            deleteSticker,
            clearStickerState
        }}>
            {children}
        </context.Provider>
    );
}