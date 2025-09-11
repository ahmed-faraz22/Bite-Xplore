import React from "react";
import { Link } from "react-router-dom";
import { CiStar } from "react-icons/ci";
import Button from "./Button";
import "../assets/style/Productcard.css";

const Productcard = ({ product }) => {
  return (
    <div className="productcard-wrapper">
      <div className="card">
        <div className="card-head">
          <img
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
          />
        </div>
        <div className="card-body">
          <span>
            {[...Array(5)].map((_, index) => (
              <CiStar
                key={`${product._id}-${index}`}
                className={product.rating > index ? "filled" : ""}
              />
            ))}
          </span>
          <div className="description">
            <h4>{product.name}</h4>
            <p>{product.description || "No description available"}</p>
          </div>
          <div className="price-wrapper">
            <span>Rs {product.price}</span>
            <Button
              buttonLink={`/product/${product._id}`}
              buttonText="View Details"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productcard;
