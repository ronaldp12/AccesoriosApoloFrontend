import React, { useState } from "react";
import "./UpdateUserModal.css";

export const UpdateUserModal = ({ isOpen, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    if (!isOpen && !isClosing) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 400);
    };

    return (
        <div className="modal-overlay-update-user">
            <div className={`modal-content-update-user ${isClosing ? "exit" : "entry"}`}>
                <h2>Editar Usuario</h2>
                <form className="form-update-user">
                    <div className="group-update-user">
                        <div className="form-group-update-user">
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Escriba su nombre"
                        
                            />
                        </div>
                        <div className="form-group-update-user">
                            <label>Selecciona el rol</label>
                            <select name="rol">
                                <option value="">Rol</option>
                                <option>Cliente</option>
                                <option>Gerente</option>
                                <option>Vendedor</option>
                            </select>
                        </div>
                    </div>
                    <div className="group-update-user">
                        <div className="form-group-update-user">
                            <label>Cédula</label>
                            <input
                                type="text"
                                name="cedula"
                                placeholder="Escriba su cédula"
                                
                            />
                        </div>
                        <div className="form-group-update-user">
                            <label>Teléfono</label>
                            <input
                                type="text"
                                name="telefono"
                                placeholder="+ 57"
                                
                            />
                        </div>
                    </div>

                    <div className="form-group-full">
                        <label>Correo</label>
                        <input
                            type="email"
                            name="correo"
                            placeholder="Escriba su correo"
                            
                        />
                    </div>
                    <div className="form-group-full">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            name="contrasena"
                            placeholder="Escriba su contraseña"
                            
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>
                            CANCELAR
                        </button>
                        <button type="submit" className="btn-editar">
                            EDITAR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
