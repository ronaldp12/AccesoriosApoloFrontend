import React, { useState, useContext } from "react";
import "./ManageSupliers.css";
import { FaSearch, FaFilter, FaEdit, FaTrash, FaHome, FaUndo } from "react-icons/fa";
import img1 from "../../../assets/images/img1-manage-users.png";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../Ui/Pagination/Pagination";
import { RegisterSuplierModal } from "../../Ui/RegisterSuplierModal/RegisterSuplierModal";
import { UpdateSuplierModal } from "../../Ui/UpdateSuplierModal/UpdateSuplierModal";
import { ConfirmDeleteModal } from "../../Ui/ConfirmDeleteModal/ConfirmDeleteModal";
import { context } from "../../../Context/Context.jsx";

export const ManageSupliers = () => {
    const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
    const openRegisterModal = () => setIsModalRegisterOpen(true);
    const closeRegisterModal = () => setIsModalRegisterOpen(false);

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const openUpdateModal = () => setIsModalUpdateOpen(true);
    const closeUpdateModal = () => setIsModalUpdateOpen(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const navigate = useNavigate();

    const { isLoading, setIsLoading, errorMessage, successMessage } = useContext(context);

    const openConfirmDeleteModal = (usuario) => {
        setSelectedUser(usuario);
        setIsConfirmDeleteOpen(true);
    };
    const closeConfirmDeleteModal = () => {
        setIsConfirmDeleteOpen(false);
        setSelectedUser(null);
    };

    const supliersData = [
        {
            nit: "10101010",
            representante: "Carlos Pérez",
            nombreEmpresa: "Pérez S.A.S",
            correo: "carlos@example.com",
            telefono: "3001234567",
            direccion: "calle 34 # 76-23",
            estado: "Activo"
        },
        {
            nit: "20202020",
            representante: "Laura Gómez",
            nombreEmpresa: "Gómez Consultores S.A.S",
            correo: "laura.gomez@example.com",
            telefono: "3109876543",
            direccion: "carrera 45 # 12-34",
            estado: "Activo"
        },
        {
            nit: "30303030",
            representante: "Andrés Rodríguez",
            nombreEmpresa: "Rodríguez Tech S.A.S",
            correo: "andres.rod@example.com",
            telefono: "3201122334",
            direccion: "avenida 10 # 56-78",
            estado: "Inactivo"
        }


    ];

    const [currentPage, setCurrentPage] = useState(1);
    const usersPage = 7;

    const indexUltimoUsuario = currentPage * usersPage;
    const indexPrimerUsuario = indexUltimoUsuario - usersPage;
    const usuariosActuales = supliersData.slice(indexPrimerUsuario, indexUltimoUsuario);
    const totalPages = Math.ceil(supliersData.length / usersPage);

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
                        {usuariosActuales.map((usuario, index) => (
                            <tr key={usuario.nit || index}>
                                <td>{indexPrimerUsuario + index + 1}</td>
                                <td>{usuario.nit}</td>
                                <td>{usuario.representante}</td>
                                <td>{usuario.nombreEmpresa}</td>
                                <td>{usuario.correo}</td>
                                <td>{usuario.telefono}</td>
                                <td>{usuario.direccion}</td>
                                <td>
                                    <span className={`estado ${usuario.estado === "Activo" ? "activo" : "inactivo"}`}>
                                        {usuario.estado}
                                    </span>
                                </td>
                                <td>
                                    <FaEdit onClick={() => openUpdateModal(usuario)} className="icono-editar" />
                                </td>
                                <td>
                                    {usuario.estado === "Activo" ? (
                                        <FaTrash onClick={() => openConfirmDeleteModal(usuario)} className="icono-delete" />
                                    ) : (
                                        <FaUndo className="icono-restore" />
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
            />

            <UpdateSuplierModal
                isOpen={isModalUpdateOpen}
                onClose={closeUpdateModal}
            />

            <ConfirmDeleteModal
                isOpen={isConfirmDeleteOpen}
                onClose={closeConfirmDeleteModal}
                title="¿Eliminar proveedor?"
                description={
                    <>
                        ¿Estás seguro de eliminar a <strong>{selectedUser?.nombreEmpresa}</strong> con nit <strong>{selectedUser?.nit}</strong>?
                    </>}
                onConfirm={null}
                isLoading={isLoading}
                errorMessage={errorMessage}
                successMessage={successMessage}
            />

            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
    );
};
