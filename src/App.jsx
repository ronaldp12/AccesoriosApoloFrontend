import { Container } from "./Components/Container/Container.jsx";
import { Home } from "./Components/Pages/Home/Home.jsx";
import { Route, Routes } from "react-router-dom";
import { Products } from "./Components/Pages/Products/Products.jsx";
import { Header } from "./Components/Layouts/Header/Header.jsx";
import { Footer } from "./Components/Layouts/Footer/Footer.jsx";

export function App() {


  return (
    <>
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </Container>
      <Footer />

    </>
  )
}

