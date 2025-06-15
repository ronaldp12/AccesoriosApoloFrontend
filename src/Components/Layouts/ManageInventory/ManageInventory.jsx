import React, { useState, useEffect, useContext } from "react";
import "./ManageInventory.css";
import { FaSearch, FaHome, FaEye, FaDownload } from "react-icons/fa";
import img1 from "../../../assets/images/img1-manage-users.png";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../Ui/Pagination/Pagination";
import { context } from "../../../Context/Context.jsx";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { ConfirmModal } from "../../Ui/ConfirmModal/ConfirmModal.jsx";
import { TopProductsChart } from "../InventoryStatistics/TopProductsCharts.jsx";
import { InventoryEvolutionChart } from "../InventoryStatistics/InventoryEvolutionChart.jsx";
import { CategoryValueChart } from "../InventoryStatistics/CategoryValueChart.jsx";

export const ManageInventory = () => {
    const [inventarios, setInventarios] = useState([]);
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const inventoriesPerPage = 5;
    const navigate = useNavigate();
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);
    const [searchDate, setSearchDate] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const openModalConfirm = () => setIsModalConfirmOpen(true);
    const closeModalConfirm = () => setIsModalConfirmOpen(false);

    const fetchInventarios = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/consultar-inventario");
            if (!response.ok) {
                throw new Error("Error al obtener inventarios");
            }
            const data = await response.json();
            if (data.success) {
                const inventariosOrdenados = data.inventarios.sort((a, b) => a.id - b.id);
                setInventarios(inventariosOrdenados);
            } else {
                console.error("Error al obtener inventarios");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInventarios();
    }, []);

    const filteredInventarios = inventarios.filter((item) => {
        if (!searchDate) return true;
        const [d, m, y] = item.fecha_creacion.split('/');
        const itemFecha = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        return itemFecha === searchDate;
    });

    const generarInventario = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://accesoriosapolobackend.onrender.com/generar-inventario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccessMessage("Inventario generado exitosamente."),
                    setErrorMessage("");
                fetchInventarios();
            } else {
                setErrorMessage(data.mensaje || "Error al generar inventario.");
                setErrorMessage(getErrorMessage(data, "Error al generar inventario."));
            }
        } catch (error) {
            console.log("Error al generar inventario:", error)
            setErrorMessage("Hubo un error al generar inventario.");
            setIsLoading(false);
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                closeModalConfirm();
                setSuccessMessage("");
                setErrorMessage("");
            }, 2000);
        }
    };

    const verPDFInventario = (id) => {
        const url = `https://accesoriosapolobackend.onrender.com/inventario-pdf/${id}`;
        window.open(url, '_blank');
    };

    const descargarPDFInventario = (id) => {
        const url = `https://accesoriosapolobackend.onrender.com/inventario-pdf-descargar/${id}`;
        window.open(url, '_blank');
    };

    const indexUltimo = currentPage * inventoriesPerPage;
    const indexPrimero = indexUltimo - inventoriesPerPage;
    const inventariosActuales = filteredInventarios.slice(indexPrimero, indexUltimo);
    const totalPages = Math.ceil(filteredInventarios.length / inventoriesPerPage);

    return (
        <div className="inventory-container">
            <div className="breadcrumb">
                <FaHome onClick={() => navigate("/dashboard")} className="icono-home" />
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-actual">Inventario</span>
            </div>

            <div className="inventory-header">
                <h2>Inventario</h2>
                <button className="btn-registrar" onClick={openModalConfirm}>
                    Generar Inventario
                </button>
            </div>
            <hr className="hr-inventory" />

            <div className="inventory-filtros">
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
                    <img src={wheelIcon} alt="Cargando..." className="manage-inventory-spinner" />
                    <p>Cargando inventarios...</p>
                </div>
            )}

            <div className="inventory-table">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Fecha de Informe</th>
                            <th>Total de Productos</th>
                            <th>Total de Unidades</th>
                            <th>Valor Total</th>
                            <th>Responsable</th>
                            <th>Ver PDF</th>
                            <th>Descargar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventariosActuales.map((inventario) => (
                            <tr key={inventario.id}>
                                <td>{inventario.id}</td>
                                <td>{inventario.fecha_creacion}</td>
                                <td>{inventario.cantidad_productos}</td>
                                <td>{inventario.cantidad_unidades}</td>
                                <td>${inventario.valor_total}</td>
                                <td>{inventario.responsable}</td>
                                <td>
                                    <FaEye
                                        className="icono-ver-factura"
                                        title="Ver PDF"
                                        onClick={() => verPDFInventario(inventario.id)}
                                    />
                                </td>
                                <td>
                                    <FaDownload
                                        className="icono-descargar-factura"
                                        title="Descargar PDF"
                                        onClick={() => descargarPDFInventario(inventario.id)}
                                    />
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {inventariosActuales.length === 0 && !isLoading && (
                <div className="no-data">
                    <p>No se encontraron inventarios.</p>
                </div>
            )}

            <div className="inventory-statistics">
                <h3>Estadísticas del Inventario</h3>
                <div className="charts-grid">
                    <TopProductsChart />
                    <InventoryEvolutionChart/>
                    <CategoryValueChart/>
                </div>
            </div>


            <ConfirmModal
                isOpen={isModalConfirmOpen}
                onClose={() => setIsModalConfirmOpen(false)}
                title="Generar Inventario"
                message="¿Está seguro de generar un nuevo inventario con los productos disponibles?"
                confirmText="Generar"
                onConfirm={generarInventario}
                errorMessage={errorMessage}
                successMessage={successMessage}
                isLoading={isLoading}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};
