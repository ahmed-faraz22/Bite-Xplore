import React, { useState } from "react";
import Button from "./Button";
import { registerUser } from "../../api/auth"; 
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: ""
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // 🔹 Validation
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/;

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email format";

    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    else if (!phoneRegex.test(form.phone)) newErrors.phone = "Invalid phone number";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!form.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await registerUser(form); // API call
      toast.success("Registered successfully! 🎉");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <span>or use your email for registration</span>

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}

        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        {errors.phone && <small style={{ color: "red" }}>{errors.phone}</small>}

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}

        {/* 🔹 Role Dropdown */}
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="">Select Role</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        {errors.role && <small style={{ color: "red" }}>{errors.role}</small>}

        <Button type="submit" className="authButton" buttonText="Register" />
        <ToastContainer position="top-right" autoClose={2000} />
      </form>
    </div>
  );
}
