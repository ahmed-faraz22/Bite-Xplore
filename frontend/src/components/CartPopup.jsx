import React, { useState } from "react";
import { useContext } from "react";
import { toast } from "react-toastify";
import Button from "./Button";
import { CartContext } from "../context/CartContext";
import "../assets/style/CartPopup.css";


const CartPopup = ({ items = [], onClose }) => {
    const { removeFromCart } = useContext(CartContext);
    const [removing, setRemoving] = useState(null);

    if (!items || !Array.isArray(items)) {
        return null;
    }

    const totalPrice = items.reduce((acc, item) => {
        if (!item || !item.productId) return acc;
        return acc + (item.productId.price || 0) * (item.quantity || 0);
    }, 0);

    const handleRemove = async (e, productId) => {
        e.stopPropagation();
        if (removing) return;
        setRemoving(productId);
        try {
            await removeFromCart(productId);
            toast.success("Item removed from cart");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to remove item");
        } finally {
            setRemoving(null);
        }
    };

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
                            const productId = item.productId._id || item.productId;
                            return (
                                <li key={productId || index} className="cart-item">
                                    <div className="cart-item-info">
                                        <p className="item-name">{item.productId.name || "Unknown Product"}</p>
                                        <p className="item-qty">Qty: {item.quantity || 0}</p>
                                    </div>
                                    <div className="cart-item-right">
                                        <p className="item-price">Rs {((item.productId.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                                        <button
                                            className="cart-remove-btn"
                                            onClick={(e) => handleRemove(e, productId)}
                                            disabled={removing === productId}
                                            title="Remove from cart"
                                            aria-label="Remove from cart"
                                        >
                                            {removing === productId ? "..." : "×"}
                                        </button>
                                    </div>
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
