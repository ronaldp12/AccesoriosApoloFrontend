import React, { useState, useEffect } from 'react';
import './PreviewSaleClient.css';
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const PreviewSaleSuplier = ({ invoiceId, isModal = false, onClose }) => {
    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (invoiceId) {
            fetchInvoiceData(invoiceId);
        }
    }, [invoiceId]);

    const fetchInvoiceData = async (id) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`https://accesoriosapolobackend.onrender.com/consultar-detalle-factura-proveedor/${id}`);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.success) {
                setInvoiceData(result.data);
            } else {
                setError(result.mensaje || 'Error al obtener los datos de la factura');
            }
        } catch (err) {
            console.error('Error fetching sale data:', err);
            setError(err.message || 'Error al cargar los datos de la venta');
        } finally {
            setLoading(false);
        }
    };

    const retryFetch = () => {
        if (invoiceId) {
            fetchInvoiceData(invoiceId);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && onClose) {
            onClose();
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const renderSaleContent = () => {
        if (loading) {
            return (
                <div className="sale-loading-state">
                    <img src={wheelIcon} alt="Cargando..." className="manage-sale-spinner" />
                    <p>Cargando factura venta...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="sale-error-state">
                    <p>❌ {error}</p>
                    <button className="btn-retry" onClick={retryFetch}>
                        Reintentar
                    </button>
                </div>
            );
        }

        if (!invoiceData) {
            return (
                <div className="sale-empty-state">
                    <p>No se encontraron datos de la venta</p>
                </div>
            );
        }

        return (
            <div className="sale-container">
                {/* Header */}
                <div className="sale-header-preview">
                    <div className="client-info">
                        <h2 className="client-name">
                            {invoiceData.factura.proveedor.empresa || invoiceData.factura.proveedor.nombre}
                        </h2>
                        <p className="client-address">{invoiceData.factura.proveedor.direccion}</p>
                        <p className="client-phone">Teléfono: {invoiceData.factura.proveedor.telefono}</p>
                        <p className="client-nit">NIT: {invoiceData.factura.proveedor.nit}</p>
                    </div>
                    <div className="sale-title">
                        <h1>FACTURA VENTA</h1>
                    </div>
                </div>

                {/* Sale Info */}
                <div className="sale-info">
                    <div className="sale-number">
                        <div className="info-row-header">
                            <span className="label">FACTURA VENTA #</span>
                            <span className="label">FECHA</span>
                        </div>
                    </div>
                        <div className="info-row">
                            <span className="value">{invoiceData.factura.id}</span>
                            <span className="value">{invoiceData.factura.fecha_compra}</span>
                        </div>
                    
                </div>

                {/* Supplier Info */}
                <div className="parties-info">
                    <div className="client-info">
                        <h3 className="section-title">CLIENTE</h3>
                        <div className="party-details">
                            <h4>{invoiceData.factura.proveedor.nombre}</h4>
                            <p>{invoiceData.factura.proveedor.empresa}</p>
                            <p>{invoiceData.factura.proveedor.direccion}</p>
                            <p>{invoiceData.factura.proveedor.telefono}</p>
                            <p>NIT: {invoiceData.factura.proveedor.nit}</p>
                        </div> 
                    </div>

                    <div className="client-info">
                        <h3 className="section-title">MÉTODO DE PAGO</h3>
                        <div className="party-details">
                            <p>{invoiceData.factura.metodo_pago}</p>
                        </div> 
                    </div>
                </div>

                {/* Products Table */}
                <div className="products-section-preview-sale">
                    <table className="products-table-preview-sale">
                        <thead>
                            <tr>
                                <th>REFERENCIA</th>
                                <th>DESCRIPCIÓN</th>
                                <th>CANT</th>
                                <th>PRECIO UNITARIO</th>
                                <th>PRECIO DESCUENTO</th>
                                <th>SUBTOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoiceData.productos.map((product, index) => (
                                <tr key={index}>
                                    <td className="product-ref">Ref: {product.referencia}</td>
                                    <td className="description-cell">
                                        <div className="product-name">{product.nombre}</div>
                                    </td>
                                    <td className="quantity-cell">{product.cantidad}</td>
                                    <td className="price-cell">{product.precio_unitario}</td>
                                    <td className="amount-cell">{product.subtotal}</td>
                                </tr>
                            ))}
                            <tr className="empty-row">
                                <td colSpan="6"></td>
                            </tr>
                            <tr className="empty-row">
                                <td colSpan="6"></td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="totals-section">
                        <div className="total-row final-total">
                            <span className="total-label">Total:</span>
                            <span className="total-value">{invoiceData.factura.valor_total}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!isModal) {
        return renderSaleContent();
    }

    return (
        <div className="sale-modal-overlay" onClick={handleOverlayClick}>
            <div className="sale-modal-container">
                <div className="sale-modal-header">
                    <h3>Vista Previa de Venta</h3>
                    <div className="sale-modal-actions">
                        <button className="btn-print" onClick={handlePrint}>
                            🖨 Imprimir
                        </button>
                        <button className="btn-close" onClick={onClose}>
                            ×
                        </button>
                    </div>
                </div>
                <div className="sale-modal-content">
                    {renderSaleContent()}
                </div>
            </div>
        </div>
    );
};