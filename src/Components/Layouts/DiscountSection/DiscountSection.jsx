import React from 'react'
import { DiscountCard } from '../DiscountCard/DiscountCard.jsx'
import img1 from '../../../assets/images/img1-discount.jpg'
import '../DiscountSection/DiscountSection.css'

export const DiscountSection = () => {
  return (
    <>
    
    <section className="descuentos-section">
      <h2 className="section-title">LOS MEJORES DESCUENTOS</h2>

      <div className="cards-container">
        <DiscountCard imagen={img1} titulo={"cascos"}/>
        <DiscountCard imagen={img1} titulo={"chaquetas"}/>
        <DiscountCard imagen={img1} titulo={"guantes"}/>
        <DiscountCard imagen={img1} titulo={"gafas"}/>
      </div>

      <button className="ver-btn">VER</button>
    </section>
    <div className='dots-container'>

    </div>
    </>
  )
}
