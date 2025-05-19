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

export function App() {
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

        <Route
          path="/profile"
          element={
            <>
              <Header />
              <Container>
                <ProfileLayout />
              </Container>
              <Footer />
            </>
          }
        >
          
          <Route index element={<ProfileData />} />
          <Route path="orders" element={<ProfileOrders />} />
          <Route path="wish-list" element={<WishList />} />
        </Route>

      </Routes>
    </>
  );
}
