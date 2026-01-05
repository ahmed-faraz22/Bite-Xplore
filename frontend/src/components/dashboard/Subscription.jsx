import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import "../../assets/style/Subscription.css";

axios.defaults.withCredentials = true;

const Subscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [processedSessionId, setProcessedSessionId] = useState(null);
  const token = localStorage.getItem("token");
  const [searchParams] = useSearchParams();

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/v1/subscription/status", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscription(res.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch subscription status");
    } finally {
      setLoading(false);
    }
  };

  const handleStripeSuccess = async (sessionId) => {
    if (!sessionId) {
      toast.error("Invalid payment session. Please try again.");
      window.history.replaceState({}, "", "/dashboard/subscription");
      return;
    }

    // Prevent processing the same session multiple times (e.g., on page refresh)
    if (processedSessionId === sessionId) {
      console.log("Session already processed, skipping...");
      window.history.replaceState({}, "", "/dashboard/subscription");
      return;
    }

    setProcessedSessionId(sessionId);
    setIsProcessingPayment(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/subscription/verify-payment",
        { sessionId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Only show success if payment was actually verified
      if (res.data.success) {
        toast.success("Payment successful! Subscription activated.");
        fetchSubscriptionStatus();
      } else {
        toast.error("Payment verification failed. Please contact support.");
      }
      
      // Clean up URL parameters
      window.history.replaceState({}, "", "/dashboard/subscription");
    } catch (err) {
      // Show detailed error message
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to verify payment";
      toast.error(`Payment verification failed: ${errorMessage}`);
      
      // If payment wasn't completed, show helpful message
      if (errorMessage.includes("not completed") || errorMessage.includes("not succeeded")) {
        toast.info("Please complete the payment on Stripe's checkout page to activate your subscription.");
      }
      
      // Clean up URL parameters even on error
      window.history.replaceState({}, "", "/dashboard/subscription");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
    
    // Check for Stripe payment success
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");
    const canceled = searchParams.get("canceled");

    // Only process if we have both success flag AND session ID
    // Stripe only adds session_id to success_url when payment is actually completed
    if (success === "true" && sessionId) {
      // Verify session ID format (Stripe session IDs start with 'cs_')
      if (sessionId.startsWith("cs_")) {
        handleStripeSuccess(sessionId);
      } else {
        toast.error("Invalid payment session ID. Please try again.");
        window.history.replaceState({}, "", "/dashboard/subscription");
      }
    } else if (canceled === "true") {
      toast.info("Payment was canceled. You can try again anytime.");
      window.history.replaceState({}, "", "/dashboard/subscription");
    }
    // If success=true but no session_id, it might be a manual navigation - ignore it
  }, [searchParams]);

  const handleStripeCheckout = async () => {
    if (!window.confirm("You will be redirected to Stripe for secure payment. Continue?")) {
      return;
    }

    setIsProcessingPayment(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/subscription/create-checkout-session",
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Redirect to Stripe Checkout
      if (res.data.data?.url) {
        window.location.href = res.data.data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create checkout session");
      setIsProcessingPayment(false);
    }
  };

  const handleActivateSubscription = async () => {
    // If credit card is selected, use Stripe
    if (paymentMethod === "credit_card") {
      handleStripeCheckout();
      return;
    }

    if (!window.confirm("Are you sure you want to activate subscription for PKR 3,500 per month?")) {
      return;
    }

    setIsProcessingPayment(true);
    try {
      // For other payment methods, simulate payment
      const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const res = await axios.post(
        "http://localhost:4000/api/v1/subscription/activate",
        {
          paymentId,
          paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Subscription activated successfully! Your account is now active.");
      fetchSubscriptionStatus();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to activate subscription");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return <div className="subscription-container">Loading subscription status...</div>;
  }

  if (!subscription) {
    return <div className="subscription-container">Unable to load subscription status</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#4caf50";
      case "expired":
      case "suspended":
        return "#f44336";
      case "free":
        return "#ff9800";
      default:
        return "#666";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "expired":
        return "Expired";
      case "suspended":
        return "Suspended";
      case "free":
        return "Free Tier";
      default:
        return status;
    }
  };

  return (
    <div className="subscription-container">
      <div className="subscription-card">
        <h2>Subscription Status</h2>

        <div className="subscription-info">
          <div className="info-row">
            <span className="info-label">Current Status:</span>
            <span
              className="status-badge"
              style={{ color: getStatusColor(subscription.subscriptionStatus) }}
            >
              {getStatusText(subscription.subscriptionStatus)}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Total Orders Received:</span>
            <span className="info-value">{subscription.orderCount}</span>
          </div>

          {subscription.subscriptionStatus === "free" && (
            <div className="info-row">
              <span className="info-label">Free Orders Remaining:</span>
              <span className="info-value highlight">
                {subscription.freeOrdersRemaining} / 15
              </span>
            </div>
          )}

          {subscription.subscriptionStatus === "active" && subscription.subscriptionExpiry && (
            <div className="info-row">
              <span className="info-label">Subscription Expires:</span>
              <span className="info-value">
                {new Date(subscription.subscriptionExpiry).toLocaleDateString()}
              </span>
            </div>
          )}

          {subscription.lastPaymentDate && (
            <div className="info-row">
              <span className="info-label">Last Payment Date:</span>
              <span className="info-value">
                {new Date(subscription.lastPaymentDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Warning Messages */}
        {subscription.isSuspended && (
          <div className="warning-box">
            <strong>⚠️ Account Suspended</strong>
            <p>Your subscription has expired. Please renew to continue receiving orders.</p>
          </div>
        )}

        {subscription.needsSubscription && !subscription.isSuspended && (
          <div className="warning-box">
            <strong>⚠️ Free Limit Reached</strong>
            <p>You have reached the free order limit (15 orders). Subscribe now to continue receiving orders.</p>
          </div>
        )}

        {/* Subscription Plan Info */}
        <div className="plan-info">
          <h3>Subscription Plan</h3>
          <div className="plan-details">
            <p><strong>Free Tier:</strong> 15 orders</p>
            <p><strong>Monthly Subscription:</strong> PKR 3,500/month</p>
            <p><strong>Benefits:</strong> Unlimited orders while subscription is active</p>
          </div>
        </div>

        {/* Payment Section */}
        {(subscription.needsSubscription || subscription.isSuspended) && (
          <div className="payment-section">
            <h3>Activate Subscription</h3>
            <p className="payment-amount">Amount: PKR 3,500 / Month</p>

            <div className="payment-method">
              <label>Payment Method:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="payment-select"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="easypaisa">EasyPaisa</option>
                <option value="jazzcash">JazzCash</option>
                <option value="credit_card">Credit Card (Stripe)</option>
              </select>
            </div>

            <button
              onClick={handleActivateSubscription}
              className="activate-btn"
              disabled={isProcessingPayment}
            >
              {isProcessingPayment 
                ? (paymentMethod === "credit_card" ? "Redirecting to Stripe..." : "Processing...") 
                : paymentMethod === "credit_card" 
                  ? "Pay with Stripe" 
                  : "Activate Subscription"}
            </button>

            <p className="payment-note">
              {paymentMethod === "credit_card" 
                ? "You will be redirected to Stripe's secure payment page for credit card processing."
                : "Note: Other payment methods are simulated. In production, integrate with respective payment gateways."}
            </p>
          </div>
        )}

        {subscription.subscriptionStatus === "active" && (
          <div className="success-box">
            <strong>✓ Subscription Active</strong>
            <p>Your subscription is active. You can receive unlimited orders until {new Date(subscription.subscriptionExpiry).toLocaleDateString()}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription;



