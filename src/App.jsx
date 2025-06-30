import { Route, Routes, Navigate } from "react-router-dom";
import { Container } from "./Components/Container/Container.jsx";
import { Home } from "./Components/Pages/Home/Home.jsx";
import { Header } from "./Components/Layouts/Header/Header.jsx";
import { Footer } from "./Components/Layouts/Footer/Footer.jsx";
import { VerifyAccount } from "./Components/Ui/VerifyAccount/VerifyAccount.jsx";
import { ProfileData } from "./Components/Ui/ProfileData/ProfileData.jsx";
import { ProfileLayout } from "./Components/Layouts/ProfileLayout/ProfileLayout.jsx";
import { ProfileOrders } from "./Components/Ui/ProfileOrders/ProfileOrders.jsx";
import { WishList } from "./Components/Ui/WishList/WishList.jsx";
import { WelcomeModal } from "./Components/Layouts/WelcomeModal/WelcomeModal.jsx";
import { useContext, useState } from "react";
import { context } from "./Context/Context.jsx";
import { IntermediateLoaderModal } from "./Components/Ui/IntermediateLoaderModal/IntermedaiteLoaderModal.jsx";
import { RequestResetEmail } from "./Components/Ui/RequestResetEmail/RequestResetEmail.jsx";
import { ChangePassword } from "./Components/Ui/ChangePassword/ChangePassword.jsx";
import { DashboardGerente } from "./Components/Pages/DashboardGerente/DashboardGerente.jsx";
import { HomeDashboardGerente } from "./Components/Layouts/HomeDashboardGerente/HomeDashboardGerente.jsx";
import { ManageUsers } from "./Components/Layouts/ManageUsers/ManageUsers.jsx";
import { ProtectedRouteClient } from "./Components/ProtectedRouteClient/ProtectedRouteClient.jsx";
import { ProtectedRouteDashboard } from "./Components/ProtectedRouteDashboard/ProtectedRouteDashboard.jsx";
import { ManageSupliers } from "./Components/Layouts/ManageSupliers/ManageSupliers.jsx";
import { ManageCategories } from "./Components/Layouts/ManageCategories/ManageCategories.jsx";
import { ManageSubcategories } from "./Components/Layouts/ManageSubcategories/ManageSubcategories.jsx";
import { ManageProducts } from "./Components/Layouts/ManageProducts/ManageProducts.jsx";
import { ManageInvoice } from "./Components/Layouts/ManageInvoice/ManageInvoice.jsx";
import { ManageStickers } from "./Components/Layouts/ManageStickers/ManageStickers.jsx";
import { ContactAboutUsHelp } from "./Components/Pages/Contact-AboutUs-Help/ContactAboutUsHelp.jsx";
import { ManageSales } from "./Components/Layouts/ManageSales/ManageSales.jsx";
import { ManageInventory } from "./Components/Layouts/ManageInventory/ManageInventory.jsx";
import { StickersUpload } from "./Components/Layouts/StickersUpload/StickersUpload.jsx";
import { StickerGallery } from "./Components/Layouts/StickerGallery/StickerGallery.jsx";
import { StickersLayout } from "./Components/Layouts/StickersLayout/StickersLayout.jsx";
import { ProductPage } from "./Components/Pages/ProductPage/ProductPage.jsx";
import { ProductDetailPage } from "./Components/Layouts/ProductDetailPage/ProductDetailPage.jsx";
import { ScrollToTop } from "./Components/Ui/ScrollToTop/ScrollToTop.jsx";
import { StickersPage } from "./Components/Pages/StickersPage/StickersPage.jsx";
import { RegisterModal } from "./Components/Layouts/RegisterModal/RegisterModal.jsx";
import { LoginModal } from "./Components/Layouts/LoginModal/LoginModal.jsx";
import { CheckoutForm } from "./Components/Layouts/CheckoutForm/CheckoutForm.jsx";
import { PagoPage } from "./Components/Layouts/PagoPage/PagoPage.jsx";
import { ThanksForYourPurchase } from "./Components/Pages/ThanksForYourPurchase/ThanksForYourPurchase.jsx";

export function App() {

  const { isWelcomeOpen, setIsWelcomeOpen } = useContext(context);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleOpenRegister = () => {
    setShowRegister(true);
  };

  const handleOpenLogin = () => {
    setShowLogin(true);
  };

  const handleCloseRegister = () => {
    setShowRegister(false);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  return (
    <>
      <ScrollToTop />
      <Routes>

        <Route
          path="/"
          element={
            <>
              <Header />
              <Container>
                <Home />
              </Container>
              <Footer />
            </>
          }
        />

        <Route
          path="/products"
          element={
            <>
              <Header />
              <Container>
                <ProductPage />
              </Container>
              <Footer />
            </>
          }
        />

        <Route
          path="/product/:slug"
          element={
            <>
              <Header />
              <Container>
                <ProductDetailPage />
              </Container>
              <Footer />
            </>
          }
        />

        <Route
          path="/sticker/:id"
          element={
            <>
              <Header />
              <Container>
                <ProductDetailPage />
              </Container>
              <Footer />
            </>
          }
        />

        <Route
          path="/stickers/all"
          element={
            <>
              <Header />
              <Container>
                <StickersPage onOpenRegister={handleOpenRegister}
                  onOpenLogin={handleOpenLogin} />
              </Container>
              <Footer />
            </>
          }
        ></Route>

        <Route
          path="/stickers"
          element={
            <>
              <Header />
              <Container>
                <StickersLayout />
              </Container>
              <Footer />
            </>
          }
        >
          <Route index element={<StickersUpload />} />
          <Route path="gallery" element={<StickerGallery />} />
          <Route path="upload" element={<StickersUpload />} />
        </Route>

        <Route
          path="/contact-about-us-help"
          element={
            <>
              <Header />
              <Container>
                <ContactAboutUsHelp />
              </Container>
              <Footer />
            </>
          }
        />

        <Route
          path="/checkout"
          element={
            <>
              <Container>
                <CheckoutForm />
              </Container>
            </>
          }
        />

        <Route
          path="/gracias-por-tu-compra"
          element={
            <>
              <Container>
                <ThanksForYourPurchase />
              </Container>
            </>
          }
        />

        <Route
          path="/checkout/pago"
          element={
            <>
              <Container>
                <PagoPage />
              </Container>
            </>
          }
        />
        

        <Route path="/verify-account" element={<VerifyAccount />} />
        <Route path="/request-email" element={<RequestResetEmail />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route
          path="/profile"
          element={
            <ProtectedRouteClient>
              <>
                <Header />
                <Container>
                  <ProfileLayout />
                </Container>
                <Footer />
              </>
            </ProtectedRouteClient>
          }
        >

          <Route index element={<ProfileData />} />
          <Route path="orders" element={<ProfileOrders />} />
          <Route path="wish-list" element={<WishList />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRouteDashboard>
              <Container>
                <DashboardGerente />
              </Container>
            </ProtectedRouteDashboard>
          }
        >
          <Route index element={<HomeDashboardGerente />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-supliers" element={<ManageSupliers />} />
          <Route path="manage-categories" element={<ManageCategories />} />
          <Route path="manage-subcategories" element={<ManageSubcategories />} />
          <Route path="manage-products" element={<ManageProducts />} />
          <Route path="manage-invoice" element={<ManageInvoice />} />
          <Route path="manage-stickers" element={<ManageStickers />} />
          <Route path="manage-sales" element={<ManageSales />} />
          <Route path="manage-inventory" element={<ManageInventory />} />
        </Route>

      </Routes>
      <IntermediateLoaderModal />
      <WelcomeModal isOpen={isWelcomeOpen} onClose={() => setIsWelcomeOpen(false)} />
      {showRegister && <RegisterModal onClose={handleCloseRegister} />}
      {showLogin && <LoginModal onClose={handleCloseLogin} />}
    </>
  );
}
