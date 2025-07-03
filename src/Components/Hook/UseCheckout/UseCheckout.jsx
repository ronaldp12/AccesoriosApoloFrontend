import { useState, useCallback, useContext, useEffect } from 'react';
import { context } from '../../../Context/Context.jsx';

export const UseCheckout = () => {
    // Estado del formulario principal
    const { token, getLocalCartProducts, calculateLocalCartSummary, getLocalCartItemCount } = useContext(context);
    const [formData, setFormData] = useState({
        // Campos requeridos por la API
        nombre: '',
        cedula: '',
        telefono: '',
        correo: '',
        direccion: '',
        informacion_adicional: '',

        // Campos adicionales del formulario original
        pais: 'Colombia',
        departamento: '',
        municipio: '',
        direccionPredeterminada: false
    });

    const [localProducts, setLocalProducts] = useState([]);
    const [localCartSummary, setLocalCartSummary] = useState(() => {
        try {
            const savedPaymentData = sessionStorage.getItem('paymentData');
            if (savedPaymentData) {
                const parsedData = JSON.parse(savedPaymentData);
                // Si encontramos un resumen guardado, lo usamos
                if (parsedData.summary) {
                    return parsedData.summary;
                }
            }
        } catch (e) {
            console.error("Error al leer el resumen del sessionStorage", e);
        }
        // Si no, volvemos al valor por defecto
        return {
            TotalArticulosSinDescuento: 0,
            DescuentoArticulos: 0,
            Subtotal: 0,
            PrecioEnvio: 14900,
            Total: 14900
        };
    });

    // Estados de la UI y manejo de respuesta
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isUserRegistered, setIsUserRegistered] = useState(false);
    const [facturaId, setFacturaId] = useState(''); // Para datos de pago
    const [paymentData, setPaymentData] = useState(() => {
        const saved = sessionStorage.getItem('paymentData');
        return saved ? JSON.parse(saved) : null;
    });

    const [carritoItems, setCarritoItems] = useState([]);
    const [numeroItemsCarrito, setNumeroItemsCarrito] = useState(0);
    const [carritoLoading, setCarritoLoading] = useState(false);
    const [carritoError, setCarritoError] = useState(null);

    // Agregar estos estados después de los existentes
    const [checkoutData, setCheckoutData] = useState(null);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState(null);
    const [orderStatus, setOrderStatus] = useState(null);
    const [orderStatusLoading, setOrderStatusLoading] = useState(false);

    const [lastAddressInfo, setLastAddressInfo] = useState(null);

    const updateFormData = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Limpiar errores cuando el usuario empiece a escribir
        if (error) {
            setError(null);
        }
    }, [error]);

    const loadLocalCartData = useCallback(() => {
        const localCart = getLocalCartProducts();

        const transformedProducts = localCart.map(item => {
            // La misma lógica de fallback que en el contexto
            const precioBase = item.priceBeforeDiscount || item.originalPrice || item.price;

            return {
                nombre: item.title,
                cantidad: item.quantity,
                subtotalArticulo: item.price * item.quantity, // Precio final
                // Usamos el precio base que calculamos para el precio original
                precio_antes_descuento: precioBase * item.quantity,
                url_imagen_o_archivo: item.image,
                tamano: item.size
            };
        });

        setLocalProducts(transformedProducts);

        const summary = calculateLocalCartSummary(localCart);
        setLocalCartSummary(summary);

        const itemCount = getLocalCartItemCount(localCart);
        setNumeroItemsCarrito(itemCount);

        console.log('Checkout -> Carrito local cargado con resumen:', {
            productos: transformedProducts,
            resumen: summary,
            totalItems: itemCount
        });
    }, [getLocalCartProducts, calculateLocalCartSummary, getLocalCartItemCount]);

    /**
     * Actualiza múltiples campos del formulario
     */
    const updateMultipleFields = useCallback((fields) => {
        setFormData(prev => ({
            ...prev,
            ...fields
        }));
    }, []);

    /**
     * Función auxiliar para desestructurar la dirección en formato "departamento-municipio-direccion"
     */
    const parseAddress = useCallback((direccionCompleta) => {
        if (!direccionCompleta || typeof direccionCompleta !== 'string') {
            return {
                departamento: '',
                municipio: '',
                direccion: ''
            };
        }

        // Dividir por ' - ' (espacio-guion-espacio)
        const partes = direccionCompleta.split(' - ');

        if (partes.length >= 3) {
            return {
                departamento: partes[0].trim(),
                municipio: partes[1].trim(),
                direccion: partes.slice(2).join(' - ').trim() // Por si la dirección tiene más guiones
            };
        } else if (partes.length === 2) {
            // Caso donde solo hay departamento y municipio-direccion
            return {
                departamento: partes[0].trim(),
                municipio: '',
                direccion: partes[1].trim()
            };
        } else {
            // Caso donde no hay separadores o formato inesperado
            return {
                departamento: '',
                municipio: '',
                direccion: direccionCompleta.trim()
            };
        }
    }, []);

    /**
     * Obtiene la última dirección de envío del usuario
     */
    const getLastAddress = useCallback(async () => {
        try {
            if (!token) {
                console.log('No hay token disponible para consultar última dirección');
                return null;
            }

            const response = await fetch('https://accesoriosapolobackend.onrender.com/ultima-direccion', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Última dirección obtenida:', result);
                return result.data;
            } else if (response.status === 404) {
                // El usuario no tiene direcciones anteriores, esto es normal
                console.log('Usuario sin direcciones anteriores');
                return null;
            } else {
                const errorData = await response.json();
                console.error('Error al obtener última dirección:', errorData);
                return null;
            }
        } catch (err) {
            console.error('Error al consultar última dirección:', err);
            return null;
        }
    }, [token]);

    /**
     * Crea el checkout y obtiene los datos de pago de Wompi
     */
    const createCheckout = useCallback(async (reference, amountInCents) => {
        try {
            setCheckoutLoading(true);
            setCheckoutError(null);

            if (!paymentData?.id_factura_temp) {
                throw new Error('No se encontró ID de factura. Primero guarda la dirección de envío.');
            }

            if (!reference) {
                throw new Error('La referencia es requerida para generar la firma.');
            }

            if (!amountInCents || amountInCents <= 0) {
                throw new Error('El monto es requerido para generar la firma.');
            }

            const headers = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('https://accesoriosapolobackend.onrender.com/create-checkout', {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify({
                    id_factura: paymentData.id_factura_temp,
                    reference: reference,
                    amount_in_cents: amountInCents
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.mensaje || 'Error al crear el checkout');
            }

            setCheckoutData(result);
            return result;

        } catch (err) {
            const errorMessage = err.message || 'Error inesperado al crear el checkout';
            setCheckoutError(errorMessage);
            throw err;
        } finally {
            setCheckoutLoading(false);
        }
    }, [paymentData, token]);

    /**
     * Consulta el estado de una orden específica
     */
    const getOrderStatus = useCallback(async (id_factura) => {
        try {
            setOrderStatusLoading(true);

            const headers = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`https://accesoriosapolobackend.onrender.com/estado-orden/${id_factura}/status`, {
                method: 'GET',
                headers,
                credentials: 'include'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.mensaje || 'Error al consultar el estado de la orden');
            }

            setOrderStatus(result);
            return result;

        } catch (err) {
            console.error('Error al consultar estado de orden:', err);
            throw err;
        } finally {
            setOrderStatusLoading(false);
        }
    }, [token]);

    /**
     * Valida los campos requeridos antes de enviar
     */
    const validateForm = useCallback(() => {
        const { nombre, cedula, telefono, correo, direccion } = formData;

        if (!nombre.trim()) {
            throw new Error('El nombre es obligatorio');
        }
        if (!cedula.trim()) {
            throw new Error('La cédula es obligatoria');
        }
        if (!telefono.trim()) {
            throw new Error('El teléfono es obligatorio');
        }
        if (!correo.trim()) {
            throw new Error('El correo es obligatorio');
        }
        if (!direccion.trim()) {
            throw new Error('La dirección es obligatoria');
        }
        if (!formData.departamento.trim()) {
            throw new Error('El departamento es obligatorio');
        }
        if (!formData.municipio.trim()) {
            throw new Error('El municipio es obligatorio');
        }

        // Validaciones adicionales
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            throw new Error('Por favor ingrese un correo válido');
        }

        const cedulaRegex = /^\d+$/;
        if (!cedulaRegex.test(cedula)) {
            throw new Error('La cédula debe contener solo números');
        }

        return true;
    }, [formData]);

    /**
     * Maneja el guardado de la dirección (botón "Guardar")
     */
    const handleSaveAddress = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            // Validar formulario
            validateForm();

            // Armar dirección completa
            const direccionCompleta = `${formData.departamento} - ${formData.municipio} - ${formData.direccion}`.trim();

            // Preparar datos base para la API
            const apiData = {
                nombre: formData.nombre.trim(),
                cedula: formData.cedula.trim(),
                telefono: formData.telefono.trim(),
                correo: formData.correo.trim().toLowerCase(),
                direccion: direccionCompleta,
                informacion_adicional: formData.informacion_adicional?.trim() || null
            };

            // 🔥 Solo agregar carrito si NO está logueado
            if (!token) {
                const carritoLocal = getLocalCartProducts();

                if (carritoLocal.length === 0) {
                    throw new Error('Tu carrito está vacío, agrega productos antes de continuar.');
                }

                apiData.carrito = carritoLocal.map(item => ({
                    tipo: item.type === 'staff_sticker' ? 'calcomania' : 'producto',
                    id_producto: item.type !== 'staff_sticker' ? item.id : null,
                    id_calcomania: item.type === 'staff_sticker' ? item.id : null,
                    cantidad: item.quantity,
                    tamano: item.type === 'staff_sticker' ? item.size : null
                }));

                console.log('Enviando carrito local al backend:', apiData.carrito);
            }

            const headers = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('https://accesoriosapolobackend.onrender.com/direccion-envio', {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify(apiData)
            });

            let paymentInfo = null;

            const result = await response.json();
            if (result.id_factura_creada) {
                // CORREGIDO: Usar el resumen correcto según el tipo de usuario
                const summaryToSave = token ?
                    // Para usuarios logueados, usar los datos del carrito del servidor
                    {
                        TotalArticulosSinDescuento: result.resumen_pedido?.TotalArticulosSinDescuento || 0,
                        DescuentoArticulos: result.resumen_pedido?.DescuentoArticulos || 0,
                        Subtotal: result.resumen_pedido?.Subtotal || 0,
                        PrecioEnvio: result.resumen_pedido?.PrecioEnvio || 14900,
                        Total: result.resumen_pedido?.Total || 14900
                    } :
                    // Para usuarios no logueados, usar el resumen local
                    localCartSummary;

                paymentInfo = {
                    id_factura_temp: result.id_factura_creada,
                    email_cliente: formData.correo,
                    nombre_cliente: formData.nombre,
                    summary: summaryToSave
                };
                setPaymentData(paymentInfo);
                sessionStorage.setItem('paymentData', JSON.stringify(paymentInfo));
            }

            if (!response.ok) {
                throw new Error(result.mensaje || 'Error al procesar la dirección de envío');
            }

            // Procesar respuesta exitosa
            setSuccess(true);
            setIsUserRegistered(result.nuevo_usuario_registrado);
            setUserInfo(result.datos_usuario_para_checkout);

            if (result.id_factura_creada) {
                setFacturaId(result.id_factura_creada);
                console.log('Factura creada exitosamente:', result.id_factura_creada);
                console.log('Datos de pago guardados:', paymentInfo);
            }

            return result;

        } catch (err) {
            const errorMessage = err.message || 'Error inesperado al procesar la dirección';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [formData, validateForm, token, getLocalCartProducts, localCartSummary]);

    /**
     * Limpia los datos del checkout
     */
    const clearCheckoutData = useCallback(() => {
        setCheckoutData(null);
        setCheckoutError(null);
        setOrderStatus(null);
    }, []);

    /**
     * Carga datos del usuario si está autenticado
     * ACTUALIZADA: Ahora también carga la última dirección de envío
     */
    const loadUserData = useCallback(async () => {
        try {
            // Verificar si hay token disponible
            if (!token) {
                console.log('No hay token disponible');
                return;
            }

            // Hacer petición para obtener datos del usuario
            const response = await fetch('https://accesoriosapolobackend.onrender.com/perfil', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                const userData = await response.json();
                console.log('Datos del usuario:', userData);

                // Obtener la última dirección de envío
                const lastAddressData = await getLastAddress();

                let addressFields = {
                    departamento: '',
                    municipio: '',
                    direccion: '',
                    informacion_adicional: ''
                };

                // Si hay una dirección anterior, desestructurarla
                if (lastAddressData && lastAddressData.direccion) {
                    console.log('Procesando última dirección:', lastAddressData.direccion);

                    const parsedAddress = parseAddress(lastAddressData.direccion);
                    addressFields = {
                        departamento: parsedAddress.departamento,
                        municipio: parsedAddress.municipio,
                        direccion: parsedAddress.direccion,
                        informacion_adicional: lastAddressData.informacion_adicional || ''
                    };

                    console.log('Dirección desestructurada:', addressFields);
                    // Guardar la información de la dirección anterior para mostrar en el componente
                    if (lastAddressData) {
                        setLastAddressInfo({
                            direccion_completa: lastAddressData.direccion,
                            informacion_adicional: lastAddressData.informacion_adicional,
                            direccion_desestructurada: addressFields
                        });
                    }
                } else {
                    // Si no hay dirección anterior, usar la del perfil (si existe)
                    console.log('No se encontró dirección anterior, usando datos del perfil');
                    addressFields = {
                        departamento: userData.usuario.departamento || '',
                        municipio: userData.usuario.municipio || '',
                        direccion: userData.usuario.direccion || '',
                        informacion_adicional: userData.usuario.informacion_adicional || ''
                    };
                }

                // Prellenar el formulario con los datos del usuario y la dirección
                updateMultipleFields({
                    nombre: userData.usuario.nombre || '',
                    cedula: userData.usuario.cedula?.toString() || '',
                    telefono: userData.usuario.telefono || '',
                    correo: userData.usuario.correo || '',
                    ...addressFields
                });

                // También actualizar la información del usuario
                setUserInfo(userData);
                setIsUserRegistered(true);

                console.log('Formulario prellenado con:', {
                    datosUsuario: {
                        nombre: userData.usuario.nombre,
                        cedula: userData.usuario.cedula,
                        telefono: userData.usuario.telefono,
                        correo: userData.usuario.correo
                    },
                    datosDireccion: addressFields
                });

            } else {
                const errorData = await response.json();
                console.error('Error al obtener datos del usuario:', errorData);
            }
        } catch (err) {
            console.error('Error cargando datos del usuario:', err);
        }
    }, [token, updateMultipleFields, getLastAddress, parseAddress]);

    const resetForm = useCallback(() => {
        setFormData({
            nombre: '',
            cedula: '',
            telefono: '',
            correo: '',
            direccion: '',
            informacion_adicional: '',
            pais: 'Colombia',
            departamento: '',
            municipio: '',
            direccionPredeterminada: false
        });
        setError(null);
        setSuccess(false);
        setUserInfo(null);
        setIsUserRegistered(false);
    }, []);

    const clearPaymentData = useCallback(() => {
        setPaymentData(null);
        sessionStorage.removeItem('paymentData');
    }, []);

    const loadCarritoData = useCallback(async () => {
        try {
            if (!token) {
                console.log('No hay token disponible para consultar carrito');
                return;
            }

            console.log('Iniciando carga de carrito con token:', !!token);
            setCarritoLoading(true);
            setCarritoError(null);

            const response = await fetch('https://accesoriosapolobackend.onrender.com/carrito-resumen', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const result = await response.json();
            console.log('Respuesta del carrito:', result);

            if (!response.ok) {
                throw new Error(result.mensaje || 'Error al consultar el carrito');
            }

            // Actualizar estados con los datos del carrito
            setCarritoItems(result.articulos_en_carrito || []);
            setNumeroItemsCarrito(result.numero_articulos_carrito || 0);

            console.log('Carrito cargado exitosamente:', result);

        } catch (err) {
            const errorMessage = err.message || 'Error inesperado al consultar el carrito';
            setCarritoError(errorMessage);
            console.error('Error al consultar carrito:', err);
        } finally {
            setCarritoLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            loadUserData();
            loadCarritoData();
        } else {
            loadLocalCartData();
        }
    }, [token, loadUserData, loadCarritoData, loadLocalCartData]);

    // Agregar un segundo useEffect para debug
    useEffect(() => {
        console.log('Estados actuales:', {
            token: !!token,
            localCartSummary,
            carritoItems: carritoItems.length,
            localProducts: localProducts.length,
            numeroItemsCarrito
        });
    }, [token, localCartSummary, carritoItems, localProducts, numeroItemsCarrito]);

    const clearCartAfterPayment = useCallback(() => {
        if (!token) {
            localStorage.removeItem("localCartProducts");
            setLocalProducts([]);
            setLocalCartSummary({
                TotalArticulosSinDescuento: 0,
                DescuentoArticulos: 0,
                Subtotal: 0,
                PrecioEnvio: 14900,
                Total: 14900
            });
            setNumeroItemsCarrito(0);
        }
        // Para usuarios logueados, el carrito se limpiará automáticamente por el backend
    }, [token]);

    /**
     * Utilidades para el manejo de productos (mantenidas para compatibilidad)
     */
    const addProduct = useCallback((product) => {
        // Esta función ya no se usa, pero se mantiene para compatibilidad
        console.warn('addProduct is deprecated, use context functions instead');
    }, []);

    const removeProduct = useCallback((productId) => {
        // Esta función ya no se usa, pero se mantiene para compatibilidad
        console.warn('removeProduct is deprecated, use context functions instead');
    }, []);

    const updateOrderSummary = useCallback((summary) => {
        // Esta función ya no se usa, pero se mantiene para compatibilidad
        console.warn('updateOrderSummary is deprecated, summaries are calculated automatically');
    }, []);

    useEffect(() => {
        // Limpiar datos de checkout cuando cambie el token o se resetee
        return () => {
            if (!token) {
                setCheckoutData(null);
                setOrderStatus(null);
            }
        };
    }, [token]);

    // CORREGIDO: Definir productos y resumen que se van a mostrar
    const productosAMostrar = token ? carritoItems : localProducts;
    const resumenAMostrar = token ?
        // Para usuarios logueados, construir el resumen desde carritoItems
        {
            TotalArticulosSinDescuento: carritoItems.reduce((sum, item) => sum + (item.precio_original || item.subtotalArticulo), 0),
            DescuentoArticulos: carritoItems.reduce((sum, item) => sum + (item.descuento_total || 0), 0),
            Subtotal: carritoItems.reduce((sum, item) => sum + item.subtotalArticulo, 0),
            PrecioEnvio: 14900,
            Total: carritoItems.reduce((sum, item) => sum + item.subtotalArticulo, 0) + 14900
        } :
        localCartSummary;

    return {
        // Estado del formulario
        formData,

        // Estados de UI
        loading,
        error,
        success,
        userInfo,
        isUserRegistered,

        // CORREGIDO: Productos y resumen definitivos
        productos: productosAMostrar,
        resumenPedido: resumenAMostrar,
        numeroItemsCarrito,
        carritoLoading,
        carritoError,

        // Funciones de actualización
        updateFormData,
        updateMultipleFields,

        // Funciones principales
        handleSaveAddress,
        loadUserData,
        loadCarritoData,
        resetForm,
        loadLocalCartData,

        // Funciones de productos (mantenidas para compatibilidad)
        addProduct,
        removeProduct,
        updateOrderSummary,

        // Función de validación expuesta
        validateForm,

        paymentData,
        clearCartAfterPayment,
        facturaId,
        clearPaymentData,

        checkoutData,
        checkoutLoading,
        checkoutError,
        orderStatus,
        orderStatusLoading,

        // Nuevas funciones
        createCheckout,
        getOrderStatus,
        clearCheckoutData,
        getLastAddress,
        parseAddress,
        lastAddressInfo
    };
};