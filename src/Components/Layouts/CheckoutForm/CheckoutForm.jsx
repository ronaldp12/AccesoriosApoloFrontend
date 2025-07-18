import React, { useEffect, useState, useContext } from 'react';
import './CheckoutForm.css';
import { Logo } from '../../Ui/Logo/Logo';
import { useNavigate } from 'react-router-dom';
import { UseCheckout } from '../../Hook/UseCheckout/UseCheckout.jsx';
import { departamentosMunicipios } from "../../../data/data.js";
import { context } from '../../../Context/Context.jsx';

export const CheckoutForm = () => {
    const [municipiosDisponibles, setMunicipiosDisponibles] = useState([]);
    const [saveLoading, setSaveLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [isAddressSaved, setIsAddressSaved] = useState(false);
    const { token } = useContext(context);

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
        numeroItemsCarrito,
        carritoLoading,
        carritoError,
        updateFormData,
        handleSaveAddress,
        loadUserData,
        loadCarritoData,
        loadLocalCartData,
        paymentData,
        lastAddressInfo
    } = UseCheckout();

    // Cargar datos del usuario al montar el componente
    useEffect(() => {
        loadUserData();

        if (token) {
            loadCarritoData();
        } else {
            loadLocalCartData();
        }
    }, [token]);

    // Solo marcar como guardado cuando el usuario presiona el botón guardar exitosamente
    useEffect(() => {
    if (success && !saveLoading) {
        setIsAddressSaved(true);
    }
}, [success, saveLoading]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        updateFormData(name, type === "checkbox" ? checked : value);

        // Si se modifica cualquier campo después de haber guardado, marcar como no guardado
        if (isAddressSaved) {
            setIsAddressSaved(false);
        }

        if (name === "departamento") {
            const departamentoSeleccionado = departamentosMunicipios.find(
                (dep) => dep.departamento === value
            );
            setMunicipiosDisponibles(departamentoSeleccionado ? departamentoSeleccionado.municipios : []);
            updateFormData("municipio", "");
        }
    };

    const handleSave = async () => {
        setSaveLoading(true);
        setIsAddressSaved(false); // Resetear estado antes de guardar
        try {
            const result = await handleSaveAddress();
            if (result) {
                // El estado se marcará como guardado en el useEffect cuando success sea true
                console.log('Dirección guardada exitosamente');
            }
        } catch (err) {
            console.error('Error al guardar la dirección:', err);
            setIsAddressSaved(false);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleGoToPayment = async () => {
        setPaymentLoading(true);
        try {
            const result = await handleSaveAddress();
            if (result && result.id_factura_creada) {
                // Esperar un poco para asegurar que el estado se actualice
                setTimeout(() => {
                    navigate('/checkout/pago');
                }, 100);
            }
        } catch (err) {
            console.error('Error al preparar el pago:', err);
        } finally {
            setPaymentLoading(false);
        }
    };

    useEffect(() => {
        if (formData.departamento) {
            const departamentoSeleccionado = departamentosMunicipios.find(
                (dep) => dep.departamento === formData.departamento
            );
            setMunicipiosDisponibles(departamentoSeleccionado ? departamentoSeleccionado.municipios : []);
        }
    }, [formData.departamento]);

    // Verificar si el formulario está completo
    const isFormComplete = () => {
        return formData.nombre &&
            formData.cedula &&
            formData.telefono &&
            formData.correo &&
            formData.departamento &&
            formData.municipio &&
            formData.direccion;
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
                                required
                                disabled={saveLoading}
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
                                disabled={saveLoading}
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
                                disabled={saveLoading}
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
                                disabled={saveLoading}
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
                                disabled={saveLoading}
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
                                disabled={saveLoading}
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
                                disabled={saveLoading || municipiosDisponibles.length === 0}
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
                                disabled={saveLoading}
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
                                disabled={saveLoading}
                                placeholder="Referencias, instrucciones especiales, etc."
                            ></textarea>
                        </div>

                        <button
                            type="button"
                            className="btn-guardar-checkout-form"
                            onClick={handleSave}
                            disabled={saveLoading || !isFormComplete()}
                        >
                            {saveLoading ? 'Guardando...' : isAddressSaved ? 'Guardado ✓' : 'Guardar'}
                        </button>
                    </div>

                    {/* Mostrar mensajes de estado */}
                    {error && (
                        <div className="status-message error-message">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="status-message success-message">
                            Información guardada exitosamente
                        </div>
                    )}

                    <div className="productos-section-checkout-form">
                        <h3>Productos a enviar ({numeroItemsCarrito})</h3>
                        {carritoLoading && <p>Cargando productos...</p>}
                        {carritoError && <p style={{ color: 'red' }}>Error: {carritoError}</p>}
                        <div className="productos-grid-checkout-form">
                            {productos.map((item, index) => (
                                <div key={index} className="producto-item-checkout-form">
                                    <img
                                        src={item.url_imagen_o_archivo || '/api/placeholder/80/80'}
                                        alt={item.nombre}
                                    />
                                    <div className="producto-info">
                                        <p>{item.nombre}</p>
                                        {item.tamano && <p>Tamaño: {item.tamano}</p>}
                                        <small>Cantidad: {item.cantidad}</small>
                                    </div>
                                    <div className="producto-precio-checkout-form">
                                        <span className="precio">
                                            ${item.subtotalArticulo.toLocaleString()}
                                        </span>
                                        <span className="moneda">COP</span>
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
                            <span>${resumenPedido.TotalArticulosSinDescuento?.toLocaleString() || '0'}</span>
                        </div>

                        <div className="summary-line discount">
                            <span>Descuento de artículos</span>
                            <span>-${resumenPedido.DescuentoArticulos?.toLocaleString() || '0'}</span>
                        </div>

                        <div className="summary-line subtotal">
                            <span>Subtotal</span>
                            <span>${resumenPedido.Subtotal?.toLocaleString() || '0'}</span>
                        </div>

                        <div className="summary-line">
                            <span>Envío</span>
                            <span>${resumenPedido.PrecioEnvio?.toLocaleString() || '0'}</span>
                        </div>

                        <div className="summary-line total">
                            <span>Total a pagar</span>
                            <span>${resumenPedido.Total?.toLocaleString() || '0'}</span>
                        </div>

                        <div className="terms-text">
                            Al enviar su pedido, acepta nuestros Términos de uso y autoriza el
                            procesamiento de sus datos personales de acuerdo con la Política de
                            privacidad. Para obtener más detalles sobre los propósitos y los
                            métodos de procesamiento de datos, sus derechos y cómo ejercerlos,
                            visite nuestra Política de privacidad.
                        </div>

                        <button
                            className={`btn-finalizar ${!isAddressSaved ? 'disabled' : ''}`}
                            onClick={handleGoToPayment}
                            disabled={paymentLoading || numeroItemsCarrito === 0 || !isAddressSaved}
                            title={!isAddressSaved ? 'Primero guarda la dirección de envío' : ''}
                        >
                            {paymentLoading ? 'Procesando...' : `Continuar al Pago (${numeroItemsCarrito})`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};