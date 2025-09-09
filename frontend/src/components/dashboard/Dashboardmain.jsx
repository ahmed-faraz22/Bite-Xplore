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
    phone: "",
    hasOwnDelivery: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (restaurant) {
        // Update existing
        await axios.put(
          "http://localhost:4000/api/v1/restaurants/my-restaurant",
          formData
        );
        setRestaurant(formData);
        toast.success("Restaurant profile updated successfully 🎉");
      } else {
        // Create new
        const res = await axios.post(
          "http://localhost:4000/api/v1/restaurants/my-restaurant",
          formData
        );
        setRestaurant(res.data.data);
        toast.success("Restaurant profile created successfully 🎉");
      }

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
          src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
          alt="restaurant"
          className="user-avatar"
        />
      </div>

      <div className="user-col-right">
        <div className="user-field-row">
          <div className="user-field">
            <label>Restaurant Name</label>
            {isEditing ? (
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="user-input"
              />
            ) : (
              <p>{restaurant?.name}</p>
            )}
          </div>
          <div className="user-field">
            <label>Phone</label>
            {isEditing ? (
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="user-input"
              />
            ) : (
              <p>{restaurant?.phone}</p>
            )}
          </div>
        </div>

        <div className="user-field-row">
          <div className="user-field">
            <label>Address</label>
            {isEditing ? (
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="user-input"
              />
            ) : (
              <p>{restaurant?.address}</p>
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
