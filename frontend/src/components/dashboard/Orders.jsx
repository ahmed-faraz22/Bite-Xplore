import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../../assets/style/Orders.css";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [activeOrders, setActiveOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/v1/orders/restaurant", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const orders = res.data.data || [];
      
      setActiveOrders(
        orders.filter((o) =>
          ["pending", "confirmed", "preparing", "on_the_way"].includes(o.status)
        )
      );
      setTotalOrders(orders);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch orders");
      // Fallback to empty arrays on error
      setActiveOrders([]);
      setTotalOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (status) => {
    const statusMap = {
      pending: "Pending",
      confirmed: "Done",
      preparing: "Preparing",
      on_the_way: "On the Way",
      delivered: "Delivered",
      cancelled: "Cancelled"
    };
    return statusMap[status] || status;
  };

  const approveOrder = async (orderId) => {
    try {
      const res = await axios.put(
        `http://localhost:4000/api/v1/orders/${orderId}/status`,
        { status: "confirmed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Order approved successfully!");
      
      // Refresh orders to show updated status
      await fetchOrders();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to approve order");
    }
  };

  const switchTab = (tab) => setActiveTab(tab);
  const toggleExpand = (id) =>
    setExpandedOrder(expandedOrder === id ? null : id);

  return (
    <section className="order-tab">
      <div className="inner">
        {/* === Tabs === */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "active" ? "active" : ""}`}
            onClick={() => switchTab("active")}
          >
            Active Orders
          </button>
          <button
            className={`tab ${activeTab === "done" ? "active" : ""}`}
            onClick={() => switchTab("done")}
          >
            All Orders
          </button>
        </div>

        {/* === Active Orders === */}
        {activeTab === "active" && (
          <div className="orders-section">
            <h3>Active Orders</h3>
            {loading ? (
              <p>Loading orders...</p>
            ) : activeOrders.length === 0 ? (
              <p>No active orders at the moment.</p>
            ) : (
              <ul>
                {activeOrders.map((order) => (
                  <li key={order._id || order.id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-lg">
                        {order.buyerId?.name || "Customer"}
                      </span>
                      <span className={`status ${order.status}`}>
                        {formatStatus(order.status)}
                      </span>
                    </div>

                    <div className="text-gray-400 text-sm mb-1">
                      <strong>Total:</strong> Rs {order.totalPrice?.toFixed(2) || "0.00"}
                    </div>
                    <div className="text-gray-400 text-sm mb-1">
                      <strong>Restaurant Amount:</strong> Rs {order.restaurantAmount?.toFixed(2) || "0.00"}
                    </div>
                    <div className="text-gray-400 text-sm mb-1">
                      <strong>Payment:</strong>{" "}
                      {order.paymentMethod?.toUpperCase() || "ONLINE"} (
                      {order.paymentStatus || "paid"})
                    </div>
                    <div className="text-gray-400 text-sm mb-1">
                      <strong>Delivery By:</strong>{" "}
                      {order.deliveryBy === "platform"
                        ? "Platform"
                        : "Restaurant"}
                    </div>
                    <div className="text-gray-400 text-sm mb-3">
                      <strong>Restaurant Confirmation:</strong>{" "}
                      {order.restaurantConfirmation || order.status === "confirmed" ? (
                        <span className="text-green-400">✓ Done</span>
                      ) : (
                        <span className="text-yellow-400">Pending</span>
                      )}
                    </div>

                    {/* === Items === */}
                    <div>
                      <strong className="text-purple-400">Items:</strong>
                      <ul>
                        {order.items?.map((item, index) => (
                          <li key={item.productId?._id || item.productId || index}>
                            {item.productId?.name || "Product"} × {item.quantity} — Rs
                            {(item.price * item.quantity).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* === Approve Button (only for pending orders) === */}
                    {(!order.restaurantConfirmation && order.status === "pending") && (
                      <button
                        onClick={() => approveOrder(order._id || order.id)}
                        className="approve-btn mt-3"
                      >
                        ✓ Approve Order
                      </button>
                    )}

                    {/* === Payment Details Toggle === */}
                    <button
                      onClick={() => toggleExpand(order._id || order.id)}
                      className="toggle-btn mt-3"
                    >
                      {expandedOrder === (order._id || order.id)
                        ? "Hide Payment Details"
                        : "View Payment Details"}
                    </button>

                    {expandedOrder === (order._id || order.id) && (
                      <div className="payment-details">
                        <strong className="block text-purple-400 mb-2">
                          Payment Details
                        </strong>
                        <p>
                          <strong>Method:</strong>{" "}
                          {order.paymentMethod?.toUpperCase() || "ONLINE"}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          <span
                            className={
                              order.paymentStatus === "paid"
                                ? "text-green-400"
                                : "text-yellow-400"
                            }
                          >
                            {order.paymentStatus?.toUpperCase() || "PAID"}
                          </span>
                        </p>
                        <p>
                          <strong>Transaction ID:</strong>{" "}
                          {order.paymentId || "N/A"}
                        </p>
                        <p>
                          <strong>Total Amount:</strong> Rs{" "}
                          {order.totalPrice?.toFixed(2) || "0.00"}
                        </p>
                        <p>
                          <strong>Restaurant Amount:</strong> Rs{" "}
                          {order.restaurantAmount?.toFixed(2) || "0.00"}
                        </p>
                        {order.deliveryFee > 0 && (
                          <p>
                            <strong>Delivery Fee:</strong> Rs{" "}
                            {order.deliveryFee.toFixed(2)}
                          </p>
                        )}
                        <p>
                          <strong>Placed At:</strong>{" "}
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                        {order.confirmedAt && (
                          <p>
                            <strong>Confirmed At:</strong>{" "}
                            {new Date(order.confirmedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* === All Orders === */}
        {activeTab === "done" && (
          <div className="orders-section">
            <h3>All Orders</h3>
            {loading ? (
              <p>Loading orders...</p>
            ) : totalOrders.length === 0 ? (
              <p>No orders available.</p>
            ) : (
              <ul>
                {totalOrders.map((order) => (
                  <li key={order._id || order.id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-lg">
                        {order.buyerId?.name || "Customer"}
                      </span>
                      <span className={`status ${order.status}`}>
                        {formatStatus(order.status)}
                      </span>
                    </div>

                    <div className="text-gray-400 text-sm mb-1">
                      <strong>Total:</strong> Rs {order.totalPrice?.toFixed(2) || "0.00"}
                    </div>
                    <div className="text-gray-400 text-sm mb-1">
                      <strong>Restaurant Amount:</strong> Rs {order.restaurantAmount?.toFixed(2) || "0.00"}
                    </div>
                    <div className="text-gray-400 text-sm mb-1">
                      <strong>Payment:</strong>{" "}
                      {order.paymentMethod?.toUpperCase() || "ONLINE"} (
                      {order.paymentStatus || "paid"})
                    </div>
                    <div className="text-gray-400 text-sm mb-1">
                      <strong>Delivery By:</strong>{" "}
                      {order.deliveryBy === "platform"
                        ? "Platform"
                        : "Restaurant"}
                    </div>
                    <div className="text-gray-400 text-sm mb-1">
                      <strong>Status:</strong>{" "}
                      {order.restaurantConfirmation || order.status === "confirmed" ? (
                        <span className="text-green-400">✓ Done</span>
                      ) : (
                        <span className="text-yellow-400">Pending Confirmation</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Orders;
