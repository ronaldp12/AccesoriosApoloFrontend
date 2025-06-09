import React, { useState, useEffect, useContext } from "react";
import "./UpdateUserModal.css";
import { context } from "../../../Context/Context.jsx";
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const UpdateUserModal = ({ isOpen, onClose, usuario, onUpdateSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading, validatePassword } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");
    const [showPasswordValidation, setShowPasswordValidation] = useState(false);
    const [sendPasswordByEmail, setSendPasswordByEmail] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        telefono: "",
        cedula: "",
        rol: "",
        contrasena: "",
    });

    useEffect(() => {
        if (usuario) {
            setFormData({
                nombre: usuario.nombre || "",
                correo: usuario.correo || "",
                telefono: usuario.telefono || "",
                cedula: usuario.cedula || "",
                rol: usuario.rol || "",
                contrasena: "",
            });
        }
    }, [usuario]);

    useEffect(() => {
        if (isOpen) {
            clearMessages();
        }
    }, [isOpen]);

    const clearMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
        setShowPasswordValidation(false);
        setSendPasswordByEmail(false);
        setIsLoading(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleRoleChange = (e) => {
        const newRole = e.target.value;
        setFormData({ ...formData, rol: newRole, contrasena: "" });
        setShowPasswordValidation(false);
        setSendPasswordByEmail(false);
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handlePasswordFocus = () => {
        setShowPasswordValidation(true);
    };

    const handlePasswordBlur = () => {
        setShowPasswordValidation(false);
    };

    const handlePasswordChange = (e) => {
        setFormData({ ...formData, contrasena: e.target.value });
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleCheckboxChange = (e) => {
        setSendPasswordByEmail(e.target.checked);
        setErrorMessage("");
        setSuccessMessage("");
    };

    const isPasswordValid = () => {
        const validation = validatePassword(formData.contrasena || '');
        return validation.length && validation.uppercase && validation.number;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(""); 
        setSuccessMessage("");

        if (formData.telefono.length !== 10) {
            setErrorMessage("El número de teléfono debe tener 10 dígitos.");
            setIsLoading(false);
            return;
        }

        if ((formData.rol === 'vendedor' || formData.rol === 'gerente') && formData.contrasena) {
            if (!isPasswordValid()) {
                setErrorMessage("La contraseña no cumple con los requisitos.");
                setIsLoading(false);
                return;
            }
        }

        try {
            const token = localStorage.getItem("token");
            const dataToSend = {
                correoOriginal: usuario.correo,
                ...formData,
            };

            if (formData.rol === 'cliente' && sendPasswordByEmail) {
                dataToSend.enviarContrasena = true;
                delete dataToSend.contrasena;
            }

            const response = await fetch("https://accesoriosapolobackend.onrender.com/actualizar-usuario", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();
            if (data.success) {
                let successMsg = "Usuario actualizado con éxito.";
                if (formData.rol === 'cliente' && sendPasswordByEmail) {
                    successMsg += " Se ha enviado una contraseña temporal al correo.";
                }
                setSuccessMessage(successMsg);
                setIsLoading(false);

                if (onUpdateSuccess) onUpdateSuccess();

                setTimeout(() => {
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al actualizar usuario."));
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            setErrorMessage("Hubo un error al actualizar usuario.");
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            clearMessages();
            onClose();
        }, 400);
    };

    if (!isOpen && !isClosing) return null;

    return (
        <div className="modal-overlay-update-user">
            <div className={`modal-content-update-user ${isClosing ? "exit" : "entry"}`}>
                <h2>Editar Usuario</h2>
                <form className="form-update-user" onSubmit={handleSubmit}>
                    <div className="group-update-user">
                        <div className="form-group-update-user">
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group-update-user">
                            <label>Selecciona el rol</label>
                            <select name="rol" value={formData.rol} onChange={handleRoleChange} required>
                                <option value="">Rol</option>
                                <option value="cliente">Cliente</option>
                                <option value="gerente">Gerente</option>
                                <option value="vendedor">Vendedor</option>
                            </select>
                        </div>
                    </div>

                    <div className="group-update-user">
                        <div className="form-group-update-user">
                            <label>Cédula</label>
                            <input
                                type="text"
                                name="cedula"
                                value={formData.cedula}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group-update-user">
                            <label>Teléfono</label>
                            <input
                                type="tel"
                                name="telefono"
                                placeholder="Teléfono"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={formData.telefono}
                                onChange={(e) => {
                                    const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 10);
                                    setFormData((prev) => ({ ...prev, telefono: onlyNumbers }));
                                    setErrorMessage("");
                                    setSuccessMessage("");
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group-full">
                        <label>Correo</label>
                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {formData.rol === 'cliente' && (
                        <div className="form-group-full">
                            <div className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id="sendPasswordEmail"
                                    checked={sendPasswordByEmail}
                                    onChange={handleCheckboxChange}
                                />
                                <label htmlFor="sendPasswordEmail">
                                    Enviar contraseña temporal al correo (el usuario podrá cambiarla desde su perfil)
                                </label>
                            </div>
                        </div>
                    )}

                    {(formData.rol === 'vendedor' || formData.rol === 'gerente') && (
                        <div className="form-group-full">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                name="contrasena"
                                value={formData.contrasena}
                                onChange={handlePasswordChange}
                                onFocus={handlePasswordFocus}
                                onBlur={handlePasswordBlur}
                                placeholder="Nueva contraseña (opcional)"
                            />

                            {showPasswordValidation && (
                                <div className="password-conditions">
                                    {!validatePassword(formData.contrasena || '').length && <p>○ Debe tener al menos 8 caracteres</p>}
                                    {!validatePassword(formData.contrasena || '').uppercase && <p>○ Debe contener una letra mayúscula</p>}
                                    {!validatePassword(formData.contrasena || '').number && <p>○ Debe contener al menos un número</p>}
                                    {formData.contrasena && isPasswordValid() && (
                                        <p className="valid-password-change">Contraseña válida <i className="bi bi-check-circle"></i></p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="modal-buttons">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>
                            CANCELAR
                        </button>
                        <button type="submit" className="btn-editar" disabled={isLoading}>
                            {isLoading ? (
                                <img src={wheelIcon} alt="Cargando..." className="update-user-spinner" />
                            ) : (
                                <span>EDITAR</span>
                            )}
                        </button>
                    </div>
                </form>

                {errorMessage && (
                    <div className="status-message-update error">
                        <span>{errorMessage}</span>
                        <i className="bi bi-x-circle"></i>
                    </div>
                )}

                {successMessage && (
                    <div className="status-message-register success">
                        <span>{successMessage}</span>
                        <i className="bi bi-check-circle"></i>
                    </div>
                )}
            </div>
        </div>
    );
};