import React from 'react'

export const DiscountCard = ({imagen, titulo}) => {
    return (
        <div className="card">
            <img src={imagen} alt={titulo} />
            <div className="card-text">
                <h3>{titulo}</h3>
                <span>DESCUENTOS</span>
            </div>
        </div>
    )
}
