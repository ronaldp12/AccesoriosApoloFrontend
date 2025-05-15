import React from 'react';
import '../FeaturedBrands/FeaturedBrands.css';
import logo1 from '../../../assets/images/img1-marca.png';
import logo2 from '../../../assets/images/img2-marca.png';
import logo3 from '../../../assets/images/img3-marca.png';
import logo4 from '../../../assets/images/img42-marca.png';

import img1 from '../../../assets/images/img1-brand.jpg';
import img2 from '../../../assets/images/img2-brand.jpg';
import img3 from '../../../assets/images/img3-brand.jpg';
import img4 from '../../../assets/images/img4-brand.jpg';
import img5 from '../../../assets/images/img5-brand.jpg';


export const FeaturedBrands = () => {
  return (
    <section className="featured-brands">
      <h2 className="brands-title">MARCAS DESTACADAS</h2>
      <div className="brands-container">
        <div className="brand-card">
          <img className="brand-bg" src={img1} alt="Shaft" />
          <img className="brand-logo" src={logo2} alt="Logo Shaft" />
        </div>
        <div className="brand-card">
          <img className="brand-bg" src={img2} alt="HJRO" />
          <img className="brand-logo" src={logo3} alt="Logo HJRO" />
        </div>
        <div className="brand-card">
          <img className="brand-bg" src={img5} alt="Arai" />
          <img className="brand-logo" src={logo4} alt="Logo Arai" />
        </div>
        <div className="brand-card">
          <img className="brand-bg" src={img3} alt="ICH" />
          <img className="brand-logo" src={logo1} alt="Logo ICH" />
        </div>
      </div>
    </section>
  );
};
