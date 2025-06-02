import React, { useState, useEffect, useContext } from "react";
import "./ManageProducts.css";
import { FaSearch, FaHome, FaEdit, FaTrash, FaUndo, FaEye } from "react-icons/fa";
import img1 from "../../../assets/images/img1-manage-users.png";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../Ui/Pagination/Pagination.jsx";
import { ConfirmDeleteModal } from "../../Ui/ConfirmDeleteModal/ConfirmDeleteModal.jsx";
import { ConfirmRestoreModal } from "../../Ui/ConfirmRestoreModal/ConfirmRestoreModal.jsx";
import { context } from "../../../Context/Context.jsx";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { RegisterProductModal } from "../../Ui/RegisterProductModal/RegisterProductModal.jsx";
import { UpdateProductModal } from "../../Ui/UpdateProductModal/UpdateProductModal.jsx";
import { DescriptionProductModal } from "../../Ui/DescriptionProductModal/DescriptionProductModal.jsx";
import { ProductImagesModal } from "../../Ui/ProductImagesModal/ProductImagesModal.jsx";

export const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isConfirmRestoreOpen, setIsConfirmRestoreOpen] = useState(false);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState("");
    const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;
    const navigate = useNavigate();
    const { isLoading, setIsLoading } = useContext(context);
    const [searchRef, setSearchRef] = useState("");

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("https://accesoriosapolobackend.onrender.com/consultar-producto");
            if (!response.ok) throw new Error("Error al obtener productos");
            const data = await response.json();
            if (data.success) {
                setProducts(data.productos);
            } else {
                console.error("Error en la respuesta al obtener productos");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProducts = products.filter((product) =>
        product.referencia.toLowerCase().includes(searchRef.toLowerCase())
    );

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setIsModalUpdateOpen(true);
    };

    const openRegisterModal = () => setIsModalRegisterOpen(true);
    const closeRegisterModal = () => setIsModalRegisterOpen(false);
    const closeUpdateModal = () => setIsModalUpdateOpen(false);

    const openConfirmDeleteModal = (product) => {
        setSelectedProduct(product);
        setIsConfirmDeleteOpen(true);
    };
    const closeConfirmDeleteModal = () => {
        setIsConfirmDeleteOpen(false);
        setSelectedProduct(null);
    };

    const openConfirmRestoreModal = (product) => {
        setSelectedProduct(product);
        setIsConfirmRestoreOpen(true);
    };
    const closeConfirmRestoreModal = () => {
        setIsConfirmRestoreOpen(false);
        setSelectedProduct(null);
    };

    const indexLast = currentPage * productsPerPage;
    const indexFirst = indexLast - productsPerPage;
    const currentProducts = filteredProducts.slice(indexFirst, indexLast);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    useEffect(() => {
        fetchProducts();
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
                        value={searchRef}
                        onChange={(e) => setSearchRef(e.target.value)}
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
                                <th>Referencia</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Talla</th>
                                <th>Stock</th>
                                <th>Precio</th>
                                <th>Descuento</th>
                                <th>Precio Descuento</th>
                                <th>Categoría</th>
                                <th>Subcategoría</th>
                                <th>Imagen</th>
                                <th>Estado</th>
                                <th>Editar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map((product) => (
                                <tr key={product.referencia}>
                                    <td>{product.referencia}</td>
                                    <td>{product.nombre}</td>
                                    <td>
                                        {product.descripcion ? (
                                            <FaEye
                                                className="icono-ver-descripcion"
                                                onClick={() => {
                                                    setSelectedDescription(product.descripcion);
                                                    setIsDescriptionModalOpen(true);
                                                }}
                                            />
                                        ) : (
                                            <span>Sin descripción</span>
                                        )}
                                    </td>

                                    <td>{product.talla}</td>
                                    <td>{product.stock}</td>
                                    <td>{product.precio_unidad}</td>
                                    <td>{product.descuento}</td>
                                    <td>{product.precio_descuento}</td>
                                    <td>{product.categoria}</td>
                                    <td>{product.subcategoria}</td>
                                    <td>
                                        {product.imagenes.length > 0 ? (
                                            <FaEye
                                                className="icono-ver-imagenes"
                                                onClick={() => {
                                                    setSelectedImages(product.imagenes);
                                                    setIsImagesModalOpen(true);
                                                }}
                                            />
                                        ) : (
                                            <span>Sin imagen</span>
                                        )}
                                    </td>


                                    <td>
                                        <span className={`estado ${product.estado === 'Activo' ? "activo" : "inactivo"}`}>
                                            {product.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <FaEdit onClick={() => handleEditClick(product)} className="icono-editar" />
                                    </td>
                                    <td>
                                        {product.estado === "Activo" ? (
                                            <FaTrash onClick={() => openConfirmDeleteModal(product)} className="icono-delete" />
                                        ) : (
                                            <FaUndo onClick={() => openConfirmRestoreModal(product)} className="icono-restore" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <RegisterProductModal
                isOpen={isModalRegisterOpen}
                onClose={closeRegisterModal}
                onRegisterSuccess={fetchProducts}
            />

            <UpdateProductModal
                key={selectedProduct?.referencia || "nuevo"}
                isOpen={isModalUpdateOpen}
                onClose={closeUpdateModal}
                referencia={selectedProduct?.referencia}
                onUpdateSuccess={fetchProducts}
            />

            <ConfirmDeleteModal
                isOpen={isConfirmDeleteOpen}
                onClose={closeConfirmDeleteModal}
                title="¿Eliminar Producto?"
                description={
                    <>
                        ¿Deseas eliminar el producto <strong>{selectedProduct?.nombre}</strong> con referencia <strong>{selectedProduct?.referencia}</strong>?
                    </>
                }
                usuario={selectedProduct}
                onConfirmSuccess={fetchProducts}
                endpoint="https://accesoriosapolobackend.onrender.com/eliminar-producto"
                method="PUT"
                payloadKey="referencia"
                confirmText="ELIMINAR"
            />

            <ConfirmRestoreModal
                isOpen={isConfirmRestoreOpen}
                onClose={closeConfirmRestoreModal}
                usuario={selectedProduct?.referencia}
                onConfirmSuccess={fetchProducts}
                title="¿Recuperar Producto?"
                message={
                    <>
                        ¿Quieres restaurar el producto <strong>{selectedProduct?.nombre}</strong> con referencia <strong>{selectedProduct?.referencia}</strong>?
                    </>
                }
                confirmText="RECUPERAR"
                endpoint="https://accesoriosapolobackend.onrender.com/reactivar-producto"
                method="PUT"
                payloadKey="referencia"
            />

            <DescriptionProductModal
                isOpen={isDescriptionModalOpen}
                onClose={() => setIsDescriptionModalOpen(false)}
                initialValue={selectedDescription}
                readOnly={true}
            />

            <ProductImagesModal
                isOpen={isImagesModalOpen}
                onClose={() => setIsImagesModalOpen(false)}
                images={selectedImages}
            />

            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
        </div>
    );
};
