import React, { useState, useContext, useEffect, useRef } from "react";
import "./RegisterSaleModal.css";
import { context } from "../../../Context/Context";
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const RegisterSaleModal = ({ isOpen, onClose, onRegisterSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { getErrorMessage, isLoading, setIsLoading } = useContext(context);
    const [successMessage, setSuccessMessage] = useState("");

    // Refs para las animaciones
    const titleRef = useRef(null);
    const formRef = useRef(null);
    const clientSectionRef = useRef(null);
    const saleSectionRef = useRef(null);
    const productSectionRef = useRef(null);
    const tableRef = useRef(null);
    const buttonsRef = useRef(null);

    const initialSaleData = {
        cedula_cliente: "",
        metodo_pago: "efectivo",
        enviar_correo: false
    };

    const initialProductData = {
        referencia: "",
        cantidad: ""
    };

    const initialClientData = {
        nombre: "",
        correo: "",
        telefono: ""
    };

    const [saleData, setSaleData] = useState(initialSaleData);
    const [clientData, setClientData] = useState(initialClientData);
    const [productData, setProductData] = useState(initialProductData);
    const [products, setProducts] = useState([]);
    const [searchingProduct, setSearchingProduct] = useState(false);
    const [searchingClient, setSearchingClient] = useState(false);
    const [clientFound, setClientFound] = useState(false);

    // Función para animar elementos
    const animateElements = () => {
        if (!isOpen) return;

        const elements = [
            titleRef.current,
            formRef.current,
            clientSectionRef.current,
            saleSectionRef.current,
            productSectionRef.current,
            tableRef.current,
            buttonsRef.current
        ];

        elements.forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease';
            }
        });

        // Animar título
        setTimeout(() => {
            if (titleRef.current) {
                titleRef.current.style.opacity = '1';
                titleRef.current.style.transform = 'translateY(0)';
            }
        }, 200);

        // Animar formulario principal
        setTimeout(() => {
            if (formRef.current) {
                formRef.current.style.opacity = '1';
                formRef.current.style.transform = 'translateY(0)';
            }
        }, 400);

        // Animar sección de cliente
        setTimeout(() => {
            if (clientSectionRef.current) {
                clientSectionRef.current.style.opacity = '1';
                clientSectionRef.current.style.transform = 'translateY(0)';
            }
        }, 600);

        // Animar sección de venta
        setTimeout(() => {
            if (saleSectionRef.current) {
                saleSectionRef.current.style.opacity = '1';
                saleSectionRef.current.style.transform = 'translateY(0)';
            }
        }, 800);

        // Animar sección de productos
        setTimeout(() => {
            if (productSectionRef.current) {
                productSectionRef.current.style.opacity = '1';
                productSectionRef.current.style.transform = 'translateY(0)';
            }
        }, 1000);

        // Animar botones
        setTimeout(() => {
            if (buttonsRef.current) {
                buttonsRef.current.style.opacity = '1';
                buttonsRef.current.style.transform = 'translateY(0)';
            }
        }, 1200);
    };

    // Animar tabla cuando se agregan productos
    const animateTable = () => {
        if (tableRef.current) {
            tableRef.current.style.opacity = '0';
            tableRef.current.style.transform = 'translateY(30px)';
            tableRef.current.style.transition = 'all 0.6s ease';

            setTimeout(() => {
                if (tableRef.current) {
                    tableRef.current.style.opacity = '1';
                    tableRef.current.style.transform = 'translateY(0)';
                }
            }, 100);
        }
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
            animateTable();
        }
    }, [products.length]);

    const getCurrentDate = () => {
        const colombiaDate = new Date().toLocaleString("en-CA", {
            timeZone: "America/Bogota",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });
        return colombiaDate;
    };

    const getCurrentDateFormatted = () => {
        const colombiaDate = new Date().toLocaleDateString("es-CO", {
            timeZone: "America/Bogota",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });
        return colombiaDate;
    };

    const clearMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    const resetForm = () => {
        setSaleData(initialSaleData);
        setClientData(initialClientData);
        setProductData(initialProductData);
        setProducts([]);
        setClientFound(false);
        clearMessages();
    };

    if (!isOpen && !isClosing) return null;

    const searchClientByCedula = async () => {
        if (!saleData.cedula_cliente.trim()) {
            setErrorMessage("Ingrese una cédula para buscar");
            return;
        }

        setSearchingClient(true);
        clearMessages();
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`https://accesoriosapolobackend.onrender.com/validar-cliente-venta?cedula=${encodeURIComponent(saleData.cedula_cliente)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setClientData({
                    nombre: data.cliente.nombre,
                    correo: data.cliente.correo,
                    telefono: data.cliente.telefono
                });
                setClientFound(true);
                setErrorMessage("");
            } else {
                setClientData(initialClientData);
                setClientFound(false);
                setErrorMessage(data.mensaje || "Cliente no encontrado");
            }

        } catch (error) {
            console.error("Error buscando cliente:", error);
            setClientData(initialClientData);
            setClientFound(false);
            setErrorMessage("Error al buscar el cliente");
        } finally {
            setSearchingClient(false);
        }
    };

    const searchProductByReference = async (referencia) => {
        if (!referencia.trim()) return null;

        setSearchingProduct(true);
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`https://accesoriosapolobackend.onrender.com/buscar-producto-venta-referencia?referencia=${encodeURIComponent(referencia)}`, {
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
                    referencia: data.producto.referencia,
                    stock: data.producto.stock,
                    precio_unidad: data.producto.precio_unidad,
                    precio_descuento: data.producto.precio_descuento
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

    const handleSaleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSaleData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        clearMessages();

        if (name === 'cedula_cliente') {
            setClientFound(false);
            setClientData(initialClientData);
        }
    };

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
        clearMessages();
    };

    const handleAddProduct = async () => {
        const { referencia, cantidad } = productData;

        if (!referencia.trim()) {
            setErrorMessage("La referencia es obligatoria");
            return;
        }
        if (!cantidad || parseFloat(cantidad) <= 0) {
            setErrorMessage("La cantidad debe ser mayor a 0");
            return;
        }

        const productInfo = await searchProductByReference(referencia);
        if (!productInfo) {
            setErrorMessage(`No se encontró un producto con la referencia: ${referencia}`);
            return;
        }

        if (parseFloat(cantidad) > productInfo.stock) {
            setErrorMessage(`Stock insuficiente. Disponible: ${productInfo.stock}`);
            return;
        }

        if (products.some(p => p.referencia === referencia)) {
            setErrorMessage("Esta referencia ya está agregada");
            return;
        }

        const cantidadNum = parseFloat(cantidad);

        let precio_usado = productInfo.precio_unidad;
        let descuento_aplicado = 0;
        let precio_descuento_mostrar = 0;

        if (productInfo.precio_descuento && productInfo.precio_descuento > 0 && productInfo.precio_descuento !== productInfo.precio_unidad) {
            precio_usado = productInfo.precio_descuento;
            descuento_aplicado = (productInfo.precio_unidad - productInfo.precio_descuento) * cantidadNum;
            precio_descuento_mostrar = productInfo.precio_descuento;
        }

        const subtotal = cantidadNum * precio_usado;

        const newProduct = {
            id: Date.now(),
            referencia,
            nombre: productInfo.nombre,
            cantidad: cantidadNum,
            precio_unidad: productInfo.precio_unidad,
            precio_descuento: precio_descuento_mostrar,
            precio_usado: precio_usado,
            descuento_aplicado: descuento_aplicado,
            subtotal,
            stock: productInfo.stock
        };

        setProducts(prev => [...prev, newProduct]);
        setProductData(initialProductData);
        clearMessages();
    };

    const handleRemoveProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const calculateSubtotal = () => {
        return products.reduce((total, product) => total + (product.cantidad * product.precio_unidad), 0);
    };

    const calculateTotalDiscount = () => {
        return products.reduce((total, product) => total + product.descuento_aplicado, 0);
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

        if (!saleData.cedula_cliente.trim()) {
            setErrorMessage("La cédula del cliente es obligatoria");
            return;
        }

        if (!clientFound) {
            setErrorMessage("Debe buscar y validar la cédula del cliente");
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
                precio_unidad: product.precio_unidad,
                precio_descuento: product.precio_descuento > 0 ? product.precio_descuento : null
            }));

            const ventaData = {
                cedula_cliente: saleData.cedula_cliente,
                metodo_pago: saleData.metodo_pago,
                fecha_venta: getCurrentDate(),
                valor_total: calculateTotal(),
                productos: productosParaEnviar,
                enviar_correo: saleData.enviar_correo
            };

            console.log("Datos enviados al backend:", ventaData);

            const response = await fetch("https://accesoriosapolobackend.onrender.com/registrar-venta", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(ventaData)
            });

            const data = await response.json();
            console.log("Respuesta backend:", data);

            if (data.success && response.ok) {
                setSuccessMessage("Venta registrada con éxito");
                setErrorMessage("");
                onRegisterSuccess();

                setTimeout(() => {
                    setSuccessMessage("");
                    resetForm();
                    handleClose();
                }, 2000);
            } else {
                setErrorMessage(data.mensaje || "Error al registrar venta");
            }

        } catch (error) {
            console.error("Error al registrar venta:", error);
            setErrorMessage("Hubo un error al registrar la venta");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay-register-sale">
            <div className={`modal-content-register-sale ${isClosing ? "exit" : "entry"}`}>
                <h2 ref={titleRef}>Registrar Venta</h2>

                <form ref={formRef} className="form-register-sale" onSubmit={handleSubmit}>
                    {/* Datos del cliente */}
                    <div ref={clientSectionRef} className="sale-header-section">
                        <div className="sale-header-group">
                            <div className="form-group-register-sale">
                                <label>Cédula Cliente *</label>
                                <input
                                    type="text"
                                    name="cedula_cliente"
                                    placeholder="Ingrese la cédula del cliente"
                                    value={saleData.cedula_cliente}
                                    onChange={handleSaleChange}
                                />
                            </div>

                            <div className="add-product-button-container">
                                <button
                                    type="button"
                                    className="btn-add-product"
                                    onClick={searchClientByCedula}
                                    disabled={searchingClient}
                                >
                                    {searchingClient ? (
                                        <img src={wheelIcon} alt="Buscando..." className="search-spinner" />
                                    ) : (
                                        "Buscar"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Información del cliente (solo lectura) */}
                    {clientFound && (
                        <div className="sale-header-section">
                            <div className="sale-header-group">
                                <div className="form-group-register-sale">
                                    <label>Nombre</label>
                                    <div className="client-info-display">
                                        {clientData.nombre}
                                    </div>
                                </div>

                                <div className="form-group-register-sale">
                                    <label>Correo</label>
                                    <div className="client-info-display">
                                        {clientData.correo}
                                    </div>
                                </div>

                                <div className="form-group-register-sale">
                                    <label>Teléfono</label>
                                    <div className="client-info-display">
                                        {clientData.telefono}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Datos de la venta */}
                    <div ref={saleSectionRef} className="sale-header-section">
                        <div className="sale-header-group">
                            <div className="form-group-register-sale">
                                <label>Fecha de Venta</label>
                                <div className="client-info-display">
                                    {getCurrentDateFormatted()}
                                </div>
                            </div>

                            <div className="form-group-register-sale">
                                <label>Método de Pago *</label>
                                <select
                                    name="metodo_pago"
                                    value={saleData.metodo_pago}
                                    onChange={handleSaleChange}
                                >
                                    <option value="efectivo">Efectivo</option>
                                    <option value="transferencia">Transferencia</option>
                                    <option value="tarjeta">Tarjeta</option>
                                    <option value="credito">Crédito</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Formulario para agregar productos */}
                    <div ref={productSectionRef} className="add-product-section">
                        <h3>Agregar Producto</h3>
                        <div className="add-product-form-sale">
                            <div className="form-group-register-sale">
                                <label>Referencia *</label>
                                <input
                                    type="text"
                                    name="referencia"
                                    placeholder="REF001"
                                    value={productData.referencia}
                                    onChange={handleProductChange}
                                />
                            </div>

                            <div className="form-group-register-sale">
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
                        <div ref={tableRef} className="products-table-section-sale">
                            <h3>Productos Agregados</h3>
                            <div className="table-container-sale">
                                <table className="products-table-sale">
                                    <thead>
                                        <tr>
                                            <th>Referencia</th>
                                            <th>Nombre</th>
                                            <th>Cantidad</th>
                                            <th>Precio Unit.</th>
                                            <th>Precio Descuento</th>
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
                                                <td>${product.precio_unidad.toLocaleString()}</td>
                                                <td>
                                                    {product.precio_descuento > 0
                                                        ? `$${product.precio_descuento.toLocaleString()}`
                                                        : '$0'
                                                    }
                                                </td>
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
                                <div className="total-row">
                                    <span>Subtotal: ${calculateSubtotal().toLocaleString()}</span>
                                </div>
                                <div className="total-row">
                                    <span>Descuento: ${calculateTotalDiscount().toLocaleString('es-CO')}</span>
                                </div>
                                <div className="total-display">
                                    <strong>Total: ${calculateTotal().toLocaleString()}</strong>
                                </div>

                            </div>

                            {/* Checkbox para enviar correo después de los totales */}
                            <div className="email-checkbox-section">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="enviar_correo"
                                        checked={saleData.enviar_correo}
                                        onChange={handleSaleChange}
                                    />
                                    <span>Enviar factura por correo</span>
                                </label>
                            </div>
                        </div>
                    )}

                    <div ref={buttonsRef} className="modal-buttons-register-sale">
                        <button type="button" className="btn-cancelar" onClick={handleClose}>
                            CANCELAR
                        </button>
                        <button type="submit" className="btn-agregar" disabled={isLoading}>
                            {isLoading ? (
                                <img src={wheelIcon} alt="Cargando..." className="register-sale-spinner" />
                            ) : (
                                <span>REGISTRAR VENTA</span>
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