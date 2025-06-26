import React, { useState, useEffect, useContext, useRef } from "react";
import "./UpdateSuplierModal.css";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { context } from "../../../Context/Context.jsx";

export const UpdateSuplierModal = ({ isOpen, onClose, nitProveedor, onUpdateSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");
    const [formData, setFormData] = useState({
        nit: "",
        representante: "",
        nombreEmpresa: "",
        correo: "",
        telefono: "",
        direccion: "",
    });
    const modalRef = useRef(null); // Initialize useRef

    const animateElements = () => {
        if (!isOpen || !modalRef.current) return;

        const elements = [
            modalRef.current.querySelector('h2'),
            modalRef.current.querySelector('.form-update-suplier'),
            ...modalRef.current.querySelectorAll('.group-update-suplier'),
            ...modalRef.current.querySelectorAll('.form-group-update-suplier'),
            modalRef.current.querySelector('.form-group-full'),
            modalRef.current.querySelector('.modal-buttons-update-suplier')
        ].filter(Boolean);

        elements.forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease';
            }
        });

        elements.forEach((el, index) => {
            setTimeout(() => {
                if (el) {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }
            }, 100 + (index * 100));
        });
    };

    useEffect(() => {
        if (isOpen && nitProveedor) {
            fetchProveedor();
            setTimeout(() => {
                animateElements();
            }, 100);
        }
    }, [isOpen, nitProveedor]);

    const fetchProveedor = async () => {
        setIsLoading(true); // Set loading true before fetching
        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/obtener-proveedor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nit: nitProveedor }),
            });
            const data = await response.json();
            if (data.success) {
                setFormData(data.proveedor);
            } else {
                setErrorMessage(data.mensaje); // Use setErrorMessage
            }
        } catch (error) {
            console.error("Error consultando proveedor:", error);
            setErrorMessage("Error al cargar los datos del proveedor."); // Set error message
        } finally {
            setIsLoading(false); // Set loading false after fetching
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errorMessage) setErrorMessage("");
        if (successMessage) setSuccessMessage("");
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setErrorMessage("");
            setSuccessMessage("");
            setIsLoading(false);
            onClose();
        }, 400);
    };

    const handleUpdate = async () => {
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        if (formData.telefono.length !== 10) {
            setErrorMessage("El número de teléfono debe tener 10 dígitos.");
            setIsLoading(false);
            return;
        }
        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/actualizar-proveedor", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nitOriginal: nitProveedor, ...formData }),
            });
            const data = await response.json();
            if (data.success) {
                setSuccessMessage("Proveedor actualizado correctamente");
                setIsLoading(false);
                onUpdateSuccess();
                setTimeout(() => {
                    setSuccessMessage("");
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al registrar usuario."));
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error al actualizar proveedor:', error);
            setErrorMessage("Error al actualizar proveedor, intente nuevamente.");
            setIsLoading(false);
        }

    };

    if (!isOpen && !isClosing) return null;

    return (
        <div className="modal-overlay-update-suplier">
            <div ref={modalRef} className={`modal-content-update-suplier ${isClosing ? "exit" : "entry"}`}>
                <h2>Editar Proveedor</h2>
                <form className="form-update-suplier">
                    <div className="group-update-suplier">
                        <div className="form-group-update-suplier">
                            <label>Nit</label>
                            <input type="text" name="nit" value={formData.nit} onChange={handleChange} />
                        </div>

                        <div className="form-group-update-suplier">
                            <label>Nombre Representante</label>
                            <input type="text" name="representante" value={formData.representante} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="group-update-suplier">
                        <div className="form-group-update-suplier">
                            <label>Nombre Empresa</label>
                            <input type="text" name="nombreEmpresa" value={formData.nombreEmpresa} onChange={handleChange} />
                        </div>

                        <div className="form-group-update-suplier">
                            <label>Correo</label>
                            <input type="email" name="correo" value={formData.correo} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group-update-suplier">
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
                                // Limpiar mensajes cuando el usuario escriba en teléfono
                                if (errorMessage) setErrorMessage("");
                                if (successMessage) setSuccessMessage("");
                            }}
                        />
                    </div>

                    <div className="form-group-full">
                        <label>Dirección</label>
                        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} />
                    </div>

                    <div className="modal-buttons-update-suplier">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>
                            CANCELAR
                        </button>
                        <button type="button" className="btn-agregar" onClick={handleUpdate}>
                            {isLoading ? (
                                <img src={wheelIcon} alt="Cargando..." className="update-suplier-spinner" />
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
                    <div className="status-message-update success">
                        <span>{successMessage}</span>
                        <i className="bi bi-check-circle"></i>
                    </div>
                )}
            </div>
        </div>
    );
};