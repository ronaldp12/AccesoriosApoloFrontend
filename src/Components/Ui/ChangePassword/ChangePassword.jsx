import { useState, useEffect } from "react";
import "./ChangePassword.css";
import { NavLink, useSearchParams, useNavigate } from "react-router-dom";
import { Logo } from "../Logo/Logo";

export const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            alert("Token inválido o ausente");
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/cambiar-contrasena", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    nuevaContrasena: newPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Contraseña actualizada correctamente");
                navigate("/"); 
            } else {
                alert(data.mensaje || "Error al cambiar la contraseña");
            }
        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            alert("Error de red");
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
                    <Logo />
                </div>
            </div>

            <h2 className="title">Cambio de Contraseña</h2>
            <p className="subtitle">Escriba su nueva contraseña</p>

            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nueva Contraseña<span>*</span></label>
                    <div className="input-container">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Nueva Contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Confirmar Contraseña<span>*</span></label>
                    <div className="input-container">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirmar Contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn-password">
                    Restablecer Contraseña
                </button>
            </form>
        </div>
    );
};
