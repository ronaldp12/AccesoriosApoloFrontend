import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function ThanksForYourPurchase() {
    const location = useLocation();
    const [transactionId, setTransactionId] = useState(null);
    const [reference, setReference] = useState(null);

    useEffect(() => {
        // Obtener los parámetros de la URL después de la redirección de Wompi
        const params = new URLSearchParams(location.search);
        setTransactionId(params.get('transaction_id'));
        setReference(params.get('reference'));
        // Nota: Si quieres mostrar el estado final del pedido, necesitarías
        // hacer una llamada a tu backend para consultar el estado actual
        // de la factura con la 'reference' recibida.
        // El webhook ya habrá actualizado la DB, así que aquí solo lo muestras.
    }, [location]);

    return (
        <div className="gracias-compra-container">
            <h1>¡Gracias por tu compra en Accesorios Apolo!</h1>
            <p>Tu pedido está siendo procesado.</p>
            {transactionId && <p>ID de Transacción Wompi: <strong>{transactionId}</strong></p>}
            {reference && <p>Referencia de tu Pedido: <strong>{reference}</strong></p>}
            <p>Recibirás un correo electrónico de confirmación con los detalles de tu pedido en breve.</p>
            <p>Si eres un nuevo usuario y tu compra se registró con éxito, también recibirás tus credenciales de acceso por correo electrónico.</p>
            <a href="/" className="btn-volver-inicio">Volver al inicio</a>
            {/* O un enlace para ver sus pedidos si ya está implementado */}
        </div>
    );
}