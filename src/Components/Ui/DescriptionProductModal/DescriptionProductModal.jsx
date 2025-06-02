import React, { useState, useEffect } from "react";
import "./DescriptionProductModal.css"

export const DescriptionProductModal = ({ isOpen, onClose, onSave, initialValue, readOnly = false }) => {
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
                <h3>{readOnly ? "Descripción del producto" : "Editar descripción"}</h3>
                <textarea
                    value={descripcion}
                    onChange={(e) => !readOnly && setDescripcion(e.target.value)}
                    placeholder="Escribe la descripción detallada del producto..."
                    rows={8}
                    readOnly={readOnly}
                />
                {!readOnly && <p className="char-count">{descripcion.length} caracteres</p>}

                <div className="modal-buttons-description-product">
                    <button onClick={onClose} className="btn-cancelar">Cerrar</button>
                    {!readOnly && (
                        <button
                            onClick={() => {
                                onSave(descripcion);
                                onClose();
                            }}
                            className="btn-guardar"
                        >
                            Guardar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
