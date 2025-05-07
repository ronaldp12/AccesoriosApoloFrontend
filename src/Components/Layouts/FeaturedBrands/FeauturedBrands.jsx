import React from 'react';
import '../FeaturedBrands/FeaturedBrands.css';
import logo1 from '../../../assets/images/logo1-brand.png';
import img1 from '../../../assets/images/img1-brand.jpg';

export const FeaturedBrands = () => {
  return (
    <section className="featured-brands">
      <h2 className="brands-title">MARCAS DESTACADAS</h2>
      <div className="brands-container">
        <div className="brand-card">
          <img className="brand-bg" src={img1} alt="Shaft" />
          <img className="brand-logo" src={logo1} alt="Logo Shaft" />
        </div>
        <div className="brand-card">
          <img className="brand-bg" src={img1} alt="HJRO" />
          <img className="brand-logo" src={logo1} alt="Logo HJRO" />
        </div>
        <div className="brand-card">
          <img className="brand-bg" src={img1} alt="Arai" />
          <img className="brand-logo" src={logo1} alt="Logo Arai" />
        </div>
        <div className="brand-card">
          <img className="brand-bg" src={img1} alt="ICH" />
          <img className="brand-logo" src={logo1} alt="Logo ICH" />
        </div>
      </div>
    </section>
  );
};
