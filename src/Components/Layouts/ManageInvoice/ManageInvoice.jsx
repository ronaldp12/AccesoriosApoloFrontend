import React, { useState, useEffect, useContext } from "react";
import "./ManageInvoice.css";
import { FaSearch, FaHome, FaEye } from "react-icons/fa";
import img1 from "../../../assets/images/img1-manage-users.png";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../Ui/Pagination/Pagination";
import { context } from "../../../Context/Context.jsx";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { RegisterInvoiceModal } from "../../Ui/RegisterInvoiceModal/RegisterInvoiceModal.jsx";
import { PreviewInvoiceSuplier } from "../../Ui/PreviewInvoiceSuplier/PreviewInvoiceSuplier.jsx";

export const ManageInvoice = () => {
    const [facturas, setFacturas] = useState([]);
    const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const invoicesPerPage = 7;
    const navigate = useNavigate();
    const { isLoading, setIsLoading } = useContext(context);
    const [searchDate, setSearchDate] = useState("");

    const fetchFacturas = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/facturas-proveedores");
            if (!response.ok) {
                throw new Error("Error al obtener facturas de proveedores");
            }

            const data = await response.json();
            if (data.success) {
                const facturasOrdenadas = data.facturas.sort((a, b) => a.id - b.id);
                setFacturas(facturasOrdenadas);
            } else {
                console.error("Error al obtener facturas de proveedores");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredFacturas = facturas.filter((factura) => {
        if (!searchDate) return true;
        const [d, m, y] = factura.fecha.split('/');
        const facturaFecha = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        return facturaFecha === searchDate;
    });

    const handleViewInvoice = (factura) => {
        console.log("Ver factura:", factura);
        setSelectedInvoiceId(factura.id);
        setIsPreviewModalOpen(true);
    };

    const closePreviewModal = () => {
        setIsPreviewModalOpen(false);
        setSelectedInvoiceId(null);
    };

    useEffect(() => {
        fetchFacturas();
    }, []);

    const openRegisterModal = () => setIsModalRegisterOpen(true);
    const closeRegisterModal = () => setIsModalRegisterOpen(false);

    const indexUltimaFactura = currentPage * invoicesPerPage;
    const indexPrimeraFactura = indexUltimaFactura - invoicesPerPage;
    const facturasActuales = filteredFacturas.slice(indexPrimeraFactura, indexUltimaFactura);
    const totalPages = Math.ceil(filteredFacturas.length / invoicesPerPage);

    return (
        <div className="manage-invoice-container">
            <div className="breadcrumb">
                <FaHome onClick={() => navigate("/dashboard")} className="icono-home" />
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-actual">Facturas Proveedores</span>
            </div>

            <div className="invoice-header">
                <h2>Facturas Proveedores</h2>
                <button className="btn-registrar" onClick={openRegisterModal}>
                    Registrar Factura
                </button>
            </div>
            <hr className="hr-invoice" />

            <div className="invoice-filtros">
                <div className="filtro-input">
                    <input
                        type="date"
                        placeholder="Consultar por Fecha"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                    />
                    <FaSearch className="icono-buscar" />
                </div>
                <div className="img-filtro">
                    <img src={img1} alt="img1-manage" />
                </div>
            </div>

            {isLoading && (
                <div className="tabla-loader">
                    <img src={wheelIcon} alt="Cargando..." className="manage-invoice-spinner" />
                    <p>Cargando facturas proveedores...</p>
                </div>
            )}

            <div className="invoice-table">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>NIT</th>
                            <th>Nombre Empresa</th>
                            <th>Fecha Compra</th>
                            <th>Valor Total</th>
                            <th>Método Pago</th>
                            <th>Ver Factura</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facturasActuales.map((factura, index) => (
                            <tr key={factura.id}>
                                <td>{factura.id}</td>
                                <td>{factura.nit}</td>
                                <td>{factura.empresa}</td>
                                <td>{factura.fecha}</td>
                                <td>${factura.valor_total}</td>
                                <td>{factura.metodo_pago}</td>
                                <td>
                                    <FaEye
                                        onClick={() => handleViewInvoice(factura)}
                                        className="icono-ver-factura"
                                        title="Ver factura"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {facturasActuales.length === 0 && !isLoading && (
                <div className="no-data">
                    <p>No se encontraron facturas de proveedores.</p>
                </div>
            )}

            <RegisterInvoiceModal
                isOpen={isModalRegisterOpen}
                onClose={closeRegisterModal}
                onRegisterSuccess={fetchFacturas}
            />

            {isPreviewModalOpen && selectedInvoiceId && (
                <PreviewInvoiceSuplier
                    invoiceId={selectedInvoiceId}
                    isModal={true}
                    onClose={closePreviewModal}
                />
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};