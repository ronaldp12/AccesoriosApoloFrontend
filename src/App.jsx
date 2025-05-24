import { Route, Routes } from "react-router-dom";
import { Container } from "./Components/Container/Container.jsx";
import { Home } from "./Components/Pages/Home/Home.jsx";
import { Products } from "./Components/Pages/Products/Products.jsx";
import { Header } from "./Components/Layouts/Header/Header.jsx";
import { Footer } from "./Components/Layouts/Footer/Footer.jsx";
import { VerifyAccount } from "./Components/Ui/VerifyAccount/VerifyAccount.jsx";
import { ProfileData } from "./Components/Ui/ProfileData/ProfileData.jsx";
import { ProfileLayout } from "./Components/Layouts/ProfileLayout/ProfileLayout.jsx";
import { ProfileOrders } from "./Components/Ui/ProfileOrders/ProfileOrders.jsx";
import { WishList } from "./Components/Ui/WishList/WishList.jsx";
import { WelcomeModal } from "./Components/Layouts/WelcomeModal/WelcomeModal.jsx";
import { useContext } from "react";
import { context } from "./Context/Context.jsx";
import { IntermediateLoaderModal } from "./Components/Ui/IntermediateLoaderModal/IntermedaiteLoaderModal.jsx";
import { RequestResetEmail } from "./Components/Ui/RequestResetEmail/RequestResetEmail.jsx";
import { ChangePassword } from "./Components/Ui/ChangePassword/ChangePassword.jsx";
import { DashboardGerente } from "./Components/Pages/DashboardGerente/DashboardGerente.jsx";
import { HomeDashboardGerente } from "./Components/Layouts/HomeDashboardGerente/HomeDashboardGerente.jsx";
import { ManageUsers } from "./Components/Layouts/ManageUsers/ManageUsers.jsx";
import { ProtectedRouteClient } from "./Components/ProtectedRouteClient/ProtectedRouteClient.jsx";
import { ProtectedRouteManager } from "./Components/ProtectedRouteManager/ProtectedRouteManager.jsx";

export function App() {

  const { isWelcomeOpen, setIsWelcomeOpen } = useContext(context);

  return (
    <>
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
                <Products />
              </Container>
              <Footer />
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
            <ProtectedRouteManager>
              <Container>
                <DashboardGerente />
              </Container>
            </ProtectedRouteManager>
          }
        >
          <Route index element={<HomeDashboardGerente />} />
          <Route path="manage-users" element={<ManageUsers />} />
        </Route>

      </Routes>
      <IntermediateLoaderModal />
      <WelcomeModal isOpen={isWelcomeOpen} onClose={() => setIsWelcomeOpen(false)} />
    </>
  );
}
