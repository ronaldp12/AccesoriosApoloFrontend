import React, { useState, useContext, useRef, useEffect, use } from "react";
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
    const { setUserLogin, setToken, setName, isLoading, setIsLoading, setIsWelcomeOpen, 
    setIsIntermediateLoading } = useContext(context);
    const [userName, setUserName] = useState("");

    const navigate = useNavigate();

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
                    type: "icon",
                    theme: "filled-blue",
                    size: "medium",
                    shape: "circle",
                }
            );
        }
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

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
                alert(data.mensaje);
            }
        } catch (error) {
            console.error("Error al registrar:", error);
            alert("Hubo un error al registrar el usuario.");
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

                localStorage.setItem("token", data.token);
                localStorage.setItem("usuarioLogueado", data.usuario.nombre);

                onClose();

                setTimeout(() =>{
                    setIsIntermediateLoading(true)
                }, 800 )

                setTimeout(() => {
                    setIsIntermediateLoading(false)
                    setIsWelcomeOpen(true);
                    setIsLoading(false);
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
            <div className={`modal-box ${isOpen ? "active" : ""}`}>
                <button className="close-btn" onClick={onClose}>×</button>

                <div className="modal-form-container">
                    <h2>REGÍSTRATE</h2>
                    <form onSubmit={handleRegister}>
                        <div className="input-group-register">
                            <div className="input-field">
                                <label>Nombre *</label>
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    required
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                            <div className="input-field">
                                <label>Teléfono *</label>
                                <input
                                    type="tel"
                                    placeholder="Teléfono"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="input-group-register">
                            <div className="input-field">
                                <label>Correo *</label>
                                <input
                                    type="email"
                                    placeholder="example@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="input-field">
                                <label>Contraseña *</label>
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="group-bottom">
                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? (
                                    <img src={wheelIcon} alt="Cargando..." className="spinner" />
                                ) : (
                                    <span>Registrarse</span>
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
