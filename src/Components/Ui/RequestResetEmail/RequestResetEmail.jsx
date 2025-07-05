import React, { useState, useContext, useEffect, useRef } from "react";
import "./RequestResetEmail.css";
import { useNavigate, NavLink } from "react-router-dom";
import { Logo } from "../Logo/Logo";
import { context } from "../../../Context/Context.jsx";
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const RequestResetEmail = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle");
    const navigate = useNavigate();
    const { isLoading, setIsLoading } = useContext(context);

    const headerRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const formRef = useRef(null);
    const bottomRef = useRef(null);

    const animateElements = () => {
        const elements = [
            headerRef.current,
            titleRef.current,
            subtitleRef.current,
            formRef.current,
            bottomRef.current,
        ];

        elements.forEach((el) => {
            if (el) {
                el.style.opacity = "0";
                el.style.transform = "translateY(30px)";
                el.style.transition = "all 0.6s ease";
            }
        });

        setTimeout(() => {
            headerRef.current.style.opacity = "1";
            headerRef.current.style.transform = "translateY(0)";
        }, 100);

        setTimeout(() => {
            titleRef.current.style.opacity = "1";
            titleRef.current.style.transform = "translateY(0)";
        }, 200);

        setTimeout(() => {
            subtitleRef.current.style.opacity = "1";
            subtitleRef.current.style.transform = "translateY(0)";
        }, 300);

        setTimeout(() => {
            formRef.current.style.opacity = "1";
            formRef.current.style.transform = "translateY(0)";
        }, 400);

        setTimeout(() => {
            bottomRef.current.style.opacity = "1";
            bottomRef.current.style.transform = "translateY(0)";
        }, 500);
    };

    useEffect(() => {
        animateElements();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus("loading");

        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/recuperar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo: email }),
            });

            const data = await response.json();

            if (response.ok) {
                setTimeout(() => {
                    setIsLoading(false);
                    setStatus("success");
                }, 1000);
            } else {
                alert(data.mensaje);
                setIsLoading(false);
                setStatus("error");
            }
        } catch (error) {
            console.error("Error enviando solicitud de recuperación:", error);
            alert("Hubo un problema al enviar la solicitud. Intenta de nuevo.");
            setIsLoading(false);
            setStatus("error");
        }
    };

    return (
        <div className="reset-email-container">
            <div ref={headerRef} className="reset-email-header">
                <NavLink to="/">
                    <button className="back-btn">
                        <iconify-icon icon="fluent:ios-arrow-24-filled" className="arrow-back" />
                    </button>
                </NavLink>
                <Logo styleContainer="container-logo-reset" styleLogo="logo-reset-email" />
            </div>

            <h2 ref={titleRef} className="reset-email-title">Recuperar Contraseña</h2>
            <p ref={subtitleRef} className="reset-email-subtitle">
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <form ref={formRef} onSubmit={handleSubmit} className="reset-email-form">
                <div className="input-field-reset-email">
                    <label>
                        Correo electrónico <span>*</span>
                    </label>
                    <input
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={status === "loading" || status === "success"}
                    />
                    <small>Reenviar correo en 30 segundos</small>
                </div>

                {(status !== "idle") && (
                    <div className="reset-email-message">
                        {status === "loading" && (
                            <div className="status-content-loading">
                                <span>Enviando</span>
                                <img src={wheelIcon} alt="Cargando..." className="reset-spinner" />
                            </div>
                        )}

                        {status === "success" && (
                            <div className="status-content-request">
                                <p>
                                    Te hemos enviado un correo con instrucciones para restablecer contraseña.
                                </p>
                                <div className="status-content-success">
                                    <span>Enviado</span>
                                    <i className="bi bi-check-circle"></i>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {status === "idle" && (
                    <button type="submit" className="reset-email-btn">
                        Enviar
                    </button>
                )}
            </form>

            <div ref={bottomRef} className="reset-email-bottom">
                <p>
                    ¿Recordaste tu contraseña?{" "}
                    <span onClick={() => navigate("/")}>Iniciar Sesión</span>
                </p>
            </div>
        </div>
    );
};
