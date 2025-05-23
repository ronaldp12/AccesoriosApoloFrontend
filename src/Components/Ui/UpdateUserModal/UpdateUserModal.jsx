import React, { useState, useEffect, useContext } from "react";
import "./UpdateUserModal.css";
import { context } from "../../../Context/Context.jsx";
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const UpdateUserModal = ({ isOpen, onClose, usuario, onUpdateSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        telefono: "",
        cedula: "",
        contrasena: "",
        rol: "",
    });

    useEffect(() => {
        if (usuario) {
            setFormData({
                nombre: usuario.nombre || "",
                correo: usuario.correo || "",
                telefono: usuario.telefono || "",
                cedula: usuario.cedula || "",
                contrasena: "",
                rol: usuario.rol || "",
            });
        }
    }, [usuario]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://accesoriosapolobackend.onrender.com/actualizar-usuario", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    correoOriginal: usuario.correo,
                    ...formData,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setSuccessMessage("Usuario actualizado con éxito.");
                if (onUpdateSuccess) onUpdateSuccess();

                setTimeout(() => {
                    setSuccessMessage("");
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al registrar usuario."));
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            setErrorMessage("Hubo un error al registrar usuario.");
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
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
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
                        </div>
                        <div className="form-group-update-user">
                            <label>Selecciona el rol</label>
                            <select name="rol" value={formData.rol} onChange={handleChange}>
                                <option value="">Rol</option>
                                <option value={"cliente"}>Cliente</option>
                                <option value={"gerente"}>Gerente</option>
                                <option value={"vendedor"}>Vendedor</option>
                            </select>
                        </div>
                    </div>

                    <div className="group-update-user">
                        <div className="form-group-update-user">
                            <label>Cédula</label>
                            <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} />
                        </div>
                        <div className="form-group-update-user">
                            <label>Teléfono</label>
                            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group-full">
                        <label>Correo</label>
                        <input type="email" name="correo" value={formData.correo} onChange={handleChange} />
                    </div>
                    <div className="form-group-full">
                        <label>Contraseña (opcional)</label>
                        <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} />
                    </div>

                    <div className="modal-buttons">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>CANCELAR</button>
                        <button type="submit" className="btn-editar">
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
                        {setIsLoading(false)}
                    </div>
                )}
            </div>
        </div>
    );
};
