import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseCheckout } from '../../Hook/UseCheckout/UseCheckout.jsx';
import { context } from '../../../Context/Context.jsx';

export const PagoPage = () => {
    const navigate = useNavigate();
    const { token: contextToken } = useContext(context);
    const [error, setError] = useState(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    const {
        paymentData,
        resumenPedido,
        localCartSummary,
        token,
        clearCartAfterPayment,
        loadCarritoData,
        loadLocalCartData,
        getWompiSignature,
        createCheckout // ← Agregar esta línea
    } = UseCheckout();

    const WOMPI_PUBLIC_KEY = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
    const REDIRECT_URL = import.meta.env.VITE_WOMPI_REDIRECT_URL;

    // Cargar el script de Wompi
    useEffect(() => {
        const loadWompiScript = () => {
            // Verificar si el script ya está cargado
            if (document.querySelector('script[src*="checkout.wompi.co/widget.js"]')) {
                setIsScriptLoaded(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.wompi.co/widget.js';
            script.type = 'text/javascript';
            script.onload = () => {
                console.log('✅ Script de Wompi cargado exitosamente');
                setIsScriptLoaded(true);
            };
            script.onerror = () => {
                console.error('❌ Error al cargar el script de Wompi');
                setError('Error al cargar el sistema de pagos. Por favor, recarga la página.');
            };

            document.head.appendChild(script);
        };

        loadWompiScript();
    }, []);

    // Debug de variables de entorno
    useEffect(() => {
        console.log('🔑 Variables de entorno:', {
            WOMPI_PUBLIC_KEY: WOMPI_PUBLIC_KEY ? 'Configurada' : 'NO CONFIGURADA',
            REDIRECT_URL: REDIRECT_URL ? 'Configurada' : 'NO CONFIGURADA',
            publicKeyLength: WOMPI_PUBLIC_KEY?.length || 0
        });

        // Validar que la clave pública esté configurada
        if (!WOMPI_PUBLIC_KEY || WOMPI_PUBLIC_KEY === 'undefined') {
            setError('Clave pública de Wompi no configurada. Revisa tu archivo .env');
            console.error('❌ WOMPI_PUBLIC_KEY no está configurada');
        }
    }, []);

    useEffect(() => {
        if (!paymentData) {
            const timer = setTimeout(() => {
                console.log('No hay datos de pago, redirigiendo...');
                navigate('/checkout');
            }, 1000);
            return () => clearTimeout(timer);
        }

        if (contextToken && (!resumenPedido || resumenPedido.Total === 0)) {
            console.log('Cargando datos del carrito para usuario logueado...');
            loadCarritoData();
        }
    }, [paymentData, navigate, contextToken, resumenPedido, loadCarritoData]);

    // Inicializar el widget de Wompi cuando todo esté listo
    // Inicializar el widget de Wompi cuando todo esté listo
    useEffect(() => {
        if (!isScriptLoaded || !paymentData || !WOMPI_PUBLIC_KEY) {
            return;
        }

        const summary = contextToken ? resumenPedido : localCartSummary;

        if (!summary || summary.Total <= 0) {
            return;
        }

        // Limpiar widget anterior si existe
        const existingWidget = document.querySelector('#wompi-widget-container');
        if (existingWidget) {
            existingWidget.innerHTML = '';
        }

        // Hacer la inicialización async
        initializeWompiWidget(summary).catch(error => {
            console.error('Error al inicializar widget:', error);
            setError(`Error al cargar el sistema de pagos: ${error.message}`);
        });
    }, [isScriptLoaded, paymentData, resumenPedido, localCartSummary, WOMPI_PUBLIC_KEY, getWompiSignature]);

    const initializeWompiWidget = async (summary) => {
        try {
            // Validaciones previas
            if (!WOMPI_PUBLIC_KEY || WOMPI_PUBLIC_KEY === 'undefined') {
                throw new Error('Clave pública de Wompi no configurada');
            }

            if (!summary || summary.Total <= 0) {
                throw new Error('El total del pedido no es válido');
            }

            // Validar email
            if (!paymentData.email_cliente || !paymentData.email_cliente.includes('@')) {
                throw new Error('Email del cliente no es válido');
            }

            const amountInCents = Math.round(summary.Total * 100);

            // Generar referencia única
            const generateReference = () => {
                const timestamp = Date.now();
                const randomNum = Math.floor(Math.random() * 1000);
                const facturaId = paymentData.id_factura_temp || 'temp';
                return `REF-${facturaId}-${timestamp}-${randomNum}`;
            };

            const reference = generateReference();

            console.log('📊 Enviando datos al backend:', {
                monto: summary.Total,
                centavos: amountInCents,
                referencia: reference,
                email: paymentData.email_cliente,
                facturaId: paymentData.id_factura_temp
            });

            // ✅ Obtener la firma del backend enviando referencia y monto
            const signatureData = await createCheckout(reference, amountInCents);

            console.log('🔐 Firma obtenida:', signatureData.wompiCheckout.signature.integrity);

            // Verificar que el widget de Wompi esté disponible
            if (!window.WidgetCheckout) {
                throw new Error('El widget de Wompi no está disponible. Recarga la página.');
            }

            // Configuración del checkout con firma
            const checkoutConfig = {
                currency: 'COP',
                amountInCents: amountInCents,
                reference: reference,  // ✅ Usar la misma referencia
                publicKey: WOMPI_PUBLIC_KEY,
                signature: {
                    integrity: signatureData.wompiCheckout.signature.integrity
                },
                redirectUrl: REDIRECT_URL || window.location.origin + '/gracias-por-tu-compra',
                customerData: {
                    email: paymentData.email_cliente,
                    fullName: paymentData.nombre_cliente || 'Cliente'
                }
            };

            // Agregar dirección de envío si está disponible
            if (paymentData.direccion_envio) {
                checkoutConfig.shippingAddress = {
                    addressLine1: paymentData.direccion_envio,
                    city: paymentData.ciudad || '',
                    phoneNumber: paymentData.telefono || ''
                };
            }

            console.log('🚀 Configuración del checkout con firma:', checkoutConfig);

            // Crear el checkout
            const checkout = new window.WidgetCheckout(checkoutConfig);

            // Configurar el callback para manejar la respuesta
            checkout.open(function (result) {
                console.log('📱 Resultado del pago:', result);

                const transaction = result.transaction;

                if (transaction && transaction.status === 'APPROVED') {
                    console.log('✅ Pago aprobado');
                    clearCartAfterPayment();
                    alert('¡Pago aprobado exitosamente!');
                    navigate(`/gracias-por-tu-compra?transaction_id=${transaction.id}&reference=${transaction.reference}`);
                } else if (transaction && transaction.status === 'DECLINED') {
                    console.log('❌ Pago declinado');
                    alert('El pago fue declinado. Por favor, verifica tus datos e intenta de nuevo.');
                } else if (transaction && transaction.status === 'ERROR') {
                    console.log('⚠️ Error en el pago');
                    alert('Ocurrió un error durante el procesamiento. Por favor, intenta de nuevo.');
                } else {
                    console.log('🔄 Pago no completado o cancelado');
                    alert('El proceso de pago no se completó.');
                }
            });

            // Renderizar el botón en el contenedor
            const widgetContainer = document.getElementById('wompi-widget-container');
            if (widgetContainer) {
                checkout.render(widgetContainer);
            }

        } catch (error) {
            console.error("❌ Error al inicializar el widget:", error);
            setError(`Error al inicializar el pago: ${error.message}`);
        }
    };

    const summary = contextToken ? resumenPedido : localCartSummary;

    // Mostrar error si hay problemas de configuración
    if (error) {
        return (
            <div className="pago-container">
                <div className="error-container" style={{
                    padding: '20px',
                    backgroundColor: '#fee',
                    border: '1px solid #fcc',
                    borderRadius: '8px',
                    margin: '20px 0'
                }}>
                    <h2>Error de Configuración</h2>
                    <p>{error}</p>
                    <div style={{ marginTop: '15px' }}>
                        <h3>Pasos para solucionar:</h3>
                        <ol>
                            <li>Verifica que tu archivo <code>.env</code> tenga la variable <code>VITE_WOMPI_PUBLIC_KEY</code></li>
                            <li>La clave debe empezar con <code>pub_prod_</code> o <code>pub_test_</code></li>
                            <li>Reinicia el servidor de desarrollo después de cambiar el .env</li>
                            <li>Verifica que la clave sea correcta en el dashboard de Wompi</li>
                        </ol>
                    </div>
                    <button onClick={() => navigate('/checkout')} style={{
                        marginTop: '15px',
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                        Volver al Checkout
                    </button>
                </div>
            </div>
        );
    }

    if (!paymentData) {
        return (
            <div className="pago-container">
                <h1>Finalizar Pago</h1>
                <p>Cargando datos de pago...</p>
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="pago-container">
                <h1>Finalizar Pago</h1>
                <p>Cargando información del pedido...</p>
                <button onClick={() => navigate('/checkout')}>Volver al checkout</button>
            </div>
        );
    }

    if (summary.Total === undefined || summary.Total <= 0) {
        return (
            <div className="pago-container">
                <h1>Finalizar Pago</h1>
                <p>Error: Total del pedido no válido</p>
                <button onClick={() => navigate('/checkout')}>Volver al checkout</button>
            </div>
        );
    }

    return (
        <div className="pago-container">
            <div className="pago-content">
                <h1>Finalizar Pago</h1>

                <div className="payment-info">
                    <h2>Resumen del Pedido</h2>

                    <div className="order-details">
                        <div className="summary-line">
                            <span>Total de artículos:</span>
                            <span>${summary.TotalArticulosSinDescuento?.toLocaleString() || '0'}</span>
                        </div>

                        {summary.DescuentoArticulos > 0 && (
                            <div className="summary-line discount">
                                <span>Descuento:</span>
                                <span>-${summary.DescuentoArticulos?.toLocaleString() || '0'}</span>
                            </div>
                        )}

                        <div className="summary-line">
                            <span>Subtotal:</span>
                            <span>${summary.Subtotal?.toLocaleString() || '0'}</span>
                        </div>

                        <div className="summary-line">
                            <span>Envío:</span>
                            <span>${summary.PrecioEnvio?.toLocaleString() || '0'}</span>
                        </div>

                        <div className="summary-line total">
                            <span><strong>Total a pagar:</strong></span>
                            <span><strong>${summary.Total?.toLocaleString() || '0'} COP</strong></span>
                        </div>
                    </div>

                    <div className="payment-method">
                        <h3>Método de Pago</h3>
                        <p>Utiliza el botón de pago seguro de Wompi para completar tu compra.</p>
                        {WOMPI_PUBLIC_KEY && (
                            <p style={{ fontSize: '12px', color: '#666' }}>
                                Modo: {WOMPI_PUBLIC_KEY.includes('test') ? 'Prueba' : 'Producción'}
                            </p>
                        )}
                    </div>

                    {/* Contenedor del widget de Wompi */}
                    <div className="wompi-payment-section">
                        {!isScriptLoaded ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <p>Cargando sistema de pagos...</p>
                                <div className="loading-spinner" style={{
                                    border: '3px solid #f3f3f3',
                                    borderTop: '3px solid #3498db',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    animation: 'spin 1s linear infinite',
                                    margin: '10px auto'
                                }}></div>
                            </div>
                        ) : (
                            <div
                                id="wompi-widget-container"
                                style={{
                                    marginTop: '20px',
                                    padding: '20px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    backgroundColor: '#f9f9f9'
                                }}
                            >
                                {/* El widget de Wompi se renderizará aquí */}
                            </div>
                        )}
                    </div>

                    <div className="payment-actions" style={{ marginTop: '20px' }}>
                        <button
                            className="btn-back"
                            onClick={() => navigate('/checkout')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginRight: '10px'
                            }}
                        >
                            Volver al Checkout
                        </button>
                    </div>
                </div>

                {/* Debug info mejorada */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="debug-info" style={{
                        marginTop: '20px',
                        padding: '15px',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        fontSize: '12px'
                    }}>
                        <strong>🔍 Debug Info:</strong>
                        <div style={{ marginTop: '10px' }}>
                            <p>✅ Context Token: {contextToken ? 'Sí' : 'No'}</p>
                            <p>✅ Payment Data: {paymentData ? 'Disponible' : 'No disponible'}</p>
                            <p>✅ Summary Total: ${summary?.Total?.toLocaleString()}</p>
                            <p>✅ Wompi Key: {WOMPI_PUBLIC_KEY ? 'Configurada' : '❌ NO CONFIGURADA'}</p>
                            <p>✅ Script Loaded: {isScriptLoaded ? 'Sí' : 'No'}</p>
                            <p>✅ Email: {paymentData?.email_cliente || 'No disponible'}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Estilos para la animación de carga */}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};