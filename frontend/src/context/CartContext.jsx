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

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
