import React from 'react'
import { Slider } from '../../Layouts/Slider/Slider.jsx';
import { DiscountSection } from '../../Layouts/DiscountSection/DiscountSection.jsx';
import { AccessoriesSelector } from '../../Layouts/AccesoriesSelector/AccesoriesSelector.jsx';
import { BestSellersSection } from '../../Layouts/BestSellerSection/BestSellerSection.jsx';
import { JoinBanner } from '../../Layouts/JoinBanner/JoinBanner.jsx';
import { FeaturedBrands } from '../../Layouts/FeaturedBrands/FeauturedBrands.jsx';
import { useContext, useState } from 'react';
import { context } from '../../../Context/Context.jsx';
import { RegisterModal } from '../../Layouts/RegisterModal/RegisterModal.jsx';
import { LoginModal } from '../../Layouts/LoginModal/LoginModal.jsx';

export const Home = () => {

  const { handleAddToCart } = useContext(context);

  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const openRegister = () => {
    setRegisterOpen(true);
  };

  const closeRegister = () => setRegisterOpen(false);

  const openLogin = () => {
    setLoginOpen(true);
  };

  const closeLogin = () => setLoginOpen(false);

  return (
    <>

      <Slider />
      <DiscountSection />
      <AccessoriesSelector />
      <BestSellersSection onAddToCart={handleAddToCart} />
      <JoinBanner
        onOpenRegister={openRegister}
        onOpenLogin={openLogin}
      />
      <FeaturedBrands />

      <RegisterModal isOpen={registerOpen} onClose={closeRegister} />
      <LoginModal isOpen={loginOpen} onClose={closeLogin} />
    </>
  )
}
