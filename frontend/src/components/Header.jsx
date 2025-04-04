import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import Button from "./Button";
import "../assets/style/Header.css";

const Header = () => {
  const [menuToggle, setMenuToggle] = useState(false);
  const handleMenuToggle = () => {
    setMenuToggle((prevState) => !prevState);
  };

  return (
    <>
      <header>
        <div className="container">
          <div className="inner">
            <div className="site-logo">
              <Link to = '/'><img src={logo} alt="" /></Link>
            </div>
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/explore">Explore</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </nav>

            <div className="header-cta">
              <Button buttonLink={"#"} buttonText={`Sign Up`} />
            </div>

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
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <Link to="/about">About</Link>
                    </li>
                    <li>
                      <Link to="/explore">Explore</Link>
                    </li>
                    <li>
                      <Link to="/contact">Contact</Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
