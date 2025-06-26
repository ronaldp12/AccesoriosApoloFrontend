import React, { useState, useContext, useEffect, useRef } from "react";
import "./RegisterSaleModal.css";
import { context } from "../../../Context/Context";
import wheelIcon from "../../../assets/icons/img1-loader.png";
import { FaMagic, FaBox } from "react-icons/fa";

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
    const itemSelectorRef = useRef(null);
    const productSectionRef = useRef(null);
    const calcomaniasSectionRef = useRef(null);
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

    const initialCalcomaniaData = {
        id_calcomania: "",
        cantidad: "",
        tamano: "pequeno"
    };

    const initialClientData = {
        nombre: "",
        correo: "",
        telefono: ""
    };

    const [saleData, setSaleData] = useState(initialSaleData);
    const [clientData, setClientData] = useState(initialClientData);
    const [productData, setProductData] = useState(initialProductData);
    const [calcomaniaData, setCalcomaniaData] = useState(initialCalcomaniaData);
    const [products, setProducts] = useState([]);
    const [calcomanias, setCalcomanias] = useState([]);
    const [searchingProduct, setSearchingProduct] = useState(false);
    const [searchingCalcomania, setSearchingCalcomania] = useState(false);
    const [searchingClient, setSearchingClient] = useState(false);
    const [clientFound, setClientFound] = useState(false);
    const [itemType, setItemType] = useState(""); // "producto" o "calcomania"

    // Función para animar elementos
    const animateElements = () => {
        if (!isOpen) return;

        const elements = [
            titleRef.current,
            formRef.current,
            clientSectionRef.current,
            saleSectionRef.current,
            itemSelectorRef.current,
            productSectionRef.current,
            calcomaniasSectionRef.current,
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

        // Animar selector de items
        setTimeout(() => {
            if (itemSelectorRef.current) {
                itemSelectorRef.current.style.opacity = '1';
                itemSelectorRef.current.style.transform = 'translateY(0)';
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

    // Animar tabla cuando cambian los items
    useEffect(() => {
        if (products.length > 0 || calcomanias.length > 0) {
            animateTable();
        }
    }, [products.length, calcomanias.length]);

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
        setCalcomaniaData(initialCalcomaniaData);
        setProducts([]);
        setCalcomanias([]);
        setClientFound(false);
        setItemType("");
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
            console.log(data);

            if (response.ok && data.success && data.producto) {
                return {
                    nombre: data.producto.nombre,
                    referencia: data.producto.referencia,
                    stock: data.producto.stock,
                    precio_unidad: data.producto.precio_unidad,
                    precio_final_con_descuento: data.producto.precio_final_con_descuento
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

    const searchCalcomaniaById = async (id, tamano, cantidad) => {
        if (!id.trim()) return null;

        setSearchingCalcomania(true);
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`https://accesoriosapolobackend.onrender.com/buscar-calcomania-venta-id?id=${encodeURIComponent(id)}&tamano=${encodeURIComponent(tamano)}&cantidad=${encodeURIComponent(cantidad)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                return {
                    id_calcomania: data.calcomania.id_calcomania,
                    nombre: data.calcomania.nombre,
                    precio_unidad: data.calcomania.precio_unidad,
                    precio_descuento: data.calcomania.precio_descuento,
                    subtotal: data.calcomania.subtotal
                };
            } else {
                console.log("Calcomanía no encontrada:", data.mensaje);
                return null;
            }

        } catch (error) {
            console.error("Error buscando calcomanía:", error);
            return null;
        } finally {
            setSearchingCalcomania(false);
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

    const handleCalcomaniaChange = (e) => {
        const { name, value } = e.target;
        setCalcomaniaData(prev => ({ ...prev, [name]: value }));
        clearMessages();
    };

    const handleItemTypeChange = (type) => {
        setItemType(type);
        setProductData(initialProductData);
        setCalcomaniaData(initialCalcomaniaData);
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

        if (!Number.isInteger(parseFloat(cantidad))) {
            setErrorMessage("La cantidad debe ser un número entero");
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

        const cantidadNum = parseFloat(cantidad);

        let precio_usado = productInfo.precio_unidad;
        let descuento_aplicado = 0;
        let precio_descuento_mostrar = 0;

        if (productInfo.precio_final_con_descuento && productInfo.precio_final_con_descuento > 0 && productInfo.precio_final_con_descuento < productInfo.precio_unidad) {
            precio_usado = productInfo.precio_final_con_descuento;
            descuento_aplicado = (productInfo.precio_unidad - productInfo.precio_final_con_descuento) * cantidadNum;
            precio_descuento_mostrar = productInfo.precio_final_con_descuento;
        }

        const subtotal = cantidadNum * precio_usado;

        const existingProductIndex = products.findIndex(p => p.referencia === referencia);
        if (existingProductIndex !== -1) {
            // Producto existe, actualizar cantidad
            const existingProduct = products[existingProductIndex];
            const nuevaCantidad = existingProduct.cantidad + cantidadNum;

            if (nuevaCantidad > productInfo.stock) {
                setErrorMessage(`Stock insuficiente. Disponible: ${productInfo.stock}, solicitado: ${nuevaCantidad}`);
                return;
            }

            const updatedProducts = [...products];
            updatedProducts[existingProductIndex] = {
                ...existingProduct,
                cantidad: nuevaCantidad,
                subtotal: nuevaCantidad * existingProduct.precio_usado
            };
            setProducts(updatedProducts);
        } else {
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
        }

        setProductData(initialProductData);
        clearMessages();
    };

    const handleAddCalcomania = async () => {
        const { id_calcomania, cantidad, tamano } = calcomaniaData;

        if (!id_calcomania.trim()) {
            setErrorMessage("El ID de la calcomanía es obligatorio");
            return;
        }
        if (!cantidad || parseFloat(cantidad) <= 0) {
            setErrorMessage("La cantidad debe ser mayor a 0");
            return;
        }
        if (!Number.isInteger(parseFloat(cantidad))) {
            setErrorMessage("La cantidad debe ser un número entero");
            return;
        }
        if (!tamano) {
            setErrorMessage("Debe seleccionar un tamaño");
            return;
        }

        const calcomaniaInfo = await searchCalcomaniaById(id_calcomania, tamano, cantidad);
        if (!calcomaniaInfo) {
            setErrorMessage(`No se encontró la calcomanía con ID: ${id_calcomania} o no hay stock suficiente`);
            return;
        }

        const claveUnica = `${id_calcomania}-${tamano}`;

        const cantidadNum = parseFloat(cantidad);

        const existingCalcomaniaIndex = calcomanias.findIndex(c => `${c.id_calcomania}-${c.tamano}` === claveUnica);
        if (existingCalcomaniaIndex !== -1) {
            const existingCalcomania = calcomanias[existingCalcomaniaIndex];
            const nuevaCantidad = existingCalcomania.cantidad + cantidadNum;

            const updatedCalcomanias = [...calcomanias];
            updatedCalcomanias[existingCalcomaniaIndex] = {
                ...existingCalcomania,
                cantidad: nuevaCantidad,
                subtotal: calcomaniaInfo.subtotal + existingCalcomania.subtotal
            };
            setCalcomanias(updatedCalcomanias);
        } else {
            const newCalcomania = {
                id: Date.now(),
                id_calcomania: calcomaniaInfo.id_calcomania,
                nombre: calcomaniaInfo.nombre,
                cantidad: cantidadNum,
                tamano: tamano,
                precio_unidad: calcomaniaInfo.precio_unidad,
                precio_descuento: calcomaniaInfo.precio_descuento,
                precio_usado: calcomaniaInfo.precio_descuento > 0 ? calcomaniaInfo.precio_descuento : calcomaniaInfo.precio_unidad,
                subtotal: calcomaniaInfo.subtotal,
            };
            setCalcomanias(prev => [...prev, newCalcomania]);
        }

        setCalcomaniaData(initialCalcomaniaData);
        clearMessages();
    };

    const handleRemoveProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const handleRemoveCalcomania = (id) => {
        setCalcomanias(prev => prev.filter(c => c.id !== id));
    };

    const calculateSubtotal = () => {
        const productSubtotal = products.reduce((total, product) => total + (product.cantidad * product.precio_unidad), 0);
        const calcomaniaSubtotal = calcomanias.reduce((total, calcomania) => total + (calcomania.cantidad * calcomania.precio_unidad), 0);
        return productSubtotal + calcomaniaSubtotal;
    };

    const calculateTotalDiscount = () => {
        const productDiscount = products.reduce((total, product) => total + product.descuento_aplicado, 0);
        const calcomaniaDiscount = calcomanias.reduce((total, calcomania) => {
            if (calcomania.precio_descuento && calcomania.precio_descuento > 0) {
                return total + ((calcomania.precio_unidad - calcomania.precio_descuento) * calcomania.cantidad);
            }
            return total;
        }, 0);
        return productDiscount + calcomaniaDiscount;
    };

    const calculateTotal = () => {
        const productTotal = products.reduce((total, product) => total + product.subtotal, 0);
        const calcomaniaTotal = calcomanias.reduce((total, calcomania) => total + calcomania.subtotal, 0);
        return productTotal + calcomaniaTotal;
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

        if (products.length === 0 && calcomanias.length === 0) {
            setErrorMessage("Debe agregar al menos un producto o calcomanía");
            return;
        }

        setIsLoading(true);
        clearMessages();

        try {
            const token = localStorage.getItem("token");

            const productosParaEnviar = products.map(product => ({
                referencia: product.referencia,
                cantidad: product.cantidad,
                precio_usado: product.precio_usado
            }));

            const calcomaniasParaEnviar = calcomanias.map(calcomania => ({
                id_calcomania: calcomania.id_calcomania,
                cantidad: calcomania.cantidad,
                tamano: calcomania.tamano,
                precio_usado: calcomania.precio_usado
            }));

            const ventaData = {
                cedula_cliente: saleData.cedula_cliente,
                metodo_pago: saleData.metodo_pago,
                fecha_venta: getCurrentDate(),
                valor_total: calculateTotal(),
                productos: productosParaEnviar,
                calcomanias: calcomaniasParaEnviar,
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

    const getTamanoDisplayName = (tamano) => {
        switch (tamano) {
            case 'pequeno': return 'Pequeño';
            case 'mediano': return 'Mediano';
            case 'grande': return 'Grande';
            default: return tamano;
        }
    };

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

                    {/* Selector de tipo de ítem */}
                    <div ref={itemSelectorRef} className="item-type-selector">
                        <h3>¿Qué desea agregar?</h3>
                        <div className="item-type-buttons">
                            <button
                                type="button"
                                className={`item-type-btn ${itemType === 'producto' ? 'active' : ''}`}
                                onClick={() => handleItemTypeChange('producto')}
                            >
                                <FaBox className="sticker-selector" />
                                <span>Producto</span>
                            </button>
                            <button
                                type="button"
                                className={`item-type-btn ${itemType === 'calcomania' ? 'active' : ''}`}
                                onClick={() => handleItemTypeChange('calcomania')}
                            >
                                <FaMagic className="sticker-selector" />
                                <span>Calcomanía</span>
                            </button>
                        </div>
                    </div>

                    {/* Formulario para agregar productos */}
                    {itemType === 'producto' && (
                        <div ref={productSectionRef} className="add-product-section">
                            <h3>Agregar Producto</h3>
                            <div className="add-item-form-sale">
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
                                        min="1"
                                        step="1"
                                        value={productData.cantidad}
                                        onChange={handleProductChange}
                                    />
                                </div>

                                <div className="add-item-button-container">
                                    <button
                                        type="button"
                                        className="btn-add-product"
                                        onClick={handleAddProduct}
                                        disabled={searchingProduct}
                                    >
                                        {searchingProduct ? (
                                            <img src={wheelIcon} alt="Buscando..." className="search-spinner" />
                                        ) : (
                                            "Agregar Producto"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Formulario para agregar calcomanías */}
                    {itemType === 'calcomania' && (
                        <div ref={calcomaniasSectionRef} className="add-product-section">
                            <h3>Agregar Calcomanía</h3>
                            <div className="add-item-form-sale">
                                <div className="form-group-register-sale">
                                    <label>ID Calcomanía *</label>
                                    <input
                                        type="text"
                                        name="id_calcomania"
                                        placeholder="ID001"
                                        value={calcomaniaData.id_calcomania}
                                        onChange={handleCalcomaniaChange}
                                    />
                                </div>

                                <div className="form-group-register-sale">
                                    <label>Tamaño *</label>
                                    <select
                                        name="tamano"
                                        value={calcomaniaData.tamano}
                                        onChange={handleCalcomaniaChange}
                                    >
                                        <option value="pequeno">Pequeño</option>
                                        <option value="mediano">Mediano (+125%)</option>
                                        <option value="grande">Grande (+300%)</option>
                                    </select>
                                </div>

                                <div className="form-group-register-sale">
                                    <label>Cantidad *</label>
                                    <input
                                        type="number"
                                        name="cantidad"
                                        placeholder="1"
                                        min="1"
                                        step="1"
                                        value={calcomaniaData.cantidad}
                                        onChange={handleCalcomaniaChange}
                                    />
                                </div>

                                <div className="add-item-button-container">
                                    <button
                                        type="button"
                                        className="btn-add-product"
                                        onClick={handleAddCalcomania}
                                        disabled={searchingCalcomania}
                                    >
                                        {searchingCalcomania ? (
                                            <img src={wheelIcon} alt="Buscando..." className="search-spinner" />
                                        ) : (
                                            "Agregar Calcomanía"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabla de productos y calcomanías */}
                    {(products.length > 0 || calcomanias.length > 0) && (
                        <div ref={tableRef} className="items-table-section-sale">
                            <h3>Items Agregados</h3>
                            <div className="table-container-sale">
                                {products.length > 0 && (
                                    <div className="table-section">
                                        <h4>Productos</h4>
                                        <div className="table-container">
                                            <table className="products-table-sale">
                                                <thead>
                                                    <tr>
                                                        <th>Referencia</th>
                                                        <th>Nombre</th>
                                                        <th>Cantidad</th>
                                                        <th>Precio Unit.</th>
                                                        <th>Precio Desc.</th>
                                                        <th>Subtotal</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {products.map((product) => (
                                                        <tr key={product.id}>
                                                            <td>{product.referencia}</td>
                                                            <td>{product.nombre}</td>
                                                            <td>{product.cantidad}</td>
                                                            <td>${product.precio_unidad.toLocaleString()}</td>
                                                            <td>
                                                                {product.precio_descuento > 0 ? (
                                                                    <span className="discount-price">
                                                                        ${product.precio_descuento.toLocaleString()}
                                                                    </span>
                                                                ) : (
                                                                    <span className="no-discount">--</span>
                                                                )}
                                                            </td>
                                                            <td className="subtotal-cell">
                                                                ${product.subtotal.toLocaleString()}
                                                            </td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn-remove-item"
                                                                    onClick={() => handleRemoveProduct(product.id)}
                                                                    title="Eliminar producto"
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Tabla de calcomanías */}
                                {calcomanias.length > 0 && (
                                    <div className="table-section">
                                        <h4 className="table-subtitle">
                                            <i className="bi bi-stickers"></i>
                                            Calcomanías
                                        </h4>
                                        <div className="table-container">
                                            <table className="products-table-sale">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Nombre</th>
                                                        <th>Tamaño</th>
                                                        <th>Cantidad</th>
                                                        <th>Precio Unit.</th>
                                                        <th>Precio Desc.</th>
                                                        <th>Subtotal</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {calcomanias.map((calcomania) => (
                                                        <tr key={calcomania.id_calcomania}>
                                                            <td>{calcomania.id_calcomania}</td>
                                                            <td>{calcomania.nombre}</td>
                                                            <td>
                                                                <span className={`size-badge size-${calcomania.tamano}`}>
                                                                    {getTamanoDisplayName(calcomania.tamano)}
                                                                </span>
                                                            </td>
                                                            <td>{calcomania.cantidad}</td>
                                                            <td>${calcomania.precio_unidad?.toLocaleString() ?? '--'}</td>
                                                            <td>
                                                                {calcomania.precio_descuento > 0 ? (
                                                                    <span className="discount-price">
                                                                        ${calcomania.precio_descuento.toLocaleString()}
                                                                    </span>
                                                                ) : (
                                                                    <span className="no-discount">--</span>
                                                                )}
                                                            </td>
                                                            <td className="subtotal-cell">
                                                                ${calcomania.subtotal.toLocaleString()}
                                                            </td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn-remove-item"
                                                                    onClick={() => handleRemoveCalcomania(calcomania.id)}
                                                                    title="Eliminar calcomanía"
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Totales */}
                                <div className="totals-section">
                                    <div className="totals-row">
                                        <span className="totals-label">Subtotal:</span>
                                        <span className="totals-value">${calculateSubtotal().toLocaleString()}</span>
                                    </div>
                                    {calculateTotalDiscount() > 0 && (
                                        <div className="totals-row discount-row">
                                            <span className="totals-label">Descuento:</span>
                                            <span className="totals-value discount-value">
                                                -${formatNumber(calculateTotalDiscount())}
                                            </span>
                                        </div>
                                    )}
                                    <div className="totals-row total-row">
                                        <span className="totals-label">Total:</span>
                                        <span className="totals-value total-value">
                                            ${calculateTotal().toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
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

                    {/* Mensajes */}
                    {errorMessage && (
                        <div className="status-message-register error">
                            <i className="bi bi-exclamation-triangle"></i>
                            {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div className="status-message-register success">
                            <i className="bi bi-check-circle"></i>
                            {successMessage}
                        </div>
                    )}

                    {/* Botones */}
                    <div ref={buttonsRef} className="modal-buttons-register-sale">
                        <button
                            type="button"
                            className="btn-cancelar-register-sale"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-add-register-sale"
                            disabled={isLoading || (products.length === 0 && calcomanias.length === 0)}
                        >
                            {isLoading ? (
                                <>
                                    <img src={wheelIcon} alt="Cargando..." className="register-sale-spinner" />
                                    Registrando...
                                </>
                            ) : (
                                <>
                                    Registrar Venta
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};