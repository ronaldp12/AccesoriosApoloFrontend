import React, { useEffect, useState } from "react";
import "./ManageUsers.css";
import { FaSearch, FaFilter, FaEdit, FaTrash, FaHome } from "react-icons/fa";
import img1 from "../../../assets/images/img1-manage-users.png";

export const ManageUsers = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const fetchUsuarios = async () => {
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
            }
        };

        fetchUsuarios();
    }, []);


    return (
        <div className="usuarios-container">
            <div className="breadcrumb">
                <FaHome className="icono-home" />
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-actual">Usuarios</span>
            </div>

            <div className="usuarios-header">
                <h2>Usuarios</h2>
                <button className="btn-registrar">Registrar Usuario</button>
            </div>
            <hr className="hr-usuario" />

            <div className="usuarios-filtros">
                <div className="filtro-input">
                    <input type="text" placeholder="Consultar por cédula" />
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
                        {usuarios.map((usuario, index) => (
                            <tr key={usuario.cedula}>
                                <td>{index + 1}</td>
                                <td>{usuario.cedula}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.correo}</td>
                                <td>{usuario.telefono}</td>
                                <td>{usuario.rol}</td>
                                <td>
                                    <span
                                        className={`estado ${usuario.estado === "Activo" ? "activo" : "inactivo"
                                            }`}
                                    >
                                        {usuario.estado}
                                    </span>
                                </td>
                                <td>
                                    <FaEdit className="icono-editar" />
                                </td>
                                <td>
                                    <FaTrash className="icono-eliminar" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
