import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../../assets/style/Profile.css";

axios.defaults.withCredentials = true;

const Dashboardmain = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    hasOwnDelivery: false,
    openingTime: "09:00",
    closingTime: "22:00",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch restaurant profile
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:4000/api/v1/restaurants/my-restaurant"
        );
        setRestaurant(res.data.data);
        setFormData(res.data.data);
        if (res.data.data.logo) {
          setLogoPreview(res.data.data.logo);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // No profile yet
          toast.info("No restaurant profile found. Please create one.");
          setIsEditing(true);
        } else {
          toast.error(
            err?.response?.data?.message ||
              "Error fetching restaurant profile"
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === "file" && name === "logo") {
      const file = files[0];
      if (file) {
        // Validate file type - only images allowed, no PDF
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (!allowedTypes.includes(file.type)) {
          toast.error("Please upload an image file only (JPG, PNG, GIF, WEBP). PDF files are not allowed.");
          e.target.value = ""; // Clear the input
          return;
        }
        
        if (file.size > maxSize) {
          toast.error("Image size should be less than 5MB");
          e.target.value = ""; // Clear the input
          return;
        }
        
        setLogoFile(file);
        // Clear any previous errors
        setErrors({ ...errors, logo: "" });
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) || 0 : value,
      });
      // Clear error when user types
      if (errors[name]) {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Pakistani phone number regex
    // Accepts: +92XXXXXXXXXX, 0092XXXXXXXXXX, 0XXXXXXXXXX, 03XXXXXXXXX
    const pakistaniPhoneRegex = /^(\+92|0092|92|0)?[0-9]{10}$/;

    // Name validation
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Restaurant name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Restaurant name must be at least 2 characters";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Restaurant name must be less than 100 characters";
    }

    // City validation
    if (!formData.city || !formData.city.trim()) {
      newErrors.city = "City is required";
    } else if (formData.city.trim().length < 2) {
      newErrors.city = "City name must be at least 2 characters";
    } else if (formData.city.trim().length > 50) {
      newErrors.city = "City name must be less than 50 characters";
    }

    // Phone validation - Pakistani phone numbers only
    if (formData.phone && formData.phone.trim()) {
      const cleanedPhone = formData.phone.replace(/[\s-]/g, "");
      if (!pakistaniPhoneRegex.test(cleanedPhone)) {
        newErrors.phone = "Please enter a valid Pakistani phone number (e.g., +923001234567, 03001234567)";
      }
    }

    // Address validation (optional but validate length if provided)
    if (formData.address && formData.address.trim()) {
      if (formData.address.trim().length < 5) {
        newErrors.address = "Address must be at least 5 characters";
      } else if (formData.address.trim().length > 200) {
        newErrors.address = "Address must be less than 200 characters";
      }
    }

    // Opening time validation
    if (!formData.openingTime) {
      newErrors.openingTime = "Opening time is required";
    }

    // Closing time validation
    if (!formData.closingTime) {
      newErrors.closingTime = "Closing time is required";
    }

    // Validate closing time is after opening time
    if (formData.openingTime && formData.closingTime) {
      const opening = new Date(`2000-01-01T${formData.openingTime}`);
      const closing = new Date(`2000-01-01T${formData.closingTime}`);
      if (closing <= opening) {
        newErrors.closingTime = "Closing time must be after opening time";
      }
    }

    // Logo file validation (if new file is being uploaded)
    if (logoFile) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedTypes.includes(logoFile.type)) {
        newErrors.logo = "Please upload an image file only (JPG, PNG, GIF, WEBP). PDF files are not allowed.";
      } else if (logoFile.size > maxSize) {
        newErrors.logo = "Image size should be less than 5MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    // Validate form
    if (!validate()) {
      return;
    }

    try {

      setLoading(true);

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("address", formData.address || "");
      submitData.append("city", formData.city);
      submitData.append("phone", formData.phone || "");
      submitData.append("hasOwnDelivery", formData.hasOwnDelivery);
      submitData.append("openingTime", formData.openingTime || "09:00");
      submitData.append("closingTime", formData.closingTime || "22:00");
      
      if (logoFile) {
        submitData.append("logo", logoFile);
      }

      if (restaurant) {
        // Update existing
        const res = await axios.put(
          "http://localhost:4000/api/v1/restaurants/my-restaurant",
          submitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setRestaurant(res.data.data);
        if (res.data.data.logo) {
          setLogoPreview(res.data.data.logo);
        }
        toast.success("Restaurant profile updated successfully 🎉");
      } else {
        // Create new
        const res = await axios.post(
          "http://localhost:4000/api/v1/restaurants/my-restaurant",
          submitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setRestaurant(res.data.data);
        if (res.data.data.logo) {
          setLogoPreview(res.data.data.logo);
        }
        toast.success("Restaurant profile created successfully 🎉");
      }

      setLogoFile(null);
      setIsEditing(false);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Error saving restaurant profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  useEffect(() => {
    if (restaurant) {
      fetchSubscriptionStatus();
    }
  }, [restaurant]);

  const fetchSubscriptionStatus = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/subscription/status", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setSubscriptionStatus(res.data.data);
    } catch (err) {
      console.error("Failed to fetch subscription status:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* Subscription Status Banner */}
      {subscriptionStatus && (
        <div className={`subscription-banner ${subscriptionStatus.isSuspended || subscriptionStatus.needsSubscription ? 'warning' : subscriptionStatus.subscriptionStatus === 'active' ? 'success' : ''}`}>
          {subscriptionStatus.isSuspended ? (
            <div>
              <strong>⚠️ Account Suspended</strong>
              <p>Your subscription has expired. <Link to="/dashboard/subscription">Renew now</Link> to continue receiving orders.</p>
            </div>
          ) : subscriptionStatus.needsSubscription ? (
            <div>
              <strong>⚠️ Free Limit Reached</strong>
              <p>You've received {subscriptionStatus.orderCount} orders. <Link to="/dashboard/subscription">Subscribe now</Link> to continue (PKR 3,500/month).</p>
            </div>
          ) : subscriptionStatus.subscriptionStatus === 'active' ? (
            <div>
              <strong>✓ Subscription Active</strong>
              <p>You can receive unlimited orders until {subscriptionStatus.subscriptionExpiry ? new Date(subscriptionStatus.subscriptionExpiry).toLocaleDateString() : 'N/A'}.</p>
            </div>
          ) : (
            <div>
              <strong>Free Tier Active</strong>
              <p>{subscriptionStatus.freeOrdersRemaining} free orders remaining out of 15.</p>
            </div>
          )}
        </div>
      )}

    <div className="user-card">
      <div className="user-avatar-wrapper">
        <img
          src={restaurant?.logo || logoPreview || "https://cdn-icons-png.flaticon.com/512/3075/3075977.png"}
          alt="restaurant logo"
          className="user-avatar"
        />
      </div>

      <div className="user-col-right">
        <div className="user-field-row">
          <div className="user-field">
            <label>Restaurant Name *</label>
            {isEditing ? (
              <>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`user-input ${errors.name ? "error-input" : ""}`}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </>
            ) : (
              <p>{restaurant?.name}</p>
            )}
          </div>
          <div className="user-field">
            <label>Phone</label>
            {isEditing ? (
              <>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`user-input ${errors.phone ? "error-input" : ""}`}
                  placeholder="e.g., +923001234567 or 03001234567"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </>
            ) : (
              <p>{restaurant?.phone || "Not set"}</p>
            )}
          </div>
        </div>

        <div className="user-field-row">
          <div className="user-field">
            <label>Address</label>
            {isEditing ? (
              <>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`user-input ${errors.address ? "error-input" : ""}`}
                  placeholder="Enter full address"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </>
            ) : (
              <p>{restaurant?.address || "Not set"}</p>
            )}
          </div>
          <div className="user-field">
            <label>City *</label>
            {isEditing ? (
              <>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`user-input ${errors.city ? "error-input" : ""}`}
                  placeholder="Enter city name"
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </>
            ) : (
              <p>{restaurant?.city || "Not set"}</p>
            )}
          </div>
          <div className="user-field">
            <label>Opening Hours</label>
            {isEditing ? (
              <p style={{ color: "#999", fontSize: "14px" }}>
                Set opening and closing times below
              </p>
            ) : (
              <p>
                {restaurant?.openingTime || "09:00"} - {restaurant?.closingTime || "22:00"}
              </p>
            )}
          </div>
        </div>

        <div className="user-field-row">
          <div className="user-field">
            <label>Restaurant Logo</label>
            {isEditing ? (
              <div className="logo-upload-wrapper">
                {logoPreview && (
                  <div className="logo-preview">
                    <img src={logoPreview} alt="Logo preview" />
                  </div>
                )}
                <input
                  type="file"
                  name="logo"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleChange}
                  className={`logo-input ${errors.logo ? "error-input" : ""}`}
                />
                {errors.logo && <span className="error-message" style={{ display: "block", marginTop: "5px" }}>{errors.logo}</span>}
                <p className="logo-hint">Upload restaurant logo (JPG, PNG, GIF, WEBP only - Max 5MB)</p>
              </div>
            ) : (
              <div className="logo-display">
                {restaurant?.logo ? (
                  <img src={restaurant.logo} alt="Restaurant Logo" />
                ) : (
                  <p>No logo uploaded</p>
                )}
              </div>
            )}
          </div>
          <div className="user-field">
            <label>
              <input
                type="checkbox"
                name="hasOwnDelivery"
                checked={formData.hasOwnDelivery || false}
                onChange={handleChange}
                disabled={!isEditing}
              />
              Has Own Delivery?
            </label>
          </div>
        </div>

        <div className="user-field-row">
          <div className="user-field">
            <label>Opening Time *</label>
            {isEditing ? (
              <>
                <input
                  name="openingTime"
                  type="time"
                  value={formData.openingTime || "09:00"}
                  onChange={handleChange}
                  className={`user-input ${errors.openingTime ? "error-input" : ""}`}
                />
                {errors.openingTime && <span className="error-message">{errors.openingTime}</span>}
                <small style={{ color: "#666", display: "block", marginTop: "5px" }}>
                  Restaurant opening time
                </small>
              </>
            ) : (
              <p>{restaurant?.openingTime || "09:00"}</p>
            )}
          </div>
          <div className="user-field">
            <label>Closing Time *</label>
            {isEditing ? (
              <>
                <input
                  name="closingTime"
                  type="time"
                  value={formData.closingTime || "22:00"}
                  onChange={handleChange}
                  className={`user-input ${errors.closingTime ? "error-input" : ""}`}
                />
                {errors.closingTime && <span className="error-message">{errors.closingTime}</span>}
                <small style={{ color: "#666", display: "block", marginTop: "5px" }}>
                  Restaurant closing time
                </small>
              </>
            ) : (
              <p>{restaurant?.closingTime || "22:00"}</p>
            )}
          </div>
        </div>

        <div className="user-actions">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="user-button btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="user-button btn"
              disabled={loading}
            >
              {loading ? "Loading..." : "Edit"}
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboardmain;
