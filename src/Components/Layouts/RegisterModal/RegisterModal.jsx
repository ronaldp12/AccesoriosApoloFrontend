import React from "react";
import "./RegisterModal.css";
import iconGoogle from "../../../assets/icons/google.png";
import iconFacebook from "../../../assets/icons/facebook.png";

export const RegisterModal = ({ isOpen, onClose }) => {
    return (
        <div className={`modal-overlay ${isOpen ? "active" : ""}`}>
            <div className={`modal-box ${isOpen ? "active" : ""}`}>
                <button className="close-btn" onClick={onClose}>×</button>

                <div className="modal-form-container">
                    <h2>REGISTRATE</h2>
                    <form>
                        <div className="input-group">
                            <div className="input-field">
                                <label>Nombre *</label>
                                <input type="text" placeholder="Nombre" required />
                            </div>
                            <div className="input-field">
                                <label>Teléfono *</label>
                                <input type="tel" placeholder="Teléfono" required />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-field">
                                <label>Correo *</label>
                                <input type="email" placeholder="example@example.com" required />
                            </div>
                            <div className="input-field">
                                <label>Contraseña *</label>
                                <input type="password" placeholder="Contraseña" required />
                            </div>
                        </div>

                        <div className="group-bottom">
                            <button type="submit" className="submit-btn">
                                <span>Registrarse</span>
                            </button>

                            <div className="divider">o</div>

                            <div className="social-icons">
                                <button type="button" className="social facebook"><img src={iconFacebook} alt="facebook" /></button>
                                <span className="divider-vertical"></span>
                                <button type="button" className="social google"><img src={iconGoogle} alt="google" /></button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
