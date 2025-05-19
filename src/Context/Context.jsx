import { createContext } from "react";
import { useState } from "react";

export const context = createContext();

export const Provider = ({ children }) => {

    const [cartProducts, setCartProducts] = useState([]);
    const [name, setName] = useState(localStorage.getItem("usuarioLogueado") || "");
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [userLogin, setUserLogin] = useState(localStorage.getItem("usuarioLogueado") || null);

    const [isLoading, setIsLoading] = useState(false);

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
    };


    return (
        <context.Provider value={{

            cartProducts,
            setCartProducts,
            handleAddToCart,
            handleRemoveProduct,
            handleQuantityChange,
            name,
            setName,
            token,
            setToken,
            userLogin,
            setUserLogin,
            isLoading,
            setIsLoading,
            handleLogout

        }}>
            {children}
        </context.Provider>
    );
}

