import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../FeaturedBrands/FeaturedBrands.css';
import logo1 from '../../../assets/images/img1-marca.png';
import logo2 from '../../../assets/images/img2-marca.png';
import logo3 from '../../../assets/images/img3-marca.png';
import logo4 from '../../../assets/images/img42-marca.png';

import img1 from '../../../assets/images/img1-brand.jpg';
import img2 from '../../../assets/images/img2-brand.jpg';
import img3 from '../../../assets/images/img3-brand.jpg';
import img5 from '../../../assets/images/img5-brand.jpg';

export const FeaturedBrands = () => {
  const navigate = useNavigate();
  
  const featuredBrands = [
    { name: 'Shaft', bgImage: img1, logo: logo2 },
    { name: 'Hro', bgImage: img2, logo: logo3 },
    { name: 'Arai', bgImage: img5, logo: logo4 },
    { name: 'Ich', bgImage: img3, logo: logo1 }
  ];

  const handleBrandClick = (brandName) => {
    navigate(`/products?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <section className="featured-brands">
      <h2 className="brands-title">MARCAS DESTACADAS</h2>
      <div className="brands-container">
        {featuredBrands.map((brand, index) => (
          <div
            key={index}
            className="brand-card"
            onClick={() => handleBrandClick(brand.name)}
            style={{ cursor: 'pointer' }}
          >
            <img className="brand-bg" src={brand.bgImage} alt={brand.name} />
            <img className="brand-logo" src={brand.logo} alt={`Logo ${brand.name}`} />
          </div>
        ))}
      </div>
    </section>
  );
};