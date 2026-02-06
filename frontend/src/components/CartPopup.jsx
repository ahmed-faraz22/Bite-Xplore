import React from "react";
import Button from "./Button";
import "../assets/style/CartPopup.css";


const CartPopup = ({ items = [], onClose }) => {
    if (!items || !Array.isArray(items)) {
        return null;
    }

    const totalPrice = items.reduce((acc, item) => {
        if (!item || !item.productId) return acc;
        return acc + (item.productId.price || 0) * (item.quantity || 0);
    }, 0);

    return (
        <div className="cart-popup" onClick={(e) => e.stopPropagation()}>
            <div className="cart-popup-header">
                <h4>Your Cart</h4>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>

            {items.length === 0 ? (
                <p className="empty-text">Your cart is empty.</p>
            ) : (
                <>
                    <ul className="cart-items">
                        {items.map((item, index) => {
                            if (!item || !item.productId) return null;
                            return (
                                <li key={index} className="cart-item">
                                    <div>
                                        <p className="item-name">{item.productId.name || "Unknown Product"}</p>
                                        <p className="item-qty">Qty: {item.quantity || 0}</p>
                                    </div>
                                    <p className="item-price">Rs {((item.productId.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="cart-total">
                        <strong>Total:</strong> <span>Rs {totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="cart-actions">
                        <Button 
                            buttonText="Checkout" 
                            buttonLink="/checkout" 
                            onClick={onClose}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPopup;
