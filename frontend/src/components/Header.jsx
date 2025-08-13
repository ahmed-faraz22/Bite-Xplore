import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/logo.png";
import Button from "./Button";
import "../assets/style/Header.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();
  const [menuToggle, setMenuToggle] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    setTimeout(() => {
      navigate("/auth");
    }, 50);
  };

  const handleMenuToggle = () => {
    setMenuToggle((prevState) => !prevState);
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
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/explore"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Explore
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="header-cta">
            {isLoggedIn ? (
              <Button buttonText="Logout" onClick={handleLogout} />
            ) : (
              <Button buttonLink="/auth" buttonText="Sign Up" />
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
                  <li>
                    <NavLink
                      to="/"
                      end
                      onClick={handleMenuToggle}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/about"
                      onClick={handleMenuToggle}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      About
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/explore"
                      onClick={handleMenuToggle}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      Explore
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/contact"
                      onClick={handleMenuToggle}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      Contact
                    </NavLink>
                  </li>
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
