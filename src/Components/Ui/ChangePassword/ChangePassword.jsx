import { useState, useEffect, useContext } from "react";
import "./ChangePassword.css";
import { NavLink, useSearchParams, useNavigate } from "react-router-dom";
import { Logo } from "../Logo/Logo";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { context } from "../../../Context/Context.jsx"

export const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUserLogin } = useContext(context)

    const validatePassword = (password) => {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
        };
    };


    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            setMessage("Token inválido o ausente");
            setStatus("error");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("Las contraseñas no coinciden");
            setStatus("error");
            return;
        }

        setStatus("loading");
        setMessage("");

        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/cambiar-contrasena", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    nuevaContrasena: newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage("Contraseña actualizada correctamente. Redireccionando...");
                setUserLogin(null);
                setTimeout(() => navigate("/"), 2000);
            } else {
                setStatus("error");
                setMessage(data.mensaje || "Error al cambiar la contraseña.");
            }
        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            setStatus("error");
            setMessage("Error de red. Intenta de nuevo.");
        }
    };

    return (
        <div className="change-password-container">
            <div className="logo-back">
                <NavLink to="/">
                    <button className="back-btn">
                        <iconify-icon icon="fluent:ios-arrow-24-filled" className="arrow-back" />
                    </button>
                </NavLink>

                <div className="logo">
                    <Logo styleContainer="container-logo-reset" styleLogo="logo-reset-email" />
                </div>
            </div>

            <h2 className="title">Cambio de Contraseña</h2>
            <p className="subtitle">Escriba su nueva contraseña</p>

            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        Nueva Contraseña<span>*</span>
                    </label>
                    <div className="password-conditions">
                        {!validatePassword(newPassword).length && <p>○ Debe tener al menos 8 caracteres</p>}
                        {!validatePassword(newPassword).uppercase && <p>○ Debe contener una letra mayúscula</p>}
                        {!validatePassword(newPassword).number && <p>○ Debe contener al menos un número</p>}
                        {validatePassword(newPassword).length && validatePassword(newPassword).uppercase && validatePassword(newPassword).number && (
                            <p className="valid-password-change">Contraseña válida <i className="bi bi-check-circle"></i></p>
                        )}
                    </div>

                    <div className="input-container">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Nueva Contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={status === "loading" || status === "success"}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>
                        Confirmar Contraseña<span>*</span>
                    </label>
                    <div className="input-container">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirmar Contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={status === "loading" || status === "success"}
                        />
                        <div className="password-match">
                            {confirmPassword && confirmPassword !== newPassword && <p className="error-message">Las contraseñas no coinciden</p>}
                            {confirmPassword && confirmPassword === newPassword && <p className="valid-password-change">Contraseña válida <i className="bi bi-check-circle"></i></p>}
                        </div>
                    </div>
                </div>


                {status !== "idle" && (
                    <div className={`status-message ${status}`}>
                        {status === "loading" && (
                            <div className="status-content-loading">
                                <span>Restableciendo</span>
                                <img src={wheelIcon} alt="Cargando..." className="change-spinner" />
                            </div>
                        )}

                        {(status === "success" || status === "error") && (
                            <div className="status-content">
                                {status === "success" && (
                                    <>
                                        <span>{message}</span>
                                        <i className="bi bi-check-circle"></i>

                                    </>
                                )}
                                {status === "error" && (
                                    <>
                                        <span>{message}</span>
                                        <i className="bi bi-x-circle"></i>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {status === "idle" && (
                    <button type="submit" className="submit-btn-password">
                        Restablecer Contraseña
                    </button>
                )}
            </form>
        </div>
    );
};
