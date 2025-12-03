import React, { useState } from "react";
import Button from "./Button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";


axios.defaults.withCredentials = true; // ✅ so cookies stick

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Username validation
    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    } else if (!usernameRegex.test(form.username)) {
      newErrors.username = "Username must be 3-20 characters (letters, numbers, underscore only)";
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(form.password)) {
      newErrors.password = "Password must contain at least one uppercase and one lowercase letter";
    }

    // Role validation
    if (!form.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post("http://localhost:4000/api/v1/users/send-otp", {
        email: form.email,
      });
      toast.success(res.data.message || "OTP sent to email");
      setShowOtpInput(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    }
  };

  // Step 2: Register with OTP
  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:4000/api/v1/users/register", {
        ...form,
        otp,
      });
      toast.success("Registered successfully!");
      setTimeout(() => navigate("/auth"), 1500);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <span>or use your email for registration</span>

        <input type="text" placeholder="Name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}

        <input type="text" placeholder="User Name"
          value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        {errors.username && <small style={{ color: "red" }}>{errors.username}</small>}

        <input type="email" placeholder="Email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}

        <input type="text" placeholder="Phone"
          value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        {errors.phone && <small style={{ color: "red" }}>{errors.phone}</small>}

        <input type="password" placeholder="Password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}

        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="">Select Role</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        {errors.role && <small style={{ color: "red" }}>{errors.role}</small>}

        {showOtpInput ? (
          <>
            <input type="text" placeholder="Enter OTP"
              value={otp} onChange={(e) => setOtp(e.target.value)} />
            <Button type="button" className="authButton"
              buttonText="Verify OTP & Register"
              onClick={handleRegister} />
          </>
        ) : (
          <Button type="submit" className="authButton" buttonText="Register" />
        )}
      </form>
    </div>
  );
}