import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const token = localStorage.getItem("token");

    // fetch cart from backend
    const fetchCart = async () => {
        if (!token) return setCartItems([]);
        try {
            const res = await axios.get("http://localhost:4000/api/v1/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartItems(res.data?.data?.items || []);
        } catch (err) {
            console.error("Failed to fetch cart", err);
            setCartItems([]);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token]);

    const removeFromCart = async (productId) => {
        if (!token) return;
        try {
            await axios.delete(`http://localhost:4000/api/v1/cart/delete/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            await fetchCart();
        } catch (err) {
            console.error("Failed to remove item from cart", err);
            throw err;
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, fetchCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};
