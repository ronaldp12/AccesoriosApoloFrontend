import React, { useState, useEffect, useContext } from "react";
import "./ManageStickers.css";
import { FaSearch, FaHome, FaEdit, FaTrash, FaUndo } from "react-icons/fa";
import img1 from "../../../assets/images/img1-manage-users.png";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../Ui/Pagination/Pagination.jsx";
import { ConfirmDeleteModal } from "../../Ui/ConfirmDeleteModal/ConfirmDeleteModal.jsx";
import { ConfirmRestoreModal } from "../../Ui/ConfirmRestoreModal/ConfirmRestoreModal.jsx";
import { context } from "../../../Context/Context.jsx";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { RegisterStickerModal } from "../../Ui/RegisterStickerModal/RegisterStickerModal.jsx";
import { UpdateStickerModal } from "../../Ui/UpdateStickerModal/UpdateStickerModal.jsx";

export const ManageStickers = () => {
    const [calcomanias, setCalcomanias] = useState([]);
    const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [selectedCalcomania, setSelectedCalcomania] = useState(null);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isConfirmRestoreOpen, setIsConfirmRestoreOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const calcomaniasPorPagina = 7;
    const navigate = useNavigate();
    const { isLoading, setIsLoading } = useContext(context);
    const [searchName, setSearchName] = useState("");

    const fetchCalcomanias = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/calcomanias");
            if (!response.ok) {
                throw new Error("Error al obtener calcomanías");
            }

            const data = await response.json();
            console.log(data.calcomanias);
            if (data.success) {
                setCalcomanias(data.calcomanias);
            } else {
                console.error("Error en la respuesta al obtener calcomanías");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredCalcomanias = calcomanias.filter((calcomania) =>
        calcomania.nombre.toLowerCase().includes(searchName.toLowerCase())
    ).sort((a, b) => a.id_calcomania - b.id_calcomania);

    const handleEditClick = (calcomania) => {
        setSelectedCalcomania(calcomania);
        setIsModalUpdateOpen(true);
    };

    const openRegisterModal = () => setIsModalRegisterOpen(true);
    const closeRegisterModal = () => setIsModalRegisterOpen(false);
    const closeUpdateModal = () => setIsModalUpdateOpen(false);

    const openConfirmDeleteModal = (calcomania) => {
        setSelectedCalcomania(calcomania);
        setIsConfirmDeleteOpen(true);
    };
    const closeConfirmDeleteModal = () => {
        setIsConfirmDeleteOpen(false);
        setSelectedCalcomania(null);
    };

    const openConfirmRestoreModal = (calcomania) => {
        setSelectedCalcomania(calcomania);
        setIsConfirmRestoreOpen(true);
    };
    const closeConfirmRestoreModal = () => {
        setIsConfirmRestoreOpen(false);
        setSelectedCalcomania(null);
    };

    const indexLast = currentPage * calcomaniasPorPagina;
    const indexFirst = indexLast - calcomaniasPorPagina;
    const currentCalcomanias = filteredCalcomanias.slice(indexFirst, indexLast);
    const totalPages = Math.ceil(filteredCalcomanias.length / calcomaniasPorPagina);

    useEffect(() => {
        fetchCalcomanias();
    }, []);

    const formatDate = (fechaISO) => {
        if (!fechaISO) return '';

        try {
            const fechaStr = fechaISO.split('T')[0];
            const [año, mes, dia] = fechaStr.split('-');
            return `${dia}/${mes}/${año}`;
        } catch (error) {
            return '';
        }
    };

    return (
        <div className="stickers-container">
            <div className="breadcrumb">
                <FaHome onClick={() => navigate("/dashboard")} className="icono-home" />
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-actual">Calcomanías</span>
            </div>

            <div className="stickers-header">
                <h2>Calcomanías</h2>
                <button className="btn-registrar" onClick={openRegisterModal}>
                    Registrar Calcomanía
                </button>
            </div>
            <hr className="hr-stickers" />

            <div className="stickers-filtros">
                <div className="filtro-input">
                    <input
                        type="text"
                        placeholder="Buscar por Nombre"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                    <FaSearch className="icono-buscar" />
                </div>
                <div className="img-filtro">
                    <img src={img1} alt="img-manage" />
                </div>
            </div>

            {isLoading && (
                <div className="tabla-loader">
                    <img src={wheelIcon} alt="Loading..." className="manage-stickers-spinner" />
                    <p>Cargando Calcomanías...</p>
                </div>
            )}

            {!isLoading && (
                <div className="stickers-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nombre</th>
                                <th>Formato</th>
                                <th>Tamaño</th>
                                <th>Fecha Subida</th>
                                <th>Usuario</th>
                                <th>Vista Previa</th>
                                <th>Estado</th>
                                <th>Editar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCalcomanias.map((calcomania) => (
                                <tr key={calcomania.id_calcomania}>
                                    <td>{calcomania.id_calcomania}</td>
                                    <td>{calcomania.nombre}</td>
                                    <td>{calcomania.formato}</td>
                                    <td>{calcomania.tamano_archivo}</td>
                                    <td>{formatDate(calcomania.fecha_subida)}</td>
                                    <td>{calcomania.nombre_usuario}</td>
                                    <td>
                                        {calcomania.url_archivo && (
                                            <img
                                                src={calcomania.url_archivo}
                                                alt={`Vista previa de ${calcomania.nombre}`}
                                                className="stickers-img"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <span className={`estado ${calcomania.estado === 'Activo' ? "activo" : "inactivo"}`}>
                                            {calcomania.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <FaEdit onClick={() => handleEditClick(calcomania)} className="icono-editar" />
                                    </td>
                                    <td>
                                        {calcomania.estado === 'Activo' ? (
                                            <FaTrash onClick={() => openConfirmDeleteModal(calcomania)} className="icono-delete" />
                                        ) : (
                                            <FaUndo onClick={() => openConfirmRestoreModal(calcomania)} className="icono-restore" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {currentCalcomanias.length === 0 && !isLoading && (
                <div className="no-data">
                    <p>No se encontraron Calcomanías.</p>
                </div>
            )}

            <RegisterStickerModal
                isOpen={isModalRegisterOpen}
                onClose={closeRegisterModal}
                onRegisterSuccess={fetchCalcomanias}
            />

            <UpdateStickerModal
                key={selectedCalcomania?.id_calcomania || "nuevo"}
                isOpen={isModalUpdateOpen}
                onClose={closeUpdateModal}
                idCalcomania={selectedCalcomania?.id_calcomania}
                onUpdateSuccess={fetchCalcomanias}
            />

            <ConfirmDeleteModal
                isOpen={isConfirmDeleteOpen}
                onClose={closeConfirmDeleteModal}
                title="¿Eliminar calcomanía?"
                description={
                    <>
                        ¿Estás seguro de que deseas eliminar la calcomanía <strong>{selectedCalcomania?.nombre}</strong> con ID <strong>{selectedCalcomania?.id_calcomania}</strong>?
                    </>
                }
                usuario={selectedCalcomania}
                onConfirmSuccess={fetchCalcomanias}
                endpoint="https://accesoriosapolobackend.onrender.com/eliminar-calcomania"
                method="PUT"
                payloadKey="id_calcomania"
                confirmText="ELIMINAR"
            />

            <ConfirmRestoreModal
                isOpen={isConfirmRestoreOpen}
                onClose={closeConfirmRestoreModal}
                usuario={selectedCalcomania}
                onConfirmSuccess={fetchCalcomanias}
                title="¿Recuperar calcomanía?"
                message={
                    <>
                        ¿Quieres restaurar la calcomanía <strong>{selectedCalcomania?.nombre}</strong> con ID <strong>{selectedCalcomania?.id_calcomania}</strong>?
                    </>
                }
                confirmText="RECUPERAR"
                endpoint="https://accesoriosapolobackend.onrender.com/reactivar-calcomania"
                method="PUT"
                payloadKey="id_calcomania"
            />

            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
    );
};