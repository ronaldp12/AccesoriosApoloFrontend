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
    const [localCartSummary, setLocalCartSummary] = useState({
        TotalArticulosSinDescuento: 0,
        DescuentoArticulos: 0,
        Subtotal: 0,
        PrecioEnvio: 14900,
        Total: 14900
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

    const [productos, setProductos] = useState([]);
    const [resumenPedido, setResumenPedido] = useState({
        TotalArticulosSinDescuento: 0,
        DescuentoArticulos: 0,
        Subtotal: 0,
        PrecioEnvio: 14900,
        Total: 0
    });

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

        // Transformar los productos locales al formato esperado por el componente
        const transformedProducts = localCart.map(item => ({
            nombre: item.name || item.title || `Producto ${item.id}`,
            cantidad: item.quantity,
            subtotalArticulo: item.price * item.quantity,
            url_imagen_o_archivo: item.image || item.url_imagen_o_archivo || '/api/placeholder/80/80',
            tamano: item.size || null,
            localCartId: item.localCartId
        }));

        setLocalProducts(transformedProducts);

        const summary = calculateLocalCartSummary(localCart);
        setLocalCartSummary(summary);

        const itemCount = getLocalCartItemCount(localCart);
        setNumeroItemsCarrito(itemCount);

        console.log('Carrito local cargado:', {
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
                    reference: reference,           // ✅ Enviar referencia
                    amount_in_cents: amountInCents  // ✅ Enviar monto
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
                paymentInfo = {
                    id_factura_temp: result.id_factura_creada,
                    email_cliente: formData.correo,
                    nombre_cliente: formData.nombre
                };
                setPaymentData(paymentInfo);
                console.log('✅ paymentData actualizado:', paymentInfo);
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
                // Después de setFacturaId(result.id_factura_creada);
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
    }, [formData, validateForm, token, getLocalCartProducts]);

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

                // Prellenar el formulario con los datos del usuario
                updateMultipleFields({
                    nombre: userData.usuario.nombre || '',
                    cedula: userData.usuario.cedula?.toString() || '',
                    telefono: userData.usuario.telefono || '',
                    correo: userData.usuario.correo || '',
                    direccion: userData.usuario.direccion || '',
                    informacion_adicional: userData.usuario.informacion_adicional || '',
                    departamento: userData.usuario.departamento || '',
                    municipio: userData.usuario.municipio || ''
                });

                // También actualizar la información del usuario
                setUserInfo(userData);
                setIsUserRegistered(true);
                // await loadCarritoData();
            } else {
                const errorData = await response.json();
                console.error('Error al obtener datos del usuario:', errorData);
            }
        } catch (err) {
            console.error('Error cargando datos del usuario:', err);
        }
    }, [token, updateMultipleFields]);

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

            // CAMBIO: Asegurar que siempre haya un resumen válido
            const resumenActualizado = result.resumen_pedido || {
                TotalArticulosSinDescuento: 0,
                DescuentoArticulos: 0,
                Subtotal: 0,
                PrecioEnvio: 14900,
                Total: 14900
            };

            // Actualizar estados con los datos del carrito
            setCarritoItems(result.articulos_en_carrito || []);
            setNumeroItemsCarrito(result.numero_articulos_carrito || 0);
            setResumenPedido(resumenActualizado);

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
    }, [token]);

    // Agregar un segundo useEffect para debug
    useEffect(() => {
        console.log('Estados actuales:', {
            token: !!token,
            resumenPedido,
            localCartSummary,
            carritoItems: carritoItems.length,
            localProducts: localProducts.length
        });
    }, [token, resumenPedido, localCartSummary, carritoItems, localProducts]);

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
     * Utilidades para el manejo de productos
     */
    const addProduct = useCallback((product) => {
        setProductos(prev => [...prev, product]);
    }, []);

    const removeProduct = useCallback((productId) => {
        setProductos(prev => prev.filter(p => p.id !== productId));
    }, []);

    const updateOrderSummary = useCallback((summary) => {
        setResumenPedido(summary);
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

    const productosAMostrar = token ? carritoItems : localProducts;
    const resumenAMostrar = token ? resumenPedido : localCartSummary;

    return {
        // Estado del formulario
        formData,

        // Estados de UI
        loading,
        error,
        success,
        userInfo,
        isUserRegistered,

        // Productos y resumen (actualizados)
        productos: carritoItems, // Cambiar de productos a carritoItems
        resumenPedido,
        numeroItemsCarrito,
        carritoLoading,
        carritoError,

        // Funciones de actualización
        updateFormData,
        updateMultipleFields,

        // Funciones principales
        handleSaveAddress,
        loadUserData,
        loadCarritoData, // Nueva función
        resetForm,

        // Funciones de productos (mantenidas para compatibilidad)
        addProduct,
        removeProduct,
        updateOrderSummary,

        // Función de validación expuesta
        validateForm,
        productos: productosAMostrar,
        resumenPedido: resumenAMostrar,
        loadLocalCartData,

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

    };
};