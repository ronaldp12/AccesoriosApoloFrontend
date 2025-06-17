import React, { useState, useContext, useEffect, useRef } from "react";
import "./RegisterUserModal.css";
import { context } from "../../../Context/Context.jsx";
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const RegisterUserModal = ({ isOpen, onClose, onRegisterSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");
    const [phone, setPhone] = useState("");
    const [formData, setFormData] = useState({
        nombre: "",
        cedula: "",
        telefono: "",
        correo: "",
        rol: ""
    });

    const modalRef = useRef(null);
    const titleRef = useRef(null);
    const formRef = useRef(null);
    const firstGroupRef = useRef(null);
    const secondGroupRef = useRef(null);
    const fullGroupRef = useRef(null);
    const buttonsRef = useRef(null);

    const animateElements = () => {
        if (!isOpen || !modalRef.current) return;

        const elements = [
            modalRef.current.querySelector('h2'),
            modalRef.current.querySelector('.form-register-user'),
            modalRef.current.querySelector('.group-register-user:nth-of-type(1)'),
            modalRef.current.querySelector('.group-register-user:nth-of-type(2)'),
            modalRef.current.querySelector('.form-group-full'),
            modalRef.current.querySelector('.modal-buttons-register-user')
        ].filter(Boolean);

        elements.forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease';
            }
        });

        setTimeout(() => {
            const title = modalRef.current?.querySelector('h2');
            if (title) {
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            }
        }, 100);

        setTimeout(() => {
            const form = modalRef.current?.querySelector('.form-register-user');
            if (form) {
                form.style.opacity = '1';
                form.style.transform = 'translateY(0)';
            }
        }, 200);

        setTimeout(() => {
            const firstGroup = modalRef.current?.querySelector('.group-register-user:nth-of-type(1)');
            if (firstGroup) {
                firstGroup.style.opacity = '1';
                firstGroup.style.transform = 'translateY(0)';
            }
        }, 300);

        setTimeout(() => {
            const secondGroup = modalRef.current?.querySelector('.group-register-user:nth-of-type(2)');
            if (secondGroup) {
                secondGroup.style.opacity = '1';
                secondGroup.style.transform = 'translateY(0)';
            }
        }, 400);

        setTimeout(() => {
            const fullGroup = modalRef.current?.querySelector('.form-group-full');
            if (fullGroup) {
                fullGroup.style.opacity = '1';
                fullGroup.style.transform = 'translateY(0)';
            }
        }, 500);

        setTimeout(() => {
            const buttons = modalRef.current?.querySelector('.modal-buttons-register-user');
            if (buttons) {
                buttons.style.opacity = '1';
                buttons.style.transform = 'translateY(0)';
            }
        }, 600);
    };

    useEffect(() => {
        if (isOpen) {
            resetForm();

            setTimeout(() => {
                animateElements();
            }, 100);
        }
    }, [isOpen]);

    const resetForm = () => {
        setFormData({
            nombre: "",
            cedula: "",
            telefono: "",
            correo: "",
            rol: ""
        });
        setPhone("");
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(false);
    };

    if (!isOpen && !isClosing) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            telefono: name === 'telefono' ? value : prev.telefono
        }));

        setErrorMessage("");
        setSuccessMessage("");
    };

    const handlePhoneChange = (e) => {
        const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 10);
        setPhone(onlyNumbers);
        setFormData(prev => ({ ...prev, telefono: onlyNumbers }));

        setErrorMessage("");
        setSuccessMessage("");
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
        setErrorMessage("");
        setSuccessMessage("");

        if (!/^\d{10}$/.test(phone)) {
            setErrorMessage("El número de teléfono debe tener 10 dígitos.");
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const dataToSend = {
                ...formData,
                telefono: phone
            };

            const response = await fetch("https://accesoriosapolobackend.onrender.com/registrar-directo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend)
            });

            const data = await response.json();

            if (data.success) {
                console.log("Usuario registrado con éxito.");
                setSuccessMessage("Usuario registrado con éxito.");
                setIsLoading(false);

                if (onRegisterSuccess) onRegisterSuccess();

                setTimeout(() => {
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al registrar usuario."));
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            setErrorMessage("Hubo un error al registrar usuario.");
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay-register-user">
            <div
                ref={modalRef}
                className={`modal-content-register-user ${isClosing ? "exit" : "entry"}`}
            >
                <h2 ref={titleRef}>Registrar Usuario</h2>
                <form ref={formRef} className="form-register-user" onSubmit={handleSubmit}>
                    <div ref={firstGroupRef} className="group-register-user">
                        <div className="form-group-register-user">
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Escriba su nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group-register-user">
                            <label>Selecciona el rol</label>
                            <select name="rol" value={formData.rol} onChange={handleChange} required>
                                <option value="">Rol</option>
                                <option value="cliente">Cliente</option>
                                <option value="gerente">Gerente</option>
                                <option value="vendedor">Vendedor</option>
                            </select>
                        </div>
                    </div>
                    <div ref={secondGroupRef} className="group-register-user">
                        <div className="form-group-register-user">
                            <label>Cédula</label>
                            <input
                                type="text"
                                name="cedula"
                                placeholder="Escriba su cédula"
                                value={formData.cedula}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group-register-user">
                            <label>Teléfono</label>
                            <input
                                type="tel"
                                placeholder="Teléfono"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={phone}
                                onChange={handlePhoneChange}
                                required
                            />
                        </div>
                    </div>

                    <div ref={fullGroupRef} className="form-group-full">
                        <label>Correo</label>
                        <input
                            type="email"
                            name="correo"
                            placeholder="Escriba su correo"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div ref={buttonsRef} className="modal-buttons-register-user">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>
                            CANCELAR
                        </button>
                        <button type="submit" className="btn-agregar" disabled={isLoading}>
                            {isLoading ? (
                                <img src={wheelIcon} alt="Cargando..." className="register-user-spinner" />
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