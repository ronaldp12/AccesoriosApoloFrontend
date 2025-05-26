import React, { useState } from "react";
import "./RegisterSuplierModal.css";

export const RegisterSuplierModal = ({ isOpen, onClose }) => {
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

    return (
        <div className="modal-overlay-register-suplier">
            <div className={`modal-content-register-suplier ${isClosing ? "exit" : "entry"}`}>
                <h2>Registrar Proveedor</h2>
                <form className="form-register-suplier">
                    <div className="group-register-suplier">

                        <div className="form-group-register-suplier">
                            <label>Nit</label>
                            <input
                                type="number"
                                name="nit"
                                placeholder="Escriba el nit"
                                value={formData.nit}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group-register-suplier">
                            <label>Nombre Representante</label>
                            <input
                                type="text"
                                name="nombre Representante"
                                placeholder="Escriba nombre representante"
                                value={formData.representante}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <div className="group-register-suplier">
                        <div className="form-group-register-suplier">
                            <label>Nombre Empresa</label>
                            <input
                                type="text"
                                name="nombre empresa"
                                placeholder="Escriba nombre empresa"
                                value={formData.nombreEmpresa}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group-register-suplier">
                            <label>Correo</label>
                            <input
                                type="email"
                                name="correo"
                                placeholder="Escriba su correo"
                                value={formData.correo}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <div className="form-group-register-suplier">
                        <label>Teléfono</label>
                        <input
                            type="text"
                            name="telefono"
                            placeholder="+ 57"
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group-full">
                        <label>Dirección</label>
                        <input
                            type="text"
                            name="direccion"
                            placeholder="Escriba la dirección"
                            value={formData.direccion}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="modal-buttons-register-suplier">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>
                            CANCELAR
                        </button>
                        <button type="button" className="btn-agregar">
                            REGISTRAR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
