import React, { useState } from "react";
import Button from "../components/Button";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function Login({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post("http://localhost:4000/api/v1/users/login", {
        email,
        password,
      });

      const { token, user } = response.data;
      toast.success("Login successful 🎉");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 🔁 Notify other components of login
      window.dispatchEvent(new Event("authChange"));

      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <div className="social-container">
          <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
          <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
        </div>
        <span>or use your account</span>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}

        <a href="#" className="resetpass">Forgot your password?</a>
        <Button type="submit" className="authButton" buttonText="Login" onClick={handleSubmit} />
      </form>
    </div>
  );
}
