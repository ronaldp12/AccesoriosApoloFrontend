import React, { useContext, useState, useEffect, useRef } from "react";
import "./LoginModal.css";
import { context } from "../../../Context/Context.jsx";
import { useNavigate } from "react-router-dom";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import iconFacebook from "../../../assets/icons/facebook.png"

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const { setUserLogin, setToken, setName } = useContext(context);
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const navigate = useNavigate();
    const { isLoading, setIsLoading, setIsIntermediateLoading, setIsWelcomeOpen} = useContext(context);

    const googleButtonRef = useRef(null);

    useEffect(() => {
        if (window.google && googleButtonRef.current) {
            google.accounts.id.initialize({
                client_id: "840678013716-n8jnouejj8trv0h6t0968vnohsamo9dq.apps.googleusercontent.com",
                callback: handleGoogleResponse,
            });
            google.accounts.id.renderButton(
                googleButtonRef.current,
                {
                    type: "standard",
                    theme: "filled-blue",
                    size: "medium",
                    shape: "circle",
                }
            );
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, contrasena }),
            });

            const data = await response.json();

            if (response.ok) {
                setUserLogin(data.usuario.nombre);
                setToken(data.token);
                setName(data.usuario.nombre);

                localStorage.setItem("token", data.token);
                localStorage.setItem("usuarioLogueado", data.usuario.nombre);

                setTimeout(() => {
                    setIsLoading(false);
                    onClose();
                    onLoginSuccess();
                }, 1000);
                
            } else {
                alert(data.mensaje);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error en login:", error);
            alert("Hubo un error al iniciar sesión");
            setIsLoading(false);
        }
    };

    const handleGoogleResponse = async (response) => {
        const token = response.credential;

        try {
            const res = await fetch("http://localhost:3000/login-google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();

            if (res.ok) {
                setUserLogin(data.usuario.nombre);
                setToken(data.token);
                setName(data.usuario.nombre);

                localStorage.setItem("token", data.token);
                localStorage.setItem("usuarioLogueado", data.usuario.nombre);

                onClose();
                setIsIntermediateLoading(true);

                setTimeout(() => {
                    setIsIntermediateLoading(false);
                    setIsWelcomeOpen(true)
                }, 1000);

            } else {
                alert(data.mensaje || "Error al iniciar sesión con Google");
            }
        } catch (error) {
            console.error("Error al autenticar con backend:", error);
            alert("Error de red");
        }
    };

    return (
        <div className={`modal-overlay ${isOpen ? "active" : ""}`}>
            <div className={`login-modal-box ${isOpen ? "active" : ""}`}>
                <button className="close-btn" onClick={onClose}>
                    ×
                </button>

                <div className="modal-form-container">
                    <h2>INICIAR SESIÓN</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <div className="input-field">
                                <label>Correo *</label>
                                <input
                                    type="email"
                                    placeholder="example@example.com"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-field">
                                <label>Contraseña *</label>
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={contrasena}
                                    onChange={(e) => setContrasena(e.target.value)}
                                    required
                                />
                                <u onClick={() => navigate("/request-email")} style={{ cursor: "pointer" }}>
                                    ¿Olvidaste tu contraseña?
                                </u>
                            </div>
                        </div>

                        <div className="group-bottom">
                            <button type="submit" className="submit-btn">
                                {isLoading ? (
                                    <img src={wheelIcon} alt="Cargando..." className="login-spinner" />
                                ) : (
                                    <span>Iniciar sesión</span>
                                )}
                            </button>

                            <div className="divider">o</div>

                            <div className="social-icons">

                                <button type="button" className="social facebook">
                                    <img src={iconFacebook} alt="facebook" />
                                </button>

                                <span className="divider-vertical"></span>


                                <div ref={googleButtonRef}></div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
