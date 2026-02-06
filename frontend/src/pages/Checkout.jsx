import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../assets/style/Checkout.css";

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod] = useState("online"); // Only online payment now
  const [restaurantGroups, setRestaurantGroups] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Please login to checkout");
      navigate("/auth");
      return;
    }
    fetchCart();
    
    // Check for Stripe payment success
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");
    const canceled = searchParams.get("canceled");

    if (success === "true" && sessionId) {
      if (sessionId.startsWith("cs_")) {
        handleStripeSuccess(sessionId);
      } else {
        toast.error("Invalid payment session ID. Please try again.");
        window.history.replaceState({}, "", "/checkout");
      }
    } else if (canceled === "true") {
      toast.info("Payment was canceled. You can try again anytime.");
      window.history.replaceState({}, "", "/checkout");
    }
  }, [token, navigate, searchParams]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/v1/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.data);
      groupItemsByRestaurant(res.data.data?.items || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch cart");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const groupItemsByRestaurant = (items) => {
    const groups = {};
    
    items.forEach((item) => {
      const product = item.productId;
      if (!product) return;
      
      // Handle both populated and non-populated restaurantId
      let restaurantId, restaurantName, hasOwnDelivery;
      if (product.restaurantId) {
        if (typeof product.restaurantId === 'object') {
          restaurantId = product.restaurantId._id || product.restaurantId;
          restaurantName = product.restaurantId.name || "Unknown Restaurant";
          hasOwnDelivery = product.restaurantId.hasOwnDelivery || false;
        } else {
          restaurantId = product.restaurantId;
          restaurantName = "Unknown Restaurant";
          hasOwnDelivery = false;
        }
      } else {
        return; // Skip if no restaurantId
      }
      
      if (!groups[restaurantId]) {
        // Auto-determine delivery method based on restaurant's hasOwnDelivery
        const deliveryBy = hasOwnDelivery ? "restaurant" : "platform";
        const deliveryFee = deliveryBy === "platform" ? 200 : 0; // 200 Rs for platform delivery
        
        groups[restaurantId] = {
          restaurantId,
          restaurantName,
          hasOwnDelivery,
          deliveryBy, // Auto-determined delivery method
          deliveryFee, // Delivery fee (200 Rs for platform delivery)
          items: [],
          totalPrice: 0
        };
      }
      
      const itemPrice = product.price * item.quantity;
      groups[restaurantId].items.push({
        ...item,
        productName: product.name,
        productImage: product.images?.[0],
        itemPrice
      });
      groups[restaurantId].totalPrice += itemPrice;
    });
    
    setRestaurantGroups(Object.values(groups));
  };

  const handleStripeSuccess = async (sessionId) => {
    setProcessing(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/orders/verify-payment",
        { sessionId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        const { orders, errors, warning } = res.data.data;
        
        if (errors && errors.length > 0) {
          // Some orders failed
          toast.warning(
            `Payment successful! ${orders.length} order(s) placed. ` +
            `${errors.length} restaurant(s) could not receive orders. Please contact support.`
          );
          // Show details of failed restaurants
          errors.forEach(err => {
            toast.error(`${err.restaurant}: ${err.error}`);
          });
        } else {
          toast.success(`Payment successful! ${orders.length} order(s) placed.`);
        }
        
        window.history.replaceState({}, "", "/checkout");
        navigate("/orders");
      } else {
        toast.error("Payment verification failed. Please contact support.");
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to verify payment";
      toast.error(`Payment verification failed: ${errorMessage}`);
      
      // If payment was successful but orders failed, show helpful message
      if (errorMessage.includes("Payment successful but failed to create")) {
        toast.error("Your payment was processed but orders could not be created. Please contact support for a refund.");
      }
      
      window.history.replaceState({}, "", "/checkout");
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckout = async () => {
    if (restaurantGroups.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setProcessing(true);

    try {
      // Only online payment - create Stripe checkout session
      // Prepare restaurant groups data for backend with delivery method per group
      const groupsData = restaurantGroups.map(group => ({
        restaurantId: group.restaurantId,
        deliveryBy: group.deliveryBy, // Delivery method per restaurant group
        items: group.items.map(item => {
          // Extract productId from item
          // item.productId is the full product object from cart
          let productId = null;
          
          if (item.productId) {
            if (typeof item.productId === 'object') {
              // If it's an object, get the _id
              productId = item.productId._id || item.productId;
            } else {
              // If it's already a string/ID
              productId = item.productId;
            }
          }
          
          // Convert to string to ensure consistency
          const productIdStr = productId ? (typeof productId === 'object' ? productId.toString() : productId) : null;
          
          if (!productIdStr) {
            console.error("Could not extract productId from item:", item);
            return null;
          }
          
          return {
            productId: productIdStr,
            quantity: item.quantity || 1
          };
        }).filter(item => item !== null) // Remove any null items
      })).filter(group => group.items.length > 0); // Remove groups with no items

      const res = await axios.post(
        "http://localhost:4000/api/v1/orders/create-checkout-session",
        {
          restaurantGroups: groupsData
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Redirect to Stripe Checkout
      if (res.data.data?.url) {
        window.location.href = res.data.data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Checkout failed");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-container">
        <div className="checkout-loading">Loading...</div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-empty">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate("/explore")} className="btn btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Calculate grand total including delivery fees
  const grandTotal = restaurantGroups.reduce((sum, group) => {
    return sum + group.totalPrice + (group.deliveryFee || 0);
  }, 0);
  
  // Calculate total delivery fees
  const totalDeliveryFees = restaurantGroups.reduce((sum, group) => {
    return sum + (group.deliveryFee || 0);
  }, 0);
  
  // Calculate subtotal (food only)
  const subtotal = restaurantGroups.reduce((sum, group) => sum + group.totalPrice, 0);

  return (
    <div className="checkout-container">
      <div className="checkout-inner">
        <h1>Checkout</h1>

        {/* Restaurant Groups */}
        <div className="checkout-restaurants">
          {restaurantGroups.map((group, index) => (
            <div key={group.restaurantId} className="restaurant-group">
              <h3 className="restaurant-name">{group.restaurantName}</h3>
              <div className="restaurant-items">
                {group.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="checkout-item">
                    {item.productImage && (
                      <img src={item.productImage} alt={item.productName} className="item-image" />
                    )}
                    <div className="item-details">
                      <h4>{item.productName}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p className="item-price">Rs {item.itemPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="restaurant-total">
                <div className="subtotal-row">
                  <span>Subtotal:</span>
                  <span>Rs {group.totalPrice.toFixed(2)}</span>
                </div>
                {group.deliveryFee > 0 && (
                  <div className="delivery-fee-row">
                    <span>Delivery Fee:</span>
                    <span>Rs {group.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="restaurant-total-row">
                  <strong>Total:</strong>
                  <strong>Rs {(group.totalPrice + group.deliveryFee).toFixed(2)}</strong>
                </div>
              </div>
              <div className="restaurant-delivery-info">
                <strong>Delivery: {group.deliveryBy === "restaurant" ? "Restaurant Delivery" : "Platform Delivery"}</strong>
                {group.deliveryFee > 0 && (
                  <span className="delivery-fee-note">(Platform delivery fee: Rs {group.deliveryFee})</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Payment and Delivery Info */}
        <div className="checkout-options">
          <div className="option-group">
            <h3>Payment Method</h3>
            <div className="payment-info">
              <span>Online Payment (Stripe)</span>
            </div>
          </div>

          <div className="option-group">
            <h3>Delivery Method</h3>
            <div className="delivery-info">
              <p>Delivery method is automatically determined based on each restaurant's settings:</p>
              <ul>
                {restaurantGroups.map((group) => (
                  <li key={group.restaurantId}>
                    <strong>{group.restaurantName}:</strong> {group.deliveryBy === "restaurant" ? "Restaurant Delivery" : "Platform Delivery"}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <div className="summary-row">
            <span>Number of Restaurants:</span>
            <span>{restaurantGroups.length}</span>
          </div>
          <div className="summary-row">
            <span>Subtotal (Food):</span>
            <span>Rs {subtotal.toFixed(2)}</span>
          </div>
          {totalDeliveryFees > 0 && (
            <div className="summary-row">
              <span>Total Delivery Fees:</span>
              <span>Rs {totalDeliveryFees.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row total-row">
            <span>Grand Total:</span>
            <span>Rs {grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="checkout-actions">
          <button
            onClick={() => navigate("/explore")}
            className="btn btn-secondary"
            disabled={processing}
          >
            Continue Shopping
          </button>
          <button
            onClick={handleCheckout}
            className="btn btn-primary"
            disabled={processing || restaurantGroups.length === 0}
          >
            {processing 
              ? "Processing..." 
              : `Pay with Stripe (Rs ${grandTotal.toFixed(2)})`
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

