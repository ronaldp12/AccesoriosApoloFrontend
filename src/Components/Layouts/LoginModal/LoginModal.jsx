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
    const { isLoading, setIsLoading, setIsIntermediateLoading, setIsWelcomeOpen, getErrorMessage,
        setAvatar, setNameRol, nameRol } = useContext(context);
    const [errorMessage, setErrorMessage] = useState("");

    const googleButtonRef = useRef(null);

    useEffect(() => {
        if (window.google && googleButtonRef.current) {
            google.accounts.id.initialize({
                client_id: "230268662322-ir35oged9meek539n1ipa77pjtl4f4lg.apps.googleusercontent.com",
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
            const response = await fetch("https://accesoriosapolobackend.onrender.com/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, contrasena }),
            });

            const data = await response.json();

            if (response.ok) {
                setUserLogin(data.usuario.nombre);
                setToken(data.token);
                setName(data.usuario.nombre);
                setNameRol(data.usuario.nombreRol);

                setAvatar(null)
                localStorage.removeItem("avatar")
                localStorage.setItem("token", data.token);
                localStorage.setItem("usuarioLogueado", data.usuario.nombre);
                localStorage.setItem("nameRol", data.usuario.nombreRol);
                console.log("Rol del usuario:", data.usuario.nombreRol);

                const validateGerente = await fetch("https://accesoriosapolobackend.onrender.com/validar-gerente", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${data.token}`,
                    },
                });

                const gerenteData = await validateGerente.json();

                setIsLoading(false);
                onClose();
                const rol = Array.isArray(gerenteData.nombreRol) ? gerenteData.nombreRol[0] : gerenteData.nombreRol;
            
                setNameRol(rol);
                localStorage.setItem("nameRol", rol);
                console.log("Rol del usuario:", rol);

                if (gerenteData.esGerente || rol === "vendedor") {
                    navigate("/dashboard");

                } else {
                    onLoginSuccess();
                }

            } else {
                setErrorMessage(getErrorMessage(data, "Error al iniciar sesión."));
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error en login:", error);
            setErrorMessage("Hubo un error al iniciar sesión");
            setIsLoading(false);
        }
    };


    const handleGoogleResponse = async (response) => {
        const token = response.credential;

        try {
            const res = await fetch("https://accesoriosapolobackend.onrender.com/login-google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();

            if (res.ok) {
                setUserLogin(data.usuario.nombre);
                setToken(data.token);
                setName(data.usuario.nombre);
                setAvatar(data.usuario.foto || null);

                localStorage.setItem("token", data.token);
                localStorage.setItem("usuarioLogueado", data.usuario.nombre);
                localStorage.setItem("avatar", data.usuario.foto);

                const validateGerente = await fetch("https://accesoriosapolobackend.onrender.com/validar-gerente", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${data.token}`,
                    },
                });

                if (!validateGerente.ok) {
                    const errorText = await validateGerente.text();
                    console.error("Error al validar gerente:", errorText);
                }

                const gerenteData = await validateGerente.json();

                onClose();

                const rol = Array.isArray(gerenteData.nombreRol) ? gerenteData.nombreRol[0] : gerenteData.nombreRol;

                    setNameRol(rol);
                    localStorage.setItem("nameRol", rol);

                if (gerenteData.esGerente) {
                    navigate("/dashboard");

                } else {
                    setIsIntermediateLoading(true);
                    setTimeout(() => {
                        setIsIntermediateLoading(false);
                        setIsWelcomeOpen(true);
                    }, 1000);
                }
            }
            else {
                setErrorMessage(getErrorMessage(data, "Error al iniciar sesión con Google"));
            }
        } catch (error) {
            console.error("Error al autenticar con backend:", error);
            setErrorMessage("Error de red");
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
                                    onChange={(e) => {
                                        setCorreo(e.target.value)
                                        setErrorMessage("")
                                    }}
                                    required
                                />
                            </div>
                            <div className="input-field">
                                <label>Contraseña *</label>
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={contrasena}
                                    onChange={(e) => {
                                        setContrasena(e.target.value)
                                        setErrorMessage("")
                                    }}
                                    required
                                />
                                <u onClick={() => {
                                    onClose();
                                    navigate("/request-email")
                                }} style={{ cursor: "pointer" }}>
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

                            {errorMessage && (
                                <div className="status-message error">
                                    <span>{errorMessage}</span>
                                    <i className="bi bi-x-circle"></i>
                                </div>
                            )}

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
