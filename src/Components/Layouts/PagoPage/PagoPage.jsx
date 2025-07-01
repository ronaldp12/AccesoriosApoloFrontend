import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseCheckout } from '../../Hook/UseCheckout/UseCheckout.jsx';
import { context } from '../../../Context/Context.jsx';
import './PagoPage.css';

export const PagoPage = () => {
    const navigate = useNavigate();
    const { token: contextToken } = useContext(context);
    const [error, setError] = useState(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckoutReady, setIsCheckoutReady] = useState(false);
    const [checkoutInstance, setCheckoutInstance] = useState(null);

    const {
        paymentData,
        resumenPedido,
        localCartSummary,
        clearCartAfterPayment,
        createCheckout,
    } = UseCheckout();

    const WOMPI_PUBLIC_KEY = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
    const REDIRECT_URL = import.meta.env.VITE_WOMPI_REDIRECT_URL;
    const summary = contextToken ? resumenPedido : localCartSummary;

    useEffect(() => {
        if (document.querySelector('script[src*="checkout.wompi.co/widget.js"]')) {
            setIsScriptLoaded(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.wompi.co/widget.js';
        script.onload = () => setIsScriptLoaded(true);
        script.onerror = () => setError('Error al cargar el sistema de pagos.');
        document.head.appendChild(script);
    }, []);

    useEffect(() => {
        if (!paymentData) {
            const timer = setTimeout(() => navigate('/checkout'), 1500);
            return () => clearTimeout(timer);
        }
    }, [paymentData, navigate]);

    useEffect(() => {
        if (!isScriptLoaded || !paymentData || !WOMPI_PUBLIC_KEY) return;
        if (!summary || summary.Total <= 0) {
            setIsLoading(true);
            return;
        }
        if (isCheckoutReady) return;

        setIsLoading(false);

        const prepareWompiWidget = async (summaryData) => {
            try {
                const amountInCents = Math.round(summaryData.Total * 100);
                const reference = `REF-${paymentData.id_factura_temp}-${Date.now()}`;
                const signatureData = await createCheckout(reference, amountInCents);

                if (!window.WidgetCheckout) throw new Error('Wompi no disponible.');

                const checkout = new window.WidgetCheckout({
                    currency: 'COP',
                    amountInCents,
                    reference,
                    publicKey: WOMPI_PUBLIC_KEY,
                    signature: { integrity: signatureData.wompiCheckout.signature.integrity },
                    redirectUrl: REDIRECT_URL,
                    customerData: {
                        email: paymentData.email_cliente,
                        fullName: paymentData.nombre_cliente || 'Cliente'
                    }
                });

                setCheckoutInstance(checkout);
                setIsCheckoutReady(true);

            } catch (err) {
                setError(`Error al inicializar: ${err.message}`);
            }
        };

        prepareWompiWidget(summary);

    }, [isScriptLoaded, paymentData, summary, isCheckoutReady, createCheckout, WOMPI_PUBLIC_KEY, REDIRECT_URL]);

    const handlePagarClick = () => {
        if (checkoutInstance && isCheckoutReady) {
            checkoutInstance.open((result) => {
                const { transaction } = result;
                if (transaction?.status === 'APPROVED') {
                    clearCartAfterPayment();
                    navigate(`/gracias-por-tu-compra?transaction_id=${transaction.id}&reference=${transaction.reference}`);
                } else if (transaction?.status === 'DECLINED') {
                    alert('Pago declinado.');
                } else {
                    alert('Pago no completado o cancelado.');
                }
            });
        } else {
            setError('Sistema de pagos no disponible.');
        }
    };

    if (error) {
        return (
            <div className="pago-container-pago-page">
                <div className="error-container">
                    <h2>Error en el Pago</h2>
                    <p className="error-message">{error}</p>
                    <button className="btn-back" onClick={() => navigate('/checkout')}>Volver</button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="pago-container-pago-page">
                <h1>Finalizar Pago</h1>
                <p className="loading-message">Cargando resumen del pedido...</p>
            </div>
        );
    }

    return (
        <div className="pago-container-pago-page">
            <div className="pago-content-pago-page">
                <h1>Finalizar Pago</h1>
                <div className="payment-info-pago-page">
                    <h2>Resumen del Pedido</h2>
                    <div className="order-details-pago-page">
                        <div className="summary-line-pago-page">
                            <span>Total de artículos:</span>
                            <span>${summary.TotalArticulosSinDescuento?.toLocaleString() || '0'}</span>
                        </div>
                        {summary.DescuentoArticulos > 0 && (
                            <div className="summary-line-pago-page discount">
                                <span>Descuento:</span>
                                <span>-${summary.DescuentoArticulos?.toLocaleString() || '0'}</span>
                            </div>
                        )}
                        <div className="summary-line-pago-page">
                            <span>Subtotal:</span>
                            <span>${summary.Subtotal?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="summary-line-pago-page">
                            <span>Envío:</span>
                            <span>${summary.PrecioEnvio?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="summary-line-pago-page total">
                            <strong>Total a pagar:</strong>
                            <strong>${summary.Total?.toLocaleString() || '0'} COP</strong>
                        </div>
                    </div>
                    <div className="payment-method-pago-page">
                        <h3>Método de Pago</h3>
                        <p>Haz clic en el botón de pago seguro para completar tu compra.</p>
                    </div>
                    <div className="wompi-payment-section">
                        <button
                            className={`btn-pagar-wompi ${isCheckoutReady ? 'active' : 'disabled'}`}
                            onClick={handlePagarClick}
                            disabled={!isCheckoutReady}
                        >
                            {isCheckoutReady ? 'Pagar ahora' : 'Preparando pago...'}
                        </button>
                    </div>
                    <div className="payment-actions-pago-page">
                        <button className="btn-back-pago-page" onClick={() => navigate('/checkout')}>Volver al Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
