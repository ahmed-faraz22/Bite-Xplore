import React from "react";
import "../assets/style/Foodcard.css";
import defaultImage from "../assets/images/foodiesfeed.com_colorful-bowl-of-deliciousness-with-fried-egg.png";

const Foodcard = ({ product, staticname, bgimage, isRestaurant }) => {
  const name = product?.name || staticname;
  const rating = product?.rating || "";
  const image = bgimage || product?.image;

  // For restaurant cards: use logo when available; otherwise show letter placeholder (not food image)
  const useRestaurantPlaceholder = isRestaurant && !image;
  const backgroundImage = useRestaurantPlaceholder ? undefined : (image || defaultImage);

  return (
    <div
      className={`card-wrapper ${useRestaurantPlaceholder ? "card-wrapper--restaurant-placeholder" : ""}`}
      style={
        backgroundImage
          ? {
              background: `url(${backgroundImage})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }
          : undefined
      }
    >
      {useRestaurantPlaceholder && (
        <div className="card-restaurant-placeholder">
          {name ? name.charAt(0).toUpperCase() : "?"}
        </div>
      )}
      <div className="card-description">
        <strong>{name}</strong>
        {rating && <p>Rating: {rating}</p>}
      </div>
    </div>
  );
};

export default Foodcard;