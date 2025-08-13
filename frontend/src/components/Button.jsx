import React from "react";
import { Link } from "react-router-dom";
import "../assets/style/Button.css";

const Button = ({ buttonLink, buttonText, onClick, className }) => {
  return (
    <>
      <Link to={buttonLink} onClick={onClick} className={`btn ${className}`}>
        {buttonText}
      </Link>
    </>
  );
};

export default Button;
