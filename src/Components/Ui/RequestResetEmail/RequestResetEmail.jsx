import React, { useState } from "react";
import "./RequestResetEmail.css";
import { useNavigate } from "react-router-dom";
import { Logo } from "../Logo/Logo";
import { NavLink } from "react-router-dom";

export const RequestResetEmail = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Aquí iría la lógica para enviar correo al backend
        alert(`Se ha enviado un enlace de recuperación a: ${email}`);
    };

    return (
        <div className="reset-email-container">
            <div className="reset-email-header">
                <NavLink to="/">
                    <button className="back-btn">
                        <iconify-icon icon="fluent:ios-arrow-24-filled" className="arrow-back" />
                    </button>
                </NavLink>

                <Logo />
            </div>

            <h2 className="reset-email-title">Recuperar Contraseña</h2>
            <p className="reset-email-subtitle">
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <form onSubmit={handleSubmit} className="reset-email-form">
                <div className="input-field">
                    <label>Correo electrónico <span>*</span></label>
                    <input
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <small>Reenviar correo en 30 segundos</small>
                </div>

                <button type="submit" className="reset-email-btn">Enviar</button>
            </form>

            <div className="reset-email-bottom">
                <p>
                    ¿Recordaste tu contraseña?{" "}
                    <span onClick={() => navigate("/login")}>Iniciar Sesión</span>
                </p>
            </div>
        </div>
    );
};
