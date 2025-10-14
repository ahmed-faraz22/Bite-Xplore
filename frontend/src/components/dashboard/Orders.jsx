import React, { useState, useEffect } from "react";
import "../../assets/style/Orders.css";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [activeOrders, setActiveOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    // Simulate fetching from backend (replace with API later)
    const fetchOrders = async () => {
      const mockOrders = [
        {
          id: "1",
          restaurantName: "Burger King",
          status: "pending",
          totalPrice: 19.99,
          paymentStatus: "pending",
          paymentMethod: "cod",
          paymentId: null,
          restaurantConfirmation: false,
          deliveryBy: "platform",
          createdAt: "2025-10-10T14:12:00Z",
          confirmedAt: null,
          items: [
            { productId: "1", name: "Burger", quantity: 1, price: 9.99 },
            { productId: "2", name: "Fries", quantity: 1, price: 4.99 },
          ],
        },
        {
          id: "2",
          restaurantName: "Pizza Hut",
          status: "delivered",
          totalPrice: 29.99,
          paymentStatus: "paid",
          paymentMethod: "online",
          paymentId: "TXN-98123",
          restaurantConfirmation: true,
          deliveryBy: "restaurant",
          createdAt: "2025-10-07T12:45:00Z",
          confirmedAt: "2025-10-07T12:50:00Z",
          items: [
            { productId: "3", name: "Pizza", quantity: 1, price: 19.99 },
            { productId: "4", name: "Coke", quantity: 2, price: 5.0 },
          ],
        },
        {
          id: "3",
          restaurantName: "Pasta Express",
          status: "confirmed",
          totalPrice: 15.99,
          paymentStatus: "pending",
          paymentMethod: "cod",
          paymentId: null,
          restaurantConfirmation: true,
          deliveryBy: "platform",
          createdAt: "2025-10-12T15:10:00Z",
          confirmedAt: "2025-10-12T15:30:00Z",
          items: [
            { productId: "5", name: "Pasta", quantity: 1, price: 12.99 },
            { productId: "6", name: "Salad", quantity: 1, price: 3.0 },
          ],
        },
      ];

      setActiveOrders(
        mockOrders.filter((o) =>
          ["pending", "confirmed", "preparing", "on_the_way"].includes(o.status)
        )
      );
      setTotalOrders(mockOrders);
    };

    fetchOrders();
  }, []);

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
            {activeOrders.length === 0 ? (
              <p>No active orders at the moment.</p>
            ) : (
              <ul>
                {activeOrders.map((order) => (
                  <li key={order.id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-lg">
                        {order.restaurantName}
                      </span>
                      <span className={`status ${order.status}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="text-gray-400 text-sm mb-1">
                      <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
                    </div>
                    <div className="text-gray-400 text-sm mb-1">
                      <strong>Payment:</strong>{" "}
                      {order.paymentMethod.toUpperCase()} (
                      {order.paymentStatus})
                    </div>
                    <div className="text-gray-400 text-sm mb-1">
                      <strong>Delivery By:</strong>{" "}
                      {order.deliveryBy === "platform"
                        ? "Our Platform"
                        : "Restaurant"}
                    </div>
                    <div className="text-gray-400 text-sm mb-3">
                      <strong>Restaurant Confirmation:</strong>{" "}
                      {order.restaurantConfirmation ? (
                        <span className="text-green-400">Confirmed</span>
                      ) : (
                        <span className="text-yellow-400">Pending</span>
                      )}
                    </div>

                    {/* === Items === */}
                    <div>
                      <strong className="text-purple-400">Items:</strong>
                      <ul>
                        {order.items.map((item) => (
                          <li key={item.productId}>
                            {item.name} × {item.quantity} — $
                            {item.price * item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* === Payment Details Toggle === */}
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="toggle-btn mt-3"
                    >
                      {expandedOrder === order.id
                        ? "Hide Payment Details"
                        : "View Payment Details"}
                    </button>

                    {expandedOrder === order.id && (
                      <div className="payment-details">
                        <strong className="block text-purple-400 mb-2">
                          Payment Details
                        </strong>
                        <p>
                          <strong>Method:</strong>{" "}
                          {order.paymentMethod.toUpperCase()}
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
                            {order.paymentStatus.toUpperCase()}
                          </span>
                        </p>
                        <p>
                          <strong>Transaction ID:</strong>{" "}
                          {order.paymentId || "N/A"}
                        </p>
                        <p>
                          <strong>Amount:</strong> $
                          {order.totalPrice.toFixed(2)}
                        </p>
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
            {totalOrders.length === 0 ? (
              <p>No past orders available.</p>
            ) : (
              <ul>
                {totalOrders.map((order) => (
                  <li key={order.id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-lg">
                        {order.restaurantName}
                      </span>
                      <span className={`status ${order.status}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="text-gray-400 text-sm mb-1">
                      <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
                    </div>
                    <div className="text-gray-400 text-sm mb-1">
                      <strong>Payment:</strong>{" "}
                      {order.paymentMethod.toUpperCase()} (
                      {order.paymentStatus})
                    </div>
                    <div className="text-gray-400 text-sm mb-1">
                      <strong>Delivery By:</strong>{" "}
                      {order.deliveryBy === "platform"
                        ? "Our Platform"
                        : "Restaurant"}
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
