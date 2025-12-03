import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../../assets/style/Profile.css";

axios.defaults.withCredentials = true;

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:4000/api/v1/users/profile");
                setUser(res.data.data);
                setFormData(res.data.data);
            } catch (err) {
                toast.error(err?.response?.data?.message || "Error fetching profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

        // Name validation
        if (!formData.name || !formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        // Username validation
        if (!formData.username || !formData.username.trim()) {
            newErrors.username = "Username is required";
        } else if (!usernameRegex.test(formData.username)) {
            newErrors.username = "Username must be 3-20 characters (letters, numbers, underscore only)";
        }

        // Email validation
        if (!formData.email || !formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Phone validation (optional but validate format if provided)
        if (formData.phone && formData.phone.trim()) {
            if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
                newErrors.phone = "Please enter a valid phone number";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) {
            return;
        }

        try {
            setLoading(true);
            await axios.put("http://localhost:4000/api/v1/users/profile", formData);
            setUser(formData);
            setIsEditing(false);
            setErrors({});
            toast.success("Profile updated successfully 🎉");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Error saving profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <p>Loading profile...</p>;

    return (
        <div className="user-card">
            {/* Avatar on top */}
            <div className="user-avatar-wrapper">
                <img
                    src={user.avatar || "https://i.pravatar.cc/150"}
                    alt="avatar"
                    className="user-avatar"
                />
            </div>

            {/* Info Fields */}
            <div className="user-col-right">
                <div className="user-field-row">
                    <div className="user-field">
                        <label>Name *</label>
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
                            <p>{user.name}</p>
                        )}
                    </div>
                    <div className="user-field">
                        <label>Username *</label>
                        {isEditing ? (
                            <>
                                <input
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`user-input ${errors.username ? "error-input" : ""}`}
                                />
                                {errors.username && <span className="error-message">{errors.username}</span>}
                            </>
                        ) : (
                            <p>{user.username}</p>
                        )}
                    </div>
                </div>

                <div className="user-field-row">
                    <div className="user-field">
                        <label>Email *</label>
                        {isEditing ? (
                            <>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`user-input ${errors.email ? "error-input" : ""}`}
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </>
                        ) : (
                            <p>{user.email}</p>
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
                            <p>{user.phone || "Not set"}</p>
                        )}
                    </div>
                </div>

                {/* Action Button */}
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

export default UserProfile;
