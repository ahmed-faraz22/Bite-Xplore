import React from "react";
import { Link } from "react-router-dom";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import Button from "./Button";
import "../assets/style/Productcard.css";

const Productcard = ({ product }) => {
  const averageRating = product.averageRating || 0;
  const totalReviews = product.totalReviews || 0;
  const stock = product.stock || 0;
  const isInStock = stock > 0;

  return (
    <div className="productcard-wrapper">
      <div className="card">
        <div className="card-head">
          <img
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
          />
          {!isInStock && (
            <div className="out-of-stock-badge">Not Available</div>
          )}
        </div>
        <div className="card-body">
          <div className="rating-display">
            <span className="stars">
              {[...Array(5)].map((_, index) => (
                index < Math.floor(averageRating) ? (
                  <FaStar key={`${product._id}-${index}`} className="star-filled" />
                ) : index < averageRating ? (
                  <FaStar key={`${product._id}-${index}`} className="star-half" />
                ) : (
                  <CiStar key={`${product._id}-${index}`} className="star-empty" />
                )
              ))}
            </span>
            {averageRating > 0 && (
              <span className="rating-text">
                {averageRating.toFixed(1)} ({totalReviews})
              </span>
            )}
            {averageRating === 0 && (
              <span className="rating-text">No ratings yet</span>
            )}
          </div>
          <div className="description">
            <h4>{product.name}</h4>
            <p>{product.description || "No description available"}</p>
          </div>
          <div className="stock-info">
            <span className={isInStock ? "stock-in" : "stock-out"}>
              {isInStock ? "✓ Available" : "✗ Not Available"}
            </span>
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
