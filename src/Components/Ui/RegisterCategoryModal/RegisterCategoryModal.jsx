import React, { useState, useContext, useEffect, useRef } from "react";
import "./RegisterCategoryModal.css";
import { context } from "../../../Context/Context";
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const RegisterCategorieModal = ({ isOpen, onClose, onRegisterSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");

    const initialFormData = {
        nombre_categoria: "",
        descripcion: "",
        descuento: "",
    };

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
            modalRef.current.querySelector('.form-register-categorie'),
            modalRef.current.querySelector('.group-register-categorie:nth-of-type(1)'),
            modalRef.current.querySelector('.group-register-categorie:nth-of-type(2)'),
            modalRef.current.querySelector('.modal-buttons-register-categorie')
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
            const form = modalRef.current?.querySelector('.form-register-categorie');
            if (form) {
                form.style.opacity = '1';
                form.style.transform = 'translateY(0)';
            }
        }, 200);

        setTimeout(() => {
            const firstGroup = modalRef.current?.querySelector('.group-register-categorie:nth-of-type(1)');
            if (firstGroup) {
                firstGroup.style.opacity = '1';
                firstGroup.style.transform = 'translateY(0)';
            }
        }, 300);

        setTimeout(() => {
            const secondGroup = modalRef.current?.querySelector('.group-register-categorie:nth-of-type(2)');
            if (secondGroup) {
                secondGroup.style.opacity = '1';
                secondGroup.style.transform = 'translateY(0)';
            }
        }, 400);

        setTimeout(() => {
            const buttons = modalRef.current?.querySelector('.modal-buttons-register-categorie');
            if (buttons) {
                buttons.style.opacity = '1';
                buttons.style.transform = 'translateY(0)';
            }
        }, 500);
    };

    useEffect(() => {
        if (isOpen) {
            resetForm();

            setTimeout(() => {
                animateElements();
            }, 100);
        }
    }, [isOpen]);

    const [formData, setFormData] = useState(initialFormData);

    const clearMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    const resetForm = () => {
        setFormData(initialFormData);
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

        try {
            const token = localStorage.getItem("token");

            const response = await fetch("https://accesoriosapolobackend.onrender.com/registrar-categoria", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nombre_categoria: formData.nombre_categoria,
                    descripcion: formData.descripcion,
                    descuento: parseFloat(formData.descuento),
                }),
            });

            const data = await response.json();
            console.log("Respuesta backend:", data);

            if (data.success && response.ok) {
                setSuccessMessage("Categoría registrada con éxito.");
                setErrorMessage("");
                onRegisterSuccess();

                setTimeout(() => {
                    setSuccessMessage("");
                    resetForm();
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(getErrorMessage(data, "Error al registrar categoría."));
            }

            setIsLoading(false);
        } catch (error) {
            console.error("Error al registrar categoría:", error);
            setErrorMessage("Hubo un error al registrar la categoría.");
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay-register-categorie">
            <div ref={modalRef} className={`modal-content-register-categorie ${isClosing ? "exit" : "entry"}`}>
                <h2 ref={titleRef}>Registrar Categoría</h2>
                <form ref={formRef} className="form-register-categorie" onSubmit={handleSubmit}>
                    <div ref={firstGroupRef} className="group-register-categorie">
                        <div className="form-group-register-categorie">
                            <label>Nombre de categoría *</label>
                            <input
                                type="text"
                                name="nombre_categoria"
                                placeholder="Nombre de la categoría"
                                value={formData.nombre_categoria}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group-register-categorie">
                            <label>Descripción</label>
                            <input
                                type="text"
                                name="descripcion"
                                placeholder="Descripción opcional"
                                value={formData.descripcion}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div ref={secondGroupRef} className="group-register-categorie">
                        <div className="form-group-register-categorie">
                            <label>Descuento *</label>
                            <input
                                type="number"
                                name="descuento"
                                placeholder="Ej: 10"
                                value={formData.descuento}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                        <p>%</p>
                    </div>

                    <div ref={buttonsRef} className="modal-buttons-register-categorie">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>
                            CANCELAR
                        </button>
                        <button type="submit" className="btn-agregar">
                            {isLoading ? (
                                <img src={wheelIcon} alt="Cargando..." className="register-categorie-spinner" />
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