import { useState, useCallback, useContext } from 'react';
import { context } from '../../../Context/Context.jsx';

export const UseCheckout = () => {
    // Estado del formulario principal
    const { token } = useContext(context);
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

    // Estados de la UI y manejo de respuesta
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isUserRegistered, setIsUserRegistered] = useState(false);

    // Estado del carrito/productos (ejemplo)
    const [productos, setProductos] = useState([]);
    const [resumenPedido, setResumenPedido] = useState({
        totalArticulos: 0,
        descuento: 0,
        subtotal: 0,
        total: 0
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
     * Envía la información de dirección de envío a la API
     */
    const submitShippingAddress = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            // Validar formulario
            validateForm();

            // Preparar datos para la API
            const apiData = {
                nombre: formData.nombre.trim(),
                cedula: formData.cedula.trim(),
                telefono: formData.telefono.trim(),
                correo: formData.correo.trim().toLowerCase(),
                direccion: formData.direccion.trim(),
                informacion_adicional: formData.informacion_adicional?.trim() || null
            };

            const headers = {
                'Content-Type': 'application/json',
            };

            // Agregar token si existe
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('https://accesoriosapolobackend.onrender.com/direccion-envio', {
                method: 'POST',
                headers: headers,
                credentials: 'include', // Para manejar sesiones
                body: JSON.stringify(apiData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.mensaje || 'Error al procesar la dirección de envío');
            }

            // Procesar respuesta exitosa
            setSuccess(true);
            setIsUserRegistered(result.usuario_existente_en_db);
            setUserInfo(result.datos_usuario);

            // Si el usuario tiene datos previos, opcionalmente prellenar algunos campos
            if (result.datos_usuario) {
                const {
                    direccion_anterior,
                    informacion_adicional_anterior
                } = result.datos_usuario;

                // Podrías mostrar esta información como sugerencia o prellenar
                console.log('Dirección anterior disponible:', direccion_anterior);
                console.log('Info adicional anterior:', informacion_adicional_anterior);
            }

            return result;

        } catch (err) {
            const errorMessage = err.message || 'Error inesperado al procesar la dirección';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [formData, validateForm, token]);

    /**
     * Maneja el guardado de la dirección (botón "Guardar")
     */
    const handleSaveAddress = useCallback(async () => {
        try {
            await submitShippingAddress();
            // Aquí podrías mostrar un mensaje de éxito
            console.log('Dirección guardada exitosamente');
        } catch (err) {
            console.error('Error al guardar dirección:', err);
            // El error ya está en el estado, se mostrará en la UI
        }
    }, [submitShippingAddress]);

    /**
     * Finaliza la compra (botón "Finalizar Compra")
     */
    const handleFinalizePurchase = useCallback(async () => {
        try {
            // Primero guardar/validar la dirección
            await submitShippingAddress();

            // Aquí continuarías con el proceso de pago
            console.log('Procediendo al pago...');

            // Ejemplo: redirigir a pasarela de pago o siguiente paso
            // navigate('/payment') o similar

        } catch (err) {
            console.error('Error al finalizar compra:', err);
            // El error ya está en el estado
        }
    }, [submitShippingAddress]);

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
            } else {
                const errorData = await response.json();
                console.error('Error al obtener datos del usuario:', errorData);
            }
        } catch (err) {
            console.error('Error cargando datos del usuario:', err);
        }
    }, [token, updateMultipleFields]);

    /**
     * Resetea el formulario
     */
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

    return {
        // Estado del formulario
        formData,

        // Estados de UI
        loading,
        error,
        success,
        userInfo,
        isUserRegistered,

        // Productos y resumen
        productos,
        resumenPedido,

        // Funciones de actualización
        updateFormData,
        updateMultipleFields,

        // Funciones principales
        handleSaveAddress,
        handleFinalizePurchase,
        loadUserData,
        resetForm,

        // Funciones de productos
        addProduct,
        removeProduct,
        updateOrderSummary,

        // Función de validación expuesta (por si necesitas usarla externamente)
        validateForm
    };
};