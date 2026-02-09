import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../../assets/style/CommissionAlert.css";

const API_BASE = "http://localhost:4000/api/v1";
const MONTHLY_LIMIT_UNPAID = 10;

const CommissionAlert = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/commission/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatus(res.data.data);
      } catch {
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handlePayNow = async () => {
    if (!status?.commissionAmount || paying) return;
    setPaying(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/commission/create-checkout-session`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.data?.url) {
        window.location.href = res.data.data.url;
        return;
      }
      throw new Error("No checkout URL received");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to start payment");
      setPaying(false);
    }
  };

  if (loading || !status) return null;

  const isInSlider = status.sliderStatus === "in_slider";
  const isTopRated = status.isTopRated === true;
  const hasCommissionBill = (status.commissionType === "slider" || status.commissionType === "top_rated") && status.commissionAmount > 0;
  const isPaid = status.sliderPaymentStatus === "paid" && status.sliderPaymentExpiry && new Date() < new Date(status.sliderPaymentExpiry);
  const paymentDue = hasCommissionBill && !isPaid;
  const monthlyCount = status.monthlyOrderCount ?? 0;

  // Alert: Pay bill (valid 30 days after payment) – Pay now goes to admin Stripe
  if (paymentDue) {
    return (
      <div className="commission-alert commission-alert--pay">
        <div className="commission-alert-inner">
          <span className="commission-alert-icon">⚠️</span>
          <div>
            <strong>Pay your commission bill</strong>
            <p>
              Your commission (PKR {status.commissionAmount?.toLocaleString()}) is due. After payment, it will be valid for <strong>30 days</strong>.
              {hasCommissionBill && (
                <span className="commission-alert-limit">
                  {" "}Until then, monthly order limit is <strong>{MONTHLY_LIMIT_UNPAID} orders</strong> ({monthlyCount}/{MONTHLY_LIMIT_UNPAID} used).
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={handlePayNow}
            disabled={paying}
            className="commission-alert-cta"
          >
            {paying ? "Redirecting…" : "Pay now"}
          </button>
        </div>
      </div>
    );
  }

  // Alert: Free until limit (not in slider, not top-rated)
  if (!isInSlider && !isTopRated) {
    return (
      <div className="commission-alert commission-alert--free">
        <div className="commission-alert-inner">
          <span className="commission-alert-icon">ℹ️</span>
          <div>
            <strong>You're free until you reach the limit</strong>
            <p>Your restaurant is not in the slider and not top-rated. You can receive orders within the free tier limit. Subscribe when you need more.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CommissionAlert;
