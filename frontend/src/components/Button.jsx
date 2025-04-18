import React from "react";
import "../assets/style/Button.css";

const Button = ({ buttonLink, buttonText, onClick, className }) => {
  return (
    <>
      <button onClick={onClick} className={`btn ${className}`}>
        {buttonText}
      </button>
    </>
  );
};

export default Button;
