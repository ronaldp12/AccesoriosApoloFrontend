import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { context } from '../../../Context/Context.jsx'; 
import './ThanksForYourPurchase.css';

export function ThanksForYourPurchase() {
    const location = useLocation();
    const navigate = useNavigate();
    const { token, userLogin, name, checkAndRestoreAuthState } = useContext(context);
    const [transactionId, setTransactionId] = useState(null);
    const [reference, setReference] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setTransactionId(params.get('transaction_id'));
        setReference(params.get('reference'));

        if (checkAndRestoreAuthState) {
            checkAndRestoreAuthState();
        }
    }, [location, checkAndRestoreAuthState]);

    const handleVolver = () => {
        navigate('/');
    };

    return (
        <div className="gracias-compra-container">
            <div className="gracias-content">

                <div className="icon-check">
                    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                        <circle className="check-circle" cx="32" cy="32" r="27.5" fill="none" />
                        <path className="check-mark" fill="none" d="M20 34 l8 8 l16 -16" />
                    </svg>
                </div>

                <h1>¡Gracias por tu compra!</h1>
                <p className="mensaje-secundario">Tu pedido está siendo procesado y te notificaremos cuando esté en camino.</p>

                {transactionId && (
                    <p className="dato-transaccion">
                        <strong>ID de Transacción:</strong> {transactionId}
                    </p>
                )}

                {reference && (
                    <p className="dato-transaccion">
                        <strong>Referencia de tu Pedido:</strong> {reference}
                    </p>
                )}

                <p className="info-extra">También recibirás un correo con los detalles y, si es tu primera compra, las credenciales de acceso.</p>

                <div className="acciones-finales">
                    <button onClick={handleVolver} className="btn-volver-inicio">
                        Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    );
}