import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../../assets/style/Verification.css";

axios.defaults.withCredentials = true;

const AdminVerification = () => {
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState({ open: false, restaurantId: null });
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:4000/api/v1/verification/pending",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingVerifications(res.data.data);
    } catch (err) {
      console.error("Error fetching pending verifications:", err);
      toast.error("Failed to load pending verifications");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (restaurantId) => {
    if (!window.confirm("Are you sure you want to approve this restaurant?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:4000/api/v1/verification/approve/${restaurantId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Restaurant approved successfully!");
      fetchPendingVerifications();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to approve restaurant");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:4000/api/v1/verification/reject/${rejectModal.restaurantId}`,
        { reason: rejectReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Restaurant rejected");
      setRejectModal({ open: false, restaurantId: null });
      setRejectReason("");
      fetchPendingVerifications();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reject restaurant");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: "Pending", class: "status-pending" },
      manual_review: { text: "Manual Review", class: "status-review" },
    };
    const badge = badges[status] || badges.pending;
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  if (loading) {
    return <div className="admin-verification-container">Loading...</div>;
  }

  return (
    <div className="admin-verification-container">
      <h2>Restaurant Verification Review</h2>

      {pendingVerifications.length === 0 ? (
        <p style={{ color: "#aaa" }}>No pending verifications</p>
      ) : (
        <div className="verification-list">
          {pendingVerifications.map((restaurant) => (
            <div key={restaurant._id} className="verification-card">
              <div className="verification-card-header">
                <div className="restaurant-info">
                  <h3>{restaurant.name}</h3>
                  <p><strong>City:</strong> {restaurant.city}</p>
                  <p><strong>Address:</strong> {restaurant.address || "N/A"}</p>
                  <p><strong>Phone:</strong> {restaurant.phone || "N/A"}</p>
                  {restaurant.ownerId && (
                    <>
                      <p><strong>Owner:</strong> {restaurant.ownerId.name} ({restaurant.ownerId.email})</p>
                    </>
                  )}
                  <p><strong>Submitted:</strong> {new Date(restaurant.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  {getStatusBadge(restaurant.verificationStatus)}
                </div>
              </div>

              {/* Verification Documents */}
              <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #333" }}>
                <h4 style={{ color: "#FF6B35", marginBottom: "15px" }}>Verification Documents</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <p style={{ color: "#aaa", marginBottom: "10px", fontWeight: "600" }}>Business License:</p>
                    {restaurant.businessLicenseUrl ? (
                      <a 
                        href={restaurant.businessLicenseUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          display: "inline-block", 
                          color: "#FF6B35", 
                          textDecoration: "underline",
                          marginBottom: "10px"
                        }}
                      >
                        View Business License
                      </a>
                    ) : (
                      <p style={{ color: "#888" }}>Not provided</p>
                    )}
                  </div>
                  <div>
                    <p style={{ color: "#aaa", marginBottom: "10px", fontWeight: "600" }}>Owner ID:</p>
                    {restaurant.ownerIdUrl ? (
                      <a 
                        href={restaurant.ownerIdUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          display: "inline-block", 
                          color: "#FF6B35", 
                          textDecoration: "underline",
                          marginBottom: "10px"
                        }}
                      >
                        View Owner ID
                      </a>
                    ) : (
                      <p style={{ color: "#888" }}>Not provided</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="verification-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(restaurant._id)}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => setRejectModal({ open: true, restaurantId: restaurant._id })}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {rejectModal.open && (
        <div className="reject-modal" onClick={() => setRejectModal({ open: false, restaurantId: null })}>
          <div className="reject-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Reject Verification</h3>
            <p style={{ color: "#aaa", marginBottom: "15px" }}>
              Please provide a reason for rejection:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
            />
            <div className="reject-modal-actions">
              <button className="cancel-btn" onClick={() => setRejectModal({ open: false, restaurantId: null })}>
                Cancel
              </button>
              <button className="reject-btn" onClick={handleReject}>
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerification;

