import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Explore from "./pages/Explore";
import Layout from "./components/Layout";
import ProductDetail from "./pages/ProductDetail";
import "./App.css";
import Auth from "./pages/auth/Auth";
import Dashboard from "./pages/Dashboard";
import Dashboardmain from "./components/dashboard/Dashboardmain";
import Category from "./components/dashboard/Category";
import Newsletter from "./components/dashboard/Newsletter";
import Profile from "./components/dashboard/Profile";
import ProtectedRoute from "./components/dashboard/ProtectedRoute";
import Product from "./components/dashboard/Product";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public pages */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="explore" element={<Explore />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="auth" element={<Auth />} />

          {/* Seller-only dashboard */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowedRole="seller">
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboardmain />} />
            <Route path="categories" element={<Category />} />
            <Route path="newsletter" element={<Newsletter />} />
            <Route path="profile" element={<Profile />} />
            <Route path="Product" element={< Product/>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
