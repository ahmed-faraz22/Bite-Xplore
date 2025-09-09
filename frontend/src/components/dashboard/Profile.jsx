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

    const handleSave = async () => {
        try {
            setLoading(true);
            await axios.put("http://localhost:4000/api/v1/users/profile", formData);
            setUser(formData);
            setIsEditing(false);
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
                        <label>Name</label>
                        {isEditing ? (
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="user-input"
                            />
                        ) : (
                            <p>{user.name}</p>
                        )}
                    </div>
                    <div className="user-field">
                        <label>Username</label>
                        {isEditing ? (
                            <input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="user-input"
                            />
                        ) : (
                            <p>{user.username}</p>
                        )}
                    </div>
                </div>

                <div className="user-field-row">
                    <div className="user-field">
                        <label>Email</label>
                        {isEditing ? (
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="user-input"
                            />
                        ) : (
                            <p>{user.email}</p>
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
                            <p>{user.phone}</p>
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
