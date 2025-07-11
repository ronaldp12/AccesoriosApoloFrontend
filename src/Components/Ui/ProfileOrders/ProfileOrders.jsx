import React, { useState, useEffect } from 'react';
import styles from './ProfileOrders.module.css';

export const ProfileOrders = () => {
  const [pedidos, setPedidos] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [submittingRating, setSubmittingRating] = useState({});
  const [expandingStates, setExpandingStates] = useState({});
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    obtenerHistorialPedidos();
  }, []);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    const newToast = { id, message, type };

    setToasts(prev => [...prev, newToast]);

    // Auto-remover después de 4 segundos
    setTimeout(() => {
      setToasts(prev => prev.map(toast =>
        toast.id === id ? { ...toast, exiting: true } : toast
      ));

      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 300);
    }, 4000);
  };

  const obtenerHistorialPedidos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://accesoriosapolobackend.onrender.com/historial-pedidos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      console.log('Historial de pedidos:', result);
      if (result.success) {
        // Agrupar productos por factura
        const pedidosAgrupados = agruparPorFactura(result.data);
        setPedidos(pedidosAgrupados);
      } else {
        console.error('Error al obtener pedidos:', result.message);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    } finally {
      setLoading(false);
    }
  };

  const agruparPorFactura = (items) => {
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.id_factura]) {
        acc[item.id_factura] = {
          id_factura: item.id_factura,
          direccion: item.direccion,
          productos: []
        };
      }
      acc[item.id_factura].productos.push(item);
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => b.id_factura - a.id_factura);
  };

  const toggleExpandOrder = (facturaId) => {
    if (expandedOrders[facturaId]) {
      setExpandingStates(prev => ({ ...prev, [facturaId]: 'exiting' }));

      setTimeout(() => {
        setExpandedOrders(prev => ({ ...prev, [facturaId]: false }));
        setExpandingStates(prev => ({ ...prev, [facturaId]: null }));
      }, 600);
    } else {
      setExpandedOrders(prev => ({ ...prev, [facturaId]: true }));
      setExpandingStates(prev => ({ ...prev, [facturaId]: 'entering' }));

      setTimeout(() => {
        setExpandingStates(prev => ({ ...prev, [facturaId]: 'entered' }));
      }, 50);
    }
  };

  const handleRatingChange = (itemId, rating) => {
    setRatings(prev => ({
      ...prev,
      [itemId]: rating
    }));
  };

  const enviarCalificacion = async (referencia, itemId) => {
    if (!ratings[itemId]) {
      showToast('Por favor selecciona una calificación', 'error');
      return;
    }

    setSubmittingRating(prev => ({ ...prev, [itemId]: true }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://accesoriosapolobackend.onrender.com/calificar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          referencia: referencia,
          puntuacion: ratings[itemId]
        })
      });

      const result = await response.json();
      if (result.success) {
        showToast('¡Gracias por tu calificación!', 'success');
        setPedidos(prev => prev.map(pedido => ({
          ...pedido,
          productos: pedido.productos.map(producto =>
            producto.id_item === itemId
              ? { ...producto, calificacion_usuario: ratings[itemId] }
              : producto
          )
        })));
      } else {
        showToast('Error al enviar calificación: ' + result.message, 'error');
      }
    } catch (error) {
      console.error('Error al enviar calificación:', error);
      showToast('Error de conexión al enviar calificación', 'error');
    } finally {
      setSubmittingRating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const StarRating = ({ itemId, currentRating, onRatingChange, disabled }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= (currentRating || 0) ? 'filled' : ''} ${disabled ? 'disabled' : ''}`}
            onClick={() => !disabled && onRatingChange(itemId, star)}
          >
            <i className={`fa-star ${star <= (currentRating || 0) ? 'fa-solid' : 'fa-regular'}`}></i>
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.ordersContainer}>
        <h2>Pedidos</h2>
        <div className="loading">Cargando pedidos...</div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return Number(price).toLocaleString("es-CO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    });
  };

  return (
    <div className={styles.ordersContainer}>
      <h2>Pedidos</h2>

      {pedidos.length === 0 ? (
        <div className={styles.noOrders}>No tienes pedidos realizados</div>
      ) : (
        pedidos.map((pedido) => {
          const productosPrincipal = pedido.productos[0];
          const productosRestantes = pedido.productos.slice(1);
          const isExpanded = expandedOrders[pedido.id_factura];

          return (
            <div key={pedido.id_factura} className={styles.orderCard}>
              {/* Producto Principal */}
              <div className={styles.orderInfo}>
                <img
                  src={productosPrincipal.url_imagen || '/default-image.jpg'}
                  alt="Producto"
                  className={styles.orderProductImg}
                />

                <div className={styles.orderDetails}>
                  <p className={styles.ordersTitle}>{productosPrincipal.nombre_item}</p>
                  <p className={styles.ordersQuantity}><strong>CANT {productosPrincipal.cantidad}</strong></p>
                  <p className={styles.orderAddress}>{pedido.direccion}</p>
                  <p className={styles.orderPrice}><strong>${formatPrice(productosPrincipal.precio_unidad)} COP</strong></p>

                  {/* Calificación del producto principal */}
                  {productosPrincipal.tipo_item === 'producto' && (
                    <div className={styles.ratingSection}>
                      <StarRating
                        itemId={productosPrincipal.id_item}
                        currentRating={productosPrincipal.calificacion_usuario || ratings[productosPrincipal.id_item]}
                        onRatingChange={handleRatingChange}
                        disabled={productosPrincipal.calificacion_usuario}
                      />
                      {!productosPrincipal.calificacion_usuario && (
                        <button
                          className={styles.rateButton}
                          onClick={() => enviarCalificacion(productosPrincipal.id_item, productosPrincipal.id_item)}
                          disabled={submittingRating[productosPrincipal.id_item]}
                        >
                          {submittingRating[productosPrincipal.id_item] ? 'Enviando...' : 'Calificar'}
                        </button>
                      )}
                    </div>
                  )}
                </div>


              </div>
              <div>
                {/* Flecha expandible si hay más productos */}
                {productosRestantes.length > 0 && (
                  <div className={styles.expandSection}>
                    <button
                      className={styles.expandButton}
                      onClick={() => toggleExpandOrder(pedido.id_factura)}
                    >
                      <span
                        className={`${styles.expandArrow} ${expandingStates[pedido.id_factura] === 'entered' ? styles.rotated : ''}`}
                      >
                        <i className="fas fa-chevron-down"></i>
                      </span>

                      <span className={styles.productCount}>({productosRestantes.length} productos)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Productos adicionales expandidos */}
              {(isExpanded || expandingStates[pedido.id_factura]) && productosRestantes.length > 0 && (
                <div className={`${styles.expandedProducts} ${expandingStates[pedido.id_factura] ? styles[expandingStates[pedido.id_factura]] : styles.entered
                  }`}
                >
                  {productosRestantes.map((producto) => (
                    <div key={producto.id_item} className={styles.additionalProduct}>
                      <div className={styles.orderInfo}>
                        <img
                          src={producto.url_imagen || '/default-image.jpg'}
                          alt="Producto"
                          className={styles.orderProductImg}
                        />

                        <div className={styles.orderDetails}>
                          <p className={styles.ordersTitle}>{producto.nombre_item}</p>
                          <p className={styles.ordersQuantity}><strong>CANT {producto.cantidad}</strong></p>
                          <p className={styles.orderPrice}><strong>${formatPrice(producto.precio_unidad)} COP</strong></p>

                          {/* Calificación del producto adicional */}
                          {producto.tipo_item === 'producto' && (
                            <div className={styles.ratingSection}>
                              <StarRating
                                itemId={producto.id_item}
                                currentRating={producto.calificacion_usuario || ratings[producto.id_item]}
                                onRatingChange={handleRatingChange}
                                disabled={producto.calificacion_usuario}
                              />
                              {!producto.calificacion_usuario && (
                                <button
                                  className={styles.rateButton}
                                  onClick={() => enviarCalificacion(producto.id_item, producto.id_item)}
                                  disabled={submittingRating[producto.id_item]}
                                >
                                  {submittingRating[producto.id_item] ? 'Enviando...' : 'Calificar'}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          );
        })
      )}
      {toasts.length > 0 && (
        <div className={styles.toastContainer}>
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`${styles.toast} ${styles[toast.type]} ${toast.exiting ? styles.exiting : ''}`}
            >
              {toast.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};