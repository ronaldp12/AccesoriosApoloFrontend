import React, { useState, useContext, useEffect, useRef } from "react";
import "./RegisterInvoiceModal.css";
import { context } from "../../../Context/Context";
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const RegisterInvoiceModal = ({ isOpen, onClose, onRegisterSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");

    // Referencias para las animaciones
    const modalRef = useRef(null);
    const titleRef = useRef(null);
    const formRef = useRef(null);
    const invoiceHeaderRef = useRef(null);
    const addProductSectionRef = useRef(null);
    const productsTableRef = useRef(null);
    const buttonsRef = useRef(null);

    const initialInvoiceData = {
        nit_proveedor: "",
        fecha_compra: "",
        metodo_pago: "efectivo"
    };

    const initialProductData = {
        referencia: "",
        cantidad: "",
        precio_unitario: ""
    };

    const [invoiceData, setInvoiceData] = useState(initialInvoiceData);
    const [productData, setProductData] = useState(initialProductData);
    const [products, setProducts] = useState([]);
    const [searchingProduct, setSearchingProduct] = useState(false);

    // Función de animación
    const animateElements = () => {
        if (!isOpen || !modalRef.current) return;

        const elements = [
            titleRef.current,           // título
            formRef.current,           // formulario
            invoiceHeaderRef.current,  // sección de datos principales
            addProductSectionRef.current, // sección agregar producto
            productsTableRef.current,  // tabla de productos (si existe)
            buttonsRef.current         // botones
        ].filter(Boolean);

        // Aplicar estilos iniciales
        elements.forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease';
            }
        });

        // Animar elementos con retrasos progresivos
        setTimeout(() => {
            if (titleRef.current) {
                titleRef.current.style.opacity = '1';
                titleRef.current.style.transform = 'translateY(0)';
            }
        }, 100);

        setTimeout(() => {
            if (formRef.current) {
                formRef.current.style.opacity = '1';
                formRef.current.style.transform = 'translateY(0)';
            }
        }, 200);

        setTimeout(() => {
            if (invoiceHeaderRef.current) {
                invoiceHeaderRef.current.style.opacity = '1';
                invoiceHeaderRef.current.style.transform = 'translateY(0)';
            }
        }, 300);

        setTimeout(() => {
            if (addProductSectionRef.current) {
                addProductSectionRef.current.style.opacity = '1';
                addProductSectionRef.current.style.transform = 'translateY(0)';
            }
        }, 400);

        setTimeout(() => {
            if (productsTableRef.current) {
                productsTableRef.current.style.opacity = '1';
                productsTableRef.current.style.transform = 'translateY(0)';
            }
        }, 500);

        setTimeout(() => {
            if (buttonsRef.current) {
                buttonsRef.current.style.opacity = '1';
                buttonsRef.current.style.transform = 'translateY(0)';
            }
        }, 600);
    };

    // Función para animar la tabla cuando se agrega un producto
    const animateProductsTable = () => {
        if (productsTableRef.current) {
            productsTableRef.current.style.opacity = '0';
            productsTableRef.current.style.transform = 'translateY(20px)';
            productsTableRef.current.style.transition = 'all 0.4s ease';

            setTimeout(() => {
                if (productsTableRef.current) {
                    productsTableRef.current.style.opacity = '1';
                    productsTableRef.current.style.transform = 'translateY(0)';
                }
            }, 50);
        }
    };

    const clearMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    const resetForm = () => {
        setInvoiceData(initialInvoiceData);
        setProductData(initialProductData);
        setProducts([]);
        clearMessages();
    };

    useEffect(() => {
        if (isOpen) {
            clearMessages();
            setTimeout(() => {
                animateElements();
            }, 100);
        }
    }, [isOpen]);

    // Animar tabla cuando cambian los productos
    useEffect(() => {
        if (products.length > 0) {
            animateProductsTable();
        }
    }, [products.length]);

    if (!isOpen && !isClosing) return null;

    const searchProductByReference = async (referencia) => {
        if (!referencia.trim()) return null;

        setSearchingProduct(true);
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`https://accesoriosapolobackend.onrender.com/buscar-producto-factura-referencia?referencia=${encodeURIComponent(referencia)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                return {
                    nombre: data.producto.nombre,
                    referencia: data.producto.referencia
                };
            } else {
                console.log("Producto no encontrado:", data.mensaje);
                return null;
            }

        } catch (error) {
            console.error("Error buscando producto:", error);
            return null;
        } finally {
            setSearchingProduct(false);
        }
    };

    const handleInvoiceChange = (e) => {
        const { name, value } = e.target;
        setInvoiceData(prev => ({ ...prev, [name]: value }));
        clearMessages();
    };

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
        clearMessages();
    };

    const handleAddProduct = async () => {
        const { referencia, cantidad, precio_unitario } = productData;

        if (!referencia.trim()) {
            setErrorMessage("La referencia es obligatoria");
            return;
        }
        if (!cantidad || parseFloat(cantidad) <= 0) {
            setErrorMessage("La cantidad debe ser mayor a 0");
            return;
        }
        if (!precio_unitario || parseFloat(precio_unitario) <= 0) {
            setErrorMessage("El precio unitario debe ser mayor a 0");
            return;
        }

        const productInfo = await searchProductByReference(referencia);
        if (!productInfo) {
            setErrorMessage(`No se encontró un producto con la referencia: ${referencia}`);
            return;
        }

        if (products.some(p => p.referencia === referencia)) {
            setErrorMessage("Esta referencia ya está agregada");
            return;
        }

        const cantidadNum = parseFloat(cantidad);
        const precioNum = parseFloat(precio_unitario);
        const subtotal = cantidadNum * precioNum;

        const newProduct = {
            id: Date.now(),
            referencia,
            nombre: productInfo.nombre,
            cantidad: cantidadNum,
            precio_unitario: precioNum,
            subtotal
        };

        setProducts(prev => [...prev, newProduct]);
        setProductData(initialProductData);
        clearMessages();
    };

    const handleRemoveProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const calculateTotal = () => {
        return products.reduce((total, product) => total + product.subtotal, 0);
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            resetForm();
            onClose();
        }, 400);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!invoiceData.nit_proveedor.trim()) {
            setErrorMessage("El NIT es obligatorio");
            return;
        }
        if (!invoiceData.fecha_compra) {
            setErrorMessage("La fecha de compra es obligatoria");
            return;
        }
        if (products.length === 0) {
            setErrorMessage("Debe agregar al menos un producto");
            return;
        }

        setIsLoading(true);
        clearMessages();

        try {
            const token = localStorage.getItem("token");

            const productosParaEnviar = products.map(product => ({
                referencia: product.referencia,
                nombre: product.nombre,
                cantidad: product.cantidad,
                precio_unitario: product.precio_unitario
            }));

            const totalCalculado = calculateTotal();

            const factura = {
                nit_proveedor: invoiceData.nit_proveedor,
                fecha_compra: invoiceData.fecha_compra,
                metodo_pago: invoiceData.metodo_pago,
                valor_total: totalCalculado,
                productos: productosParaEnviar
            };

            console.log("Datos enviados al backend:", factura);

            const response = await fetch("https://accesoriosapolobackend.onrender.com/registrar-factura-proveedor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(factura)
            });

            const data = await response.json();
            console.log("Respuesta backend:", data);

            if (data.success && response.ok) {
                setSuccessMessage("Factura registrada con éxito");
                setErrorMessage("");
                onRegisterSuccess();

                setTimeout(() => {
                    setSuccessMessage("");
                    resetForm();
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(data.mensaje || "Error al registrar factura");
            }

        } catch (error) {
            console.error("Error al registrar factura:", error);
            setErrorMessage("Hubo un error al registrar la factura");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReferenceBlur = async () => {
        if (productData.referencia.trim()) {
            const productInfo = await searchProductByReference(productData.referencia);
            if (productInfo) {
                console.log("Producto encontrado:", productInfo.nombre);
            }
        }
    };

    return (
        <div className="modal-overlay-register-invoice">
            <div ref={modalRef} className={`modal-content-register-invoice ${isClosing ? "exit" : "entry"}`}>
                <h2 ref={titleRef}>Registrar Factura Proveedor</h2>

                <form ref={formRef} className="form-register-invoice" onSubmit={handleSubmit}>
                    {/* Datos principales de la factura */}
                    <div ref={invoiceHeaderRef} className="invoice-header-section">
                        <div className="invoice-header-group">
                            <div className="form-group-register-invoice">
                                <label>NIT Proveedor *</label>
                                <input
                                    type="text"
                                    name="nit_proveedor"
                                    placeholder="Ingrese el NIT del proveedor"
                                    value={invoiceData.nit_proveedor}
                                    onChange={handleInvoiceChange}
                                />
                            </div>

                            <div className="form-group-register-invoice">
                                <label>Fecha de Compra *</label>
                                <input
                                    type="date"
                                    name="fecha_compra"
                                    value={invoiceData.fecha_compra}
                                    onChange={handleInvoiceChange}
                                />
                            </div>

                            <div className="form-group-register-invoice">
                                <label>Método de Pago *</label>
                                <select
                                    name="metodo_pago"
                                    value={invoiceData.metodo_pago}
                                    onChange={handleInvoiceChange}
                                >
                                    <option value="efectivo">Efectivo</option>
                                    <option value="transferencia">Transferencia</option>
                                    <option value="cheque">Cheque</option>
                                    <option value="credito">Crédito</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Formulario para agregar productos */}
                    <div ref={addProductSectionRef} className="add-product-section">
                        <h3>Agregar Producto</h3>
                        <div className="add-product-form">
                            <div className="form-group-register-invoice">
                                <label>Referencia *</label>
                                <input
                                    type="text"
                                    name="referencia"
                                    placeholder="REF001"
                                    value={productData.referencia}
                                    onChange={handleProductChange}
                                    onBlur={handleReferenceBlur}
                                />
                            </div>

                            <div className="form-group-register-invoice">
                                <label>Cantidad *</label>
                                <input
                                    type="number"
                                    name="cantidad"
                                    placeholder="1"
                                    min="0.01"
                                    step="0.01"
                                    value={productData.cantidad}
                                    onChange={handleProductChange}
                                />
                            </div>

                            <div className="form-group-register-invoice">
                                <label>Precio Unitario *</label>
                                <input
                                    type="text"
                                    name="precio_unitario"
                                    placeholder="0.00"
                                    value={`${productData.precio_unitario.toLocaleString("es-ES")}`}
                                    onChange={(e) => {
                                        const rawValue = e.target.value.replace(/\./g, "").replace(/[^0-9]/g, "");
                                        setProductData({
                                            ...productData,
                                            precio_unitario: Number(rawValue)
                                        });
                                        clearMessages();
                                    }}
                                />
                            </div>

                            <div className="add-product-button-container">
                                <button
                                    type="button"
                                    className="btn-add-product"
                                    onClick={handleAddProduct}
                                    disabled={searchingProduct}
                                >
                                    {searchingProduct ? (
                                        <img src={wheelIcon} alt="Buscando..." className="search-spinner" />
                                    ) : (
                                        "Agregar"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de productos */}
                    {products.length > 0 && (
                        <div ref={productsTableRef} className="products-table-section-invoice">
                            <h3>Productos Agregados</h3>
                            <div className="table-container-invoice">
                                <table className="products-table-invoice">
                                    <thead>
                                        <tr>
                                            <th>Referencia</th>
                                            <th>Nombre</th>
                                            <th>Cantidad</th>
                                            <th>Precio Unit.</th>
                                            <th>Subtotal</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(product => (
                                            <tr key={product.id}>
                                                <td>{product.referencia}</td>
                                                <td>{product.nombre}</td>
                                                <td>{product.cantidad}</td>
                                                <td>${product.precio_unitario.toLocaleString()}</td>
                                                <td>${product.subtotal.toLocaleString()}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn-remove-product"
                                                        onClick={() => handleRemoveProduct(product.id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="total-section">
                                <div className="total-display">
                                    <strong>Total: ${calculateTotal().toLocaleString()}</strong>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={buttonsRef} className="modal-buttons-register-invoice">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>
                            CANCELAR
                        </button>
                        <button type="submit" className="btn-agregar" disabled={isLoading}>
                            {isLoading ? (
                                <img src={wheelIcon} alt="Cargando..." className="register-invoice-spinner" />
                            ) : (
                                <span>REGISTRAR</span>
                            )}
                        </button>
                    </div>
                </form>

                {errorMessage && (
                    <div className="status-message-register error">
                        <span>{errorMessage}</span>
                        <i className="bi bi-x-circle"></i>
                    </div>
                )}

                {successMessage && (
                    <div className="status-message-register success">
                        <span>{successMessage}</span>
                        <i className="bi bi-check-circle"></i>
                    </div>
                )}
            </div>
        </div>
    );
};