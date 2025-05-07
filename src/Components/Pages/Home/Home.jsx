import React from 'react'
import { Header } from "../../Layouts/Header/Header.jsx";
import { Slider } from '../../Layouts/Slider/Slider.jsx';
import { DiscountSection } from '../../Layouts/DiscountSection/DiscountSection.jsx';
import { AccessoriesSelector } from '../../Layouts/AccesoriesSelector/AccesoriesSelector.jsx';
import { BestSellersSection } from '../../Layouts/BestSellerSection/BestSellerSection.jsx';
import { JoinBanner } from '../../Layouts/JoinBanner/JoinBanner.jsx';
import { FeaturedBrands } from '../../Layouts/FeaturedBrands/FeauturedBrands.jsx';
import { Footer } from '../../Layouts/Footer/Footer.jsx';

export const Home = () => {
  return (
    <>
        <Header/>
        <Slider/>
        <DiscountSection/>
        <AccessoriesSelector/>
        <BestSellersSection/>
        <JoinBanner/>
        <FeaturedBrands/>
        <Footer/>
    </>
  )
}
