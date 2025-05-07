import React, { useState, useEffect } from "react";
import img1 from "../../../assets/images/img1-slider.jpg";
import img2 from "../../../assets/images/img2-slider.jpg";
import img3 from "../../../assets/images/img3-slider.jpg";
import "../Slider/Slider.css";

export const Slider = () => {
  const images = [img1, img2, img3];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <>
    
    <div className="slider">
      <div className="slider-inner">
        {images.map((image, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? "active" : ""}`}
          >
            <img src={image} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>
    </div>
    <div className="dots-container">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>
    </>
  );
};
