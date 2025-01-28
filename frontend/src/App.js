import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { Home } from "./components/Home";
import { Footer } from "./components/layouts/Footer";
import ProductDetails from "./components/product/ProductDetails";
import Header from "./components/layouts/Header";
import { ProductSearch } from "./components/product/ProductSearch";

function App() {
  return (
    <Router>
      <div>
        <HelmetProvider>
          <Header />
          <div className="container container-fluid">
            <ToastContainer theme="dark" />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/search/:keyword" element={<ProductSearch />} />
            </Routes>
          </div>
          <Footer />
        </HelmetProvider>
      </div>
    </Router>
  );
}

export default App;
