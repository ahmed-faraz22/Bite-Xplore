import React from "react";
import "../assets/style/Foodcard.css";
import defaultImage from "../assets/images/foodiesfeed.com_colorful-bowl-of-deliciousness-with-fried-egg.png";

const Foodcard = ({ product, staticname, bgimage }) => {
  const image = bgimage || product?.image || defaultImage;
  const name = product?.name || staticname;
  const rating = product?.rating || "";

  return (
    <div
      className="card-wrapper"
      style={{
        background: `url(${image})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="card-description">
        <strong>{name}</strong>
        {rating && <p>Rating: {rating}</p>}
      </div>
    </div>
  );
};

export default Foodcard;