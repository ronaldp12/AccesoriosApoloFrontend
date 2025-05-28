import React, { useState, useEffect, useContext } from "react";
import "./ManageCategories.css";
import { FaSearch, FaFilter, FaEdit, FaTrash, FaHome, FaUndo } from "react-icons/fa";
import img1 from "../../../assets/images/img1-manage-users.png";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../Ui/Pagination/Pagination.jsx";
import { ConfirmDeleteModal } from "../../Ui/ConfirmDeleteModal/ConfirmDeleteModal.jsx";
import { ConfirmRestoreModal } from "../../Ui/ConfirmRestoreModal/ConfirmRestoreModal.jsx";
import { context } from "../../../Context/Context.jsx";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { RegisterCategorieModal } from "../../Ui/RegisterCategoryModal/RegisterCategoryModal.jsx";
import { UpdateCategoryModal } from "../../Ui/UpdateCategoryModal/UpdateCategoryModal.jsx";

export const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isConfirmRestoreOpen, setIsConfirmRestoreOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 7;
    const navigate = useNavigate();
    const { isLoading, setIsLoading } = useContext(context);
    const [searchId, setSearchId] = useState("");

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/categorias");
            if (!response.ok) {
                throw new Error("Error al obtener categorias");
            }

            const data = await response.json();
            if (data.success) {
                setCategories(data.categorias);
            } else {
                console.error("Error en la respuesta al obtener categorías");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredCategories = categories.filter((category) =>
        category.id_categoria.toString().includes(searchId)
    );

    const handleEditClick = (category) => {
        setSelectedCategory(category);
        setIsModalUpdateOpen(true);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openRegisterModal = () => setIsModalRegisterOpen(true);
    const closeRegisterModal = () => setIsModalRegisterOpen(false);
    const closeUpdateModal = () => setIsModalUpdateOpen(false);

    const openConfirmDeleteModal = (category) => {
        setSelectedCategory(category);
        setIsConfirmDeleteOpen(true);
    };
    const closeConfirmDeleteModal = () => {
        setIsConfirmDeleteOpen(false);
        setSelectedCategory(null);
    };

    const openConfirmRestoreModal = (category) => {
        setSelectedCategory(category);
        setIsConfirmRestoreOpen(true);
    };
    const closeConfirmRestoreModal = () => {
        setIsConfirmRestoreOpen(false);
        setSelectedCategory(null);
    };

    const indexLastCategory = currentPage * categoriesPerPage;
    const indexFirstCategory = indexLastCategory - categoriesPerPage;
    const currentCategories = filteredCategories.slice(indexFirstCategory, indexLastCategory);
    const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

    return (
        <div className="categories-container">
            <div className="breadcrumb">
                <FaHome onClick={() => navigate("/dashboard")} className="icono-home" />
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-actual">Categories</span>
            </div>

            <div className="categories-header">
                <h2>Categorías</h2>
                <button className="btn-registrar" onClick={openRegisterModal}>
                    Registrar Categoría
                </button>
            </div>
            <hr className="hr-categorie" />

            <div className="categories-filtros">
                <div className="filtro-input">
                    <input
                        type="text"
                        placeholder="Buscar por Nombre"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    <FaSearch className="icono-buscar" />
                </div>
                <div className="img-filtro">
                    <img src={img1} alt="img1-manage" />
                </div>
            </div>

            {isLoading && (
                <div className="tabla-loader">
                    <img src={wheelIcon} alt="Loading..." className="manage-categories-spinner" />
                    <p>Cargando categorías</p>
                </div>
            )}

            {!isLoading && (
                <div className="categories-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Id Categoría</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Descuento</th>
                                <th>Estado</th>
                                <th>Editar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCategories.map((category, index) => (
                                <tr key={category.id_categoria}>
                                    <td>{category.id_categoria}</td>
                                    <td>{category.nombre_categoria}</td>
                                    <td>{category.descripcion}</td>
                                    <td>{category.descuento}%</td>
                                    <td>
                                        <span className={`estado ${category.estado === 1 ? "activo" : "inactivo"}`}>
                                            {category.estado === 1 ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td>
                                        <FaEdit onClick={() => handleEditClick(category)} className="icono-editar" />
                                    </td>
                                    <td>
                                        {category.estado === 1 ? (
                                            <FaTrash onClick={() => openConfirmDeleteModal(category)} className="icono-delete" />
                                        ) : (
                                            <FaUndo onClick={() => openConfirmRestoreModal(category)} className="icono-restore" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <RegisterCategorieModal
                isOpen={isModalRegisterOpen}
                onClose={closeRegisterModal}
                onRegisterSuccess={fetchCategories}
            />

            <UpdateCategoryModal
                isOpen={isModalUpdateOpen}
                onClose={closeUpdateModal}
                idCategoria={selectedCategory?.id_categoria}
                onUpdateSuccess={fetchCategories}
            />

            <ConfirmDeleteModal
                isOpen={isConfirmDeleteOpen}
                onClose={closeConfirmDeleteModal}
                title="Delete category?"
                description={
                    <>
                        ¿Estás seguro de que deseas eliminar la categoría <strong>{selectedCategory?.nombre_categoria}</strong> con ID <strong>{selectedCategory?.id_categoria}</strong>?
                    </>
                }
                usuario={selectedCategory}
                onConfirmSuccess={fetchCategories}
                endpoint="https://accesoriosapolobackend.onrender.com/eliminar-categoria"
                method="PUT"
                payloadKey="id_categoria"
                confirmText="ELIMINAR"
            />

            <ConfirmRestoreModal
                isOpen={isConfirmRestoreOpen}
                onClose={closeConfirmRestoreModal}
                usuario={selectedCategory}
                onConfirmSuccess={fetchCategories}
                title="Recuperar categoria ?"
                message={
                    <>
                        ¿Quieres restaurar la categoría <strong>{selectedCategory?.nombre_categoria}</strong> con ID <strong>{selectedCategory?.id_categoria}</strong>?
                    </>
                }
                confirmText="RESTORE"
                endpoint="https://accesoriosapolobackend.onrender.com/reactivar-categoria"
                method="PUT"
                payloadKey="id_categoria"
            />

            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
    );
};
