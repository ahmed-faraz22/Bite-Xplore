import React from "react";
import Button from "./Button";
import "../assets/style/CartPopup.css";


const CartPopup = ({ items = [], onClose }) => {
    const totalPrice = items.reduce((acc, item) => acc + (item.productId.price || 0) * item.quantity, 0);

    return (
        <div className="cart-popup">
            <div className="cart-popup-header">
                <h4>Your Cart</h4>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>

            {items.length === 0 ? (
                <p className="empty-text">Your cart is empty.</p>
            ) : (
                <>
                    <ul className="cart-items">
                        {items.map((item, index) => (
                            <li key={index} className="cart-item">
                                <div>
                                    <p className="item-name">{item.productId.name}</p>
                                    <p className="item-qty">Qty: {item.quantity}</p>
                                </div>
                                <p className="item-price">Rs {(item.productId.price * item.quantity).toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>

                    <div className="cart-total">
                        <strong>Total:</strong> <span>Rs {totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="cart-actions">
                        <Button buttonText="Checkout" buttonLink="/checkout" />
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPopup;
