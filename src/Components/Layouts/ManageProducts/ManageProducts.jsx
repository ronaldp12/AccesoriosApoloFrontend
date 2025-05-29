import React, { useState, useEffect, useContext } from "react";
import "./ManageProducts.css";
import { FaSearch, FaHome, FaEdit, FaTrash, FaUndo } from "react-icons/fa";
import img1 from "../../../assets/images/img1-manage-users.png";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../Ui/Pagination/Pagination.jsx";
import { ConfirmDeleteModal } from "../../Ui/ConfirmDeleteModal/ConfirmDeleteModal.jsx";
import { ConfirmRestoreModal } from "../../Ui/ConfirmRestoreModal/ConfirmRestoreModal.jsx";
import { context } from "../../../Context/Context.jsx";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { RegisterSubcategorieModal } from "../../Ui/RegisterSubcategoryModal/RegisterSubcategoryModal.jsx";
import { UpdateSubcategoryModal } from "../../Ui/UpdateSubcategoryModal/UpdateSubcategoryModal.jsx";

export const ManageProducts = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isConfirmRestoreOpen, setIsConfirmRestoreOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const subcategoriesPerPage = 7;
    const navigate = useNavigate();
    const { isLoading, setIsLoading } = useContext(context);
    const [searchName, setSearchName] = useState("");

    const fetchSubcategories = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/subcategorias");
            if (!response.ok) {
                throw new Error("Error al obtener subcategorías");
            }

            const data = await response.json();
            console.log(data.subcategorias);
            if (data.success) {
                setSubcategories(data.subcategorias);
            } else {
                console.error("Error en la respuesta al obtener subcategorías");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredSubcategories = subcategories.filter((subcategory) =>
        subcategory.nombre_subcategoria.toLowerCase().includes(searchName.toLowerCase())
    );

    const handleEditClick = (subcategory) => {
        setSelectedSubcategory(subcategory);
        setIsModalUpdateOpen(true);
    };

    const openRegisterModal = () => setIsModalRegisterOpen(true);
    const closeRegisterModal = () => setIsModalRegisterOpen(false);
    const closeUpdateModal = () => setIsModalUpdateOpen(false);

    const openConfirmDeleteModal = (subcategory) => {
        setSelectedSubcategory(subcategory);
        setIsConfirmDeleteOpen(true);
    };
    const closeConfirmDeleteModal = () => {
        setIsConfirmDeleteOpen(false);
        setSelectedSubcategory(null);
    };

    const openConfirmRestoreModal = (subcategory) => {
        setSelectedSubcategory(subcategory);
        setIsConfirmRestoreOpen(true);
    };
    const closeConfirmRestoreModal = () => {
        setIsConfirmRestoreOpen(false);
        setSelectedSubcategory(null);
    };

    const indexLast = currentPage * subcategoriesPerPage;
    const indexFirst = indexLast - subcategoriesPerPage;
    const currentSubcategories = filteredSubcategories.slice(indexFirst, indexLast);
    const totalPages = Math.ceil(filteredSubcategories.length / subcategoriesPerPage);

    useEffect(() => {
        fetchSubcategories();
    }, []);

    return (
        <div className="products-manage-container">
            <div className="breadcrumb">
                <FaHome onClick={() => navigate("/dashboard")} className="icono-home" />
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-actual">Productos</span>
            </div>

            <div className="products-header">
                <h2>Productos</h2>
                <button className="btn-registrar" onClick={openRegisterModal}>
                    Registrar Producto
                </button>
            </div>
            <hr className="hr-product" />

            <div className="products-filtros">
                <div className="filtro-input">
                    <input
                        type="text"
                        placeholder="Buscar por Referencia"
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
                    <img src={wheelIcon} alt="Loading..." className="manage-products-spinner" />
                    <p>Cargando productos</p>
                </div>
            )}

            {!isLoading && (
                <div className="products-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Descuento</th>
                                <th>Categoría</th>
                                <th>Imagen</th>
                                <th>Estado</th>
                                <th>Editar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentSubcategories.map((subcategory) => (
                                <tr key={subcategory.id_subcategoria}>
                                    <td>{subcategory.id_subcategoria}</td>
                                    <td>{subcategory.nombre_subcategoria}</td>
                                    <td>{subcategory.descripcion}</td>
                                    <td>{subcategory.descuento}%</td>
                                    <td>{subcategory.nombre_categoria}</td>
                                    <td>
                                        <img
                                            src={subcategory.url_imagen}
                                            alt={`Imagen de ${subcategory.nombre_subcategoria}`}
                                            className="products-img"
                                        />
                                    </td>
                                    <td>
                                        <span className={`estado ${subcategory.estado === 1 ? "activo" : "inactivo"}`}>
                                            {subcategory.estado === 1 ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td>
                                        <FaEdit onClick={() => handleEditClick(subcategory)} className="icono-editar" />
                                    </td>
                                    <td>
                                        {subcategory.estado === 1 ? (
                                            <FaTrash onClick={() => openConfirmDeleteModal(subcategory)} className="icono-delete" />
                                        ) : (
                                            <FaUndo onClick={() => openConfirmRestoreModal(subcategory)} className="icono-restore" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <RegisterSubcategorieModal
                isOpen={isModalRegisterOpen}
                onClose={closeRegisterModal}
                onRegisterSuccess={fetchSubcategories}
            />

            <UpdateSubcategoryModal
                key={selectedSubcategory?.id_subcategoria || "nuevo"}
                isOpen={isModalUpdateOpen}
                onClose={closeUpdateModal}
                idSubcategoria={selectedSubcategory?.id_subcategoria}
                onUpdateSuccess={fetchSubcategories}
            />

            <ConfirmDeleteModal
                isOpen={isConfirmDeleteOpen}
                onClose={closeConfirmDeleteModal}
                title="¿Eliminar subcategoría?"
                description={
                    <>
                        ¿Estás seguro de que deseas eliminar el producto <strong>{selectedSubcategory?.nombre_subcategoria}</strong> con referencia <strong>{selectedSubcategory?.id_subcategoria}</strong>?
                    </>
                }
                usuario={selectedSubcategory}
                onConfirmSuccess={fetchSubcategories}
                endpoint="https://accesoriosapolobackend.onrender.com/eliminar-subcategoria"
                method="PUT"
                payloadKey="id_subcategoria"
                confirmText="ELIMINAR"
            />

            <ConfirmRestoreModal
                isOpen={isConfirmRestoreOpen}
                onClose={closeConfirmRestoreModal}
                usuario={selectedSubcategory}
                onConfirmSuccess={fetchSubcategories}
                title="¿Recuperar subcategoría?"
                message={
                    <>
                        ¿Quieres restaurar el producto <strong>{selectedSubcategory?.nombre_subcategoria}</strong> con referencia<strong>{selectedSubcategory?.id_subcategoria}</strong>?
                    </>
                }
                confirmText="RECUPERAR"
                endpoint="https://accesoriosapolobackend.onrender.com/reactivar-subcategoria"
                method="PUT"
                payloadKey="id_subcategoria"
            />

            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
    );
};
