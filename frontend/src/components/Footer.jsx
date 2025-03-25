import React from "react";
import "../assets/style/Footer.css";
import map from "../assets/images/logo.png";
import Button from "./Button";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaReddit } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="container">
          <div className="inner">
            <div className="col">
              <div className="logo">
                <img src={map} alt="" />
              </div>
            </div>
            <div className="col">
              <h4>All Pages</h4>
              <ul>
                <li>
                  <a href="">Home</a>
                </li>
                <li>
                  <a href="">About</a>
                </li>
                <li>
                  <a href="">Products</a>
                </li>
                <li>
                  <a href="">Contact</a>
                </li>
              </ul>
            </div>
            <div className="col">
              <h4>All Pages</h4>
              <ul>
                <li>
                  <a href="">
                    <FaFacebook /> Facebook
                  </a>
                </li>
                <li>
                  <a href="">
                    <FaInstagram /> Instagram
                  </a>
                </li>
                <li>
                  <a href="">
                    <FaWhatsapp /> Whatsapp
                  </a>
                </li>
                <li>
                  <a href="">
                    <FaReddit /> Reddit
                  </a>
                </li>
              </ul>
            </div>
            <div className="col">
              <label htmlFor="useremail">Contact Us</label>
              <input type="text" name="useremail" />
              <Button />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
