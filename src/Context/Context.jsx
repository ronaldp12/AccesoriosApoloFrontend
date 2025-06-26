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

    useEffect(() => {
        if (token && userLogin) {
            loadUserStickers();
        }
    }, [token, userLogin]);

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
        setSavedStickers([]);
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

            const response = await fetch('https://accesoriosapolobackend.onrender.com/registrar-calcomania', {
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

            welcomeNoLoginOpen, openWelcomeNoLogin, closeWelcomeNoLogin
        }}>
            {children}
        </context.Provider>
    );
}