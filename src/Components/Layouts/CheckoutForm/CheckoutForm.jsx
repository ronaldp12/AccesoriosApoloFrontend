import React, { useEffect, useState } from 'react';
import './CheckoutForm.css';
import { Logo } from '../../Ui/Logo/Logo';
import { useNavigate } from 'react-router-dom';
import { UseCheckout } from '../../Hook/UseCheckout/UseCheckout.jsx';
import { departamentosMunicipios } from "../../../data/data.js";

export const CheckoutForm = () => {
    const [municipiosDisponibles, setMunicipiosDisponibles] = useState([]);

    const navigate = useNavigate();

    const {
        formData,
        loading,
        error,
        success,
        userInfo,
        isUserRegistered,
        productos,
        resumenPedido,
        updateFormData,
        handleSaveAddress,
        handleFinalizePurchase,
        loadUserData
    } = UseCheckout();

    // Cargar datos del usuario al montar el componente
    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    // Productos de ejemplo (puedes moverlos al hook si vienen de una API)
    const productosEjemplo = [
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
        updateFormData(name, type === "checkbox" ? checked : value);

        if (name === "departamento") {
            const departamentoSeleccionado = departamentosMunicipios.find(
                (dep) => dep.departamento === value
            );
            setMunicipiosDisponibles(departamentoSeleccionado ? departamentoSeleccionado.municipios : []);
            updateFormData("municipio", "");
        }
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

                    {/* Mostrar mensajes de estado */}
                    {error && (
                        <div className="error-message" style={{
                            background: '#fee',
                            color: '#c33',
                            padding: '10px',
                            borderRadius: '4px',
                            marginBottom: '15px',
                            border: '1px solid #fcc'
                        }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message" style={{
                            background: '#efe',
                            color: '#363',
                            padding: '10px',
                            borderRadius: '4px',
                            marginBottom: '15px',
                            border: '1px solid #cfc'
                        }}>
                            ✓ Dirección guardada exitosamente
                            {isUserRegistered && userInfo && (
                                <div style={{ marginTop: '5px', fontSize: '0.9em' }}>
                                    Usuario registrado: {userInfo.correo}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Información del usuario si está registrado y tiene dirección anterior */}
                    {userInfo && (userInfo.direccion_anterior || userInfo.informacion_adicional_anterior) && (
                        <div className="previous-address-info" style={{
                            background: '#f9f9f9',
                            padding: '10px',
                            borderRadius: '4px',
                            marginBottom: '15px',
                            border: '1px solid #ddd'
                        }}>
                            <h4>Información de envío anterior:</h4>
                            {userInfo.direccion_anterior && (
                                <p><strong>Dirección:</strong> {userInfo.direccion_anterior}</p>
                            )}
                            {userInfo.informacion_adicional_anterior && (
                                <p><strong>Info adicional:</strong> {userInfo.informacion_adicional_anterior}</p>
                            )}
                        </div>
                    )}

                    <div className="shipping-form">
                        <div className="form-group-checkout-form">
                            <label htmlFor="nombre">Nombre *</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group-checkout-form">
                            <label htmlFor="cedula">Cédula *</label>
                            <input
                                type="text"
                                id="cedula"
                                name="cedula"
                                value={formData.cedula}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                                placeholder="Solo números"
                            />
                        </div>

                        <div className="form-group-checkout-form">
                            <label htmlFor="telefono">Número de teléfono *</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group-checkout-form">
                            <label htmlFor="correo">Correo electrónico *</label>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                value={formData.correo}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                                placeholder="ejemplo@correo.com"
                            />
                        </div>

                        <div className="form-group-checkout-form">
                            <label htmlFor="pais">País / Región *</label>
                            <input
                                type="text"
                                id="pais"
                                name="pais"
                                readOnly
                                value={formData.pais}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group-checkout-form">
                            <label htmlFor="departamento">Departamento *</label>
                            <select
                                id="departamento"
                                name="departamento"
                                className='select-checkout-form'
                                value={formData.departamento}
                                onChange={handleInputChange}
                                disabled={loading}
                            >
                                <option value="">Selecciona un departamento</option>
                                {departamentosMunicipios.map((dep) => (
                                    <option key={dep.departamento} value={dep.departamento}>
                                        {dep.departamento}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group-checkout-form">
                            <label htmlFor="municipio">Municipio *</label>
                            <select
                                id="municipio"
                                name="municipio"
                                className='select-checkout-form'
                                value={formData.municipio}
                                onChange={handleInputChange}
                                disabled={loading || municipiosDisponibles.length === 0}
                            >
                                <option value="">Selecciona un municipio</option>
                                {municipiosDisponibles.map((mun) => (
                                    <option key={mun} value={mun}>
                                        {mun}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group-checkout-form">
                            <label htmlFor="direccion">Dirección *</label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                                placeholder="Calle, número, barrio"
                            />
                        </div>

                        <div className="form-group-checkout-form">
                            <label htmlFor="informacion_adicional">Información adicional</label>
                            <textarea
                                id="informacion_adicional"
                                name="informacion_adicional"
                                value={formData.informacion_adicional}
                                onChange={handleInputChange}
                                rows="3"
                                disabled={loading}
                                placeholder="Referencias, instrucciones especiales, etc."
                            ></textarea>
                        </div>

                        <button
                            type="button"
                            className="btn-guardar-checkout-form"
                            onClick={handleSaveAddress}
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>

                    <div className="productos-section-checkout-form">
                        <h3>Productos a enviar ({productosEjemplo.length})</h3>
                        <div className="productos-grid-checkout-form">
                            {productosEjemplo.map((producto) => (
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

                        <button
                            className="btn-finalizar"
                            onClick={handleFinalizePurchase}
                            disabled={loading || !success}
                        >
                            {loading ? 'Procesando...' : `Finalizar Compra (${productosEjemplo.length})`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};