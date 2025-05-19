import React from 'react';
import './ProfileOrders.css';
import helmet from '../../../assets/images/img1-sale.jpg';

export const ProfileOrders = () => {
  return (
    <div className="orders-container">
      <h2>Pedidos</h2>

      <div className="order-card">
        <div className="order-info">
          <img src={helmet} alt="Producto" className="order-product-img" />

          <div className="order-details">
            <p className="order-title">PUÑOS PRO TAPER K107 CERRADO NEGRO AZUL</p>
            <p className="order-quantity"><strong>CANT 1</strong></p>
            <p className="order-address">Torres El Bosque, APT 742, calle 12 A/3</p>
            <p className="order-price"><strong>$20.000 COP</strong></p>
          </div>
        </div>

        <div className="order-status">
          <button className="status-button">ENTREGADO</button>
        </div>
      </div>

    </div>
  );
};
