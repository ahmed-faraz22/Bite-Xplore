import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaShoppingCart } from "react-icons/fa";
import Button from "./Button";
import CartPopup from "./CartPopup";
import logo from "../assets/images/logo.png";
import "../assets/style/Header.css";
import { CartContext } from "../context/CartContext.jsx";

const Header = () => {
  const navigate = useNavigate();
  const cartRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showCart, setShowCart] = useState(false);

  const { cartItems, fetchCart } = useContext(CartContext);

  // fetch cart on login
  useEffect(() => {
    if (isLoggedIn) fetchCart();
  }, [isLoggedIn, fetchCart]);

  // click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) setShowCart(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4000/api/v1/users/logout", {}, { withCredentials: true });
    } catch (err) {
      console.warn(err);
    }
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logged out successfully!");
    navigate("/auth");
  };

  return (
    <header>
      <div className="container">
        <div className="inner">
          <div className="site-logo">
            <NavLink to="/"><img src={logo} alt="Logo" /></NavLink>
          </div>

          <nav className="main-nav">
            <ul>
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/about">About</NavLink></li>
              <li><NavLink to="/explore">Explore</NavLink></li>
              <li><NavLink to="/contact">Contact</NavLink></li>
            </ul>
          </nav>

          <div className="header-cta" style={{ position: "relative", display: "flex", gap: "1rem" }}>
            {isLoggedIn ? (
              <>
                <div ref={cartRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setShowCart(prev => !prev)}
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    <FaShoppingCart color="#FF6B35" size={25} />
                  </button>

                  {showCart && (
                    <div style={{ position: "absolute", right: 0, top: "2.5rem", zIndex: 100 }}>
                      <CartPopup items={cartItems} onClose={() => setShowCart(false)} />
                    </div>
                  )}
                </div>
                <Button buttonText="Logout" onClick={handleLogout} />
              </>
            ) : (
              <Button buttonText="Sign In" buttonLink="/auth" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
