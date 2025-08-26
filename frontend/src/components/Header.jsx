import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/images/logo.png";
import Button from "./Button";
import "../assets/style/Header.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();
  const [menuToggle, setMenuToggle] = useState(false);

  // ✅ Sync login status on localStorage change
  useEffect(() => {
  const updateLoginStatus = () => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  };

  window.addEventListener("storage", updateLoginStatus);
  window.addEventListener("authChange", updateLoginStatus); // ✅ Listen to custom login event

  return () => {
    window.removeEventListener("storage", updateLoginStatus);
    window.removeEventListener("authChange", updateLoginStatus); // ✅ Clean up
  };
}, []);


  const handleLogout = async () => {
    try {
      // If your backend supports logout route, call it
      await axios.post("http://localhost:4000/api/v1/users/logout", {}, {
        withCredentials: true,
      });
    } catch (err) {
      console.warn("Logout request failed (fallback to local removal):", err?.message);
    }

    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    toast.success("Logged out successfully!");
    navigate("/auth");
  };

  const handleMenuToggle = () => {
    setMenuToggle(prev => !prev);
  };

  return (
    <header>
      <div className="container">
        <div className="inner">
          <div className="site-logo">
            <NavLink to="/">
              <img src={logo} alt="Site Logo" />
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="main-nav">
            <ul>
              <li><NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink></li>
              <li><NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>About</NavLink></li>
              <li><NavLink to="/explore" className={({ isActive }) => (isActive ? "active" : "")}>Explore</NavLink></li>
              <li><NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>Contact</NavLink></li>
            </ul>
          </nav>

          {/* CTA Button */}
          <div className="header-cta">
            {isLoggedIn ? (
              <Button buttonText="Logout" onClick={handleLogout} />
            ) : (
              <Button buttonText="Sign In" buttonLink="/auth" />
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="mobile-menu">
            <div className="mobile-btn" onClick={handleMenuToggle}>
              <div className="btn-bar"></div>
              <div className="btn-bar"></div>
              <div className="btn-bar"></div>
            </div>

            <div className={`mobile-nav ${menuToggle ? "active" : ""}`}>
              <nav>
                <ul>
                  <li><NavLink to="/" end onClick={handleMenuToggle} className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink></li>
                  <li><NavLink to="/about" onClick={handleMenuToggle} className={({ isActive }) => (isActive ? "active" : "")}>About</NavLink></li>
                  <li><NavLink to="/explore" onClick={handleMenuToggle} className={({ isActive }) => (isActive ? "active" : "")}>Explore</NavLink></li>
                  <li><NavLink to="/contact" onClick={handleMenuToggle} className={({ isActive }) => (isActive ? "active" : "")}>Contact</NavLink></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
