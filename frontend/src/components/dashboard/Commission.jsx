import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import "../../assets/style/Commission.css";

axios.defaults.withCredentials = true;

const Commission = () => {
  const [searchParams] = useSearchParams();
  const [commissionStatus, setCommissionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchCommissionStatus();

    // Handle Stripe redirect
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");
    const canceled = searchParams.get("canceled");

    if (success === "true" && sessionId) {
      handleStripeSuccess(sessionId);
    } else if (canceled === "true") {
      toast.info("Payment was canceled");
    }
  }, [searchParams]);

  const fetchCommissionStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:4000/api/v1/commission/status",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommissionStatus(res.data.data);
    } catch (err) {
      console.error("Error fetching commission status:", err);
      toast.error("Failed to load commission status");
    } finally {
      setLoading(false);
    }
  };

  const handleStripeSuccess = async (sessionId) => {
    try {
      setProcessing(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:4000/api/v1/commission/verify-payment",
        { sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Commission payment successful! Your payment has been verified.");
      await fetchCommissionStatus();
      
      // Clean up URL
      window.history.replaceState({}, "", "/dashboard/commission");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to verify payment");
    } finally {
      setProcessing(false);
    }
  };

  const handlePayCommission = async () => {
    if (!commissionStatus || commissionStatus.commissionAmount === 0) {
      toast.error("No commission fee required");
      return;
    }

    if (commissionStatus.sliderPaymentStatus === "paid" && commissionStatus.sliderPaymentExpiry) {
      const expiryDate = new Date(commissionStatus.sliderPaymentExpiry);
      if (new Date() < expiryDate) {
        toast.info(`Payment already made. Valid until ${expiryDate.toLocaleDateString()}`);
        return;
      }
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:4000/api/v1/commission/create-checkout-session",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.data?.url) {
        window.location.href = res.data.data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create payment session");
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="commission-container">Loading...</div>;
  }

  if (!commissionStatus) {
    return (
      <div className="commission-container">
        <p>No commission information available. Please create a restaurant profile first.</p>
      </div>
    );
  }

  const isPaymentDue = commissionStatus.commissionAmount > 0 && 
    commissionStatus.sliderPaymentStatus !== "paid";

  const isPaymentExpired = commissionStatus.sliderPaymentStatus === "paid" && 
    commissionStatus.sliderPaymentExpiry && 
    new Date() > new Date(commissionStatus.sliderPaymentExpiry);

  return (
    <div className="commission-container">
      <h2>Commission & Slider Status</h2>

      <div className="commission-info">
        <div className="info-card">
          <h3>Restaurant Rating</h3>
          <div className="rating-display">
            <span className="rating-value">{commissionStatus.averageRating?.toFixed(1) || "0.0"}</span>
            <span className="rating-label">/ 5.0</span>
          </div>
          <p className="rating-count">{commissionStatus.totalRatings || 0} reviews</p>
          {commissionStatus.isTopRated && (
            <span className="top-rated-badge">⭐ Top Rated</span>
          )}
        </div>

        <div className="info-card">
          <h3>Slider Status</h3>
          <span className={`status-badge ${
            commissionStatus.sliderStatus === "in_slider" ? "in-slider" : "not-in-slider"
          }`}>
            {commissionStatus.sliderStatus === "in_slider" ? "In Slider" : "Not in Slider"}
          </span>
          {commissionStatus.sliderStatus === "in_slider" && (
            <p className="info-text">Your restaurant is displayed on the landing page!</p>
          )}
        </div>

        <div className="info-card">
          <h3>Commission Type</h3>
          <p className="commission-type">
            {commissionStatus.commissionType === "slider" 
              ? "Slider Placement (Top 10)" 
              : commissionStatus.commissionType === "top_rated"
              ? "Top-Rated Restaurant"
              : "No Commission"}
          </p>
          {commissionStatus.commissionAmount > 0 && (
            <p className="commission-amount">
              PKR {commissionStatus.commissionAmount.toLocaleString()} / month
            </p>
          )}
        </div>
      </div>

      {commissionStatus.commissionAmount > 0 && (
        <div className={`payment-section ${isPaymentDue || isPaymentExpired ? "payment-due" : "payment-paid"}`}>
          <h3>Payment Status</h3>
          
          {commissionStatus.sliderPaymentStatus === "paid" && commissionStatus.sliderPaymentExpiry && new Date() < new Date(commissionStatus.sliderPaymentExpiry) ? (
            <div className="payment-paid-content">
              <p className="success-text">✅ Payment received and active</p>
              <p className="expiry-text">
                Valid until: {new Date(commissionStatus.sliderPaymentExpiry).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="payment-due-content">
              <p className="warning-text">
                {isPaymentExpired ? "⚠️ Payment expired – please pay again" : "⚠️ Payment required"}
              </p>
              <p className="validity-note">After payment, your bill is valid for <strong>30 days</strong>. Then this notification will show again.</p>
              {(commissionStatus.commissionType === "slider" || commissionStatus.commissionType === "top_rated") && (
                <div className="monthly-limit-warning">
                  <p><strong>Monthly order limit (until paid):</strong> {commissionStatus.monthlyOrderCount || 0} / 10</p>
                  <p className="limit-note">
                    {(commissionStatus.monthlyOrderCount || 0) >= 10
                      ? "❌ Limit reached. Pay commission to continue receiving orders."
                      : `⚠️ You can receive up to 10 orders per month until the bill is paid. Currently: ${commissionStatus.monthlyOrderCount || 0}/10`}
                  </p>
                </div>
              )}
              <button 
                onClick={handlePayCommission} 
                className="pay-btn"
                disabled={processing}
              >
                {processing ? "Processing..." : `Pay PKR ${commissionStatus.commissionAmount.toLocaleString()}`}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="info-section">
        <h3>How It Works</h3>
        <ul>
          <li>Top-rated restaurants (4.0+ rating with 5+ reviews) can appear in the slider</li>
          <li>Top 10 restaurants (by rating, then orders) are shown in the landing page slider</li>
          <li>Slider restaurants: PKR 5,000/month (valid 30 days after payment)</li>
          <li>Top-rated restaurants (30+ orders, not in slider): PKR 1,500/month (valid 30 days after payment)</li>
          <li>If the bill is not paid, monthly order limit is 10. After payment, valid for 30 days; then the notification will show again.</li>
          <li>Restaurants not in slider and not top-rated are free until they reach the general subscription limit.</li>
        </ul>
      </div>
    </div>
  );
};

export default Commission;

