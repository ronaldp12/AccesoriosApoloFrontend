import React, { useState } from "react";
import "./UpdateSuplierModal.css";

export const UpdateSuplierModal = ({ isOpen, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [formData, setFormData] = useState({
        nit: "",
        representante: "",
        nombreEmpresa: "",
        correo: "",
        telefono: "",
        direccion: "",
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
        <div className="modal-overlay-update-suplier">
            <div className={`modal-content-update-suplier ${isClosing ? "exit" : "entry"}`}>
                <h2>Editar Proveedor</h2>
                <form className="form-update-suplier">
                    <div className="group-update-suplier">

                        <div className="form-group-update-suplier">
                            <label>Nit</label>
                            <input
                                type="text"
                                name="nit"
                                placeholder="Escriba el nit"
                                value={formData.nit}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group-update-suplier">
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

                    <div className="group-update-suplier">
                        <div className="form-group-update-suplier">
                            <label>Nombre Empresa</label>
                            <input
                                type="text"
                                name="nombre empresa"
                                placeholder="Escriba nombre empresa"
                                value={formData.nombreEmpresa}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group-update-suplier">
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

                    <div className="form-group-update-suplier">
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
                    <div className="modal-buttons-update-suplier">
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
