import React, { useEffect, useState } from "react";
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
        setLogoFile(file);
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
    }
  };

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

    // Name validation
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Restaurant name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Restaurant name must be at least 2 characters";
    }

    // City validation
    if (!formData.city || !formData.city.trim()) {
      newErrors.city = "City is required";
    } else if (formData.city.trim().length < 2) {
      newErrors.city = "City name must be at least 2 characters";
    }

    // Phone validation (optional but validate format if provided)
    if (formData.phone && formData.phone.trim()) {
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    // Address validation (optional but validate length if provided)
    if (formData.address && formData.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters";
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

  if (loading) return <p>Loading...</p>;

  return (
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
                  placeholder="e.g., +1234567890"
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
                  accept="image/*"
                  onChange={handleChange}
                  className="logo-input"
                />
                <p className="logo-hint">Upload restaurant logo (JPG, PNG, etc.)</p>
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
  );
};

export default Dashboardmain;
