import React, { useState } from "react";
import "./RequestResetEmail.css";
import { useNavigate } from "react-router-dom";
import { Logo } from "../Logo/Logo";
import { NavLink } from "react-router-dom";

export const RequestResetEmail = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/recuperar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo: email })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.mensaje);

            } else {
                alert(data.mensaje);
            }
        } catch (error) {
            console.error('Error enviando solicitud de recuperación:', error);
            alert('Hubo un problema al enviar la solicitud. Intenta de nuevo.');
        }
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
                    <span onClick={() => navigate("/")}>Iniciar Sesión</span>
                </p>
            </div>
        </div>
    );
};
