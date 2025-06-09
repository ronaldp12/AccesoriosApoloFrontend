import React, { useState, useContext, useEffect } from "react";
import "./RegisterSuplierModal.css";
import { context } from "../../../Context/Context";
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const RegisterSuplierModal = ({ isOpen, onClose, onRegisterSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading, formatPhoneNumber } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");
    const [phone, setPhone] = useState("");

    const initialFormData = {
        nit: "",
        representante: "",
        nombreEmpresa: "",
        correo: "",
        telefono: "",
        direccion: "",
    };

    const [formData, setFormData] = useState(initialFormData);

    const clearMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setPhone("");
        clearMessages();
    };

    useEffect(() => {
        if (isOpen) {
            clearMessages();
        }
    }, [isOpen]);

    if (!isOpen && !isClosing) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        clearMessages();
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            resetForm();
            onClose();
        }, 400);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        clearMessages();

        if (formData.telefono.length !== 10) {
            setErrorMessage("El número de teléfono debe tener 10 dígitos.");
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch("https://accesoriosapolobackend.onrender.com/registrar-proveedor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log("Respuesta backend:", data);

            if (data.success && response.ok) {
                console.log("Proveedor registrado con éxito.");
                setSuccessMessage("Proveedor registrado con éxito.");
                setErrorMessage("");
                onRegisterSuccess();

                setTimeout(() => {
                    setSuccessMessage("");
                    resetForm();
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al registrar proveedor."));
            }

            setIsLoading(false);

        } catch (error) {
            console.error("Error al registrar proveedor:", error);
            setErrorMessage("Hubo un error al registrar proveedor.");
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay-register-suplier">
            <div className={`modal-content-register-suplier ${isClosing ? "exit" : "entry"}`}>
                <h2>Registrar Proveedor</h2>
                <form className="form-register-suplier" onSubmit={handleSubmit}>
                    <div className="group-register-suplier">

                        <div className="form-group-register-suplier">
                            <label>Nit</label>
                            <input
                                type="text"
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
                                name="representante"
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
                                name="nombreEmpresa"
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
                            type="tel"
                            name="telefono"
                            placeholder="Teléfono"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={formData.telefono}
                            onChange={(e) => {
                                const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 10);
                                setFormData((prev) => ({ ...prev, telefono: onlyNumbers }));
                                clearMessages();
                            }}
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
                        <button type="submit" className="btn-agregar">
                            {isLoading ? (
                                <img src={wheelIcon} alt="Cargando..." className="register-suplier-spinner" />
                            ) : (
                                <span>REGISTRAR</span>
                            )}
                        </button>
                    </div>
                </form>
                {errorMessage && (
                    <div className="status-message-register error">
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