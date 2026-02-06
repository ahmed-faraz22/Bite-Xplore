import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../assets/style/BuyerOrders.css";

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Please login to view orders");
      navigate("/auth");
      return;
    }
    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/v1/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ordersData = res.data.data || [];
      
      // Remove duplicates based on order _id
      const uniqueOrders = ordersData.reduce((acc, order) => {
        const orderId = order._id || order.id;
        if (!acc.find(o => (o._id || o.id) === orderId)) {
          acc.push(order);
        }
        return acc;
      }, []);
      
      setOrders(uniqueOrders);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f39c12",
      confirmed: "#3498db",
      preparing: "#9b59b6",
      on_the_way: "#1abc9c",
      delivered: "#27ae60",
      cancelled: "#e74c3c"
    };
    return colors[status] || "#95a5a6";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const activeOrders = orders.filter(order =>
    ["pending", "confirmed", "preparing", "on_the_way"].includes(order.status)
  );

  const completedOrders = orders.filter(order =>
    ["delivered", "cancelled"].includes(order.status)
  );

  if (loading) {
    return (
      <div className="buyer-orders-container">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  const displayOrders = activeTab === "active" ? activeOrders : completedOrders;

  return (
    <div className="buyer-orders-container">
      <div className="buyer-orders-inner">
        <h1>My Orders</h1>

        {/* Tabs */}
        <div className="orders-tabs">
          <button
            className={`tab ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active Orders ({activeOrders.length})
          </button>
          <button
            className={`tab ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Orders ({completedOrders.length})
          </button>
        </div>

        {/* Orders List */}
        {displayOrders.length === 0 ? (
          <div className="no-orders">
            <p>No {activeTab === "active" ? "active" : "completed"} orders found.</p>
            {activeTab === "active" && (
              <button onClick={() => navigate("/explore")} className="btn btn-primary">
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          <div className="orders-list">
            {displayOrders.map((order) => {
              // Ensure unique key
              const orderId = order._id || order.id || Math.random();
              return (
              <div key={orderId} className="order-card">
                <div className="order-header">
                  <div className="restaurant-info">
                    {order.restaurantId?.logo && (
                      <img
                        src={order.restaurantId.logo}
                        alt={order.restaurantId.name}
                        className="restaurant-logo"
                      />
                    )}
                    <div>
                      <h3>{order.restaurantId?.name || "Unknown Restaurant"}</h3>
                      <p className="order-date">Ordered on {formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="order-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status === "confirmed" ? "DONE" : order.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items:</h4>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index} className="order-item">
                        <div className="item-info">
                          {item.productId?.images?.[0] && (
                            <img
                              src={item.productId.images[0]}
                              alt={item.productId.name}
                              className="item-image"
                            />
                          )}
                          <div>
                            <p className="item-name">{item.productId?.name || "Unknown Product"}</p>
                            <p className="item-quantity">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="item-price">
                          Rs {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="order-summary">
                  {order.deliveryFee > 0 ? (
                    <>
                      <div className="summary-row">
                        <span>Subtotal (Food):</span>
                        <span>Rs {order.restaurantAmount?.toFixed(2) || (order.totalPrice - order.deliveryFee).toFixed(2)}</span>
                      </div>
                      <div className="summary-row">
                        <span>Delivery Fee:</span>
                        <span>Rs {order.deliveryFee.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>Rs {order.totalPrice.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row total-row">
                    <span>Total:</span>
                    <span>Rs {order.totalPrice.toFixed(2)}</span>
                  </div>
                  {order.restaurantAmount && order.deliveryFee > 0 && (
                    <div className="summary-row">
                      <span>Amount to Restaurant:</span>
                      <span>Rs {order.restaurantAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row payment-info">
                    <span>Payment Method:</span>
                    <span className="payment-method">
                      💳 Online Payment
                    </span>
                  </div>
                  <div className="summary-row payment-info">
                    <span>Payment Status:</span>
                    <span className={`payment-status ${order.paymentStatus}`}>
                      {order.paymentStatus === "paid" ? "✅ Paid" : "⏳ Pending"}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery By:</span>
                    <span>
                      {order.deliveryBy === "platform" ? "🚚 Platform" : "🏪 Restaurant"}
                    </span>
                  </div>
                  {order.restaurantConfirmation && (
                    <div className="summary-row">
                      <span>Restaurant Confirmed:</span>
                      <span className="confirmed">✓ {formatDate(order.confirmedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerOrders;

