import React, { useState, useContext, useRef, useEffect } from "react";
import "./RegisterModal.css";
import iconGoogle from "../../../assets/icons/google.png";
import iconFacebook from "../../../assets/icons/facebook.png";
import { context } from "../../../Context/Context.jsx";
import { useNavigate } from "react-router-dom";
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const RegisterModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [animationStep, setAnimationStep] = useState(0);

    const { setUserLogin, setToken, setName, setIsWelcomeOpen,
        setIsIntermediateLoading, getErrorMessage, setAvatar, validatePassword, setNameRol } = useContext(context);
    const [userName, setUserName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const googleButtonRef = useRef(null);

    const modalRef = useRef(null);
    const titleRef = useRef(null);
    const formRef = useRef(null);
    const bottomGroupRef = useRef(null);
    const socialIconsRef = useRef(null);

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
                        type: "standard",
                        theme: "filled_blue",
                        size: "big",
                        shape: "circle",
                    }
                );
                console.log("Google Sign-In inicializado correctamente en RegisterModal");
            } catch (error) {
                console.error("Error al inicializar Google Sign-In en RegisterModal:", error);
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
                console.error("Google Sign-In no se pudo cargar después de 5 segundos en RegisterModal");
            }
        }, 100);
    };

    const animateElements = () => {
        if (!isOpen || !modalRef.current) return;

        const elements = [
            modalRef.current.querySelector('h2'),
            modalRef.current.querySelector('form'),
            modalRef.current.querySelector('.group-bottom'),
            modalRef.current.querySelector('.social-icons')
        ].filter(Boolean);

        elements.forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease';
            }
        });

        // Animar elementos uno por uno
        setTimeout(() => {
            const title = modalRef.current?.querySelector('h2');
            if (title) {
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            }
        }, 200);

        setTimeout(() => {
            const form = modalRef.current?.querySelector('form');
            if (form) {
                form.style.opacity = '1';
                form.style.transform = 'translateY(0)';
            }
        }, 400);

        setTimeout(() => {
            const bottomGroup = modalRef.current?.querySelector('.group-bottom');
            if (bottomGroup) {
                bottomGroup.style.opacity = '1';
                bottomGroup.style.transform = 'translateY(0)';
            }
        }, 600);

        setTimeout(() => {
            const socialIcons = modalRef.current?.querySelector('.social-icons');
            if (socialIcons) {
                socialIcons.style.opacity = '1';
                socialIcons.style.transform = 'translateY(0)';
            }
        }, 800);
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

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!userName || !email || !phone || !password) {
            setErrorMessage("Por favor completa todos los campos obligatorios.");
            setIsLoading(false);
            return;
        }

        if (phone.length !== 10) {
            setErrorMessage("El número de teléfono debe tener 10 dígitos.");
            setIsLoading(false);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrorMessage("Por favor ingresa un correo válido.");
            setIsLoading(false);
            return;
        }

        const requestData = {
            nombre: userName,
            correo: email,
            telefono: phone,
            contrasena: password,
            id_rol: "user"
        };

        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/solicitar-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (response.ok) {
                setName(userName)

                onClose();
                navigate(`/verify-account?email=${encodeURIComponent(email)}`);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al registrar."));
            }
        } catch (error) {
            console.error("Error al registrar:", error);
            setErrorMessage("Hubo un error al registrar el usuario.");
        } finally {
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

                if (gerenteData.esGerente || rol === "vendedor") {
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

    const handleCloseModal = () => {
        setErrorMessage("");
        setUserName("");
        setEmail("");
        setPhone("");
        setPassword("");
        onClose();
    };


    return (
        <div className={`modal-overlay ${isOpen ? "active" : ""}`}>
            <div
                ref={modalRef}
                className={`modal-box ${isOpen ? "active" : ""}`}
            >
                <button className="close-btn-register-modal" onClick={handleCloseModal}>×</button>

                <div className="modal-form-container">
                    <h2 ref={titleRef}>REGÍSTRATE</h2>
                    <form ref={formRef} onSubmit={handleRegister}>
                        <div className="input-group-register">
                            <div className="input-field">
                                <label>Nombre *</label>
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={userName}
                                    onChange={(e) => {
                                        setUserName(e.target.value)
                                        setErrorMessage("");
                                    }}
                                />
                            </div>
                            <div className="input-field">
                                <label>Teléfono *</label>
                                <input
                                    type="tel"
                                    placeholder="Teléfono"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={phone}
                                    onChange={(e) => {
                                        const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 10);
                                        setPhone(onlyNumbers);
                                        setErrorMessage("");
                                    }}
                                />

                            </div>
                        </div>

                        <div className="input-group-register">
                            <div className="input-field">
                                <label>Correo *</label>
                                <input
                                    type="text"
                                    placeholder="example@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setErrorMessage("");
                                    }}
                                />
                            </div>

                            <div className="input-field">
                                <label>Contraseña *</label>
                                <div className={`password-conditions-register-modal ${isPasswordFocused ? 'visible' : ''}`}>
                                    {!validatePassword(password).length && <p>○ Debe tener al menos 8 caracteres</p>}
                                    {!validatePassword(password).uppercase && <p>○ Debe contener una letra mayúscula</p>}
                                    {!validatePassword(password).number && <p>○ Debe contener al menos un número</p>}
                                    {validatePassword(password).length && validatePassword(password).uppercase && validatePassword(password).number && (
                                        <p className="valid-password-change">Contraseña válida <i className="bi bi-check-circle"></i></p>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setErrorMessage("");
                                    }}
                                />
                            </div>
                        </div>

                        <div ref={bottomGroupRef} className="group-bottom">
                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? (
                                    <img src={wheelIcon} alt="Cargando..." className="spinner" />
                                ) : (
                                    <span>Registrarse</span>
                                )}
                            </button>

                            {errorMessage && (
                                <div className="status-message error">
                                    <span>{errorMessage}</span>
                                    <i className="bi bi-x-circle"></i>
                                </div>
                            )}

                            <div className="divider">o</div>

                            <div ref={socialIconsRef} className="social-icons">

                                <div ref={googleButtonRef} id="google-signin-button-register">
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