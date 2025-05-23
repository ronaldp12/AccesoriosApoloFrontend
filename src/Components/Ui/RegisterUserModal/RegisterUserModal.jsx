import React, { useState } from "react";
import "./RegisterUserModal.css";

export const RegisterUserModal = ({ isOpen, onClose, onRegisterSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        cedula: "",
        telefono: "",
        correo: "",
        contrasena: "",
        rol: ""
    });

    if (!isOpen && !isClosing) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 400);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("https://accesoriosapolobackend.onrender.com/registrar-directo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                console.log("Usuario registrado con éxito.");
                if (onRegisterSuccess) onRegisterSuccess();
                onClose();
            } else {
                alert("Error: " + data.mensaje);
            }
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            alert("Error interno al registrar usuario.");
        }
    };

    return (
        <div className="modal-overlay-register-user">
            <div className={`modal-content-register-user ${isClosing ? "exit" : "entry"}`}>
                <h2>Registrar Usuario</h2>
                <form className="form-register-user" onSubmit={handleSubmit}>
                    <div className="group-register-user">
                        <div className="form-group-register-user">
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Escriba su nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group-register-user">
                            <label>Selecciona el rol</label>
                            <select name="rol" value={formData.rol} onChange={handleChange}>
                                <option value="">Rol</option>
                                <option>Cliente</option>
                                <option>Gerente</option>
                                <option>Vendedor</option>
                            </select>
                        </div>
                    </div>
                    <div className="group-register-user">
                        <div className="form-group-register-user">
                            <label>Cédula</label>
                            <input
                                type="text"
                                name="cedula"
                                placeholder="Escriba su cédula"
                                value={formData.cedula}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group-register-user">
                            <label>Teléfono</label>
                            <input
                                type="text"
                                name="telefono"
                                placeholder="+ 57"
                                value={formData.telefono}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group-full">
                        <label>Correo</label>
                        <input
                            type="email"
                            name="correo"
                            placeholder="Escriba su correo"
                            value={formData.correo}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group-full">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            name="contrasena"
                            placeholder="Escriba su contraseña"
                            value={formData.contrasena}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>
                            CANCELAR
                        </button>
                        <button type="submit" className="btn-agregar">
                            AGREGAR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
