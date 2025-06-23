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

    const [savedStickers, setSavedStickers] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [originalFile, setOriginalFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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

    const normalizeText = (text) =>
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const updateStickerName = (id, newName) => {
        setSavedStickers((prevStickers) =>
            prevStickers.map((sticker) =>
                sticker.id === id ? { ...sticker, name: newName } : sticker
            )
        );
    };

    const clearMessages = () => {
        setSuccessMessage('');
        setErrorMessage('');
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
        clearMessages();

        try {
            const formData = new FormData();

            const nombre = `Calcomanía ${savedStickers.length + 1}`;
            formData.append('nombre', nombre);

            let imageFile;
            if (originalFile && !croppedImage) {
                imageFile = originalFile;
            } else {
                const blob = dataURLtoBlob(imageToSave);
                imageFile = new File([blob], `${nombre}.png`, { type: 'image/png' });
            }

            formData.append('imagen', imageFile);

            const response = await fetch('https://accesoriosapolobackend.onrender.com/registrar-calcomania', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const newSticker = {
                    id: data.calcomania.id_calcomania,
                    image: imageToSave,
                    name: data.calcomania.nombre,
                    createdAt: new Date(data.calcomania.fecha_subida).toLocaleDateString(),
                    formato: data.calcomania.formato,
                    tamano_archivo: data.calcomania.tamano_archivo,
                    url_archivo: data.calcomania.url_archivo
                };

                setSavedStickers(prev => [...prev, newSticker]);
                setSuccessMessage('¡Calcomanía guardada exitosamente!');

                clearStickerState();

                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);

            } else {
                setErrorMessage(getErrorMessage(data, 'Error al guardar la calcomanía'));
            }
        } catch (error) {
            console.error('Error guardando calcomanía:', error);
            setErrorMessage('Error de conexión al guardar la calcomanía');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteSticker = (id) => {
        setSavedStickers(prev => prev.filter(sticker => sticker.id !== id));
    };

    const clearStickerState = () => {
        setSelectedImage(null);
        setCroppedImage(null);
        setIsCropping(false);
        setOriginalFile(null);
        clearMessages();
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
            clearMessages
        }}>
            {children}
        </context.Provider>
    );
}