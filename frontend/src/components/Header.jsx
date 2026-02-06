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
  const [user, setUser] = useState(() => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  });
  const [showCart, setShowCart] = useState(false);

  const { cartItems, fetchCart } = useContext(CartContext);

  // Listen for auth changes (login/logout)
  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      setIsLoggedIn(!!token);
      try {
        setUser(userStr ? JSON.parse(userStr) : null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    
    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // fetch cart on login (only for buyers)
  useEffect(() => {
    if (isLoggedIn && user?.role === "buyer") {
      fetchCart();
    }
  }, [isLoggedIn, user, fetchCart]);

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
    setUser(null);
    window.dispatchEvent(new Event("authChange"));
    toast.success("Logged out successfully!");
    navigate("/auth");
  };

  // Only show cart for buyers
  const shouldShowCart = isLoggedIn && user?.role === "buyer";

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

          <div className="header-cta" style={{ position: "relative", display: "flex", gap: "1rem", alignItems: "center" }}>
            {isLoggedIn ? (
              <>
                {/* Show cart only for buyers */}
                {shouldShowCart && (
                  <div ref={cartRef} style={{ position: "relative", zIndex: 1000 }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowCart(prev => !prev);
                      }}
                      style={{ background: "none", border: "none", cursor: "pointer", position: "relative", zIndex: 1001 }}
                    >
                      <FaShoppingCart color="#FF6B35" size={25} />
                      {cartItems.length > 0 && (
                        <span
                          style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            background: "#e74c3c",
                            color: "#fff",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: "bold",
                            zIndex: 1002
                          }}
                        >
                          {cartItems.length}
                        </span>
                      )}
                    </button>

                    {showCart && (
                      <div style={{ 
                        position: "absolute", 
                        right: 0, 
                        top: "2.5rem", 
                        zIndex: 1001,
                        width: "300px",
                        maxWidth: "90vw"
                      }}>
                        <CartPopup items={cartItems} onClose={() => setShowCart(false)} />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Show user info and role-based links */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {user && (
                    <span style={{ color: "#1a1a1a", fontSize: "14px" }}>
                      {user.name} ({user.role})
                    </span>
                  )}
                  {(user?.role === "seller" || user?.role === "admin") && (
                    <a 
                      href={user.role === "admin" ? "/admin" : "/dashboard"}
                      style={{ 
                        color: "#FF6B35", 
                        textDecoration: "none",
                        padding: "6px 12px",
                        border: "1px solid #FF6B35",
                        borderRadius: "4px",
                        fontSize: "14px"
                      }}
                    >
                      Dashboard
                    </a>
                  )}
                  <Button buttonText="Logout" onClick={handleLogout} />
                </div>
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
