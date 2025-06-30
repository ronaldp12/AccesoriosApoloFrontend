import React, { useState } from 'react';
import './CheckoutForm.css';
import { Logo } from '../../Ui/Logo/Logo';
import { useNavigate } from 'react-router-dom';

export const CheckoutForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        pais: 'Colombia',
        nombre: 'Colombia',
        apellido: 'Colombia',
        telefono: '',
        departamento: 'Colombia',
        municipio: 'Colombia',
        direccion: 'Colombia',
        informacionAdicional: '',
        direccionPredeterminada: true
    });

    const productos = [
        {
            id: 1,
            imagen: '/api/placeholder/80/80',
            precio: '$18.000',
            moneda: 'COP'
        },
        {
            id: 2,
            imagen: '/api/placeholder/80/80',
            precio: '$18.000',
            moneda: 'COP'
        },
        {
            id: 3,
            imagen: '/api/placeholder/80/80',
            precio: '$18.000',
            moneda: 'COP'
        },
        {
            id: 4,
            imagen: '/api/placeholder/80/80',
            precio: '$18.000',
            moneda: 'COP'
        }
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleGuardar = () => {
        console.log('Guardando datos:', formData);
    };

    const handleFinalizarCompra = () => {
        console.log('Finalizando compra');
    };

    return (
        <div className="checkout-container">
            <div className="header-checkout-form">
                <div className="logo">
                    <Logo styleLogo='logo-checkout-form' />
                </div>
                
            </div>
            <div className="breadcrumb-checkout-form">
                    <span onClick={() => { navigate('/') }}>Inicio</span> / <span>Finalizar compra</span>
                </div>

            <div className="content-wrapper-checkout-form">
                <div className="form-section-checkout-form">
                    <h2>Dirección de envío</h2>

                    <div className="shipping-form">

                        <div className="form-group-checkout-form">
                            <label htmlFor="nombre">Nombre *</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group-checkout-form">
                            <label htmlFor="apellido">Cédula</label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group-checkout-form">
                            <label htmlFor="telefono">Número de teléfono</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group-checkout-form">
                            <label htmlFor="pais">País / Región *</label>
                            <input
                                type="text"
                                id="pais"
                                name="pais"
                                value={formData.pais}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group-checkout-form">
                            <label htmlFor="departamento">Departamento</label>
                            <input
                                type="text"
                                id="departamento"
                                name="departamento"
                                value={formData.departamento}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group-checkout-form">
                            <label htmlFor="municipio">Municipio</label>
                            <input
                                type="text"
                                id="municipio"
                                name="municipio"
                                value={formData.municipio}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group-checkout-form">
                            <label htmlFor="direccion">Dirección</label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group-checkout-form">
                            <label htmlFor="informacionAdicional">Información adicional</label>
                            <textarea
                                id="informacionAdicional"
                                name="informacionAdicional"
                                value={formData.informacionAdicional}
                                onChange={handleInputChange}
                                rows="3"
                            ></textarea>
                        </div>

                        <button type="button" className="btn-guardar-checkout-form" onClick={handleGuardar}>
                            Guardar
                        </button>
                    </div>

                    <div className="productos-section-checkout-form">
                        <h3>Productos a enviar (4)</h3>
                        <div className="productos-grid-checkout-form">
                            {productos.map((producto) => (
                                <div key={producto.id} className="producto-item-checkout-form">
                                    <img src={producto.imagen} alt={`Producto ${producto.id}`} />
                                    <div className="producto-precio-checkout-form">
                                        <span className="precio">{producto.precio}</span>
                                        <span className="moneda">{producto.moneda}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="summary-section">
                    <div className="order-summary">
                        <h3>Resumen del Pedido</h3>

                        <div className="summary-line">
                            <span>Total de artículos</span>
                            <span>$300.000</span>
                        </div>

                        <div className="summary-line discount">
                            <span>Descuento de artículos</span>
                            <span>-$100.000</span>
                        </div>

                        <div className="summary-line subtotal">
                            <span>Subtotal</span>
                            <span>$200.000</span>
                        </div>

                        <div className="summary-line total">
                            <span>Total a pagar</span>
                            <span>$200.000</span>
                        </div>

                        <div className="terms-text">
                            Al enviar su pedido, acepta nuestros Términos de uso y autoriza el
                            procesamiento de sus datos personales de acuerdo con la Política de
                            privacidad. Para obtener más detalles sobre los propósitos y los
                            métodos de procesamiento de datos, sus derechos y cómo ejercerlos,
                            visite nuestra Política de privacidad.
                        </div>

                        <button className="btn-finalizar" onClick={handleFinalizarCompra}>
                            Finalizar Compra (4)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
