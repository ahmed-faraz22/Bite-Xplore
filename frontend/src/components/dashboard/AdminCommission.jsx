import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../../assets/style/Commission.css";

axios.defaults.withCredentials = true;

const AdminCommission = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    fetchAllCommissionStatus();
  }, []);

  const fetchAllCommissionStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:4000/api/v1/commission/all",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRestaurants(res.data.data || []);
    } catch (err) {
      console.error("Error fetching commission status:", err);
      toast.error("Failed to load commission status");
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculateSlider = async () => {
    if (!window.confirm("Are you sure you want to recalculate the slider? This will update all restaurant ratings and slider status.")) {
      return;
    }

    setRecalculating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:4000/api/v1/commission/recalculate-slider",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Slider recalculated! Top 10: ${res.data.data.top10Count}, Top-rated: ${res.data.data.topRatedCount}`);
      await fetchAllCommissionStatus();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to recalculate slider");
    } finally {
      setRecalculating(false);
    }
  };

  if (loading) {
    return <div className="commission-container">Loading...</div>;
  }

  const sliderRestaurants = restaurants.filter(r => r.sliderStatus === "in_slider");
  const topRatedRestaurants = restaurants.filter(r => r.isTopRated && r.sliderStatus !== "in_slider" && r.orderCount > 30);
  const otherRestaurants = restaurants.filter(r => !r.isTopRated || r.sliderStatus === "in_slider" || r.orderCount <= 30);

  return (
    <div className="commission-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2>Commission Management</h2>
        <button
          onClick={handleRecalculateSlider}
          disabled={recalculating}
          style={{
            padding: "12px 24px",
            background: "#FF6B35",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          {recalculating ? "Recalculating..." : "Recalculate Slider"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="commission-info" style={{ marginBottom: "40px" }}>
        <div className="info-card">
          <h3>Total Restaurants</h3>
          <p style={{ fontSize: "32px", color: "#FF6B35", fontWeight: "700", margin: "10px 0" }}>
            {restaurants.length}
          </p>
        </div>
        <div className="info-card">
          <h3>In Slider</h3>
          <p style={{ fontSize: "32px", color: "#10b981", fontWeight: "700", margin: "10px 0" }}>
            {sliderRestaurants.length}
          </p>
          <p style={{ color: "#aaa", fontSize: "14px" }}>PKR 5,000/month each</p>
        </div>
        <div className="info-card">
          <h3>Top-Rated (Not in Slider)</h3>
          <p style={{ fontSize: "32px", color: "#f59e0b", fontWeight: "700", margin: "10px 0" }}>
            {topRatedRestaurants.length}
          </p>
          <p style={{ color: "#aaa", fontSize: "14px" }}>PKR 1,500/month each</p>
        </div>
      </div>

      {/* Slider Restaurants */}
      {sliderRestaurants.length > 0 && (
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ color: "#FF6B35", marginBottom: "20px", fontSize: "24px" }}>
            Top 10 Slider Restaurants (PKR 5,000/month)
          </h3>
          <div className="restaurant-grid">
            {sliderRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} commissionAmount={5000} />
            ))}
          </div>
        </div>
      )}

      {/* Top-Rated Restaurants (Not in Slider) */}
      {topRatedRestaurants.length > 0 && (
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ color: "#FF6B35", marginBottom: "20px", fontSize: "24px" }}>
            Top-Rated Restaurants (PKR 1,500/month)
          </h3>
          <div className="restaurant-grid">
            {topRatedRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} commissionAmount={1500} />
            ))}
          </div>
        </div>
      )}

      {/* All Restaurants Table */}
      <div>
        <h3 style={{ color: "#FF6B35", marginBottom: "20px", fontSize: "24px" }}>All Restaurants</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#1a1a1a", borderRadius: "8px", overflow: "hidden" }}>
            <thead>
              <tr style={{ background: "#2a2a2a" }}>
                <th style={{ padding: "15px", textAlign: "left", color: "#fff", borderBottom: "2px solid #333" }}>Restaurant</th>
                <th style={{ padding: "15px", textAlign: "left", color: "#fff", borderBottom: "2px solid #333" }}>Rating</th>
                <th style={{ padding: "15px", textAlign: "left", color: "#fff", borderBottom: "2px solid #333" }}>Orders</th>
                <th style={{ padding: "15px", textAlign: "left", color: "#fff", borderBottom: "2px solid #333" }}>Status</th>
                <th style={{ padding: "15px", textAlign: "left", color: "#fff", borderBottom: "2px solid #333" }}>Commission</th>
                <th style={{ padding: "15px", textAlign: "left", color: "#fff", borderBottom: "2px solid #333" }}>Payment</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr key={restaurant._id} style={{ borderBottom: "1px solid #333" }}>
                  <td style={{ padding: "15px", color: "#fff" }}>{restaurant.name}</td>
                  <td style={{ padding: "15px", color: "#ffd700" }}>
                    ⭐ {restaurant.averageRating?.toFixed(1) || "0.0"} ({restaurant.totalRatings || 0})
                  </td>
                  <td style={{ padding: "15px", color: "#aaa" }}>{restaurant.orderCount || 0}</td>
                  <td style={{ padding: "15px" }}>
                    <span className={`status-badge ${
                      restaurant.sliderStatus === "in_slider" ? "in-slider" : "not-in-slider"
                    }`}>
                      {restaurant.sliderStatus === "in_slider" ? "In Slider" : "Not in Slider"}
                    </span>
                  </td>
                  <td style={{ padding: "15px", color: "#FF6B35", fontWeight: "600" }}>
                    PKR {restaurant.commissionAmount?.toLocaleString() || "0"}
                  </td>
                  <td style={{ padding: "15px" }}>
                    {restaurant.sliderPaymentStatus === "paid" && restaurant.sliderPaymentExpiry && new Date() < new Date(restaurant.sliderPaymentExpiry) ? (
                      <span style={{ color: "#10b981" }}>✅ Paid</span>
                    ) : restaurant.commissionAmount > 0 ? (
                      <span style={{ color: "#f59e0b" }}>⚠️ Unpaid</span>
                    ) : (
                      <span style={{ color: "#aaa" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const RestaurantCard = ({ restaurant, commissionAmount }) => {
  const isPaid = restaurant.sliderPaymentStatus === "paid" && 
    restaurant.sliderPaymentExpiry && 
    new Date() < new Date(restaurant.sliderPaymentExpiry);

  return (
    <div style={{
      background: "#1a1a1a",
      border: `2px solid ${isPaid ? "#10b981" : "#f59e0b"}`,
      borderRadius: "12px",
      padding: "20px",
      minWidth: "300px"
    }}>
      <h4 style={{ color: "#fff", marginBottom: "15px", fontSize: "20px" }}>{restaurant.name}</h4>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <span style={{ color: "#aaa" }}>Rating:</span>
        <span style={{ color: "#ffd700", fontWeight: "600" }}>
          ⭐ {restaurant.averageRating?.toFixed(1) || "0.0"}
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <span style={{ color: "#aaa" }}>Orders:</span>
        <span style={{ color: "#fff" }}>{restaurant.orderCount || 0}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <span style={{ color: "#aaa" }}>Commission:</span>
        <span style={{ color: "#FF6B35", fontWeight: "700" }}>PKR {commissionAmount.toLocaleString()}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
        <span style={{ color: "#aaa" }}>Status:</span>
        <span style={{ color: isPaid ? "#10b981" : "#f59e0b", fontWeight: "600" }}>
          {isPaid ? "✅ Paid" : "⚠️ Unpaid"}
        </span>
      </div>
      {isPaid && restaurant.sliderPaymentExpiry && (
        <p style={{ color: "#aaa", fontSize: "12px", marginTop: "10px" }}>
          Expires: {new Date(restaurant.sliderPaymentExpiry).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default AdminCommission;

