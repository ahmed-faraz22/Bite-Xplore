// import React from "react";
// import { Link } from "react-router-dom";
// import "../assets/style/Button.css";

// const Button = ({ buttonLink, buttonText, onClick, className }) => {
//   return (
//     <>
//       <Link to={buttonLink} onClick={onClick} className={`btn ${className}`}>
//         {buttonText}
//       </Link>
//     </>
//   );
// };

// export default Button;



import React from "react";
import { Link } from "react-router-dom";
import "../assets/style/Button.css";

const Button = ({ buttonLink, buttonText, onClick, className = "", type = "button" }) => {
  if (buttonLink) {
    // 🔹 Link-style button
    return (
      <Link to={buttonLink} className={`btn ${className}`}>
        {buttonText}
      </Link>
    );
  }

  // 🔹 Real button (works inside forms)
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${className}`}
    >
      {buttonText}
    </button>
  );
};

export default Button;

