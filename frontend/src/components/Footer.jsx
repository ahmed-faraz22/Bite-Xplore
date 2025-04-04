import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import Button from "./Button";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaReddit } from "react-icons/fa";
import "../assets/style/Footer.css";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="container">
          <div className="inner">
            <div className="col">
              <div className="logo">
                <Link to="/">
                  <img src={logo} alt="" />
                </Link>
              </div>
            </div>
            <div className="col">
              <h4>All Pages</h4>
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
            </div>
            <div className="col">
              <h4>All Pages</h4>
              <ul>
                <li>
                  <a href="https://www.facebook.com/" target="blank">
                    <FaFacebook /> Facebook
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/" target="blank">
                    <FaInstagram /> Instagram
                  </a>
                </li>
                <li>
                  <a href="https://www.whatsapp.com/" target="blank">
                    <FaWhatsapp /> Whatsapp
                  </a>
                </li>
                <li>
                  <a href="https://www.reddit.com/" target="blank">
                    <FaReddit /> Reddit
                  </a>
                </li>
              </ul>
            </div>
            <div className="col">
              <label htmlFor="useremail">Contact Us</label>
              <input type="text" name="useremail" />
              <Button buttonLink={"#"} buttonText={`contact`} />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
