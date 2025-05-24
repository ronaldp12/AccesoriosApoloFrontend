import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { context } from "../../Context/Context.jsx";

export const ProtectedRouteClient = ({ children }) => {
    const { nameRol, token } = useContext(context);

    if (!token) {
        return <Navigate to="/" />;
    }

    if (nameRol === "gerente") {
        return <Navigate to="/dashboard" />;
    }

    return children;
};
