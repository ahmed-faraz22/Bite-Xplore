import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:4000/api/v1";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    pendingVerifications: 0,
    totalRestaurants: 0,
    totalCategories: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data?.data || {};
        setStats({
          pendingVerifications: data.pendingVerifications ?? 0,
          totalRestaurants: data.totalRestaurants ?? 0,
          totalCategories: data.totalCategories ?? 0,
          totalOrders: data.totalOrders ?? 0,
        });
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load dashboard stats");
        setStats({
          pendingVerifications: 0,
          totalRestaurants: 0,
          totalCategories: 0,
          totalOrders: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const statCards = [
    { label: "Pending Verifications", value: stats.pendingVerifications, link: "/admin/verification" },
    { label: "Total Restaurants", value: stats.totalRestaurants, link: "#" },
    { label: "Total Categories", value: stats.totalCategories, link: "#" },
    { label: "Total Orders", value: stats.totalOrders, link: "#" },
  ];

  return (
    <div style={{
      padding: "20px",
      color: "#1a1a1a",
      maxWidth: "1200px",
      margin: "0 auto"
    }}>
      <h2 style={{ color: "#FF6B35", marginBottom: "30px", fontSize: "28px" }}>Admin Dashboard</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "40px"
      }}>
        {statCards.map((stat, index) => (
          <div key={index} style={{
            background: "#ffffff",
            border: "1px solid #f0e6e0",
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "32px", margin: "0 0 10px 0", color: "#FF6B35" }}>
              {loading ? "—" : stat.value}
            </h3>
            <p style={{ margin: "0 0 15px 0", color: "#555", fontSize: "14px" }}>{stat.label}</p>
            {stat.link && stat.link !== "#" && (
              <Link
                to={stat.link}
                style={{
                  color: "#FF6B35",
                  textDecoration: "underline",
                  marginTop: "10px",
                  display: "inline-block",
                  fontSize: "14px"
                }}
              >
                View Details →
              </Link>
            )}
          </div>
        ))}
      </div>

      <div style={{
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: "8px",
        padding: "30px"
      }}>
        <h3 style={{ color: "#FF6B35", marginBottom: "20px", fontSize: "20px" }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <Link
            to="/admin/verification"
            style={{
              padding: "12px 24px",
              background: "#FF6B35",
              color: "#fff",
              borderRadius: "6px",
              textDecoration: "none",
              display: "inline-block",
              fontWeight: "600",
              transition: "background 0.3s"
            }}
            onMouseEnter={(e) => e.target.style.background = "#E55A2B"}
            onMouseLeave={(e) => e.target.style.background = "#FF6B35"}
          >
            Review Pending Verifications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

