import React, { useState, useEffect } from 'react';
import './PreviewInvoiceSuplier.css';
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const PreviewInvoiceSuplier = ({ invoiceId, isModal = false, onClose }) => {
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
            console.error('Error fetching invoice data:', err);
            setError(err.message || 'Error al cargar los datos de la factura');
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

    const renderInvoiceContent = () => {
        if (loading) {
            return (
                <div className="invoice-loading-state">
                    <img src={wheelIcon} alt="Cargando..." className="manage-invoice-spinner" />
                    <p>Cargando factura...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="invoice-error-state">
                    <p>❌ {error}</p>
                    <button className="btn-retry" onClick={retryFetch}>
                        Reintentar
                    </button>
                </div>
            );
        }

        if (!invoiceData) {
            return (
                <div className="invoice-empty-state">
                    <p>No se encontraron datos de la factura</p>
                </div>
            );
        }

        return (
            <div className="invoice-container">
                {/* Header */}
                <div className="invoice-header-preview">
                    <div className="company-info">
                        <h2 className="company-name">
                            {invoiceData.factura.proveedor.empresa || invoiceData.factura.proveedor.nombre}
                        </h2>
                        <p className="company-address">{invoiceData.factura.proveedor.direccion}</p>
                        <p className="company-phone">Teléfono: {invoiceData.factura.proveedor.telefono}</p>
                        <p className="company-nit">NIT: {invoiceData.factura.proveedor.nit}</p>
                    </div>
                    <div className="invoice-title">
                        <h1>FACTURA</h1>
                    </div>
                </div>

                {/* Invoice Info */}
                <div className="invoice-info">
                    <div className="invoice-number">
                        <div className="info-row-header">
                            <span className="label">FACTURA #</span>
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
                    <div className="supplier-info">
                        <h3 className="section-title">PROVEEDOR</h3>
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
                <div className="products-section-preview-invoice">
                    <table className="products-table-preview-invoice">
                        <thead>
                            <tr>
                                <th>REFERENCIA</th>
                                <th>DESCRIPCIÓN</th>
                                <th>CANT</th>
                                <th>PRECIO UNITARIO</th>
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
                                <td colSpan="5"></td>
                            </tr>
                            <tr className="empty-row">
                                <td colSpan="5"></td>
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
        return renderInvoiceContent();
    }

    return (
        <div className="invoice-modal-overlay" onClick={handleOverlayClick}>
            <div className="invoice-modal-container">
                <div className="invoice-modal-header">
                    <h3>Vista Previa de Factura</h3>
                    <div className="invoice-modal-actions">
                        <button className="btn-print" onClick={handlePrint}>
                            🖨 Imprimir
                        </button>
                        <button className="btn-close" onClick={onClose}>
                            ×
                        </button>
                    </div>
                </div>
                <div className="invoice-modal-content">
                    {renderInvoiceContent()}
                </div>
            </div>
        </div>
    );
};