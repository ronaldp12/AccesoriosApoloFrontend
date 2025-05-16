import React, { useState, useContext } from "react";
import "./RegisterModal.css";
import iconGoogle from "../../../assets/icons/google.png";
import iconFacebook from "../../../assets/icons/facebook.png";
import { context } from "../../../Context/Context.jsx";
import { useNavigate } from "react-router-dom";

export const RegisterModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState("");
    const {name, setName } = useContext(context);
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true); 

        const requestData = {
            nombre: name,
            correo: email,
            telefono: phone,
            contrasena: password,
            id_rol: "user"
        };

        try {
            const response = await fetch("http://localhost:3000/solicitar-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (response.ok) {
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
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
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
                                {isLoading ? <span className="spinner"></span> : <span>Registrarse</span>}
                            </button>

                            <div className="divider">o</div>

                            <div className="social-icons">
                                <button type="button" className="social facebook">
                                    <img src={iconFacebook} alt="facebook" />
                                </button>
                                <span className="divider-vertical"></span>
                                <button type="button" className="social google">
                                    <img src={iconGoogle} alt="google" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
