import React from 'react'
import { DiscountCard } from '../DiscountCard/DiscountCard.jsx'
import img1 from '../../../assets/images/img1-discount.jpg'
import img2 from '../../../assets/images/img2-discount.jpg'
import img3 from '../../../assets/images/img3-discount.jpg'
import img4 from '../../../assets/images/img4-discount.jpg'
import '../DiscountSection/DiscountSection.css'

export const DiscountSection = () => {
  return (
    <>
    
    <section id='offers' className="descuentos-section">
      <h2 className="section-title-discount-section">LOS MEJORES DESCUENTOS</h2>

      <div className="cards-container">
        <DiscountCard imagen={img1} titulo={"cascos"}/>
        <DiscountCard imagen={img2} titulo={"chaquetas"}/>
        <DiscountCard imagen={img3} titulo={"guantes"}/>
        <DiscountCard imagen={img4} titulo={"gafas"}/>
      </div>

      <button className="ver-btn">VER</button>
    </section>
    <div className='dots-container'>

    </div>
    </>
  )
}
