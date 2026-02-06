import React from "react";

const AdminDashboard = () => {
  const stats = [
    { label: "Pending Verifications", value: "0", link: "/admin/verification" },
    { label: "Total Restaurants", value: "0", link: "#" },
    { label: "Total Categories", value: "0", link: "#" },
    { label: "Total Orders", value: "0", link: "#" },
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
        {stats.map((stat, index) => (
          <div key={index} style={{
            background: "#ffffff",
            border: "1px solid #f0e6e0",
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "32px", margin: "0 0 10px 0", color: "#FF6B35" }}>{stat.value}</h3>
            <p style={{ margin: "0 0 15px 0", color: "#555", fontSize: "14px" }}>{stat.label}</p>
            {stat.link && stat.link !== "#" && (
              <a
                href={stat.link}
                style={{
                  color: "#FF6B35",
                  textDecoration: "underline",
                  marginTop: "10px",
                  display: "inline-block",
                  fontSize: "14px"
                }}
              >
                View Details →
              </a>
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
          <a
            href="/admin/verification"
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
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

