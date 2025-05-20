import { useState } from "react";
import "./ChangePassword.css";
import { NavLink } from "react-router-dom";
import { Logo } from "../Logo/Logo";

export const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
        console.log("Contraseña cambiada:", newPassword);
    };

    return (
        <div className="change-password-container">
            <div className="logo-back">
                <NavLink to="/">
                    <button className="back-btn">
                        <iconify-icon icon="fluent:ios-arrow-24-filled" className="arrow-back" />
                    </button>
                </NavLink>

                <div className="logo">
                    <Logo />
                </div>
            </div>

            <h2 className="title">Cambio de Contraseña</h2>
            <p className="subtitle">Escriba su nueva contraseña</p>

            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nueva Contraseña<span>*</span></label>
                    <div className="input-container">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Nueva Contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Confirmar Contraseña<span>*</span></label>
                    <div className="input-container">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirmar Contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn-password">
                    Restablecer Contraseña
                </button>
            </form>
        </div>
    );
};
