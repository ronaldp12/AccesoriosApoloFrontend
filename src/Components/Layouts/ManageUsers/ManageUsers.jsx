import React, { useEffect, useState, useContext } from "react";
import "./ManageUsers.css";
import { FaSearch, FaFilter, FaEdit, FaTrash, FaHome, FaUndo } from "react-icons/fa";
import img1 from "../../../assets/images/img1-manage-users.png";
import { RegisterUserModal } from "../../Ui/RegisterUserModal/RegisterUserModal";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../Ui/Pagination/Pagination";
import { UpdateUserModal } from "../../Ui/UpdateUserModal/UpdateUserModal";
import { ConfirmDeleteModal } from "../../Ui/ConfirmDeleteModal/ConfirmDeleteModal";
import { context } from "../../../Context/Context.jsx";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { debounce } from "lodash";
import { ConfirmRestoreModal } from "../../Ui/ConfirmRestoreModal/ConfirmRestoreModal.jsx";

export const ManageUsers = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPage] = useState(7);

    const indexUltimoUsuario = currentPage * usersPage;
    const indexPrimerUsuario = indexUltimoUsuario - usersPage;
    const usuariosActuales = usuarios.slice(indexPrimerUsuario, indexUltimoUsuario);
    const totalPages = Math.ceil(usuarios.length / usersPage);

    const openRegisterModal = () => setIsModalRegisterOpen(true);
    const closeRegisterModal = () => setIsModalRegisterOpen(false);

    const openUpdateModal = (usuario) => {
        setSelectedUserToEdit(usuario);
        setIsModalUpdateOpen(true);
    };
    const closeUpdateModal = () => setIsModalUpdateOpen(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isConfirmRestoreOpen, setIsConfirmRestoreOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filterEmail, setFilterEmail] = useState("");
    const usersToShow = filterEmail.trim() === "" ? usuariosActuales : usuarios;
    const { isLoading, setIsLoading } = useContext(context);

    const openConfirmDeleteModal = (usuario) => {
        setSelectedUser(usuario);
        setIsConfirmDeleteOpen(true);
    };

    const closeConfirmDeleteModal = () => {
        setIsConfirmDeleteOpen(false);
        setSelectedUser(null);
    };

    const openConfirmRestoreModal = (usuario) => {
        setSelectedUser(usuario);
        setIsConfirmRestoreOpen(true);
    };

    const closeConfirmRestoreModal = () => {
        setIsConfirmRestoreOpen(false);
        setSelectedUser(null);
    };

    const fetchUsuarios = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("https://accesoriosapolobackend.onrender.com/usuarios", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setUsuarios(data.usuarios);
            } else {
                console.error("Error al obtener usuarios");
            }
        } catch (error) {
            console.error("Error al consultar la API:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const debouncedSearchUserByEmail = debounce(async (correo, fetchUsuarios, setUsuarios, setIsLoading) => {
        if (correo.trim() === "") {
            await fetchUsuarios();
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`https://accesoriosapolobackend.onrender.com/buscar-usuario-correo?filtro=${correo}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                setUsuarios(data.usuarios);
            } else {
                setUsuarios([]);
            }
        } catch (error) {
            console.error("Error al buscar usuarios:", error);
        } finally {
            setIsLoading(false);
        }
    }, 200);

    useEffect(() => {
        debouncedSearchUserByEmail(filterEmail, fetchUsuarios, setUsuarios, setIsLoading);
    }, [filterEmail]);

    return (
        <div className="usuarios-container">
            <div className="breadcrumb">
                <FaHome onClick={() => navigate("/dashboard")} className="icono-home" />
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-actual">Usuarios</span>
            </div>

            <div className="usuarios-header">
                <h2>Usuarios</h2>
                <button className="btn-registrar" onClick={openRegisterModal}>
                    Registrar Usuario
                </button>
            </div>
            <hr className="hr-usuario" />

            <div className="usuarios-filtros">
                <div className="filtro-input">
                    <input type="text" placeholder="Consultar por correo"
                        value={filterEmail}
                        onChange={(e) => setFilterEmail(e.target.value)} />
                    <FaSearch className="icono-buscar" />
                </div>
                <select className="filtro-select">
                    <option>Rol</option>
                    <option value="">Cliente</option>
                    <option value="">Gerente</option>
                    <option value="">Vendedor</option>
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
                    <img src={wheelIcon} alt="Cargando..." className="manage-users-spinner" />
                </div>
            )}

            <div className="tabla-usuarios">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Cédula</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersToShow.map((usuario, index) => (
                            <tr key={usuario.cedula || index}>
                                <td>{indexPrimerUsuario + index + 1}</td>
                                <td>{usuario.cedula}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.correo}</td>
                                <td>{usuario.telefono}</td>
                                <td>{usuario.rol}</td>
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
                                        <FaTrash
                                            onClick={() => openConfirmDeleteModal(usuario)}
                                            className="icono-delete"
                                        />
                                    ) : (
                                        <FaUndo
                                            onClick={() => openConfirmRestoreModal(usuario)}
                                            className="icono-restore"
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <RegisterUserModal
                isOpen={isModalRegisterOpen}
                onClose={closeRegisterModal}
                onRegisterSuccess={fetchUsuarios}
            />

            <UpdateUserModal
                isOpen={isModalUpdateOpen}
                onClose={closeUpdateModal}
                usuario={selectedUserToEdit}
                onUpdateSuccess={fetchUsuarios}
            />

            <ConfirmDeleteModal
                isOpen={isConfirmDeleteOpen}
                onClose={closeConfirmDeleteModal}
                usuario={selectedUser}
                onDeleteSuccess={fetchUsuarios}
            />

            <ConfirmRestoreModal
                isOpen={isConfirmRestoreOpen}
                onClose={closeConfirmRestoreModal}
                usuario={selectedUser}
                onRestoreSuccess={fetchUsuarios}
            />  

            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
    );
};
