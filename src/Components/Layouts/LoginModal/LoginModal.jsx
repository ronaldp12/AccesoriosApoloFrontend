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
    const { setIsIntermediateLoading, setIsWelcomeOpen, getErrorMessage,
        setAvatar, setNameRol, nameRol } = useContext(context);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const googleButtonRef = useRef(null);

    const titleRef = useRef(null);
    const formRef = useRef(null);
    const inputGroupRef = useRef(null);
    const bottomGroupRef = useRef(null);

    const initializeGoogleSignIn = () => {
        if (window.google && googleButtonRef.current) {
            try {
                window.google.accounts.id.initialize({
                    client_id: "230268662322-ir35oged9meek539n1ipa77pjtl4f4lg.apps.googleusercontent.com",
                    callback: handleGoogleResponse,
                });

                window.google.accounts.id.renderButton(
                    googleButtonRef.current,
                    {
                        type: "icon",
                        theme: "filled_blue",
                        size: "big",
                        shape: "circle",
                    }
                );
                console.log("Google Sign-In inicializado correctamente");
            } catch (error) {
                console.error("Error al inicializar Google Sign-In:", error);
            }
        }
    };

    const checkGoogleAvailability = () => {
        let attempts = 0;
        const maxAttempts = 50;

        const checkInterval = setInterval(() => {
            attempts++;

            if (window.google && window.google.accounts) {
                clearInterval(checkInterval);
                initializeGoogleSignIn();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.error("Google Sign-In no se pudo cargar después de 5 segundos");
            }
        }, 100);
    };

    const animateElements = () => {
        if (!isOpen) return;

        const elements = [titleRef.current, formRef.current, inputGroupRef.current, bottomGroupRef.current];
        elements.forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease';
            }
        });

        setTimeout(() => {
            if (titleRef.current) {
                titleRef.current.style.opacity = '1';
                titleRef.current.style.transform = 'translateY(0)';
            }
        }, 200);

        setTimeout(() => {
            if (formRef.current) {
                formRef.current.style.opacity = '1';
                formRef.current.style.transform = 'translateY(0)';
            }
        }, 300);

        setTimeout(() => {
            if (inputGroupRef.current) {
                inputGroupRef.current.style.opacity = '1';
                inputGroupRef.current.style.transform = 'translateY(0)';
            }
        }, 400);

        setTimeout(() => {
            if (bottomGroupRef.current) {
                bottomGroupRef.current.style.opacity = '1';
                bottomGroupRef.current.style.transform = 'translateY(0)';
            }
        }, 600);
    };

    useEffect(() => {
        if (isOpen) {
            if (googleButtonRef.current) {
                googleButtonRef.current.innerHTML = '';
            }

            checkGoogleAvailability();

            setTimeout(() => {
                animateElements();
            }, 100);
        }
    }, [isOpen]);

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
        <div id="loginModal" className={`modal-overlay ${isOpen ? "active" : ""}`}>
            <div className={`login-modal-box ${isOpen ? "active" : ""}`}>
                <button className="login-close-btn" onClick={onClose}>
                    ×
                </button>

                <div className="login-form-container">
                    <h2 ref={titleRef}>INICIAR SESIÓN</h2>
                    <form ref={formRef} className="login-form" onSubmit={handleSubmit}>
                        <div ref={inputGroupRef} className="login-input-group">
                            <div className="login-input-field">
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
                            <div className="login-input-field">
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

                        <div ref={bottomGroupRef} className="login-group-bottom">
                            <button type="submit" className="login-submit-btn">
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

                            <div className="login-divider">o</div>

                            <div className="login-social-icons">
                                <button type="button" className="social facebook">
                                    <img src={iconFacebook} alt="facebook" />
                                </button>

                                <span className="divider-vertical"></span>

                                <div ref={googleButtonRef} id="google-signin-button">
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        color: '#666'
                                    }}>
                                        G
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};