import React, { useState, useEffect } from 'react';
import './PreviewSaleClient.css';
import wheelIcon from "../../../assets/icons/img1-loader.png";
import logoApolo from "../../../assets/images/logoAccesoriosApolo.png";

export const PreviewSaleClient = ({ invoiceId, isModal = false, onClose }) => {
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

            const response = await fetch(`https://accesoriosapolobackend.onrender.com/Consultar-detalle-venta/${id}`);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.success) {
                const ventaData = result.data;
                setInvoiceData(ventaData);
            } else {
                setError(result.mensaje || 'Error al obtener los datos de la venta');
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

    // Separar productos y calcomanías
    const separateItems = (items) => {
        const productos = items.filter(item => item.type === 'producto');
        const calcomanias = items.filter(item => item.type === 'calcomania');
        return { productos, calcomanias };
    };

    const renderSaleContent = () => {
        if (loading) {
            return (
                <div className="sale-loading-state">
                    <img src={wheelIcon} alt="Cargando..." className="manage-sale-spinner" />
                    <p>Cargando recibo venta...</p>
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

        const { productos, calcomanias } = separateItems(invoiceData.items || []);

        return (
            <div className="sale-container">
                {/* Header */}
                <div className="sale-header-preview">
                    <div className="company-info">
                        <img src={logoApolo} alt="Logo Accesorios Apolo" className="company-logo" />
                        <div className="company-details">
                            <h2 className="company-name">ACCESORIOS APOLO</h2>
                            <p className="company-address">Carrera 6 #21-28, Montenegro, Quindío</p>
                            <p className="company-phone">Teléfono: 3233264578</p>
                            <p className="company-nit">NIT: 1.084.331.933</p>
                        </div>
                    </div>
                    <div className="sale-title">
                        <h1>RECIBO VENTA</h1>
                    </div>
                </div>

                {/* Sale Info */}
                <div className="sale-info">
                    <div className="sale-number">
                        <div className="info-row-header">
                            <span className="label">RECIBO VENTA #</span>
                            <span className="label">FECHA</span>
                        </div>
                    </div>
                    <div className="info-row">
                        <span className="value">{invoiceData.id}</span>
                        <span className="value">{invoiceData.fecha_venta}</span>
                    </div>
                </div>

                {/* Client Info */}
                <div className="parties-info">
                    <div className="client-info">
                        <h3 className="section-title">CLIENTE</h3>
                        <div className="party-details">
                            <h4>{invoiceData.cliente.nombre}</h4>
                            <p>Cédula: {invoiceData.cliente.cedula}</p>
                            <p>Correo: {invoiceData.cliente.correo}</p>
                            <p>Teléfono: {invoiceData.cliente.telefono}</p>
                        </div>
                    </div>

                    <div className="client-info">
                        <h3 className="section-title">MÉTODO DE PAGO</h3>
                        <div className="party-details">
                            <p>{invoiceData.metodo_pago}</p>
                        </div>
                    </div>
                </div>

                {/* Productos Table */}
                {productos.length > 0 && (
                    <div className="items-section-preview-sale">
                        <h3 className="items-section-title">PRODUCTOS</h3>
                        <table className="items-table-preview-sale">
                            <thead>
                                <tr>
                                    <th>REFERENCIA</th>
                                    <th>DESCRIPCIÓN</th>
                                    <th>CANT</th>
                                    <th>PRECIO ORIGINAL</th>
                                    <th>PRECIO UNITARIO</th>
                                    <th>SUBTOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((product, index) => (
                                    <tr key={`producto-${index}`}>
                                        <td className="product-ref">Ref: {product.referencia}</td>
                                        <td className="description-cell">
                                            <div className="product-name">{product.nombre}</div>
                                        </td>
                                        <td className="quantity-cell">{product.cantidad}</td>
                                        <td className="original-price-cell">{product.precio_original_display}</td>
                                        <td className="price-cell">
                                            {product.precio_unitario_final_vendido || '-'}
                                        </td>
                                        <td className="amount-cell">{product.subtotal_item}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Calcomanías Table */}
                {calcomanias.length > 0 && (
                    <div className="items-section-preview-sale">
                        <h3 className="items-section-title">CALCOMANÍAS</h3>
                        <table className="items-table-preview-sale">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>DESCRIPCIÓN</th>
                                    <th>TAMAÑO</th>
                                    <th>CANT</th>
                                    <th>PRECIO ORIGINAL</th>
                                    <th>PRECIO UNITARIO</th>
                                    <th>SUBTOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {calcomanias.map((calcomania, index) => (
                                    <tr key={`calcomania-${index}`}>
                                        <td className="calcomania-id">ID: {calcomania.id_calcomania}</td>
                                        <td className="description-cell">
                                            <div className="product-name">{calcomania.nombre}</div>
                                        </td>
                                        <td className="size-cell">
                                            <span className={`size-badge size-${calcomania.tamano}`}>
                                                {calcomania.tamano}
                                            </span>
                                        </td>
                                        <td className="quantity-cell">{calcomania.cantidad}</td>
                                        <td className="original-price-cell">{calcomania.precio_original_display}</td>
                                        <td className="price-cell">
                                            {calcomania.precio_unitario_final_vendido || '-'}
                                        </td>
                                        <td className="amount-cell">{calcomania.subtotal_item}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Totals */}
                <div className="totals-section">
                    <div className="total-row">
                        <span className="total-label">Subtotal:</span>
                        <span className="total-value">{invoiceData.subtotal_general}</span>
                    </div>
                    {invoiceData.descuento_total_aplicado && invoiceData.descuento_total_aplicado !== '$0,00' && (
                        <div className="total-row discount-row">
                            <span className="total-label">Descuento:</span>
                            <span className="total-value discount-value">-{invoiceData.descuento_total_aplicado}</span>
                        </div>
                    )}
                    <div className="total-row final-total">
                        <span className="total-label">Total:</span>
                        <span className="total-value">{invoiceData.valor_total}</span>
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