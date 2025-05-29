import React, { useState, useEffect } from "react";
import "./DescriptionProductModal.css";

export const DescriptionProductModal = ({ isOpen, onClose, onSave, initialValue }) => {
    const [descripcion, setDescripcion] = useState("");

    useEffect(() => {
        if (isOpen) {
            setDescripcion(initialValue || "");
        }
    }, [isOpen, initialValue]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay-description-product">
            <div className="modal-content-description-product">
                <h3>Editar descripción</h3>
                <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Escribe la descripción detallada del producto..."
                    rows={8}
                />

                <div className="modal-buttons-description-product">
                    <button onClick={onClose} className="btn-cancelar">Cancelar</button>
                    <button
                        onClick={() => {
                            onSave(descripcion);
                            onClose();
                        }}
                        className="btn-guardar"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};
