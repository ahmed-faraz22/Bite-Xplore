import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { useContext } from "react";
import { CompareContext } from "../context/CompareContext";
import "../assets/style/CompareModal.css";

const CompareModal = ({ onClose }) => {
  const { compareItems, removeFromCompare, clearCompare } = useContext(CompareContext);

  if (compareItems.length < 2) return null;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) =>
      index < Math.floor(rating) ? (
        <FaStar key={index} className="star-filled" />
      ) : (
        <CiStar key={index} className="star-empty" />
      )
    );
  };

  return (
    <div className="compare-modal-overlay" onClick={onClose}>
      <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
        <div className="compare-modal-header">
          <h3>Compare Products</h3>
          <button className="compare-close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="compare-content">
          {compareItems.map((product) => (
            <div key={product._id} className="compare-product-card">
              <button
                className="compare-remove-btn"
                onClick={() => removeFromCompare(product._id)}
                aria-label="Remove from compare"
              >
                ×
              </button>
              <div className="compare-product-image">
                <img
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                />
              </div>
              <h4>{product.name}</h4>
              <p className="compare-description">{product.description || "No description"}</p>
              <div className="compare-detail">
                <span className="compare-label">Price</span>
                <span className="compare-value">Rs {product.price}</span>
              </div>
              <div className="compare-detail">
                <span className="compare-label">Rating</span>
                <span className="compare-value compare-stars">
                  {renderStars(product.averageRating || 0)}{" "}
                  {product.averageRating?.toFixed(1) || "0.0"} ({product.totalReviews || 0})
                </span>
              </div>
              <div className="compare-detail">
                <span className="compare-label">Stock</span>
                <span className={`compare-value ${product.stock > 0 ? "stock-in" : "stock-out"}`}>
                  {product.stock > 0 ? "Available" : "Not Available"}
                </span>
              </div>
              <Link to={`/product/${product._id}`} className="compare-view-btn">
                View Details
              </Link>
            </div>
          ))}
        </div>

        <div className="compare-modal-footer">
          <button className="compare-clear-btn" onClick={clearCompare}>
            Clear Compare
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
