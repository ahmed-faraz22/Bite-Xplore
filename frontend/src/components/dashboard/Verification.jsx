import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../../assets/style/Verification.css";

axios.defaults.withCredentials = true;

const Verification = () => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [businessLicense, setBusinessLicense] = useState(null);
  const [ownerId, setOwnerId] = useState(null);
  const [businessLicensePreview, setBusinessLicensePreview] = useState(null);
  const [ownerIdPreview, setOwnerIdPreview] = useState(null);

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:4000/api/v1/verification/status",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVerificationStatus(res.data.data);
    } catch (err) {
      console.error("Error fetching verification status:", err);
      // If restaurant not found, set status to null
      if (err?.response?.status === 404) {
        setVerificationStatus(null);
      } else {
        toast.error("Failed to load verification status");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "businessLicense") {
        setBusinessLicense(file);
        setBusinessLicensePreview(URL.createObjectURL(file));
      } else {
        setOwnerId(file);
        setOwnerIdPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!businessLicense || !ownerId) {
      toast.error("Please upload both business license and owner ID");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("businessLicense", businessLicense);
      formData.append("ownerId", ownerId);

      const res = await axios.post(
        "http://localhost:4000/api/v1/verification/submit-documents",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Documents submitted successfully! Verification is pending.");
      setVerificationStatus(res.data.data);
      setBusinessLicense(null);
      setOwnerId(null);
      setBusinessLicensePreview(null);
      setOwnerIdPreview(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit documents");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="verification-container">Loading...</div>;
  }

  // Show message if restaurant profile doesn't exist
  if (!verificationStatus || verificationStatus.verificationStatus === null) {
    return (
      <div className="verification-container">
        <h2>Restaurant Verification</h2>
        <div className="status-message info" style={{ marginTop: "20px" }}>
          <p><strong>⚠️ Restaurant Profile Required</strong></p>
          <p>You need to create your restaurant profile before you can submit verification documents.</p>
          <p style={{ marginTop: "15px" }}>
            <a href="/dashboard" style={{ color: "#FF6B35", textDecoration: "underline" }}>
              Go to Dashboard to create your restaurant profile
            </a>
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: "Pending", class: "status-pending" },
      verified: { text: "Verified", class: "status-verified" },
      manual_review: { text: "Under Review", class: "status-review" },
      rejected: { text: "Rejected", class: "status-rejected" },
    };
    const badge = badges[status] || badges.pending;
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  return (
    <div className="verification-container">
      <h2>Restaurant Verification</h2>

      {verificationStatus && (
        <div className="verification-status">
          <div className="status-header">
            <h3>Current Status</h3>
            {getStatusBadge(verificationStatus.verificationStatus)}
          </div>

          {verificationStatus.verificationStatus === "verified" && (
            <div className="status-message success">
              ✅ Your restaurant is verified! You can now receive orders and publish your menu.
              {verificationStatus.verifiedAt && (
                <p>Verified on: {new Date(verificationStatus.verifiedAt).toLocaleDateString()}</p>
              )}
            </div>
          )}

          {verificationStatus.verificationStatus === "rejected" && (
            <div className="status-message error">
              ❌ Your verification was rejected.
              {verificationStatus.verificationRejectionReason && (
                <p><strong>Reason:</strong> {verificationStatus.verificationRejectionReason}</p>
              )}
              <p>Please review your documents and resubmit.</p>
            </div>
          )}

          {verificationStatus.verificationStatus === "pending" && (
            <div className="status-message info">
              ⏳ Your verification is pending. Please wait for admin approval or complete the automated verification process.
            </div>
          )}

          {verificationStatus.verificationStatus === "manual_review" && (
            <div className="status-message info">
              🔍 Your restaurant is under manual review. Please wait for admin approval.
            </div>
          )}
        </div>
      )}

      {(verificationStatus?.verificationStatus !== "verified") && (
        <div className="verification-form-container">
          <h3>Submit Verification Documents</h3>
          <p className="form-description">
            Please upload your business license and owner ID to complete verification.
          </p>

          <form onSubmit={handleSubmit} className="verification-form">
            <div className="form-group">
              <label htmlFor="businessLicense">
                Business License <span className="required">*</span>
              </label>
              <input
                type="file"
                id="businessLicense"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e, "businessLicense")}
                required
                disabled={submitting}
              />
              {businessLicensePreview && (
                <div className="file-preview">
                  <img src={businessLicensePreview} alt="Business License Preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="ownerId">
                Owner ID (CNIC/Passport) <span className="required">*</span>
              </label>
              <input
                type="file"
                id="ownerId"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e, "ownerId")}
                required
                disabled={submitting}
              />
              {ownerIdPreview && (
                <div className="file-preview">
                  <img src={ownerIdPreview} alt="Owner ID Preview" />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={submitting || !businessLicense || !ownerId}
            >
              {submitting ? "Submitting..." : "Submit Documents"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Verification;

