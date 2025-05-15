import React from 'react'
import { Slider } from '../../Layouts/Slider/Slider.jsx';
import { DiscountSection } from '../../Layouts/DiscountSection/DiscountSection.jsx';
import { AccessoriesSelector } from '../../Layouts/AccesoriesSelector/AccesoriesSelector.jsx';
import { BestSellersSection } from '../../Layouts/BestSellerSection/BestSellerSection.jsx';
import { JoinBanner } from '../../Layouts/JoinBanner/JoinBanner.jsx';
import { FeaturedBrands } from '../../Layouts/FeaturedBrands/FeauturedBrands.jsx';
import { useContext } from 'react';
import { context } from '../../../Context/Context.jsx';

export const Home = () => {

  const { handleAddToCart } = useContext(context);

  return (
    <>

      <Slider />
      <DiscountSection />
      <AccessoriesSelector />
      <BestSellersSection onAddToCart={handleAddToCart} />
      <JoinBanner />
      <FeaturedBrands />

    </>
  )
}
