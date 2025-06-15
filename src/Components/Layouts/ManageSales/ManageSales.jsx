import React, { useState, useEffect, useContext } from "react";
import "./ManageSales.css";
import { FaSearch, FaHome, FaEye, FaFilter } from "react-icons/fa";
import img1 from "../../../assets/images/img1-manage-users.png";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../Ui/Pagination/Pagination";
import { context } from "../../../Context/Context.jsx";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { RegisterSaleModal } from "../../Ui/RegisterSaleModal/RegisterSaleModal.jsx";
import { PreviewSaleClient } from "../../Ui/PreviewSaleClient/PreviewSaleClient.jsx";

export const ManageSales = () => {
    const [ventas, setVentas] = useState([]);
    const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const invoicesPerPage = 7;
    const navigate = useNavigate();
    const { isLoading, setIsLoading } = useContext(context);
    const [searchDate, setSearchDate] = useState("");
    const [searchCedula, setSearchCedula] = useState("");

    const fetchVentas = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/Consultar-ventas");
            if (!response.ok) {
                throw new Error("Error al obtener las ventas");
            }

            const data = await response.json();
            if (data.success) {
                const ventasOrdenadas = data.ventas.sort((a, b) => a.id - b.id);
                setVentas(ventasOrdenadas);
            } else {
                console.error("Error al obtener las ventas:", data.mensaje);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredVentas = ventas.filter((venta) => {
        const ventaFecha = new Date(venta.fecha_compra_iso).toISOString().split('T')[0];
        const matchDate = !searchDate || ventaFecha === searchDate;
        const matchCedula = !searchCedula || venta.cedula.toString().includes(searchCedula);
        return matchDate && matchCedula;
    });


    const handleViewInvoice = (venta) => {
        setSelectedInvoiceId(venta.id_factura);
        setIsPreviewModalOpen(true);
    };

    const closePreviewModal = () => {
        setIsPreviewModalOpen(false);
        setSelectedInvoiceId(null);
    };

    useEffect(() => {
        fetchVentas();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchDate, searchCedula]);


    const openRegisterModal = () => setIsModalRegisterOpen(true);
    const closeRegisterModal = () => setIsModalRegisterOpen(false);

    const indexUltimaVenta = currentPage * invoicesPerPage;
    const indexPrimeraVenta = indexUltimaVenta - invoicesPerPage;
    const ventasActuales = filteredVentas.slice(indexPrimeraVenta, indexUltimaVenta);
    const totalPages = Math.ceil(filteredVentas.length / invoicesPerPage);

    return (
        <div className="manage-sale-container">
            <div className="breadcrumb">
                <FaHome onClick={() => navigate("/dashboard")} className="icono-home" />
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-actual">Ventas</span>
            </div>

            <div className="sale-header">
                <h2>Ventas</h2>
                <button className="btn-registrar" onClick={openRegisterModal}>
                    Registrar Venta
                </button>
            </div>
            <hr className="hr-sale" />

            <div className="sale-filtros">
                <div className="filtro-input">
                    <input
                        type="date"
                        placeholder="Consultar por Fecha"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                    />
                    <FaSearch className="icono-buscar" />
                </div>
                <div className="filtro-input">
                    <input
                        type="text"
                        placeholder="Consultar por cédula"
                        value={searchCedula}
                        onChange={(e) => setSearchCedula(e.target.value)}
                    />
                    <FaSearch className="icono-buscar" />
                </div>
                <button
                    onClick={() => {
                        setSearchCedula("");
                        setSearchDate("");
                        setCurrentPage(1);
                    }}
                    className="btn-filtrar-users"
                >
                    Limpiar
                </button>
                <div className="img-filtro">
                    <img src={img1} alt="img1-manage" />
                </div>
            </div>

            {isLoading && (
                <div className="tabla-loader">
                    <img src={wheelIcon} alt="Cargando..." className="manage-sale-spinner" />
                    <p>Cargando ventas...</p>
                </div>
            )}

            <div className="sale-table">
                <table>
                    <thead>
                        <tr>
                            <th>Id Factura</th>
                            <th>Cédula</th>
                            <th>Nombre Cliente</th>
                            <th>Fecha Compra</th>
                            <th>Valor Total</th>
                            <th>Método Pago</th>
                            <th>Ver Venta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventasActuales.map((venta, index) => (
                            <tr key={venta.id_factura}>
                                <td>{venta.id_factura}</td>
                                <td>{venta.cedula}</td>
                                <td>{venta.nombre_cliente}</td>
                                <td>{venta.fecha_compra}</td>
                                <td>{venta.total_formateado}</td>
                                <td>{venta.metodo_pago}</td>
                                <td>
                                    <FaEye
                                        onClick={() => handleViewInvoice(venta)}
                                        className="icono-ver-venta"
                                        title="Ver venta"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {ventasActuales.length === 0 && !isLoading && (
                <div className="no-data">
                    <p>No se encontraron ventas.</p>
                </div>
            )}

            <RegisterSaleModal
                isOpen={isModalRegisterOpen}
                onClose={closeRegisterModal}
                onRegisterSuccess={fetchVentas}
            />

            {isPreviewModalOpen && selectedInvoiceId && (
                <PreviewSaleClient
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