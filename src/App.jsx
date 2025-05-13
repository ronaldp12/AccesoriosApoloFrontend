import { Route, Routes } from "react-router-dom";
import { Container } from "./Components/Container/Container.jsx";
import { Home } from "./Components/Pages/Home/Home.jsx";
import { Products } from "./Components/Pages/Products/Products.jsx";
import { Header } from "./Components/Layouts/Header/Header.jsx";
import { Footer } from "./Components/Layouts/Footer/Footer.jsx";
import { VerifyAccount } from "./Components/Ui/VerifyAccount/VerifyAccount.jsx";

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
      </Routes>
    </>
  );
}
