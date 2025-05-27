import React, { useState, useEffect, useContext } from "react";
import "./ManageSupliers.css";
import { FaSearch, FaFilter, FaEdit, FaTrash, FaHome, FaUndo } from "react-icons/fa";
import img1 from "../../../assets/images/img1-manage-users.png";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../Ui/Pagination/Pagination";
import { RegisterSuplierModal } from "../../Ui/RegisterSuplierModal/RegisterSuplierModal";
import { UpdateSuplierModal } from "../../Ui/UpdateSuplierModal/UpdateSuplierModal";
import { ConfirmDeleteModal } from "../../Ui/ConfirmDeleteModal/ConfirmDeleteModal";
import { ConfirmRestoreModal } from "../../Ui/ConfirmRestoreModal/ConfirmRestoreModal";
import { context } from "../../../Context/Context.jsx";
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const ManageSupliers = () => {
    const [proveedores, setProveedores] = useState([]);
    const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isConfirmRestoreOpen, setIsConfirmRestoreOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPage = 7;
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { isLoading, setIsLoading, getErrorMessage } = useContext(context);
    const [selectedNit, setSelectedNit] = useState(null);

    const fetchProveedores = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/proveedores");
            if (!response.ok) {
                throw new Error("Error al obtener proveedores");
            }

            const data = await response.json();
            if (data.success) {
                setProveedores(data.proveedores);
            } else {
                console.error("Error al obtener usuarios");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (nit) => {
        setSelectedNit(nit);
        setIsModalUpdateOpen(true);
    };

    useEffect(() => {
        fetchProveedores();
    }, []);

    const openRegisterModal = () => setIsModalRegisterOpen(true);
    const closeRegisterModal = () => setIsModalRegisterOpen(false);
    const closeUpdateModal = () => setIsModalUpdateOpen(false);

    const openConfirmDeleteModal = (proveedor) => {
        setSelectedUser(proveedor);
        setIsConfirmDeleteOpen(true);
    };
    const closeConfirmDeleteModal = () => {
        setIsConfirmDeleteOpen(false);
        setSelectedUser(null);
    };

    const openConfirmRestoreModal = (proveedor) => {
        setSelectedUser(proveedor);
        setIsConfirmRestoreOpen(true);
    };
    const closeConfirmRestoreModal = () => {
        setIsConfirmRestoreOpen(false);
        setSelectedUser(null);
    };

    const indexUltimoUsuario = currentPage * usersPage;
    const indexPrimerUsuario = indexUltimoUsuario - usersPage;
    const usuariosActuales = proveedores.slice(indexPrimerUsuario, indexUltimoUsuario);
    const totalPages = Math.ceil(proveedores.length / usersPage);

    return (
        <div className="supliers-container">
            <div className="breadcrumb">
                <FaHome onClick={() => navigate("/dashboard")} className="icono-home" />
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-actual">Proveedores</span>
            </div>

            <div className="supliers-header">
                <h2>Proveedores</h2>
                <button className="btn-registrar" onClick={openRegisterModal}>
                    Registrar Proveedor
                </button>
            </div>
            <hr className="hr-suplier" />

            <div className="supliers-filtros">
                <div className="filtro-input">
                    <input type="text" placeholder="Consultar por NIT" />
                    <FaSearch className="icono-buscar" />
                </div>
                <select className="filtro-select">
                    <option value={""}>Rol</option>
                    <option value="cliente">Cliente</option>
                    <option value="gerente">Gerente</option>
                    <option value="vendedor">Vendedor</option>
                </select>
                <button className="btn-filtrar">
                    <span>Filtrar</span> <FaFilter />
                </button>
                <div className="img-filtro">
                    <img src={img1} alt="img1-manage" />
                </div>
            </div>

            {isLoading && (
                <div className="tabla-loader">
                    <img src={wheelIcon} alt="Cargando..." className="manage-supliers-spinner" />
                </div>
            )}

            <div className="supliers-table">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>NIT</th>
                            <th>Representante</th>
                            <th>Nombre Empresa</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                            <th>Estado</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosActuales.map((proveedor, index) => (
                            <tr key={proveedor.nit}>
                                <td>{indexPrimerUsuario + index + 1}</td>
                                <td>{proveedor.nit}</td>
                                <td>{proveedor.representante}</td>
                                <td>{proveedor.nombreEmpresa}</td>
                                <td>{proveedor.correo}</td>
                                <td>{proveedor.telefono}</td>
                                <td>{proveedor.direccion}</td>
                                <td>
                                    <span className={`estado ${proveedor.estado === 1 ? "activo" : "inactivo"}`}>
                                        {proveedor.estado === 1 ? "Activo" : "Inactivo"}
                                    </span>
                                </td>
                                <td>
                                    <FaEdit onClick={() => handleEditClick(proveedor.nit)} className="icono-editar" />
                                </td>
                                <td>
                                    {proveedor.estado === 1 ? (
                                        <FaTrash onClick={() => openConfirmDeleteModal(proveedor)} className="icono-delete" />
                                    ) : (
                                        <FaUndo onClick={() => openConfirmRestoreModal(proveedor)} className="icono-restore" />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <RegisterSuplierModal
                isOpen={isModalRegisterOpen}
                onClose={closeRegisterModal}
                onSuccess={fetchProveedores}
            />

            <UpdateSuplierModal
                isOpen={isModalUpdateOpen}
                onClose={closeUpdateModal}
                nitProveedor={selectedNit}
                onUpdateSuccess={fetchProveedores}
            />

            <ConfirmDeleteModal
                isOpen={isConfirmDeleteOpen}
                onClose={closeConfirmDeleteModal}
                title="¿Eliminar proveedor?"
                description={
                    <>
                        ¿Estás seguro de eliminar a <strong>{selectedUser?.nombreEmpresa}</strong> con NIT <strong>{selectedUser?.nit}</strong>?
                    </>
                }
                usuario={selectedUser}
                onConfirmSuccess={fetchProveedores}
                endpoint="https://accesoriosapolobackend.onrender.com/eliminar-proveedor"
                method="PUT"
                payloadKey="nit"
                confirmText="ELIMINAR"
            />


            <ConfirmRestoreModal
                isOpen={isConfirmRestoreOpen}
                onClose={closeConfirmRestoreModal}
                usuario={selectedUser}
                onConfirmSuccess={fetchProveedores}
                title="¿Recuperar proveedor?"
                message={
                    <>
                        ¿Deseas recuperar al proveedor <strong>{selectedUser?.nombreEmpresa}</strong> con NIT <strong>{selectedUser?.nit}</strong>?
                    </>
                }
                confirmText="RECUPERAR"
                endpoint="https://accesoriosapolobackend.onrender.com/reactivar-proveedor"
                method="PUT"
                payloadKey="nit"
            />


            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
    );
};
